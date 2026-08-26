import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  FinancialSummary,
  RoleType,
  SystemUser,
  AuditLog,
  LogActionCategory,
  ChurchDepartment
} from '../types';
import {
  INITIAL_CHURCH_INFO,
  INITIAL_SCHEDULES,
  INITIAL_EVENTS,
  INITIAL_MEDIA_FOLDERS,
  INITIAL_MEDIA_ITEMS,
  INITIAL_PRAYER_REQUESTS,
  INITIAL_MEMBERS,
  INITIAL_TRANSACTIONS,
  INITIAL_SYSTEM_USERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_DEPARTMENTS
} from '../data/seedData';
import {
  isSupabaseConfigured,
  getSupabase,
  saveCustomCredentials,
  clearCustomCredentials,
  supabaseService,
  toPrayerRequest,
  toEvent,
  toSchedule,
  toMember,
  toTransaction,
  toSystemUser,
  toAuditLog
} from '../lib/supabase';

interface AdminSession {
  isAuthenticated: boolean;
  username: string;
  role: RoleType;
  loginTime: string;
}

export type SupabaseStatus = 'connected' | 'offline' | 'checking' | 'not_configured' | 'error';

interface ChurchContextType {
  churchInfo: ChurchInfo;
  updateChurchInfo: (info: Partial<ChurchInfo>) => void;
  
  // Schedules
  schedules: WeeklySchedule[];
  addSchedule: (schedule: Omit<WeeklySchedule, 'id'>) => void;
  updateSchedule: (id: string, schedule: Partial<WeeklySchedule>) => void;
  deleteSchedule: (id: string) => void;

  // Events
  events: ChurchEvent[];
  addEvent: (event: Omit<ChurchEvent, 'id' | 'registeredCount'>) => void;
  updateEvent: (id: string, event: Partial<ChurchEvent>) => void;
  deleteEvent: (id: string) => void;
  registerEvent: (registration: Omit<EventRegistration, 'id' | 'registeredAt'>) => Promise<{ success: boolean; message: string }>;

  // Departments / Ministérios (Acesso para todos os usuários)
  departments: ChurchDepartment[];
  addDepartment: (dept: Omit<ChurchDepartment, 'id' | 'createdAt'>) => { success: boolean; message: string; department?: ChurchDepartment };
  updateDepartment: (id: string, dept: Partial<ChurchDepartment>) => { success: boolean; message: string };
  deleteDepartment: (id: string) => { success: boolean; message: string };
  toggleDepartmentStatus: (id: string) => void;

  // Media Folders & Items
  mediaFolders: MediaFolder[];
  mediaItems: MediaItem[];
  addMediaFolder: (folder: Omit<MediaFolder, 'id' | 'createdAt'>) => void;
  updateMediaFolder: (id: string, folder: Partial<MediaFolder>) => void;
  deleteMediaFolder: (id: string) => void;
  addMediaItem: (item: Omit<MediaItem, 'id'>) => void;
  updateMediaItem: (id: string, item: Partial<MediaItem>) => void;
  deleteMediaItem: (id: string) => void;

  // Prayer Requests
  prayerRequests: PrayerRequest[];
  addPrayerRequest: (request: Omit<PrayerRequest, 'id' | 'createdAt' | 'status'>) => void;
  updatePrayerStatus: (id: string, status: 'pendente' | 'em_oracao' | 'atendido', notes?: string) => void;
  deletePrayerRequest: (id: string) => void;

  // Members & CRM
  members: ChurchMember[];
  addMember: (member: Omit<ChurchMember, 'id' | 'sigiloCode' | 'joinedDate'>) => ChurchMember;
  updateMember: (id: string, member: Partial<ChurchMember>) => void;
  deleteMember: (id: string) => void;
  clearAllMembers: () => Promise<void>;
  getMemberById: (id: string) => ChurchMember | undefined;

  // Financial CRM (Confidential)
  transactions: FinancialTransaction[];
  addTransaction: (tx: Omit<FinancialTransaction, 'id' | 'receiptNumber' | 'createdAt'>) => FinancialTransaction;
  updateTransaction: (id: string, tx: Partial<FinancialTransaction>) => void;
  deleteTransaction: (id: string) => void;
  clearAllTransactions: () => Promise<void>;
  financialSummary: FinancialSummary;

  // System Users & Security
  users: SystemUser[];
  addUser: (user: Omit<SystemUser, 'id' | 'createdAt'>) => { success: boolean; message: string; user?: SystemUser };
  updateUser: (id: string, user: Partial<SystemUser>) => { success: boolean; message: string };
  deleteUser: (id: string) => { success: boolean; message: string };
  toggleUserStatus: (id: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: string, category: LogActionCategory, details: string, status?: 'sucesso' | 'aviso' | 'erro') => void;
  clearAllAuditLogs: () => void;

  // Admin Auth & Secret Mode
  adminSession: AdminSession | null;
  loginAdmin: (usernameOrPassword: string, passwordOrRole?: string | RoleType, customName?: string, usernameInput?: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  isSigiloModeActive: boolean;
  toggleSigiloMode: () => void;
  
  // Storage & Export
  resetToDefaults: () => void;
  exportDatabaseJSON: () => void;
  importDatabaseJSON: (jsonData: string) => boolean;

  // Supabase Cloud Integration
  isSupabaseOnline: boolean;
  supabaseStatus: SupabaseStatus;
  supabaseStatusMessage: string;
  isSyncing: boolean;
  syncToSupabase: () => Promise<{ success: boolean; message: string }>;
  syncFromSupabase: () => Promise<{ success: boolean; message: string }>;
  saveCredentials: (url: string, key: string) => Promise<{ success: boolean; message: string }>;
  clearCredentials: () => void;
  checkSupabaseHealth: () => Promise<{ success: boolean; message: string }>;
}

const ChurchContext = createContext<ChurchContextType | null>(null);

const STORAGE_KEYS = {
  INFO: 'obpc_church_info_v2',
  SCHEDULES: 'obpc_schedules_v2',
  EVENTS: 'obpc_events_v1',
  DEPARTMENTS: 'obpc_departments_v1',
  FOLDERS: 'obpc_media_folders_v1',
  MEDIA: 'obpc_media_items_v1',
  PRAYERS: 'obpc_prayers_v1',
  MEMBERS: 'obpc_members_v2',
  TRANSACTIONS: 'obpc_transactions_v2',
  ADMIN: 'obpc_admin_session_v1',
  SIGILO: 'obpc_sigilo_mode_v1',
  USERS: 'obpc_system_users_v2',
  LOGS: 'obpc_audit_logs_v2'
};

const safeParse = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const ChurchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Church Info
  const [churchInfo, setChurchInfo] = useState<ChurchInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INFO);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.pastorName || parsed.pastorName.includes('Carlos') || parsed.pastorName.includes('Eduardo') || parsed.pastorName.includes('Marlene')) {
          parsed.pastorName = 'Pr. Janildo Manoel';
          parsed.vicePastorName = '';
        }
        if (parsed.address && parsed.address.includes('Nações Unidas')) {
          parsed.address = 'Loteamento 3 amigos, 3 - Forene';
          parsed.cityState = 'Rio Largo - AL';
          parsed.zipCode = '57100-000';
          parsed.phone = '(82) 3214-8800';
          parsed.whatsapp = '(82) 999694402';
          parsed.email = 'obpcriolargo@gmail.com';
        }
        if (parsed.pixKey === '45.123.890/0001-55' || parsed.pixKey === '00.123.456/0001-99' || !parsed.pixKey) {
          parsed.pixKey = '82999694402';
          parsed.pixKeyType = 'Telefone';
        }
        if (!parsed.instagramUrl || parsed.instagramUrl === 'https://instagram.com') {
          parsed.instagramUrl = 'https://instagram.com/obpcriolargo';
        }
        if (!parsed.youtubeChannelUrl || parsed.youtubeChannelUrl === 'https://youtube.com') {
          parsed.youtubeChannelUrl = 'https://youtube.com/@obpcriolargo';
        }
        if (!parsed.liveStreamUrl || parsed.liveStreamUrl === 'https://www.youtube.com') {
          parsed.liveStreamUrl = 'https://youtube.com/@obpcriolargo/live';
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Erro ao carregar churchInfo do localStorage, usando padrão:', e);
    }
    return INITIAL_CHURCH_INFO;
  });

  // 2. Schedules
  const [schedules, setSchedules] = useState<WeeklySchedule[]>(() => safeParse(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES));

  // 3. Events
  const [events, setEvents] = useState<ChurchEvent[]>(() => safeParse(STORAGE_KEYS.EVENTS, INITIAL_EVENTS));

  // 3.1 Departments & Ministérios
  const [departments, setDepartments] = useState<ChurchDepartment[]>(() => safeParse(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS));

  // 4. Media Folders & Items
  const [mediaFolders, setMediaFolders] = useState<MediaFolder[]>(() => safeParse(STORAGE_KEYS.FOLDERS, INITIAL_MEDIA_FOLDERS));
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => safeParse(STORAGE_KEYS.MEDIA, INITIAL_MEDIA_ITEMS));

  // 5. Prayer Requests
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(() => safeParse(STORAGE_KEYS.PRAYERS, INITIAL_PRAYER_REQUESTS));

  // 6. Members (CRM)
  const [members, setMembers] = useState<ChurchMember[]>(() => safeParse(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS));

  // 7. Transactions (CRM)
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => safeParse(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS));

  // 8. System Users
  const [users, setUsers] = useState<SystemUser[]>(() => safeParse(STORAGE_KEYS.USERS, INITIAL_SYSTEM_USERS));

  // 9. Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => safeParse(STORAGE_KEYS.LOGS, INITIAL_AUDIT_LOGS));

  // 10. Admin Session & Privacy
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    const session = safeParse<AdminSession | null>(STORAGE_KEYS.ADMIN, null);
    if (session && session.username && (session.username.includes('Carlos') || session.username.includes('Eduardo'))) {
      return { ...session, username: 'Pr. Janildo Manoel' };
    }
    return session;
  });

  const [isSigiloModeActive, setIsSigiloModeActive] = useState<boolean>(() => safeParse(STORAGE_KEYS.SIGILO, true));

  // Supabase State
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus>('checking');
  const [supabaseStatusMessage, setSupabaseStatusMessage] = useState<string>('Verificando conexão...');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // LocalStorage synchronizers
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INFO, JSON.stringify(churchInfo));
  }, [churchInfo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(mediaFolders));
  }, [mediaFolders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(mediaItems));
  }, [mediaItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify(prayerRequests));
  }, [prayerRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs.slice(0, 300)));
  }, [auditLogs]);

  useEffect(() => {
    if (adminSession) {
      localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(adminSession));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN);
    }
  }, [adminSession]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIGILO, JSON.stringify(isSigiloModeActive));
  }, [isSigiloModeActive]);

  // Add Audit Log Helper
  const addAuditLog = useCallback((action: string, category: LogActionCategory, details: string, status: 'sucesso' | 'aviso' | 'erro' = 'sucesso') => {
    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: formatted,
      userName: adminSession?.username || 'Público / Sistema',
      userRole: adminSession?.role || 'sistema',
      action,
      category,
      details,
      status
    };

    setAuditLogs(prev => [newLog, ...prev.slice(0, 299)]);
    supabaseService.insertAuditLog(newLog);
  }, [adminSession]);

  // Clear Audit Logs
  const clearAllAuditLogs = () => {
    setAuditLogs([]);
    supabaseService.clearAuditLogs();
  };

  // Supabase Health Check
  const checkSupabaseHealth = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setSupabaseStatus('not_configured');
      setSupabaseStatusMessage('Supabase não configurado. Operando em modo offline / LocalStorage.');
      return { success: false, message: 'Supabase não configurado.' };
    }

    setSupabaseStatus('checking');
    setSupabaseStatusMessage('Testando conexão com Supabase PostgreSQL...');

    const result = await supabaseService.testConnection();
    if (result.success) {
      setSupabaseStatus('connected');
      setSupabaseStatusMessage('Conectado ao Supabase PostgreSQL com sucesso!');
      return result;
    } else {
      setSupabaseStatus('error');
      setSupabaseStatusMessage(result.message);
      return result;
    }
  }, []);

  // Supabase Pull
  const syncFromSupabase = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase não está configurado.' };
    }

    setIsSyncing(true);
    try {
      const data = await supabaseService.fetchAllData();
      if (!data) {
        setIsSyncing(false);
        return { success: false, message: 'Não foi possível carregar os dados do Supabase.' };
      }

      const hasRemoteData = Boolean(
        data.churchInfo || 
        (data.schedules && data.schedules.length > 0) ||
        (data.events && data.events.length > 0) ||
        (data.departments && data.departments.length > 0)
      );

      if (hasRemoteData) {
        if (data.churchInfo) {
          const info = data.churchInfo;
          if (info.pastorName && (info.pastorName.includes('Carlos') || info.pastorName.includes('Eduardo') || info.pastorName.includes('Marlene'))) {
            info.pastorName = 'Pr. Janildo Manoel';
            info.vicePastorName = '';
            supabaseService.updateChurchInfo(info);
          }
          if (info.address && info.address.includes('Nações Unidas')) {
            info.address = 'Loteamento 3 amigos, 3 - Forene';
            info.cityState = 'Rio Largo - AL';
            info.zipCode = '57100-000';
            info.phone = '(82) 3214-8800';
            info.whatsapp = '(82) 999694402';
            info.email = 'obpcriolargo@gmail.com';
            supabaseService.updateChurchInfo(info);
          }
          setChurchInfo(info);
        }
        if (data.schedules && data.schedules.length > 0) setSchedules(data.schedules);
        if (data.events && data.events.length > 0) setEvents(data.events);
        if (data.departments && data.departments.length > 0) setDepartments(data.departments);
        if (data.mediaFolders && data.mediaFolders.length > 0) setMediaFolders(data.mediaFolders);
        if (data.mediaItems && data.mediaItems.length > 0) setMediaItems(data.mediaItems);
        if (data.prayerRequests && data.prayerRequests.length > 0) setPrayerRequests(data.prayerRequests);
        if (data.members) {
          const cleanMembers = data.members.filter(m => !/^mbr-[1-5]$/.test(m.id) && !/^MBR-202[4-6]-(001|015|088|102|140)$/.test(m.sigiloCode));
          setMembers(cleanMembers);
        }
        if (data.transactions) {
          const cleanTx = data.transactions.filter(t => !/^tx-([1-9]|1[0-1])$/.test(t.id) && !/^REC-2026-080[1-6]$/.test(t.receiptNumber) && !/^DESP-2026-080[1-5]$/.test(t.receiptNumber));
          setTransactions(cleanTx);
        }
        if (data.users) setUsers(data.users);
        if (data.logs && data.logs.length > 0) setAuditLogs(data.logs);
      } else {
        await supabaseService.pushAllLocalData({
          churchInfo,
          schedules,
          events,
          departments,
          mediaFolders,
          mediaItems,
          prayerRequests,
          members,
          transactions,
          users,
          logs: auditLogs
        });
      }

      setIsSyncing(false);
      setSupabaseStatus('connected');
      setSupabaseStatusMessage('Dados sincronizados com o Supabase com sucesso!');
      return { success: true, message: 'Dados sincronizados com sucesso!' };
    } catch (err: any) {
      setIsSyncing(false);
      return { success: false, message: err.message || 'Erro ao sincronizar do Supabase.' };
    }
  }, [churchInfo, schedules, events, departments, mediaFolders, mediaItems, prayerRequests, members, transactions, users, auditLogs]);

  // Supabase Push
  const syncToSupabase = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase não configurado. Preencha a URL e a Anon Key primeiro.' };
    }

    setIsSyncing(true);
    const result = await supabaseService.pushAllLocalData({
      churchInfo,
      schedules,
      events,
      departments,
      mediaFolders,
      mediaItems,
      prayerRequests,
      members,
      transactions,
      users,
      logs: auditLogs
    });
    setIsSyncing(false);

    if (result.success) {
      setSupabaseStatus('connected');
      setSupabaseStatusMessage('Todos os dados locais foram salvos no Supabase PostgreSQL!');
      addAuditLog('Sincronização em Nuvem', 'CONFIGURACAO', 'Backup e sincronização manual enviada ao Supabase PostgreSQL.');
    }
    return result;
  }, [churchInfo, schedules, events, departments, mediaFolders, mediaItems, prayerRequests, members, transactions, users, auditLogs, addAuditLog]);

  // Save Credentials
  const saveCredentials = async (url: string, key: string) => {
    const saved = saveCustomCredentials(url, key);
    if (!saved) {
      return { success: false, message: 'Credenciais inválidas. Verifique a URL e a Anon Key.' };
    }

    const test = await checkSupabaseHealth();
    if (test.success) {
      await syncFromSupabase();
      addAuditLog('Conexão Supabase Configurada', 'CONFIGURACAO', 'Credenciais do Supabase salvas e conectadas.');
      return { success: true, message: 'Supabase conectado com sucesso!' };
    } else {
      return test;
    }
  };

  // Clear Credentials
  const clearCredentials = () => {
    clearCustomCredentials();
    setSupabaseStatus('not_configured');
    setSupabaseStatusMessage('Supabase desconectado. Operando em modo LocalStorage.');
    addAuditLog('Supabase Desconectado', 'CONFIGURACAO', 'Desconectado do Supabase, retornado a modo offline.');
  };

  // Initial Boot & Realtime Subscription
  useEffect(() => {
    const initializeSupabase = async () => {
      if (isSupabaseConfigured()) {
        const health = await checkSupabaseHealth();
        if (health.success) {
          await syncFromSupabase();

          const client = getSupabase();
          if (client) {
            const channel = client
              .channel('obpc-global-realtime')
              .on('postgres_changes', { event: '*', schema: 'public', table: 'prayer_requests' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                  const newReq = toPrayerRequest(payload.new);
                  setPrayerRequests(prev => [newReq, ...prev.filter(p => p.id !== newReq.id)]);
                } else if (payload.eventType === 'UPDATE') {
                  const updatedReq = toPrayerRequest(payload.new);
                  setPrayerRequests(prev => prev.map(p => p.id === updatedReq.id ? updatedReq : p));
                } else if (payload.eventType === 'DELETE') {
                  setPrayerRequests(prev => prev.filter(p => p.id !== payload.old.id));
                }
              })
              .on('postgres_changes', { event: '*', schema: 'public', table: 'church_events' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                  const newEvt = toEvent(payload.new);
                  setEvents(prev => [newEvt, ...prev.filter(e => e.id !== newEvt.id)]);
                } else if (payload.eventType === 'UPDATE') {
                  const updatedEvt = toEvent(payload.new);
                  setEvents(prev => prev.map(e => e.id === updatedEvt.id ? updatedEvt : e));
                } else if (payload.eventType === 'DELETE') {
                  setEvents(prev => prev.filter(e => e.id !== payload.old.id));
                }
              })
              .on('postgres_changes', { event: '*', schema: 'public', table: 'system_users' }, (payload) => {
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                  const updatedUsr = toSystemUser(payload.new);
                  setUsers(prev => [updatedUsr, ...prev.filter(u => u.id !== updatedUsr.id)]);
                } else if (payload.eventType === 'DELETE') {
                  setUsers(prev => prev.filter(u => u.id !== payload.old.id));
                }
              })
              .on('postgres_changes', { event: '*', schema: 'public', table: 'audit_logs' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                  const newLog = toAuditLog(payload.new);
                  setAuditLogs(prev => [newLog, ...prev.filter(l => l.id !== newLog.id).slice(0, 299)]);
                }
              })
              .subscribe();

            return () => {
              client.removeChannel(channel);
            };
          }
        }
      } else {
        setSupabaseStatus('not_configured');
        setSupabaseStatusMessage('Modo Local Ativo. Configure o Supabase para sincronização em nuvem.');
      }
    };

    // Auto-clean legacy dummy members from local storage/state on boot
    setMembers(prev => {
      const filtered = prev.filter(m => !/^mbr-[1-5]$/.test(m.id) && !/^MBR-202[4-6]-(001|015|088|102|140)$/.test(m.sigiloCode));
      if (filtered.length !== prev.length) {
        localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(filtered));
      }
      return filtered;
    });

    // Auto-clean legacy dummy transactions from local storage/state on boot
    setTransactions(prev => {
      const filtered = prev.filter(t => !/^tx-([1-9]|1[0-1])$/.test(t.id) && !/^REC-2026-080[1-6]$/.test(t.receiptNumber) && !/^DESP-2026-080[1-5]$/.test(t.receiptNumber));
      if (filtered.length !== prev.length) {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filtered));
      }
      return filtered;
    });
    try {
      localStorage.removeItem('obpc_church_info_v1');
      localStorage.removeItem('obpc_members_v1');
      localStorage.removeItem('obpc_transactions_v1');
      localStorage.removeItem('obpc_system_users_v1');
    } catch (e) {}

    initializeSupabase();
  }, []);

  // Methods
  const updateChurchInfo = (info: Partial<ChurchInfo>) => {
    const updated = { ...churchInfo, ...info };
    setChurchInfo(updated);
    supabaseService.updateChurchInfo(updated);
    addAuditLog('Dados da Igreja Atualizados', 'CONFIGURACAO', `Atualizados dados institucionais / PIX.`);
  };

  // Schedules
  const addSchedule = (data: Omit<WeeklySchedule, 'id'>) => {
    const newSchedule: WeeklySchedule = {
      ...data,
      id: `sch-${Date.now()}`
    };
    setSchedules(prev => [...prev, newSchedule]);
    supabaseService.upsertSchedule(newSchedule);
    addAuditLog('Novo Culto Programado', 'CULTOS', `Criado culto "${data.title}" para ${data.dayOfWeek} às ${data.time}.`);
  };

  const updateSchedule = (id: string, updated: Partial<WeeklySchedule>) => {
    setSchedules(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updated } : s);
      const target = next.find(s => s.id === id);
      if (target) supabaseService.upsertSchedule(target);
      return next;
    });
    addAuditLog('Culto Editado', 'CULTOS', `Horário ou informações do culto atualizadas (ID: ${id}).`);
  };

  const deleteSchedule = (id: string) => {
    const sch = schedules.find(s => s.id === id);
    setSchedules(prev => prev.filter(s => s.id !== id));
    supabaseService.deleteSchedule(id);
    addAuditLog('Culto Removido', 'CULTOS', `Culto "${sch?.title || id}" excluído da grade semanal.`, 'aviso');
  };

  // Events
  const addEvent = (data: Omit<ChurchEvent, 'id' | 'registeredCount'>) => {
    const newEvent: ChurchEvent = {
      ...data,
      id: `evt-${Date.now()}`,
      registeredCount: 0
    };
    setEvents(prev => [newEvent, ...prev]);
    supabaseService.upsertEvent(newEvent);
    addAuditLog('Novo Evento Criado', 'EVENTOS', `Publicado evento "${data.title}" marcado para ${data.date}.`);
  };

  const updateEvent = (id: string, updated: Partial<ChurchEvent>) => {
    setEvents(prev => {
      const next = prev.map(e => e.id === id ? { ...e, ...updated } : e);
      const target = next.find(e => e.id === id);
      if (target) supabaseService.upsertEvent(target);
      return next;
    });
    addAuditLog('Evento Atualizado', 'EVENTOS', `Informações do evento (ID: ${id}) atualizadas.`);
  };

  const deleteEvent = (id: string) => {
    const ev = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    supabaseService.deleteEvent(id);
    addAuditLog('Evento Cancelado / Excluído', 'EVENTOS', `Evento "${ev?.title || id}" excluído.`, 'aviso');
  };

  const registerEvent = async (regData: Omit<EventRegistration, 'id' | 'registeredAt'>) => {
    const targetEvent = events.find(e => e.id === regData.eventId);
    if (!targetEvent) return { success: false, message: 'Evento não encontrado.' };

    if (targetEvent.registrationLimit && targetEvent.registeredCount >= targetEvent.registrationLimit) {
      return { success: false, message: 'As vagas para este evento já foram preenchidas.' };
    }

    const regId = `reg-${Date.now()}`;
    const newCount = (targetEvent.registeredCount || 0) + 1;

    setEvents(prev => prev.map(e => {
      if (e.id === regData.eventId) {
        return { ...e, registeredCount: newCount };
      }
      return e;
    }));

    await supabaseService.registerEvent({ ...regData, id: regId });
    await supabaseService.upsertEvent({ ...targetEvent, registeredCount: newCount });
    addAuditLog('Inscrição em Evento', 'EVENTOS', `Inscrição confirmada para "${regData.name}" no evento "${targetEvent.title}".`);

    return { success: true, message: 'Sua inscrição foi confirmada com sucesso! Que Deus abençoe.' };
  };

  // Departments / Ministérios (Acesso irrestrito a todos os usuários)
  const addDepartment = (data: Omit<ChurchDepartment, 'id' | 'createdAt'>) => {
    const cleanCode = data.code.trim().toUpperCase();
    const cleanName = data.name.trim();

    if (!cleanCode || !cleanName) {
      return { success: false, message: 'Código/Sigla e Nome do departamento são obrigatórios.' };
    }

    const duplicate = departments.find(d => d.code.toUpperCase() === cleanCode);
    if (duplicate) {
      return { success: false, message: `Já existe um departamento cadastrado com o código "${cleanCode}".` };
    }

    const newDept: ChurchDepartment = {
      ...data,
      id: `dep-${Date.now()}`,
      code: cleanCode,
      name: cleanName,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setDepartments(prev => [...prev, newDept]);
    addAuditLog('Novo Departamento Criado', 'DEPARTAMENTOS', `Criado departamento "${newDept.name}" (${newDept.code}) liderado por "${newDept.leader || 'Liderança'}".`);
    return { success: true, message: 'Departamento cadastrado com sucesso!', department: newDept };
  };

  const updateDepartment = (id: string, updated: Partial<ChurchDepartment>) => {
    if (updated.code) {
      const cleanCode = updated.code.trim().toUpperCase();
      const duplicate = departments.find(d => d.id !== id && d.code.toUpperCase() === cleanCode);
      if (duplicate) {
        return { success: false, message: `Já existe outro departamento com o código "${cleanCode}".` };
      }
      updated.code = cleanCode;
    }

    setDepartments(prev => {
      const next = prev.map(d => d.id === id ? { ...d, ...updated } : d);
      return next;
    });

    const target = departments.find(d => d.id === id);
    addAuditLog('Departamento Atualizado', 'DEPARTAMENTOS', `Departamento "${target?.name || id}" atualizado.`);
    return { success: true, message: 'Departamento atualizado com sucesso!' };
  };

  const deleteDepartment = (id: string) => {
    const target = departments.find(d => d.id === id);
    setDepartments(prev => prev.filter(d => d.id !== id));
    addAuditLog('Departamento Excluído', 'DEPARTAMENTOS', `Departamento "${target?.name || id}" foi excluído.`, 'aviso');
    return { success: true, message: 'Departamento excluído com sucesso!' };
  };

  const toggleDepartmentStatus = (id: string) => {
    setDepartments(prev => {
      const next = prev.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d);
      const target = next.find(d => d.id === id);
      if (target) {
        addAuditLog('Status de Departamento Alterado', 'DEPARTAMENTOS', `Departamento "${target.name}" ${target.isActive ? 'ativado' : 'desativado'}.`);
      }
      return next;
    });
  };

  // Media
  const addMediaFolder = (folderData: Omit<MediaFolder, 'id' | 'createdAt'>) => {
    const newFolder: MediaFolder = {
      ...folderData,
      id: `fol-${Date.now()}`,
      itemCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setMediaFolders(prev => [newFolder, ...prev]);
    supabaseService.upsertMediaFolder(newFolder);
    addAuditLog('Nova Pasta de Mídia', 'MIDIA', `Criada pasta de fotos "${folderData.name}".`);
  };

  const updateMediaFolder = (id: string, updated: Partial<MediaFolder>) => {
    setMediaFolders(prev => {
      const next = prev.map(f => f.id === id ? { ...f, ...updated } : f);
      const target = next.find(f => f.id === id);
      if (target) supabaseService.upsertMediaFolder(target);
      return next;
    });
    addAuditLog('Pasta de Mídia Editada', 'MIDIA', `Pasta de mídia atualizada.`);
  };

  const deleteMediaFolder = (id: string) => {
    const fol = mediaFolders.find(f => f.id === id);
    setMediaFolders(prev => prev.filter(f => f.id !== id));
    setMediaItems(prev => prev.filter(m => m.folderId !== id));
    supabaseService.deleteMediaFolder(id);
    addAuditLog('Pasta de Mídia Excluída', 'MIDIA', `Pasta "${fol?.name || id}" e suas mídias foram excluídas.`, 'aviso');
  };

  const addMediaItem = (itemData: Omit<MediaItem, 'id'>) => {
    const newItem: MediaItem = {
      ...itemData,
      id: `med-${Date.now()}`
    };
    setMediaItems(prev => [newItem, ...prev]);
    setMediaFolders(prev => prev.map(f => {
      if (f.id === itemData.folderId) {
        const updatedF = { ...f, itemCount: (f.itemCount || 0) + 1 };
        supabaseService.upsertMediaFolder(updatedF);
        return updatedF;
      }
      return f;
    }));
    supabaseService.upsertMediaItem(newItem);
    addAuditLog('Mídia Adicionada', 'MIDIA', `Item "${itemData.title}" adicionado à galeria.`);
  };

  const updateMediaItem = (id: string, updated: Partial<MediaItem>) => {
    setMediaItems(prev => {
      const next = prev.map(m => m.id === id ? { ...m, ...updated } : m);
      const target = next.find(m => m.id === id);
      if (target) supabaseService.upsertMediaItem(target);
      return next;
    });
  };

  const deleteMediaItem = (id: string) => {
    const item = mediaItems.find(m => m.id === id);
    setMediaItems(prev => prev.filter(m => m.id !== id));
    if (item) {
      setMediaFolders(prev => prev.map(f => {
        if (f.id === item.folderId) {
          const updatedF = { ...f, itemCount: Math.max(0, (f.itemCount || 1) - 1) };
          supabaseService.upsertMediaFolder(updatedF);
          return updatedF;
        }
        return f;
      }));
    }
    supabaseService.deleteMediaItem(id);
    addAuditLog('Mídia Removida', 'MIDIA', `Foto/vídeo "${item?.title || id}" excluído.`, 'aviso');
  };

  // Prayer Requests
  const addPrayerRequest = (reqData: Omit<PrayerRequest, 'id' | 'createdAt' | 'status'>) => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newReq: PrayerRequest = {
      ...reqData,
      id: `pray-${Date.now()}`,
      status: 'pendente',
      createdAt: formatted
    };
    setPrayerRequests(prev => [newReq, ...prev]);
    supabaseService.insertPrayerRequest(newReq);
    addAuditLog('Novo Pedido de Oração', 'ORACAO', `Recebido pedido de oração de "${reqData.name}" (${reqData.requestType}).`);
  };

  const updatePrayerStatus = (id: string, status: 'pendente' | 'em_oracao' | 'atendido', notes?: string) => {
    setPrayerRequests(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status,
          ...(notes !== undefined ? { pastorNotes: notes } : {})
        };
      }
      return p;
    }));
    supabaseService.updatePrayerStatus(id, status, notes);
    addAuditLog('Status de Oração Alterado', 'ORACAO', `Pedido (ID: ${id}) atualizado para status "${status}".`);
  };

  const deletePrayerRequest = (id: string) => {
    setPrayerRequests(prev => prev.filter(p => p.id !== id));
    supabaseService.deletePrayerRequest(id);
    addAuditLog('Pedido de Oração Excluído', 'ORACAO', `Pedido de oração (ID: ${id}) excluído.`, 'aviso');
  };

  // Members & CRM
  const addMember = (memberData: Omit<ChurchMember, 'id' | 'sigiloCode' | 'joinedDate'>): ChurchMember => {
    const currentYear = new Date().getFullYear();
    const randomCode = Math.floor(100 + Math.random() * 900);
    const sigiloCode = `MBR-${currentYear}-${randomCode}`;
    const newMember: ChurchMember = {
      ...memberData,
      id: `mbr-${Date.now()}`,
      sigiloCode,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setMembers(prev => [newMember, ...prev]);
    supabaseService.upsertMember(newMember);
    addAuditLog('Novo Membro Cadastrado', 'MEMBROS', `Cadastrado membro "${memberData.name}" com código sigiloso ${sigiloCode}.`);
    return newMember;
  };

  const updateMember = (id: string, updated: Partial<ChurchMember>) => {
    setMembers(prev => {
      const next = prev.map(m => m.id === id ? { ...m, ...updated } : m);
      const target = next.find(m => m.id === id);
      if (target) supabaseService.upsertMember(target);
      return next;
    });

    if (updated.name) {
      setTransactions(prev => prev.map(tx => {
        if (tx.memberId === id) {
          const updatedTx = { ...tx, memberNameCached: updated.name };
          supabaseService.upsertTransaction(updatedTx);
          return updatedTx;
        }
        return tx;
      }));
    }
    addAuditLog('Membro Atualizado', 'MEMBROS', `Ficha cadastral do membro (ID: ${id}) atualizada.`);
  };

  const deleteMember = (id: string) => {
    const mem = members.find(m => m.id === id);
    setMembers(prev => prev.filter(m => m.id !== id));
    supabaseService.deleteMember(id);
    addAuditLog('Membro Excluído', 'MEMBROS', `Membro "${mem?.name || id}" (${mem?.sigiloCode}) removido do cadastro.`, 'aviso');
  };

  const clearAllMembers = async () => {
    setMembers([]);
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify([]));
    try {
      localStorage.removeItem('obpc_members_v1');
    } catch (e) {}
    await supabaseService.clearAllMembers();
    addAuditLog('Cadastro de Membros Limpo', 'MEMBROS', 'Todos os membros de teste foram removidos do sistema.', 'aviso');
  };

  const getMemberById = (id: string) => {
    return members.find(m => m.id === id);
  };

  // Transactions CRM
  const addTransaction = (txData: Omit<FinancialTransaction, 'id' | 'receiptNumber' | 'createdAt'>): FinancialTransaction => {
    const prefix = txData.type === 'entrada' ? 'REC' : 'DESP';
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const receiptNumber = `${prefix}-${year}-${randomSeq}`;
    
    let sigiloCode = txData.memberSigiloCode;
    let memberNameCached = txData.memberNameCached;
    
    if (txData.memberId) {
      const mem = members.find(m => m.id === txData.memberId);
      if (mem) {
        sigiloCode = mem.sigiloCode;
        memberNameCached = mem.name;
      }
    }

    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newTx: FinancialTransaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      receiptNumber,
      memberSigiloCode: sigiloCode,
      memberNameCached,
      createdAt
    };

    setTransactions(prev => [newTx, ...prev]);
    supabaseService.upsertTransaction(newTx);
    addAuditLog(
      txData.type === 'entrada' ? 'Lançamento de Entrada / Dízimo' : 'Lançamento de Despesa',
      'FINANCEIRO',
      `Registrado ${txData.type.toUpperCase()}: R$ ${Number(txData.amount).toFixed(2)} (${txData.category}) - Recibo: ${receiptNumber}.`
    );
    return newTx;
  };

  const updateTransaction = (id: string, updated: Partial<FinancialTransaction>) => {
    setTransactions(prev => {
      const next = prev.map(tx => tx.id === id ? { ...tx, ...updated } : tx);
      const target = next.find(tx => tx.id === id);
      if (target) supabaseService.upsertTransaction(target);
      return next;
    });
    addAuditLog('Lançamento Financeiro Editado', 'FINANCEIRO', `Alteração no lançamento financeiro ID: ${id}.`);
  };

  const deleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    setTransactions(prev => prev.filter(tx => tx.id !== id));
    supabaseService.deleteTransaction(id);
    addAuditLog(
      'Lançamento Financeiro Excluído',
      'FINANCEIRO',
      `Excluído ${tx?.type}: R$ ${tx?.amount} - Recibo ${tx?.receiptNumber}.`,
      'aviso'
    );
  };

  const clearAllTransactions = async () => {
    setTransactions([]);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
    try {
      localStorage.removeItem('obpc_transactions_v1');
    } catch (e) {}
    await supabaseService.clearAllTransactions();
    addAuditLog('Livro Caixa Zerado', 'FINANCEIRO', 'Todas as entradas e saídas foram limpas do sistema.', 'aviso');
  };

  // Financial summary computation
  const financialSummary: FinancialSummary = React.useMemo(() => {
    let totalEntradas = 0;
    let totalSaidas = 0;
    let totalDizimos = 0;
    let totalOfertas = 0;
    let totalMissoes = 0;

    const currentMonthPrefix = new Date().toISOString().substring(0, 7);
    let mesAtualEntradas = 0;
    let mesAtualSaidas = 0;

    transactions.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'entrada') {
        totalEntradas += amt;
        if (tx.category === 'Dízimo') totalDizimos += amt;
        if (tx.category === 'Oferta de Culto' || tx.category === 'Oferta Alçada') totalOfertas += amt;
        if (tx.category === 'Oferta Missionária') totalMissoes += amt;

        if (tx.date.startsWith(currentMonthPrefix)) {
          mesAtualEntradas += amt;
        }
      } else {
        totalSaidas += amt;
        if (tx.date.startsWith(currentMonthPrefix)) {
          mesAtualSaidas += amt;
        }
      }
    });

    return {
      totalEntradas,
      totalSaidas,
      saldoAtual: totalEntradas - totalSaidas,
      totalDizimos,
      totalOfertas,
      totalMissoes,
      mesAtualEntradas,
      mesAtualSaidas
    };
  }, [transactions]);

  // System Users Management
  const addUser = (userData: Omit<SystemUser, 'id' | 'createdAt'>) => {
    const cleanUsername = userData.username.trim().toLowerCase();
    const exists = users.some(u => u.username.toLowerCase() === cleanUsername);
    if (exists) {
      return { success: false, message: 'Já existe um usuário com este login de acesso.' };
    }

    const newUser: SystemUser = {
      ...userData,
      username: cleanUsername,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: adminSession?.username || 'Pastor Titular'
    };

    setUsers(prev => [newUser, ...prev]);
    supabaseService.upsertUser(newUser);
    addAuditLog('Novo Usuário Criado', 'USUARIOS', `Criado usuário "${newUser.name}" (login: ${newUser.username}, perfil: ${newUser.role}).`);
    return { success: true, message: 'Usuário cadastrado com sucesso!', user: newUser };
  };

  const updateUser = (id: string, updated: Partial<SystemUser>) => {
    let usernameConflict = false;
    if (updated.username) {
      const clean = updated.username.trim().toLowerCase();
      usernameConflict = users.some(u => u.id !== id && u.username.toLowerCase() === clean);
    }
    if (usernameConflict) {
      return { success: false, message: 'Este nome de usuário já está em uso por outra conta.' };
    }

    setUsers(prev => {
      const next = prev.map(u => u.id === id ? { ...u, ...updated } : u);
      const target = next.find(u => u.id === id);
      if (target) supabaseService.upsertUser(target);
      return next;
    });

    addAuditLog('Usuário / Senha Alterada', 'USUARIOS', `Dados ou senha do usuário (ID: ${id}) atualizados.`);
    return { success: true, message: 'Usuário atualizado com sucesso!' };
  };

  const deleteUser = (id: string) => {
    const target = users.find(u => u.id === id);
    if (users.length <= 1) {
      return { success: false, message: 'Não é possível excluir o único usuário do sistema.' };
    }

    setUsers(prev => prev.filter(u => u.id !== id));
    supabaseService.deleteUser(id);
    addAuditLog('Usuário Excluído', 'USUARIOS', `Usuário "${target?.name}" (${target?.username}) foi excluído do sistema.`, 'aviso');
    return { success: true, message: 'Usuário excluído com sucesso!' };
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => {
      const next = prev.map(u => u.id === id ? { ...u, ...updatedStatus(u) } : u);
      const target = next.find(u => u.id === id);
      if (target) {
        supabaseService.upsertUser(target);
        addAuditLog('Status de Usuário Alterado', 'USUARIOS', `Usuário "${target.name}" ${target.isActive ? 'ativado' : 'desativado'}.`);
      }
      return next;
    });
  };

  const updatedStatus = (u: SystemUser) => ({ isActive: !u.isActive });

  // Admin Auth with Strict Supabase System Users Validation
  const loginAdmin = async (
    usernameOrPassword: string,
    passwordOrRole?: string | RoleType,
    _customName?: string,
    usernameInput?: string
  ): Promise<{ success: boolean; message?: string }> => {
    let cleanUsername = '';
    let cleanPassword = '';

    if (usernameInput) {
      cleanUsername = usernameInput.trim().toLowerCase();
      cleanPassword = usernameOrPassword.trim();
    } else if (typeof passwordOrRole === 'string' && passwordOrRole.trim()) {
      cleanUsername = usernameOrPassword.trim().toLowerCase();
      cleanPassword = passwordOrRole.trim();
    } else {
      cleanUsername = usernameOrPassword.trim().toLowerCase();
      cleanPassword = '';
    }

    if (!cleanUsername || !cleanPassword) {
      return { success: false, message: 'Preencha o usuário e a senha.' };
    }

    // 1. Validação obrigatória via Supabase PostgreSQL
    const client = getSupabase();
    if (client && isSupabaseConfigured()) {
      const authResult = await supabaseService.authenticateUser(cleanUsername, cleanPassword);
      if (authResult.success && authResult.user) {
        const loggedUser = authResult.user;
        const nowStr = new Date().toLocaleString('pt-BR');
        const session: AdminSession = {
          isAuthenticated: true,
          username: loggedUser.name,
          role: loggedUser.role,
          loginTime: nowStr
        };
        setAdminSession(session);
        setUsers(prev => prev.map(u => u.id === loggedUser.id ? { ...u, lastLogin: nowStr } : u));
        addAuditLog('Login no Sistema', 'AUTH', `Usuário "${loggedUser.name}" (${loggedUser.username} - ${loggedUser.role}) autenticado com sucesso.`);
        return { success: true };
      } else {
        addAuditLog('Falha no Login', 'AUTH', `Tentativa de login rejeitada para o usuário: ${cleanUsername}. (${authResult.message || 'Credenciais inválidas'}).`, 'erro');
        return { success: false, message: authResult.message || 'Usuário ou senha incorretos no banco de dados.' };
      }
    }

    // 2. Validação estrita se em modo offline local (sem fallbacks hardcoded)
    const foundUser = users.find(u => u.username.toLowerCase() === cleanUsername);
    if (!foundUser) {
      addAuditLog('Falha no Login', 'AUTH', `Tentativa de login com usuário não cadastrado: ${cleanUsername}.`, 'erro');
      return { success: false, message: 'Usuário não encontrado no sistema.' };
    }

    if (!foundUser.isActive) {
      addAuditLog('Tentativa de Login Bloqueada', 'AUTH', `Tentativa de login com usuário desativado: ${foundUser.username}.`, 'aviso');
      return { success: false, message: 'Esta conta de usuário está desativada.' };
    }

    if (!foundUser.password || foundUser.password !== cleanPassword) {
      addAuditLog('Falha no Login', 'AUTH', `Senha incorreta digitada para usuário: ${foundUser.username}.`, 'erro');
      return { success: false, message: 'Senha incorreta.' };
    }

    const nowStr = new Date().toLocaleString('pt-BR');
    const updatedUsr = { ...foundUser, lastLogin: nowStr };
    setUsers(prev => prev.map(u => u.id === foundUser.id ? updatedUsr : u));

    const session: AdminSession = {
      isAuthenticated: true,
      username: foundUser.name,
      role: foundUser.role,
      loginTime: nowStr
    };
    setAdminSession(session);
    addAuditLog('Login no Sistema', 'AUTH', `Usuário "${foundUser.name}" (${foundUser.username} - ${foundUser.role}) autenticado.`);
    return { success: true };
  };

  const logoutAdmin = () => {
    if (adminSession) {
      addAuditLog('Logout do Sistema', 'AUTH', `Sessão de ${adminSession.username} encerrada.`);
    }
    setAdminSession(null);
  };

  const toggleSigiloMode = () => {
    setIsSigiloModeActive(prev => !prev);
  };

  // Reset & Backup
  const resetToDefaults = () => {
    setChurchInfo(INITIAL_CHURCH_INFO);
    setSchedules(INITIAL_SCHEDULES);
    setEvents(INITIAL_EVENTS);
    setDepartments(INITIAL_DEPARTMENTS);
    setMediaFolders(INITIAL_MEDIA_FOLDERS);
    setMediaItems(INITIAL_MEDIA_ITEMS);
    setPrayerRequests(INITIAL_PRAYER_REQUESTS);
    setMembers(INITIAL_MEMBERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setUsers(INITIAL_SYSTEM_USERS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setIsSigiloModeActive(true);
    addAuditLog('Restauração de Padrões', 'SISTEMA', 'Banco de dados restaurado aos padrões de fábrica.', 'aviso');
  };

  const exportDatabaseJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      churchInfo,
      schedules,
      events,
      departments,
      mediaFolders,
      mediaItems,
      prayerRequests,
      members,
      transactions,
      users,
      auditLogs
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-obpc-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addAuditLog('Backup Exportado', 'SISTEMA', 'Arquivo JSON de backup completo exportado.');
  };

  const importDatabaseJSON = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.churchInfo) setChurchInfo(parsed.churchInfo);
      if (parsed.schedules) setSchedules(parsed.schedules);
      if (parsed.events) setEvents(parsed.events);
      if (parsed.departments) setDepartments(parsed.departments);
      if (parsed.mediaFolders) setMediaFolders(parsed.mediaFolders);
      if (parsed.mediaItems) setMediaItems(parsed.mediaItems);
      if (parsed.prayerRequests) setPrayerRequests(parsed.prayerRequests);
      if (parsed.members) setMembers(parsed.members);
      if (parsed.transactions) setTransactions(parsed.transactions);
      if (parsed.users) setUsers(parsed.users);
      if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
      addAuditLog('Backup Importado', 'SISTEMA', 'Backup JSON importado e restaurado com sucesso.');
      return true;
    } catch (e) {
      console.error('Failed to import database JSON', e);
      return false;
    }
  };

  return (
    <ChurchContext.Provider
      value={{
        churchInfo,
        updateChurchInfo,
        schedules,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        registerEvent,
        departments,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        toggleDepartmentStatus,
        mediaFolders,
        mediaItems,
        addMediaFolder,
        updateMediaFolder,
        deleteMediaFolder,
        addMediaItem,
        updateMediaItem,
        deleteMediaItem,
        prayerRequests,
        addPrayerRequest,
        updatePrayerStatus,
        deletePrayerRequest,
        members,
        addMember,
        updateMember,
        deleteMember,
        clearAllMembers,
        getMemberById,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        clearAllTransactions,
        financialSummary,
        users,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        auditLogs,
        addAuditLog,
        clearAllAuditLogs,
        adminSession,
        loginAdmin,
        logoutAdmin,
        isSigiloModeActive,
        toggleSigiloMode,
        resetToDefaults,
        exportDatabaseJSON,
        importDatabaseJSON,
        isSupabaseOnline: supabaseStatus === 'connected',
        supabaseStatus,
        supabaseStatusMessage,
        isSyncing,
        syncToSupabase,
        syncFromSupabase,
        saveCredentials,
        clearCredentials,
        checkSupabaseHealth
      }}
    >
      {children}
    </ChurchContext.Provider>
  );
};

export const useChurch = () => {
  const context = useContext(ChurchContext);
  if (!context) {
    throw new Error('useChurch must be used within a ChurchProvider');
  }
  return context;
};
