import React, { useState } from 'react';
import { 
  Church, 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  Image as ImageIcon, 
  DollarSign, 
  Heart, 
  Database, 
  LogOut, 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Menu, 
  X, 
  UserCheck,
  Users,
  ShieldAlert
} from 'lucide-react';
import { useChurch } from '../../context/ChurchContext';
import { AdminOverview } from './AdminOverview';
import { AdminSchedules } from './AdminSchedules';
import { AdminEvents } from './AdminEvents';
import { AdminMediaManager } from './AdminMediaManager';
import { AdminFinancialCRM } from './AdminFinancialCRM';
import { AdminPrayers } from './AdminPrayers';
import { AdminSupabaseSettings } from './AdminSupabaseSettings';
import { AdminUsersManager } from './AdminUsersManager';
import { AdminAuditLogs } from './AdminAuditLogs';

interface AdminLayoutProps {
  onBackToPublicSite: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToPublicSite }) => {
  const { adminSession, logoutAdmin, churchInfo, prayerRequests, auditLogs, users } = useChurch();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingPrayers = prayerRequests.filter(p => p.status === 'pendente').length;

  const navItems = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'cultos', label: 'Cultos & Horários', icon: Clock },
    { id: 'eventos', label: 'Eventos & Congressos', icon: Calendar },
    { id: 'midia', label: 'Pastas de Mídia (Fotos/Vídeos)', icon: ImageIcon },
    { id: 'tesouraria', label: 'CRM de Dízimos & Tesouraria', icon: DollarSign, badge: 'Sigilo' },
    { id: 'oracao', label: 'Gabinete de Oração', icon: Heart, count: pendingPrayers },
    { id: 'usuarios', label: 'Usuários & Senhas', icon: Users, badge: `${users.length}` },
    { id: 'logs', label: 'Auditoria & Logs', icon: ShieldAlert, badge: `${auditLogs.length}` },
    { id: 'supabase', label: 'Supabase & Configurações', icon: Database }
  ];

  const handleLogout = () => {
    logoutAdmin();
    onBackToPublicSite();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Fixed Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand & Pastoral Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Church className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-sm sm:text-base text-white flex items-center gap-2">
                  <span>OBPC • Painel Pastoral & CRM</span>
                  <span className="hidden sm:inline-block text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Acesso Seguro
                  </span>
                </h1>
                <span className="text-[10px] text-slate-400">
                  {churchInfo.name}
                </span>
              </div>
            </div>
          </div>

          {/* User profile & Actions */}
          <div className="flex items-center gap-3">
            
            <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-white font-semibold">{adminSession?.username || 'Líder'}</span>
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-slate-900 px-1.5 py-0.5 rounded">
                {adminSession?.role || 'pastor'}
              </span>
            </div>

            <button
              onClick={onBackToPublicSite}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
              title="Voltar ao portal público da igreja"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Site da Igreja</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
              title="Encerrar sessão pastoral"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>

          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* Navigation Sidebar (Desktop & Mobile Drawer) */}
        <aside
          className={`lg:w-64 shrink-0 ${
            mobileMenuOpen ? 'block fixed inset-x-4 top-20 z-50 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl' : 'hidden lg:block'
          }`}
        >
          <div className="sticky top-20 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3 mb-2 block">
              Módulos do Sistema
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold animate-pulse">
                      {item.count}
                    </span>
                  )}
                  {item.badge && !isActive && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Pastoral Session Badge */}
            <div className="pt-4 mt-4 border-t border-slate-800/80 px-3">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-[11px]">
                  <strong className="text-white block font-semibold">Sigilo Eclesiástico</strong>
                  <span className="text-slate-400">Proteção de dados dos membros</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Dynamic Content View Area */}
        <main className="flex-1 min-w-0 pb-16">
          {activeTab === 'overview' && (
            <AdminOverview onNavigateTab={(tab) => setActiveTab(tab)} />
          )}
          {activeTab === 'cultos' && <AdminSchedules />}
          {activeTab === 'eventos' && <AdminEvents />}
          {activeTab === 'midia' && <AdminMediaManager />}
          {activeTab === 'tesouraria' && <AdminFinancialCRM />}
          {activeTab === 'oracao' && <AdminPrayers />}
          {activeTab === 'usuarios' && <AdminUsersManager />}
          {activeTab === 'logs' && <AdminAuditLogs />}
          {activeTab === 'supabase' && <AdminSupabaseSettings />}
        </main>

      </div>

    </div>
  );
};
