import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

interface FlexRequest {
  question?: string;
  sessionId?: string;
}

const UNSAFE_PATTERNS = [
  /buy\s+(this|that|these|those|a|an|the)?\s+(fund|stock|share|sip|mutual)/i,
  /sell\s+(this|that|these|those|a|an|the)?\s+(fund|stock|share|sip|mutual)/i,
  /hold\s+(this|that|these|those|a|an|the)?\s+(fund|stock|share|sip|mutual)/i,
  /guaranteed\s+return/i,
  /assured\s+return/i,
  /risk.?free/i,
  /best\s+(fund|stock|sip|scheme|plan)/i,
  /investment\s+advice/i,
  /personalized\s+(investment|financial)\s+advice/i,
];

const SAFE_FALLBACK =
  "I can't answer that because it falls outside SIP Flex's scope. SIP Flex explains payment failures, mandates, and auto-debit issues " +
  "using approved educational sources — it does not recommend funds or guarantee returns. " +
  "For personalised help, contact your mutual fund distributor or a SEBI-registered investment adviser.";

function safetyPreCheck(question: string): { safe: boolean; reason?: string } {
  const q = question.trim();
  if (!q || q.length < 3) {
    return { safe: false, reason: "Question too short" };
  }
  for (const pattern of UNSAFE_PATTERNS) {
    if (pattern.test(q)) {
      return { safe: false, reason: "Investment advice / recommendation request detected" };
    }
  }
  return { safe: true };
}

function safetyPostCheck(answer: string, question: string): { safe: boolean; reason?: string } {
  const a = answer.toLowerCase();
  if (/(guaranteed|assured|risk.?free|certainly will|definitely will)/i.test(a)) {
    return { safe: false, reason: "Generated response contains guaranteed-return language" };
  }
  if (/(buy|sell|hold)\s+(this|that|the|a|an)\s+(fund|stock|sip)/i.test(a)) {
    return { safe: false, reason: "Generated response contains buy/sell/hold recommendation" };
  }
  return { safe: true };
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "content-type, authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  const startTime = Date.now();

  try {
    const body = (await req.json()) as FlexRequest;
    const question = body.question?.trim() || "";
    const sessionId = body.sessionId || `session-${Date.now()}`;
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const llmApiKey = Deno.env.get("LLM_API_KEY");

    const supabase = serviceRoleKey && supabaseUrl
      ? createClient(supabaseUrl, serviceRoleKey)
      : null;

    const preCheck = safetyPreCheck(question);
    if (!preCheck.safe) {
      if (supabase) {
        await supabase.from("ai_interaction_logs").insert({
          session_id: sessionId,
          intent: "blocked",
          input_category: "safety_violation",
          model: "none",
          prompt_version: "1.0",
          retrieved_source_ids: [],
          gate_outcome: "blocked_pre",
          fallback_reason: preCheck.reason,
          processing_duration_ms: Date.now() - startTime,
          user_id: null,
        });
      }
      return new Response(
        JSON.stringify({ answer: preCheck.reason || SAFE_FALLBACK }),
        { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    let sources: { title: string; url: string | null; content: string }[] = [];
    let retrievedSourceIds: string[] = [];

    if (supabase) {
      const { data: chunks } = await supabase
        .from("knowledge_chunks")
        .select(`
          id,
          content,
          embedding,
          source_id,
          knowledge_sources (
            id,
            title,
            url,
            approval_status
          )
        `);

      if (chunks && chunks.length > 0) {
        const scored = chunks
          .filter((c) => c.embedding && c.knowledge_sources?.approval_status === "approved")
          .map((c) => {
            const sim = cosineSimilarity(
              question.split(" ").map(() => 0.1),
              c.embedding as number[]
            );
            return { ...c, similarity: sim };
          })
          .sort((a: any, b: any) => b.similarity - a.similarity)
          .slice(0, 5);

        sources = scored.map((c: any) => ({
          title: c.knowledge_sources?.title || "Unknown source",
          url: c.knowledge_sources?.url || null,
          content: c.content,
        }));
        retrievedSourceIds = scored.map((c: any) => c.id);
      }
    }

    let answer: string | null = null;
    let gateOutcome = "fallback_no_key";
    let fallbackReason: string | null = null;

    if (llmApiKey) {
      try {
        const context = sources.map((s) => `- ${s.title}: ${s.content}`).join("\n");
        const llmRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${llmApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a financial education assistant explaining SIP payment failures, mandates, and auto-debit issues. " +
                  "Answer only from the provided approved sources. Do not recommend specific funds or stocks. " +
                  "Do not promise guaranteed returns. If unsure, say you don't have enough information. " +
                  "Keep answers short, clear, and educational.",
              },
              { role: "user", content: `Question: ${question}\n\nApproved sources:\n${context || "(none available)"}` },
            ],
            temperature: 0.3,
            max_tokens: 400,
          }),
        });

        if (llmRes.ok) {
          const llmData = await llmRes.json();
          answer = llmData.choices?.[0]?.message?.content?.trim() || null;
          gateOutcome = "generated";
        } else {
          gateOutcome = "llm_error";
          fallbackReason = `LLM API error (${llmRes.status})`;
        }
      } catch (err) {
        gateOutcome = "llm_exception";
        fallbackReason = err instanceof Error ? err.message : "LLM call failed";
      }
    } else {
      gateOutcome = "no_llm_key";
      fallbackReason = "LLM API key not configured — using safe fallback";
    }

    if (!answer) {
      answer = SAFE_FALLBACK;
    }

    const postCheck = safetyPostCheck(answer, question);
    if (!postCheck.safe) {
      answer = SAFE_FALLBACK;
      gateOutcome = "blocked_post";
      fallbackReason = postCheck.reason;
    }

    if (supabase) {
      await supabase.from("ai_interaction_logs").insert({
        session_id: sessionId,
        intent: "flex_explainer",
        input_category: null,
        model: llmApiKey ? "gpt-3.5-turbo" : "none",
        prompt_version: "1.0",
        retrieved_source_ids: retrievedSourceIds,
        gate_outcome: gateOutcome,
        fallback_reason: fallbackReason,
        processing_duration_ms: Date.now() - startTime,
        user_id: null,
      });
    }

    return new Response(
      JSON.stringify({ answer, fallbackReason }),
      { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ answer: SAFE_FALLBACK, fallbackReason: err instanceof Error ? err.message : "Request failed" }),
      { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
});
