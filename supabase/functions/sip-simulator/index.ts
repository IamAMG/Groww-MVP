import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface SimulateRequest {
  monthly_investment?: number;
  annual_return_percent?: number;
  duration_years?: number;
  step_up_percent?: number;
}

function futureValueSIP(monthly: number, monthlyRate: number, months: number): number {
  if (monthlyRate === 0) return monthly * months;
  return monthly * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
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
    const body = (await req.json()) as SimulateRequest;
    const monthlyInvestment = Number(body.monthly_investment) || 0;
    const annualReturn = Number(body.annual_return_percent) || 12;
    const durationYears = Number(body.duration_years) || 10;
    const stepUpPercent = Number(body.step_up_percent) || 0;

    if (monthlyInvestment <= 0 || durationYears <= 0) {
      return new Response(
        JSON.stringify({ error: "monthly_investment and duration_years must be positive" }),
        { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    const months = durationYears * 12;
    const monthlyRate = annualReturn / 100 / 12;
    const stepUpMonthly = stepUpPercent / 100 / 12;

    let totalInvested = 0;
    let totalValue = 0;
    let currentSIP = monthlyInvestment;
    const yearlyBreakdown: { year: number; invested: number; value: number; returns: number }[] = [];

    for (let m = 1; m <= months; m++) {
      const contribution = currentSIP;
      totalInvested += contribution;
      totalValue = futureValueSIP(contribution, monthlyRate, months - m + 1) + totalValue * (1 + monthlyRate);

      if (m % 12 === 0) {
        const year = m / 12;
        yearlyBreakdown.push({
          year,
          invested: Math.round(totalInvested),
          value: Math.round(totalValue),
          returns: Math.round(totalValue - totalInvested),
        });
        currentSIP = currentSIP * (1 + stepUpMonthly);
      }
    }

    const result = {
      monthly_investment: monthlyInvestment,
      annual_return_percent: annualReturn,
      duration_years: durationYears,
      step_up_percent: stepUpPercent,
      total_invested: Math.round(totalInvested),
      estimated_value: Math.round(totalValue),
      estimated_returns: Math.round(totalValue - totalInvested),
      yearly_breakdown: yearlyBreakdown,
      note: "Deterministic simulation — not investment advice. Actual returns may vary.",
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Invalid request" }),
      { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
});
