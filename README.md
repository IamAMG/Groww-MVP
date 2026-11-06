# SIP Compass

AI-native SIP Discovery, Financial Education and Retention MVP.

A Product Management Grad Project focused on improving 12-month SIP continuation among first-time mutual fund investors.

## What this is

SIP Compass is an educational tool that helps first-time investors understand their SIPs, returns, goal progress, and payment issues through AI-powered explanations grounded in approved knowledge sources. It includes:

- Explore Dashboard
- SIP Health Diagnostic
- SIP Compass (AI returns explanation)
- Goal Progress Tracker (deterministic calculations)
- SIP Flex (payment failure education)
- Resolution Check (user feedback)
- AI Evaluation Centre (Golden Set evaluation)
- Evidence Log (research traceability)
- Knowledge Base Management
- Authentication & role-based access (Learner / Mentor / Admin)

**Not an investment advisory service.** No specific fund or stock recommendations. No guaranteed returns.

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Lucide React
- Backend/Database: Supabase (PostgreSQL, pgvector, Auth, Edge Functions)
- AI: Server-side LLM calls via Supabase Edge Functions (API keys never exposed to browser)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run locally

```bash
npm run dev
```

Open http://localhost:5173

### 4. Run tests

```bash
npm test
```

### 5. Build

```bash
npm run build
```

## Supabase setup

Apply the SQL migrations in `supabase/migrations/` to your Supabase project, then deploy the Edge Functions in `supabase/functions/`.

Configure Edge Function secrets (LLM API key, embedding key, Supabase service role key) via the Supabase dashboard or CLI.

## Roles

- **Learner** — uses the app, views own data
- **Mentor** — can access Evaluation Centre
- **Admin** — manages Knowledge Base, Golden Set, Evidence

Admin/mentor accounts must be created manually in Supabase Auth (no open admin registration).

## Disclaimer

SIP Compass is an educational tool. It does not provide investment advice or recommend specific securities or mutual funds. All simulations and projections are hypothetical. Consult a SEBI-registered investment adviser for personalised financial advice.
