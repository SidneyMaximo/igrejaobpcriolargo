export type RoleType = 'pastor' | 'tesoureiro' | 'secretaria' | 'lider';

export interface ChurchInfo {
  name: string;
  subtitle: string;
  pastorName: string;
  vicePastorName: string;
  address: string;
  cityState: string;
  zipCode: string;
  phone: string;
  whatsapp: string;
  email: string;
  pixKey: string;
  pixKeyType: 'CNPJ' | 'E-mail' | 'Telefone' | 'Chave Aleatória';
  pixRecipient: string;
  bankName: string;
  bankAgency: string;
  bankAccount: string;
  youtubeChannelUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  liveStreamUrl?: string;
  historyText: string;
}

export interface WeeklySchedule {
  id: string;
  dayOfWeek: 'Domingo' | 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado';
  time: string;
  title: string;
  ministry: string;
  description: string;
  leader: string;
  location: string;
  iconName: string;
  colorTag: string;
  order: number;
}

export interface ChurchEvent {
  id: string;
  title: string;
  subtitle?: string;
  date: string; // YYYY-MM-DD
  endDate?: string;
  time: string;
  location: string;
  description: string;
  bannerUrl: string;
  category: 'Congresso' | 'Culto Especial' | 'Vigília' | 'Batismo' | 'Juventude' | 'Infantil' | 'Casais' | 'Missões';
  highlight: boolean;
  registrationOpen: boolean;
  registrationLimit?: number;
  registeredCount: number;
  guestSpeaker?: string;
  musicalGuest?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  name: string;
  phone: string;
  email: string;
  isMember: boolean;
  notes?: string;
  registeredAt: string;
}

export interface MediaFolder {
  id: string;
  name: string;
  description: string;
  category: 'Cultos e Celebrações' | 'Congressos e Conferências' | 'Ação Social' | 'Juventude e Crianças' | 'Batismos' | 'Obras e Reformas';
  coverUrl: string;
  eventDate: string;
  itemCount?: number;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  folderId: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl: string;
  description?: string;
  date: string;
  featured: boolean;
}

export interface PrayerRequest {
  id: string;
  name: string;
  phone?: string;
  isConfidential: boolean; // if true, only Pastor and Intercession leaders see
  requestType: 'Saúde' | 'Família' | 'Vida Espiritual' | 'Financeiro' | 'Libertação' | 'Gratidão' | 'Outro';
  message: string;
  status: 'pendente' | 'em_oracao' | 'atendido';
  createdAt: string;
  pastorNotes?: string;
}

export interface ChurchMember {
  id: string;
  sigiloCode: string; // e.g. MBR-2026-042
  name: string;
  phone: string;
  email: string;
  address?: string;
  baptismDate?: string;
  ministryRole?: string;
  isActive: boolean;
  joinedDate: string;
  notes?: string;
}

export interface FinancialTransaction {
  id: string;
  receiptNumber: string; // REC-2026-0001
  type: 'entrada' | 'saida';
  category: 
    | 'Dízimo'
    | 'Oferta de Culto'
    | 'Oferta Alçada'
    | 'Oferta Missionária'
    | 'Campanha / Construção'
    | 'Doação Especial'
    | 'Manutenção e Conservação'
    | 'Contas de Consumo (Água/Luz/Net)'
    | 'Material Eclesiástico / Ceia'
    | 'Missões e Ação Social'
    | 'Sonorização e Mídia'
    | 'Honorários Ministeriais'
    | 'Eventos e Congressos'
    | 'Outras Despesas';
  amount: number;
  date: string; // YYYY-MM-DD
  description: string;
  paymentMethod: 'PIX' | 'Dinheiro' | 'Transferência Bancária' | 'Boleto' | 'Cartão';
  memberId?: string; // Optional for private link to member
  memberSigiloCode?: string;
  memberNameCached?: string;
  isStrictConfidential: boolean; // Hide names from public assembly reports
  registeredBy: string;
  createdAt: string;
}

export interface FinancialSummary {
  totalEntradas: number;
  totalSaidas: number;
  saldoAtual: number;
  totalDizimos: number;
  totalOfertas: number;
  totalMissoes: number;
  mesAtualEntradas: number;
  mesAtualSaidas: number;
}

// ==============================================================================
// GESTÃO DE DEPARTAMENTOS E MINISTÉRIOS
// ==============================================================================
export interface ChurchDepartment {
  id: string;
  code: string; // Ex: 'JUBRAC', 'UFEBRAC', 'MENBRAC', 'UCEBRAC', 'ADOBRAC'
  name: string; // Ex: 'JUBRAC (Juventude)'
  description: string;
  leader: string;
  meetingSchedule?: string; // Ex: 'Sábados às 19:30'
  colorTag: 'amber' | 'rose' | 'emerald' | 'blue' | 'purple' | 'sky' | 'indigo' | 'teal' | string;
  iconName?: string; // 'users', 'heart', 'shield', 'sparkles', 'zap', 'music', 'book-open', 'flame'
  bannerUrl?: string;
  instagramUrl?: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
}

// ==============================================================================
// GESTÃO DE USUÁRIOS E CONTROLE DE ACESSO
// ==============================================================================
export interface SystemUser {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: RoleType;
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  createdBy?: string;
}

// ==============================================================================
// AUDITORIA E LOGS DE SISTEMA
// ==============================================================================
export type LogActionCategory = 
  | 'AUTH' 
  | 'FINANCEIRO' 
  | 'MEMBROS' 
  | 'EVENTOS' 
  | 'CULTOS' 
  | 'MIDIA' 
  | 'ORACAO' 
  | 'DEPARTAMENTOS'
  | 'USUARIOS' 
  | 'CONFIGURACAO' 
  | 'SISTEMA';

export interface AuditLog {
  id: string;
  timestamp: string; // Formato legível "DD/MM/AAAA HH:MM:SS"
  userName: string;
  userRole: RoleType | 'anon' | 'sistema';
  action: string;
  category: LogActionCategory;
  details: string;
  ipAddress?: string;
  status: 'sucesso' | 'aviso' | 'erro';
}
