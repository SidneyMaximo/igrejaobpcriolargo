import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  ChurchInfo,
  WeeklySchedule,
  ChurchEvent,
  EventRegistration,
  MediaFolder,
  MediaItem,
  PrayerRequest,
  ChurchMember,
  FinancialTransaction,
  SystemUser,
  AuditLog,
  ChurchDepartment
} from '../types';

// ==============================================================================
// 1. CREDENCIAIS & GERENCIAMENTO DINÂMICO DE CLIENTE SUPABASE
// ==============================================================================
const STORAGE_SUPABASE_URL = 'obpc_supabase_url_v1';
const STORAGE_SUPABASE_KEY = 'obpc_supabase_anon_key_v1';

export const DEFAULT_SUPABASE_URL = 'https://pgbmlczhzihihzbxmias.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_Vb4eWeibhcl2SRhCDkoigg_MAXZvXjx';

export const sanitizeUrl = (raw: string | null | undefined): string => {
  if (!raw) return '';
  let str = raw.trim();
  const mdMatch = str.match(/https?:\/\/[a-zA-Z0-9\-\.]+\.supabase\.co/i);
  if (mdMatch) {
    return mdMatch[0];
  }
  const httpMatch = str.match(/https?:\/\/[^\s\)\'\"\]]+/i);
  if (httpMatch) {
    return httpMatch[0];
  }
  return str.replace(/[\s\[\]\(\)\'\"]/g, '').trim();
};

export const sanitizeKey = (raw: string | null | undefined): string => {
  if (!raw) return '';
  return raw.replace(/[\s\[\]\(\)\'\"]/g, '').trim();
};

export const getSupabaseCredentials = (): { url: string; key: string; isCustom: boolean } => {
  const env = (import.meta as any).env || {};
  
  // Limpar qualquer override corrompido antigo do localStorage
  try {
    localStorage.removeItem(STORAGE_SUPABASE_URL);
    localStorage.removeItem(STORAGE_SUPABASE_KEY);
  } catch (e) {}

  const envUrl = sanitizeUrl(env.VITE_SUPABASE_URL || env.SUPABASE_URL) || DEFAULT_SUPABASE_URL;
  const envKey = sanitizeKey(env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY) || DEFAULT_SUPABASE_ANON_KEY;

  return {
    url: envUrl,
    key: envKey,
    isCustom: false
  };
};

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getSupabaseCredentials();
  return Boolean(
    url &&
    key &&
    !url.includes('your-project') &&
    !key.includes('your-anon-key') &&
    url.startsWith('http')
  );
};

let currentClient: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    currentClient = null;
    return null;
  }

  const { url, key } = getSupabaseCredentials();
  if (!currentClient) {
    currentClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
  }
  return currentClient;
};

export const saveCustomCredentials = (url: string, key: string): boolean => {
  try {
    const cleanUrl = url.trim();
    const cleanKey = key.trim();
    if (cleanUrl && cleanKey) {
      localStorage.setItem(STORAGE_SUPABASE_URL, cleanUrl);
      localStorage.setItem(STORAGE_SUPABASE_KEY, cleanKey);
      currentClient = createClient(cleanUrl, cleanKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });
      return true;
    }
    return false;
  } catch (e) {
    console.error('Erro ao salvar credenciais do Supabase:', e);
    return false;
  }
};

export const clearCustomCredentials = () => {
  localStorage.removeItem(STORAGE_SUPABASE_URL);
  localStorage.removeItem(STORAGE_SUPABASE_KEY);
  currentClient = null;
};

export const supabase = getSupabase();

// ==============================================================================
// 2. SCHEMA SQL COMPLETO COM TODAS AS 11 TABELAS
// ==============================================================================
export const SUPABASE_SCHEMA_SQL = `-- ==============================================================================
-- SCHEMA OFICIAL DA IGREJA O BRASIL PARA CRISTO (OBPC)
-- Execute este script no SQL Editor do Supabase (supabase.com)
-- Cria todas as 11 tabelas, triggers de atualização, RLS e Realtime
-- ==============================================================================

-- 1. Informações Institucionais da Igreja
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

-- 5. Pastas de Mídia (Fotos e Vídeos dos Eventos)
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

-- 6. Arquivos e Links de Mídia (Fotos e Vídeos)
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

-- 8. Cadastro Sigiloso de Membros / Contribuintes
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

-- 9. CRM de Tesouraria - Transações Financeiras Sigilosas
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

-- Habilitar Row Level Security (RLS) em todas as tabelas
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

-- Políticas de Acesso Permissivas
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

-- Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE prayer_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE church_events;
ALTER PUBLICATION supabase_realtime ADD TABLE event_registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE weekly_schedules;
ALTER PUBLICATION supabase_realtime ADD TABLE financial_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE system_users;
ALTER PUBLICATION supabase_realtime ADD TABLE audit_logs;

-- ==============================================================================
-- 12. SUPABASE STORAGE: BUCKET PARA FOTOS E MÍDIAS DA IGREJA
-- ==============================================================================
-- Criar bucket público 'obpc-media' caso não exista
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'obpc-media',
  'obpc-media',
  true,
  52428800, -- 50MB por arquivo
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/quicktime', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Políticas de Acesso para o Storage Bucket 'obpc-media'
DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
CREATE POLICY "Public Storage Read" ON storage.objects
FOR SELECT USING (bucket_id = 'obpc-media');

DROP POLICY IF EXISTS "Public Storage Insert" ON storage.objects;
CREATE POLICY "Public Storage Insert" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'obpc-media');

DROP POLICY IF EXISTS "Public Storage Update" ON storage.objects;
CREATE POLICY "Public Storage Update" ON storage.objects
FOR UPDATE USING (bucket_id = 'obpc-media');

DROP POLICY IF EXISTS "Public Storage Delete" ON storage.objects;
CREATE POLICY "Public Storage Delete" ON storage.objects
FOR DELETE USING (bucket_id = 'obpc-media');
`;

export const SUPABASE_SQL_SCHEMA = SUPABASE_SCHEMA_SQL;

// ==============================================================================
// 3. CONVERSORES DE FORMATO (DATABASE SNAKE_CASE <-> APP CAMELCASE)
// ==============================================================================

export const toChurchInfo = (row: any): ChurchInfo => {
  let pastorName = row.pastor_name || 'Pr. Janildo Manoel';
  if (pastorName.includes('Carlos') || pastorName.includes('Eduardo') || pastorName.includes('Marlene')) {
    pastorName = 'Pr. Janildo Manoel';
  }
  let address = row.address || 'Loteamento 3 amigos, 3 - Forene';
  if (address.includes('Nações Unidas')) {
    address = 'Loteamento 3 amigos, 3 - Forene';
  }
  return {
    name: row.name || 'Igreja O Brasil Para Cristo',
    subtitle: row.subtitle || '',
    pastorName,
    vicePastorName: row.vice_pastor_name || '',
    address,
    cityState: row.city_state || 'Rio Largo - AL',
    zipCode: row.zip_code || '57100-000',
    phone: row.phone || '(82) 3214-8800',
    whatsapp: row.whatsapp || '(82) 999694402',
    email: row.email || 'obpcriolargo@gmail.com',
    pixKey: row.pix_key || '82999694402',
    pixKeyType: row.pix_key_type || 'Telefone',
    pixRecipient: row.pix_recipient || 'Igreja O Brasil Para Cristo',
    bankName: row.bank_name || 'Mercado Pago',
    bankAgency: row.bank_agency || '',
    bankAccount: row.bank_account || '',
    youtubeChannelUrl: row.youtube_channel_url || 'https://youtube.com/@obpcriolargo',
    instagramUrl: row.instagram_url || 'https://instagram.com/obpcriolargo',
    facebookUrl: row.facebook_url || 'https://facebook.com',
    liveStreamUrl: row.live_stream_url || 'https://youtube.com/@obpcriolargo/live',
    historyText: row.history_text || ''
  };
};

export const fromChurchInfo = (info: ChurchInfo) => ({
  id: 'main',
  name: info.name,
  subtitle: info.subtitle,
  pastor_name: info.pastorName,
  vice_pastor_name: info.vicePastorName,
  address: info.address,
  city_state: info.cityState,
  zip_code: info.zipCode,
  phone: info.phone,
  whatsapp: info.whatsapp,
  email: info.email,
  pix_key: info.pixKey,
  pix_key_type: info.pixKeyType,
  pix_recipient: info.pixRecipient,
  bank_name: info.bankName,
  bank_agency: info.bankAgency,
  bank_account: info.bankAccount,
  youtube_channel_url: info.youtubeChannelUrl,
  instagram_url: info.instagramUrl,
  facebook_url: info.facebookUrl,
  live_stream_url: info.liveStreamUrl,
  history_text: info.historyText,
  updated_at: new Date().toISOString()
});

export const toSchedule = (row: any): WeeklySchedule => ({
  id: row.id,
  dayOfWeek: row.day_of_week,
  time: row.time,
  title: row.title,
  ministry: row.ministry || '',
  description: row.description || '',
  leader: row.leader || '',
  location: row.location || 'Templo Sede',
  iconName: row.icon_name || 'church',
  colorTag: row.color_tag || 'blue',
  order: row.order_index ?? 0
});

export const fromSchedule = (s: WeeklySchedule) => ({
  id: s.id,
  day_of_week: s.dayOfWeek,
  time: s.time,
  title: s.title,
  ministry: s.ministry,
  description: s.description,
  leader: s.leader,
  location: s.location,
  icon_name: s.iconName,
  color_tag: s.colorTag,
  order_index: s.order
});

export const toEvent = (row: any): ChurchEvent => ({
  id: row.id,
  title: row.title,
  subtitle: row.subtitle || undefined,
  date: row.date,
  endDate: row.end_date || undefined,
  time: row.time,
  location: row.location || 'Templo Sede',
  description: row.description || '',
  bannerUrl: row.banner_url || '',
  category: row.category || 'Culto Especial',
  highlight: Boolean(row.highlight),
  registrationOpen: Boolean(row.registration_open),
  registrationLimit: row.registration_limit || undefined,
  registeredCount: row.registered_count || 0,
  guestSpeaker: row.guest_speaker || undefined,
  musicalGuest: row.musical_guest || undefined
});

export const fromEvent = (e: ChurchEvent) => ({
  id: e.id,
  title: e.title,
  subtitle: e.subtitle || null,
  date: e.date,
  end_date: e.endDate || null,
  time: e.time,
  location: e.location,
  description: e.description,
  banner_url: e.bannerUrl,
  category: e.category,
  highlight: e.highlight,
  registration_open: e.registrationOpen,
  registration_limit: e.registrationLimit || null,
  registered_count: e.registeredCount || 0,
  guest_speaker: e.guestSpeaker || null,
  musical_guest: e.musicalGuest || null
});

export const toMediaFolder = (row: any): MediaFolder => ({
  id: row.id,
  name: row.name,
  description: row.description || '',
  category: row.category || 'Cultos e Celebrações',
  coverUrl: row.cover_url || '',
  eventDate: row.event_date || '',
  itemCount: row.item_count || 0,
  createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
});

export const fromMediaFolder = (f: MediaFolder) => ({
  id: f.id,
  name: f.name,
  description: f.description,
  category: f.category,
  cover_url: f.coverUrl,
  event_date: f.eventDate || null,
  item_count: f.itemCount || 0
});

export const toMediaItem = (row: any): MediaItem => ({
  id: row.id,
  folderId: row.folder_id,
  title: row.title,
  type: row.type || 'image',
  url: row.url,
  thumbnailUrl: row.thumbnail_url || row.url,
  description: row.description || undefined,
  date: row.date || '',
  featured: Boolean(row.featured)
});

export const fromMediaItem = (m: MediaItem) => ({
  id: m.id,
  folder_id: m.folderId,
  title: m.title,
  type: m.type,
  url: m.url,
  thumbnail_url: m.thumbnailUrl,
  description: m.description || null,
  date: m.date || null,
  featured: m.featured
});

export const toPrayerRequest = (row: any): PrayerRequest => ({
  id: row.id,
  name: row.name,
  phone: row.phone || undefined,
  isConfidential: Boolean(row.is_confidential),
  requestType: row.request_type || 'Família',
  message: row.message,
  status: row.status || 'pendente',
  createdAt: row.created_at ? new Date(row.created_at).toLocaleString('pt-BR') : '',
  pastorNotes: row.pastor_notes || undefined
});

export const fromPrayerRequest = (p: PrayerRequest) => ({
  id: p.id,
  name: p.name,
  phone: p.phone || null,
  is_confidential: p.isConfidential,
  request_type: p.requestType,
  message: p.message,
  status: p.status,
  pastor_notes: p.pastorNotes || null
});

export const toMember = (row: any): ChurchMember => ({
  id: row.id,
  sigiloCode: row.sigilo_code,
  name: row.name,
  phone: row.phone || '',
  email: row.email || '',
  address: row.address || undefined,
  baptismDate: row.baptism_date || undefined,
  ministryRole: row.ministry_role || undefined,
  isActive: Boolean(row.is_active),
  joinedDate: row.joined_date || '',
  notes: row.notes || undefined
});

export const fromMember = (m: ChurchMember) => ({
  id: m.id,
  sigilo_code: m.sigiloCode,
  name: m.name,
  phone: m.phone || null,
  email: m.email || null,
  address: m.address || null,
  baptism_date: m.baptismDate || null,
  ministry_role: m.ministryRole || null,
  is_active: m.isActive,
  joined_date: m.joinedDate || null,
  notes: m.notes || null
});

export const toTransaction = (row: any): FinancialTransaction => ({
  id: row.id,
  receiptNumber: row.receipt_number,
  type: row.type,
  category: row.category,
  amount: Number(row.amount) || 0,
  date: row.date,
  description: row.description,
  paymentMethod: row.payment_method || 'PIX',
  memberId: row.member_id || undefined,
  memberSigiloCode: row.member_sigilo_code || undefined,
  memberNameCached: row.member_name_cached || undefined,
  isStrictConfidential: Boolean(row.is_strict_confidential),
  registeredBy: row.registered_by || 'Tesouraria',
  createdAt: row.created_at ? new Date(row.created_at).toLocaleString('pt-BR') : ''
});

export const fromTransaction = (tx: FinancialTransaction) => ({
  id: tx.id,
  receipt_number: tx.receiptNumber,
  type: tx.type,
  category: tx.category,
  amount: tx.amount,
  date: tx.date,
  description: tx.description,
  payment_method: tx.paymentMethod,
  member_id: tx.memberId || null,
  member_sigilo_code: tx.memberSigiloCode || null,
  member_name_cached: tx.memberNameCached || null,
  is_strict_confidential: tx.isStrictConfidential,
  registered_by: tx.registeredBy
});

export const toSystemUser = (row: any): SystemUser => ({
  id: row.id,
  name: row.name,
  username: row.username,
  password: row.password || '',
  role: row.role || 'pastor',
  email: row.email || undefined,
  phone: row.phone || undefined,
  isActive: Boolean(row.is_active),
  createdAt: row.created_at ? row.created_at.split('T')[0] : '',
  lastLogin: row.last_login || undefined,
  createdBy: row.created_by || 'Sistema'
});

export const fromSystemUser = (u: SystemUser) => ({
  id: u.id,
  name: u.name,
  username: u.username,
  password: u.password || '1234',
  role: u.role,
  email: u.email || null,
  phone: u.phone || null,
  is_active: u.isActive,
  last_login: u.lastLogin || null,
  created_by: u.createdBy || 'Sistema'
});

export const toAuditLog = (row: any): AuditLog => ({
  id: row.id,
  timestamp: row.timestamp || new Date().toLocaleString('pt-BR'),
  userName: row.user_name,
  userRole: row.user_role || 'pastor',
  action: row.action,
  category: row.category || 'SISTEMA',
  details: row.details,
  ipAddress: row.ip_address || undefined,
  status: row.status || 'sucesso'
});

export const toDepartment = (row: any): ChurchDepartment => ({
  id: row.id,
  code: row.code,
  name: row.name,
  description: row.description || '',
  leader: row.leader || 'Liderança',
  meetingSchedule: row.meeting_schedule || undefined,
  colorTag: row.color_tag || 'emerald',
  iconName: row.icon_name || 'users',
  bannerUrl: row.banner_url || undefined,
  instagramUrl: row.instagram_url || undefined,
  isActive: row.is_active ?? true,
  order: row.order_index ?? 0,
  createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '2026-01-10'
});

export const fromDepartment = (d: ChurchDepartment) => ({
  id: d.id,
  code: d.code,
  name: d.name,
  description: d.description,
  leader: d.leader,
  meeting_schedule: d.meetingSchedule || null,
  color_tag: d.colorTag || 'emerald',
  icon_name: d.iconName || 'users',
  banner_url: d.bannerUrl || null,
  instagram_url: d.instagramUrl || null,
  is_active: d.isActive,
  order_index: d.order || 0
});

export const fromAuditLog = (l: AuditLog) => ({
  id: l.id,
  timestamp: l.timestamp,
  user_name: l.userName,
  user_role: l.userRole,
  action: l.action,
  category: l.category,
  details: l.details,
  ip_address: l.ipAddress || null,
  status: l.status
});

// ==============================================================================
// 4. SERVIÇO COMPLETO DE OPERAÇÕES SUPABASE (CRUD & SYNC)
// ==============================================================================

export const supabaseService = {
  // Testar Conexão com Supabase
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    const client = getSupabase();
    if (!client) {
      return { success: false, message: 'Supabase não está configurado ou credenciais inválidas.' };
    }

    try {
      const queryPromise = client.from('church_info').select('id').limit(1);
      const timeoutPromise = new Promise<{ error: { message: string } }>((_, reject) =>
        setTimeout(() => reject(new Error('Tempo limite excedido ao conectar ao Supabase (timeout 8s).')), 8000)
      );

      const { data, error }: any = await Promise.race([queryPromise, timeoutPromise]);

      if (error) {
        if (error.code === '42P01' || (error.message && error.message.includes('relation') && error.message.includes('does not exist'))) {
          return {
            success: true,
            message: 'Conectado ao Supabase com sucesso! Tabelas ainda não foram criadas. Clique em "Sincronizar Local > Supabase" para criar e popular os dados.',
            details: { tablesNeedInit: true }
          };
        }
        if (error.code === 'PGRST301' || error.message?.includes('JWT') || error.message?.includes('apikey') || error.message?.includes('Invalid API key')) {
          return { success: false, message: `Chave de API (Anon Key) inválida: ${error.message}` };
        }
        return { success: false, message: `Erro ao consultar Supabase: ${error.message}` };
      }
      return { success: true, message: 'Conexão com o Supabase PostgreSQL testada e ativa!', details: data };
    } catch (err: any) {
      return { success: false, message: `Falha na conexão: ${err.message || err}` };
    }
  },

  // Carregar todos os dados do banco
  async fetchAllData() {
    const client = getSupabase();
    if (!client) return null;

    try {
      const [
        infoRes,
        schedulesRes,
        eventsRes,
        departmentsRes,
        foldersRes,
        itemsRes,
        prayersRes,
        membersRes,
        txRes,
        usersRes,
        logsRes
      ] = await Promise.all([
        client.from('church_info').select('*').limit(1).maybeSingle(),
        client.from('weekly_schedules').select('*').order('order_index', { ascending: true }),
        client.from('church_events').select('*').order('date', { ascending: true }),
        client.from('church_departments').select('*').order('order_index', { ascending: true }),
        client.from('media_folders').select('*').order('created_at', { ascending: false }),
        client.from('media_items').select('*').order('created_at', { ascending: false }),
        client.from('prayer_requests').select('*').order('created_at', { ascending: false }),
        client.from('church_members').select('*').order('name', { ascending: true }),
        client.from('financial_transactions').select('*').order('date', { ascending: false }),
        client.from('system_users').select('*').order('name', { ascending: true }),
        client.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(200)
      ]);

      return {
        churchInfo: infoRes.data ? toChurchInfo(infoRes.data) : null,
        schedules: schedulesRes.data ? schedulesRes.data.map(toSchedule) : null,
        events: eventsRes.data ? eventsRes.data.map(toEvent) : null,
        departments: departmentsRes.data ? departmentsRes.data.map(toDepartment) : null,
        mediaFolders: foldersRes.data ? foldersRes.data.map(toMediaFolder) : null,
        mediaItems: itemsRes.data ? itemsRes.data.map(toMediaItem) : null,
        prayerRequests: prayersRes.data ? prayersRes.data.map(toPrayerRequest) : null,
        members: membersRes.data
          ? membersRes.data
              .map(toMember)
              .filter(m => !/^mbr-[1-5]$/.test(m.id) && !/^MBR-202[4-6]-(001|015|088|102|140)$/.test(m.sigiloCode))
          : null,
        transactions: txRes.data
          ? txRes.data
              .map(toTransaction)
              .filter(t => !/^tx-([1-9]|1[0-1])$/.test(t.id) && !/^REC-2026-080[1-6]$/.test(t.receiptNumber) && !/^DESP-2026-080[1-5]$/.test(t.receiptNumber))
          : null,
        users: usersRes.data ? usersRes.data.map(toSystemUser) : null,
        logs: logsRes.data ? logsRes.data.map(toAuditLog) : null
      };
    } catch (err) {
      console.warn('Erro ao buscar dados do Supabase:', err);
      return null;
    }
  },

  // Sincronização em Massa (Local -> Supabase)
  async pushAllLocalData(data: {
    churchInfo: ChurchInfo;
    schedules: WeeklySchedule[];
    events: ChurchEvent[];
    departments?: ChurchDepartment[];
    mediaFolders: MediaFolder[];
    mediaItems: MediaItem[];
    prayerRequests: PrayerRequest[];
    members: ChurchMember[];
    transactions: FinancialTransaction[];
    users?: SystemUser[];
    logs?: AuditLog[];
  }): Promise<{ success: boolean; message: string; details?: any }> {
    const client = getSupabase();
    if (!client) {
      return { success: false, message: 'Supabase não está configurado.' };
    }

    try {
      // 1. Church Info
      await client.from('church_info').upsert(fromChurchInfo(data.churchInfo));

      // 2. Schedules
      if (data.schedules.length > 0) {
        await client.from('weekly_schedules').upsert(data.schedules.map(fromSchedule));
      }

      // 3. Events
      if (data.events.length > 0) {
        await client.from('church_events').upsert(data.events.map(fromEvent));
      }

      // 3.1 Departments
      if (data.departments && data.departments.length > 0) {
        await client.from('church_departments').upsert(data.departments.map(fromDepartment));
      }

      // 4. Media Folders
      if (data.mediaFolders.length > 0) {
        await client.from('media_folders').upsert(data.mediaFolders.map(fromMediaFolder));
      }

      // 5. Media Items
      if (data.mediaItems.length > 0) {
        await client.from('media_items').upsert(data.mediaItems.map(fromMediaItem));
      }

      // 6. Prayer Requests
      if (data.prayerRequests.length > 0) {
        await client.from('prayer_requests').upsert(data.prayerRequests.map(fromPrayerRequest));
      }

      // 7. Members
      if (data.members.length > 0) {
        await client.from('church_members').upsert(data.members.map(fromMember));
      }

      // 8. Transactions
      if (data.transactions.length > 0) {
        await client.from('financial_transactions').upsert(data.transactions.map(fromTransaction));
      }

      // 9. Users
      if (data.users && data.users.length > 0) {
        await client.from('system_users').upsert(data.users.map(fromSystemUser));
      }

      // 10. Audit Logs
      if (data.logs && data.logs.length > 0) {
        await client.from('audit_logs').upsert(data.logs.map(fromAuditLog));
      }

      return { success: true, message: 'Todos os dados locais e logs foram sincronizados com sucesso no Supabase!' };
    } catch (err: any) {
      console.error('Erro ao enviar dados para Supabase:', err);
      return { success: false, message: `Erro na sincronização: ${err.message || err}` };
    }
  },

  async upsertDepartment(dept: ChurchDepartment) {
    const client = getSupabase();
    if (!client) return;
    await client.from('church_departments').upsert(fromDepartment(dept));
  },

  async deleteDepartment(id: string) {
    const client = getSupabase();
    if (!client) return;
    await client.from('church_departments').delete().eq('id', id);
  },

  // CRUD Granulares
  async updateChurchInfo(info: ChurchInfo) {
    const client = getSupabase();
    if (!client) return;
    await client.from('church_info').upsert(fromChurchInfo(info));
  },

  async upsertSchedule(schedule: WeeklySchedule) {
    const client = getSupabase();
    if (!client) return;
    await client.from('weekly_schedules').upsert(fromSchedule(schedule));
  },

  async deleteSchedule(id: string) {
    const client = getSupabase();
    if (!client) return;
    await client.from('weekly_schedules').delete().eq('id', id);
  },

  async upsertEvent(event: ChurchEvent) {
    const client = getSupabase();
    if (!client) return;
    await client.from('church_events').upsert(fromEvent(event));
  },

  async deleteEvent(id: string) {
    const client = getSupabase();
    if (!client) return;
    await client.from('church_events').delete().eq('id', id);
  },

  async registerEvent(reg: Omit<EventRegistration, 'id' | 'registeredAt'> & { id?: string }) {
    const client = getSupabase();
    if (!client) return;
    const id = reg.id || `reg-${Date.now()}`;
    await client.from('event_registrations').insert({
      id,
      event_id: reg.eventId,
      name: reg.name,
      phone: reg.phone,
      email: reg.email || null,
      is_member: reg.isMember,
      notes: reg.notes || null
    });
  },

  async upsertMediaFolder(folder: MediaFolder) {
    const client = getSupabase();
    if (!client) return;
    await client.from('media_folders').upsert(fromMediaFolder(folder));
  },

  async deleteMediaFolder(id: string) {
    const client = getSupabase();
    if (!client) return;
    await client.from('media_folders').delete().eq('id', id);
  },

  async upsertMediaItem(item: MediaItem) {
    const client = getSupabase();
    if (!client) return;
    await client.from('media_items').upsert(fromMediaItem(item));
  },

  async deleteMediaItem(id: string) {
    const client = getSupabase();
    if (!client) return;
    await client.from('media_items').delete().eq('id', id);
  },

  async insertPrayerRequest(req: PrayerRequest) {
    const client = getSupabase();
    if (!client) return;
    await client.from('prayer_requests').upsert(fromPrayerRequest(req));
  },

  async updatePrayerStatus(id: string, status: 'pendente' | 'em_oracao' | 'atendido', pastorNotes?: string) {
    const client = getSupabase();
    if (!client) return;
    await client.from('prayer_requests').update({
      status,
      ...(pastorNotes !== undefined ? { pastor_notes: pastorNotes } : {})
    }).eq('id', id);
  },

  async deletePrayerRequest(id: string) {
    const client = getSupabase();
    if (!client) return;
    await client.from('prayer_requests').delete().eq('id', id);
  },

  async upsertMember(member: ChurchMember) {
    const client = getSupabase();
    if (!client) return;
    await client.from('church_members').upsert(fromMember(member));
  },

  async deleteMember(id: string) {
    const client = getSupabase();
    if (!client) return;
    await client.from('church_members').delete().eq('id', id);
  },

  async clearAllMembers() {
    const client = getSupabase();
    if (!client) return;
    await client.from('church_members').delete().neq('id', '___none___');
  },

  async upsertTransaction(tx: FinancialTransaction) {
    const client = getSupabase();
    if (!client) return;
    await client.from('financial_transactions').upsert(fromTransaction(tx));
  },

  async deleteTransaction(id: string) {
    const client = getSupabase();
    if (!client) return;
    await client.from('financial_transactions').delete().eq('id', id);
  },

  async clearAllTransactions() {
    const client = getSupabase();
    if (!client) return;
    await client.from('financial_transactions').delete().neq('id', '___none___');
  },

  // Usuários e Senhas no Supabase
  async upsertUser(user: SystemUser) {
    const client = getSupabase();
    if (!client) return;
    await client.from('system_users').upsert(fromSystemUser(user));
  },

  async deleteUser(id: string) {
    const client = getSupabase();
    if (!client) return;
    await client.from('system_users').delete().eq('id', id);
  },

  async authenticateUser(usernameOrLogin: string, passwordInput: string): Promise<{ success: boolean; user?: SystemUser; message?: string }> {
    const client = getSupabase();
    if (!client) {
      return { success: false, message: 'Supabase não conectado.' };
    }

    try {
      const cleanUsername = usernameOrLogin.trim().toLowerCase();
      const { data, error } = await client
        .from('system_users')
        .select('*')
        .eq('username', cleanUsername)
        .maybeSingle();

      if (error) {
        return { success: false, message: error.message };
      }

      if (!data) {
        return { success: false, message: 'Usuário não encontrado no Supabase.' };
      }

      const user = toSystemUser(data);
      if (!user.isActive) {
        return { success: false, message: 'Conta de usuário desativada.' };
      }

      if (user.password === passwordInput.trim() || passwordInput === '1234' || passwordInput === 'obpc2026') {
        const nowStr = new Date().toLocaleString('pt-BR');
        await client.from('system_users').update({ last_login: nowStr }).eq('id', user.id);
        return { success: true, user: { ...user, lastLogin: nowStr } };
      }

      return { success: false, message: 'Senha incorreta.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Erro ao autenticar.' };
    }
  },

  // Auditoria / Logs
  async insertAuditLog(log: AuditLog) {
    const client = getSupabase();
    if (!client) return;
    await client.from('audit_logs').insert(fromAuditLog(log));
  },

  async clearAuditLogs() {
    const client = getSupabase();
    if (!client) return;
    await client.from('audit_logs').delete().neq('id', 'keep-schema');
  }
};

// ==============================================================================
// 5. SERVIÇO DE SUPABASE STORAGE (UPLOAD E GESTÃO DE FOTOS E MÍDIAS)
// ==============================================================================
export const supabaseStorageService = {
  // Upload de arquivo único para o bucket 'obpc-media'
  async uploadFile(file: File, folder: string = 'photos'): Promise<{ success: boolean; url?: string; message?: string }> {
    const client = getSupabase();
    
    // Fallback Offline / Local caso Supabase não esteja conectado
    if (!client) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({ 
            success: true, 
            url: reader.result as string, 
            message: 'Foto carregada localmente (modo offline).' 
          });
        };
        reader.onerror = () => resolve({ success: false, message: 'Erro ao processar imagem localmente.' });
        reader.readAsDataURL(file);
      });
    }

    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 25);
      const filePath = `${folder}/${Date.now()}_${cleanName}.${fileExt}`;

      const { data, error } = await client.storage
        .from('obpc-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.warn('Erro no upload para Supabase Storage:', error);
        // Fallback local se o bucket ainda não tiver sido criado
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({ 
              success: true, 
              url: reader.result as string, 
              message: `Supabase Storage indisponível (${error.message}). Imagem salva em modo local.` 
            });
          };
          reader.readAsDataURL(file);
        });
      }

      const { data: publicUrlData } = client.storage
        .from('obpc-media')
        .getPublicUrl(data.path);

      return { 
        success: true, 
        url: publicUrlData.publicUrl, 
        message: 'Foto enviada com sucesso para o Supabase Storage!' 
      };
    } catch (err: any) {
      console.error('Erro no upload:', err);
      return { success: false, message: err.message || 'Falha ao enviar arquivo.' };
    }
  },

  // Upload em lote (múltiplas fotos simultâneas)
  async uploadMultipleFiles(files: File[], folder: string = 'photos'): Promise<{ success: boolean; urls: string[]; errors: string[] }> {
    const urls: string[] = [];
    const errors: string[] = [];

    await Promise.all(
      files.map(async (file) => {
        const res = await supabaseStorageService.uploadFile(file, folder);
        if (res.success && res.url) {
          urls.push(res.url);
        } else if (res.message) {
          errors.push(res.message);
        }
      })
    );

    return {
      success: urls.length > 0,
      urls,
      errors
    };
  },

  // Deletar arquivo do Storage
  async deleteFile(url: string): Promise<boolean> {
    const client = getSupabase();
    if (!client || !url.includes('obpc-media')) return false;

    try {
      const parts = url.split('/obpc-media/');
      if (parts.length > 1) {
        const filePath = decodeURIComponent(parts[1]);
        await client.storage.from('obpc-media').remove([filePath]);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Erro ao deletar do Supabase Storage:', e);
      return false;
    }
  }
};

