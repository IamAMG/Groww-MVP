# SIP Compass Architecture

## Overview

SIP Compass is an AI-native financial education MVP for first-time mutual fund investors. It helps users understand their SIPs, returns, goal progress, and payment issues — without providing investment advice.

## High-level data flow

1. **User opens the app** (React + Vite frontend, deployed on Vercel)
2. **Authenticates** via PocketBase Auth (Learner / Mentor / Admin roles)
3. **Navigates** through dashboard → diagnostic → module (Compass / Flex / Goal) → resolution check
4. **AI requests** (Compass, Flex) are served via local mock responses — no Edge Functions, no LLM API keys exposed to browser
5. **All interactions** are logged to PocketBase for traceability and evaluation

## Frontend

- `src/pages/` — one page per screen (Dashboard, Diagnostic, Compass, GoalTracker, Flex, Resolution, EvidenceLog, Evaluations, KnowledgeBase, Login, SignUp)
- `src/components/` — reusable UI (Button, Card, Badge, ProgressBar, DiagnosticCard, Layout)
- `src/context/AuthContext.tsx` — auth + role provider (PocketBase)
- `src/lib/pocketbase.ts` — PocketBase client + collection types
- `src/constants/index.ts` — disclaimer, simulated data labels, sample data

## Backend (PocketBase)

- **SQLite-based** — single binary, file-based database
- **PocketBase Auth** — sign up/in/out, session persistence
- **Collection access rules** — enforced per collection; learners see only their own data (configure in Admin UI)
- **Collections**:
  - `profiles`, `users` — users and access
  - `diagnostic_sessions`, `resolution_feedback` — user journey
  - `knowledge_sources`, `knowledge_chunks` — approved educational content
  - `ai_interaction_logs`, `ai_gate_results`, `ai_retrieval_logs` — AI observability
  - `golden_set_cases`, `evaluation_runs`, `evaluation_results` — evaluation framework
  - `evidence_records`, `evidence_links` — research traceability

## Roles & permissions

- **Learner**: own diagnostic sessions, own feedback, own chat history. Cannot modify KB or Golden Set.
- **Mentor**: Evaluation Centre access, permitted AI playground. Cannot modify protected admin settings.
- **Admin**: manage knowledge sources, approve content, manage Golden Set, access all evaluation logs.

No open admin/mentor registration. Accounts created manually in PocketBase Admin UI.

## Safety

- Pre-generation checks detect: investment advice requests, fund/stock recommendations, buy/sell/hold, guaranteed returns, out-of-scope questions
- Post-generation checks verify: safety, relevance, grounding, no unsupported claims
- Failed responses → safe fallback, never the original generated response
- All simulations explicitly labelled "Simulated Data"
- Financial calculations are deterministic (never LLM)

## Deployment

- Frontend: Vercel
- Backend/Database: PocketBase (single binary, VPS or PocketBase Cloud)
- Environment variables: `VITE_POCKETBASE_URL` (frontend only)
