import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

interface IngestRequest {
  title?: string;
  publisher?: string;
  url?: string;
  category?: string;
  content?: string;
  version?: string;
}

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

function chunkText(text: string, size: number = CHUNK_SIZE, overlap: number = CHUNK_OVERLAP): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + size, text.length);
    chunks.push(text.slice(start, end));
    start = end - overlap;
    if (start < 0) start = 0;
    if (end === text.length) break;
  }
  return chunks;
}

async function getEmbedding(text: string, apiKey: string | undefined): Promise<number[] | null> {
  if (!apiKey) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: "text-embedding-3-small", input: text }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.data?.[0]?.embedding || null;
    }
  } catch {
    // ignore
  }
  return null;
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

  try {
    const body = (await req.json()) as IngestRequest;
    const title = body.title?.trim();
    const publisher = body.publisher?.trim() || null;
    const url = body.url?.trim() || null;
    const category = body.category?.trim();
    const content = body.content?.trim();
    const version = body.version?.trim() || "1.0";

    if (!title || !category || !content) {
      return new Response(
        JSON.stringify({ error: "title, category, and content are required" }),
        { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const embeddingApiKey = Deno.env.get("EMBEDDING_API_KEY");

    const supabase = serviceRoleKey && supabaseUrl
      ? createClient(supabaseUrl, serviceRoleKey)
      : null;

    if (!supabase) {
      return new Response(
        JSON.stringify({ error: "Supabase not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    const { data: source, error: sourceError } = await supabase
      .from("knowledge_sources")
      .insert({
        title,
        publisher,
        url,
        category,
        version,
        approval_status: "pending",
      })
      .select()
      .single();

    if (sourceError) throw sourceError;

    const chunks = chunkText(content);
    const chunkInserts = [];

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await getEmbedding(chunks[i], embeddingApiKey);
      chunkInserts.push({
        source_id: source.id,
        content: chunks[i],
        embedding: embedding || null,
        chunk_index: i,
      });
    }

    if (chunkInserts.length > 0) {
      const { error: chunkError } = await supabase.from("knowledge_chunks").insert(chunkInserts);
      if (chunkError) throw chunkError;
    }

    return new Response(
      JSON.stringify({
        id: source.id,
        title: source.title,
        category: source.category,
        approval_status: source.approval_status,
        version: source.version,
        chunks_ingested: chunkInserts.length,
        embeddings_generated: chunkInserts.filter((c) => c.embedding).length,
      }),
      { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Ingestion failed" }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
});
