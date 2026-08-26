-- ==============================================================================
-- SCRIPT DE INICIALIZAÇÃO COMPLETO - IGREJA O BRASIL PARA CRISTO (OBPC)
-- Execute este script no SQL Editor do Supabase (supabase.com)
-- ==============================================================================

-- 1. Tabela de Informações Institucionais da Igreja
CREATE TABLE IF NOT EXISTS church_info (
  id TEXT PRIMARY KEY DEFAULT 'main',
  name TEXT NOT NULL DEFAULT 'Igreja O Brasil Para Cristo',
  subtitle TEXT DEFAULT 'Uma Família que Ama a Deus, Serve ao Próximo e Vive a Palavra',
  pastor_name TEXT DEFAULT 'Pr. Janildo Manoel',
  vice_pastor_name TEXT DEFAULT '',
  address TEXT DEFAULT 'Loteamento 3 amigos, 3 - Forene',
  city_state TEXT DEFAULT 'Rio Largo - AL',
  zip_code TEXT DEFAULT '57100-000',
  phone TEXT DEFAULT '(82) 3214-8800',
  whatsapp TEXT DEFAULT '(82) 999694402',
  email TEXT DEFAULT 'obpcriolargo@gmail.com',
  pix_key TEXT DEFAULT '82999694402',
  pix_key_type TEXT DEFAULT 'Telefone',
  pix_recipient TEXT DEFAULT 'Igreja O Brasil Para Cristo',
  bank_name TEXT DEFAULT 'Banco Bradesco (237)',
  bank_agency TEXT DEFAULT '1452-9',
  bank_account TEXT DEFAULT '25480-1',
  youtube_channel_url TEXT DEFAULT 'https://youtube.com/@obpcriolargo',
  instagram_url TEXT DEFAULT 'https://instagram.com/obpcriolargo',
  facebook_url TEXT DEFAULT 'https://facebook.com',
  live_stream_url TEXT DEFAULT 'https://youtube.com/@obpcriolargo/live',
  history_text TEXT DEFAULT 'Fundada pelo missionário Manoel de Mello em 1956, a Igreja O Brasil Para Cristo é um ministério de fé, avivamento pentecostal, evangelização vibrante e profundo compromisso social.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Programações Semanais dos Cultos
CREATE TABLE IF NOT EXISTS weekly_schedules (
  id TEXT PRIMARY KEY,
  day_of_week TEXT NOT NULL,
  time TEXT NOT NULL,
  title TEXT NOT NULL,
  ministry TEXT,
  description TEXT,
  leader TEXT,
  location TEXT DEFAULT 'Templo Sede',
  icon_name TEXT DEFAULT 'church',
  color_tag TEXT DEFAULT 'blue',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Eventos da Igreja
CREATE TABLE IF NOT EXISTS church_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  date DATE NOT NULL,
  end_date DATE,
  time TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Templo Sede',
  description TEXT NOT NULL,
  banner_url TEXT,
  category TEXT NOT NULL DEFAULT 'Culto Especial',
  highlight BOOLEAN DEFAULT false,
  registration_open BOOLEAN DEFAULT true,
  registration_limit INTEGER,
  registered_count INTEGER DEFAULT 0,
  guest_speaker TEXT,
  musical_guest TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Inscrições nos Eventos
CREATE TABLE IF NOT EXISTS event_registrations (
  id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES church_events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  is_member BOOLEAN DEFAULT true,
  notes TEXT,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Pastas de Mídia (Álbuns de Fotos e Vídeos)
CREATE TABLE IF NOT EXISTS media_folders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Cultos e Celebrações',
  cover_url TEXT,
  event_date DATE,
  item_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Arquivos de Mídia (Fotos e Vídeos)
CREATE TABLE IF NOT EXISTS media_items (
  id TEXT PRIMARY KEY,
  folder_id TEXT REFERENCES media_folders(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. Pedidos de Oração dos Fiéis
CREATE TABLE IF NOT EXISTS prayer_requests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  is_confidential BOOLEAN DEFAULT true,
  request_type TEXT NOT NULL DEFAULT 'Família',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_oracao', 'atendido')),
  pastor_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. Cadastro Sigiloso de Membros
CREATE TABLE IF NOT EXISTS church_members (
  id TEXT PRIMARY KEY,
  sigilo_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  baptism_date DATE,
  ministry_role TEXT,
  is_active BOOLEAN DEFAULT true,
  joined_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. Tesouraria - Transações Financeiras Sigilosas
CREATE TABLE IF NOT EXISTS financial_transactions (
  id TEXT PRIMARY KEY,
  receipt_number TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('entrada', 'saida')),
  category TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'PIX',
  member_id TEXT REFERENCES church_members(id) ON DELETE SET NULL,
  member_sigilo_code TEXT,
  member_name_cached TEXT,
  is_strict_confidential BOOLEAN DEFAULT true,
  registered_by TEXT NOT NULL DEFAULT 'Tesouraria',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 10. Usuários e Senhas do Sistema Administrativo
CREATE TABLE IF NOT EXISTS system_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'pastor',
  email TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TEXT,
  created_by TEXT DEFAULT 'Sistema',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 11. Auditoria e Logs de Atividades do Sistema
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  category TEXT NOT NULL,
  details TEXT NOT NULL,
  ip_address TEXT,
  status TEXT NOT NULL DEFAULT 'sucesso',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 12. Departamentos e Ministérios da Igreja
CREATE TABLE IF NOT EXISTS church_departments (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  leader TEXT,
  meeting_schedule TEXT,
  color_tag TEXT DEFAULT 'emerald',
  icon_name TEXT DEFAULT 'users',
  banner_url TEXT,
  instagram_url TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- HABILITAR ROW LEVEL SECURITY (RLS) EM TODAS AS TABELAS
-- ==============================================================================
ALTER TABLE church_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_departments ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- POLÍTICAS DE ACESSO (POLICIES) PERMISSIVAS PARA A ANON KEY
-- ==============================================================================
DROP POLICY IF EXISTS "Allow All Info" ON church_info;
CREATE POLICY "Allow All Info" ON church_info FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Schedules" ON weekly_schedules;
CREATE POLICY "Allow All Schedules" ON weekly_schedules FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Events" ON church_events;
CREATE POLICY "Allow All Events" ON church_events FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Registrations" ON event_registrations;
CREATE POLICY "Allow All Registrations" ON event_registrations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Media Folders" ON media_folders;
CREATE POLICY "Allow All Media Folders" ON media_folders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Media Items" ON media_items;
CREATE POLICY "Allow All Media Items" ON media_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Prayers" ON prayer_requests;
CREATE POLICY "Allow All Prayers" ON prayer_requests FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Members" ON church_members;
CREATE POLICY "Allow All Members" ON church_members FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Transactions" ON financial_transactions;
CREATE POLICY "Allow All Transactions" ON financial_transactions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Users" ON system_users;
CREATE POLICY "Allow All Users" ON system_users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Logs" ON audit_logs;
CREATE POLICY "Allow All Logs" ON audit_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Departments" ON church_departments;
CREATE POLICY "Allow All Departments" ON church_departments FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- ATIVAR SINCRONIZAÇÃO EM TEMPO REAL (REALTIME)
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE prayer_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE church_events;
ALTER PUBLICATION supabase_realtime ADD TABLE event_registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE weekly_schedules;
ALTER PUBLICATION supabase_realtime ADD TABLE financial_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE system_users;
ALTER PUBLICATION supabase_realtime ADD TABLE audit_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE church_departments;

-- ==============================================================================
-- BUCKET DE ARMAZENAMENTO PARA FOTOS E MÍDIAS (SUPABASE STORAGE)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'obpc-media',
  'obpc-media',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/quicktime', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT USING (bucket_id = 'obpc-media');

DROP POLICY IF EXISTS "Public Storage Insert" ON storage.objects;
CREATE POLICY "Public Storage Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'obpc-media');

DROP POLICY IF EXISTS "Public Storage Update" ON storage.objects;
CREATE POLICY "Public Storage Update" ON storage.objects FOR UPDATE USING (bucket_id = 'obpc-media');

DROP POLICY IF EXISTS "Public Storage Delete" ON storage.objects;
CREATE POLICY "Public Storage Delete" ON storage.objects FOR DELETE USING (bucket_id = 'obpc-media');

-- ==============================================================================
-- DADOS INICIAIS (SEED DATA)
-- ==============================================================================
INSERT INTO church_info (
  id, name, subtitle, pastor_name, address, city_state, zip_code, phone, whatsapp, email, pix_key, pix_key_type, pix_recipient, bank_name, youtube_channel_url, instagram_url
) VALUES (
  'main',
  'Igreja O Brasil Para Cristo',
  'Uma Família que Ama a Deus, Serve ao Próximo e Vive a Palavra',
  'Pr. Janildo Manoel',
  'Loteamento 3 amigos, 3 - Forene',
  'Rio Largo - AL',
  '57100-000',
  '(82) 3214-8800',
  '(82) 999694402',
  'obpcriolargo@gmail.com',
  '82999694402',
  'Telefone',
  'Igreja O Brasil Para Cristo',
  'Mercado Pago',
  'https://youtube.com/@obpcriolargo',
  'https://instagram.com/obpcriolargo'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO system_users (
  id, name, username, password, role, email, is_active, created_by
) VALUES (
  'usr-1',
  'Pr. Janildo Manoel',
  'pastor',
  '1234',
  'pastor',
  'pastor@obpcriolargo.com.br',
  true,
  'Sistema'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO church_departments (
  id, code, name, description, leader, meeting_schedule, color_tag, icon_name, is_active, order_index
) VALUES 
  ('dep-1', 'JUBRAC', 'JUBRAC (Juventude)', 'Juventude da Igreja O Brasil Para Cristo. Evangelismo, louvor jovem e comunhão.', 'Liderança JUBRAC', 'Sábados às 19:30', 'amber', 'sparkles', true, 1),
  ('dep-2', 'UFEBRAC', 'UFEBRAC (Mulheres)', 'União Feminina da OBPC. Círculo de oração, intercessão e assistência social.', 'Liderança UFEBRAC', 'Terças às 19:30', 'rose', 'heart', true, 2),
  ('dep-3', 'MENBRAC', 'MENBRAC (Homens)', 'Ministério de Homens. Fortalecimento espiritual, sacerdócio no lar e liderança bíblica.', 'Liderança MENBRAC', 'Quartas às 19:30', 'blue', 'shield', true, 3),
  ('dep-4', 'UCEBRAC', 'UCEBRAC (Crianças)', 'União de Crianças da OBPC. Culto infantil e formação bíblica dos pequeninos.', 'Liderança UCEBRAC', 'Domingos às 09:00', 'emerald', 'users', true, 4),
  ('dep-5', 'ADOBRAC', 'ADOBRAC (Adolescentes)', 'Adolescentes da OBPC. Discipulado bíblico, música e eventos de integração.', 'Liderança ADOBRAC', 'Quartas às 19:30', 'purple', 'zap', true, 5)
ON CONFLICT (id) DO NOTHING;
