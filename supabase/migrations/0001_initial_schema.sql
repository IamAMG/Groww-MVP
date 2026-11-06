-- Migration 0001: Initial schema for SIP Compass
-- Enables pgvector, creates all tables, enables RLS, defines policies

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- User and access management
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'learner' CHECK (role IN ('learner', 'mentor', 'admin')),
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('learner', 'mentor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- ============================================
-- User experience
-- ============================================

CREATE TABLE diagnostic_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  concern TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'abandoned')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE diagnostic_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES diagnostic_sessions(id) ON DELETE CASCADE,
  option_id TEXT NOT NULL,
  module TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE resolution_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  diagnostic_session_id UUID REFERENCES diagnostic_sessions(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  resolved BOOLEAN,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sip_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_income NUMERIC,
  essential_expenses NUMERIC,
  other_commitments NUMERIC,
  monthly_sip NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  module TEXT NOT NULL CHECK (module IN ('compass', 'flex')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  gate_passed BOOLEAN,
  fallback_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Knowledge base
-- ============================================

CREATE TABLE knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  publisher TEXT,
  url TEXT,
  category TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  last_verified_at TIMESTAMPTZ,
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  version TEXT NOT NULL DEFAULT '1.0',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES knowledge_sources(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536),
  chunk_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AI observability
-- ============================================

CREATE TABLE ai_interaction_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  intent TEXT,
  input_category TEXT,
  model TEXT NOT NULL,
  prompt_version TEXT NOT NULL,
  retrieved_source_ids UUID[],
  gate_outcome TEXT NOT NULL,
  fallback_reason TEXT,
  processing_duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_gate_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interaction_id UUID NOT NULL REFERENCES ai_interaction_logs(id) ON DELETE CASCADE,
  check_name TEXT NOT NULL,
  passed BOOLEAN NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_retrieval_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interaction_id UUID NOT NULL REFERENCES ai_interaction_logs(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  source_ids UUID[],
  similarity_scores FLOAT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Evaluation
-- ============================================

CREATE TABLE golden_set_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  category TEXT NOT NULL,
  expected_intent TEXT NOT NULL,
  expected_behavior TEXT NOT NULL,
  expected_safety TEXT NOT NULL,
  grounding_expectation TEXT NOT NULL,
  reference_outcome TEXT,
  version TEXT NOT NULL DEFAULT '1.0',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE evaluation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  golden_set_version TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_version TEXT NOT NULL,
  total_cases INTEGER NOT NULL DEFAULT 0,
  passed_cases INTEGER NOT NULL DEFAULT 0,
  failed_cases INTEGER NOT NULL DEFAULT 0,
  safety_violations INTEGER NOT NULL DEFAULT 0,
  fallback_count INTEGER NOT NULL DEFAULT 0,
  run_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE evaluation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES evaluation_runs(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES golden_set_cases(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  generated_answer TEXT,
  retrieved_source_ids UUID[],
  gate_passed BOOLEAN NOT NULL,
  fallback_reason TEXT,
  pass_fail TEXT NOT NULL CHECK (pass_fail IN ('pass', 'fail')),
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Evidence
-- ============================================

CREATE TABLE evidence_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_type TEXT NOT NULL,
  source_platform TEXT,
  source_url TEXT,
  date_collected TIMESTAMPTZ DEFAULT NOW(),
  user_quote TEXT,
  anonymised_context TEXT,
  user_problem TEXT,
  theme TEXT,
  user_segment TEXT,
  severity TEXT,
  product_opportunity TEXT,
  linked_feature TEXT,
  related_golden_set_case_id UUID REFERENCES golden_set_cases(id) ON DELETE SET NULL,
  researcher_notes TEXT,
  verification_status TEXT NOT NULL DEFAULT 'unverified',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE evidence_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id UUID NOT NULL REFERENCES evidence_records(id) ON DELETE CASCADE,
  golden_set_case_id UUID REFERENCES golden_set_cases(id) ON DELETE SET NULL,
  interaction_id UUID REFERENCES ai_interaction_logs(id) ON DELETE SET NULL,
  link_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes
-- ============================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_diagnostic_sessions_user ON diagnostic_sessions(user_id);
CREATE INDEX idx_resolution_feedback_user ON resolution_feedback(user_id);
CREATE INDEX idx_knowledge_chunks_source ON knowledge_chunks(source_id);
CREATE INDEX idx_ai_interaction_logs_user ON ai_interaction_logs(user_id);
CREATE INDEX idx_ai_interaction_logs_created ON ai_interaction_logs(created_at);
CREATE INDEX idx_evaluation_results_run ON evaluation_results(run_id);
CREATE INDEX idx_evidence_records_theme ON evidence_records(theme);
CREATE INDEX idx_evidence_records_feature ON evidence_records(linked_feature);

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE resolution_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE sip_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interaction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_gate_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_retrieval_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE golden_set_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_links ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own, admins can read all
CREATE POLICY profiles_own ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_admin_all ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- User roles: users can read their own, admins manage all
CREATE POLICY user_roles_own ON user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY user_roles_admin_all ON user_roles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Diagnostic sessions: users own theirs
CREATE POLICY diagnostic_sessions_own ON diagnostic_sessions FOR ALL USING (auth.uid() = user_id);

-- Diagnostic answers: users own theirs via session
CREATE POLICY diagnostic_answers_own ON diagnostic_answers FOR ALL USING (
  EXISTS (SELECT 1 FROM diagnostic_sessions WHERE id = session_id AND user_id = auth.uid())
);

-- Resolution feedback: users own theirs
CREATE POLICY resolution_feedback_own ON resolution_feedback FOR ALL USING (auth.uid() = user_id);

-- SIP scenarios: users own theirs
CREATE POLICY sip_scenarios_own ON sip_scenarios FOR ALL USING (auth.uid() = user_id);

-- Chat sessions/messages: users own theirs
CREATE POLICY chat_sessions_own ON chat_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY chat_messages_own ON chat_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM chat_sessions WHERE id = session_id AND user_id = auth.uid())
);

-- Knowledge sources: all authenticated can read approved, admins manage
CREATE POLICY knowledge_sources_read_approved ON knowledge_sources FOR SELECT USING (approval_status = 'approved');
CREATE POLICY knowledge_sources_admin_all ON knowledge_sources FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Knowledge chunks: all authenticated can read chunks from approved sources
CREATE POLICY knowledge_chunks_read_approved ON knowledge_chunks FOR SELECT USING (
  EXISTS (SELECT 1 FROM knowledge_sources WHERE id = source_id AND approval_status = 'approved')
);
CREATE POLICY knowledge_chunks_admin_all ON knowledge_chunks FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- AI interaction logs: users own theirs, mentors/admins read all
CREATE POLICY ai_interaction_logs_own ON ai_interaction_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY ai_interaction_logs_mentor_admin ON ai_interaction_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('mentor', 'admin'))
);
CREATE POLICY ai_interaction_logs_insert ON ai_interaction_logs FOR INSERT WITH CHECK (true);

-- AI gate results: same as interaction logs
CREATE POLICY ai_gate_results_access ON ai_gate_results FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM ai_interaction_logs WHERE id = interaction_id AND (
      user_id = auth.uid() OR
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('mentor', 'admin'))
    )
  )
);

-- AI retrieval logs: same as interaction logs
CREATE POLICY ai_retrieval_logs_access ON ai_retrieval_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM ai_interaction_logs WHERE id = interaction_id AND (
      user_id = auth.uid() OR
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('mentor', 'admin'))
    )
  )
);

-- Golden set cases: all authenticated can read, admins manage
CREATE POLICY golden_set_cases_read ON golden_set_cases FOR SELECT USING (true);
CREATE POLICY golden_set_cases_admin_all ON golden_set_cases FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Evaluation runs/results: mentors and admins can read, admins manage
CREATE POLICY evaluation_runs_read ON evaluation_runs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('mentor', 'admin'))
);
CREATE POLICY evaluation_runs_admin_all ON evaluation_runs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY evaluation_results_read ON evaluation_results FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('mentor', 'admin'))
);
CREATE POLICY evaluation_results_admin_all ON evaluation_results FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Evidence records: all authenticated can read, admins/mentors manage
CREATE POLICY evidence_records_read ON evidence_records FOR SELECT USING (true);
CREATE POLICY evidence_records_mentor_admin_all ON evidence_records FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('mentor', 'admin'))
);

-- Evidence links: all authenticated can read, admins/mentors manage
CREATE POLICY evidence_links_read ON evidence_links FOR SELECT USING (true);
CREATE POLICY evidence_links_mentor_admin_all ON evidence_links FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('mentor', 'admin'))
);
