import React from 'react';
import { 
  DollarSign, 
  Calendar, 
  Clock, 
  Image as ImageIcon, 
  Heart, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Lock,
  PlusCircle
} from 'lucide-react';
import { useChurch } from '../../context/ChurchContext';

interface AdminOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const { 
    financialSummary, 
    schedules, 
    events, 
    mediaFolders, 
    mediaItems, 
    prayerRequests, 
    members,
    adminSession,
    isSigiloModeActive
  } = useChurch();

  const pendingPrayers = prayerRequests.filter(p => p.status === 'pendente').length;
  const activeEventsCount = events.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gabinete de Gestão Eclesiástica</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Bem-vindo(a), {adminSession?.username || 'Líder'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Painel administrativo da Igreja O Brasil Para Cristo. Atualize os cultos, fotos, vídeos, gabinete de oração e controle a tesouraria com sigilo pastoral.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('tesouraria')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-4 py-3 rounded-xl shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Lançar Dízimo / Entrada</span>
          </button>
          <button
            onClick={() => onNavigateTab('midia')}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-4 py-3 rounded-xl border border-slate-700 transition-all"
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>Nova Foto / Vídeo</span>
          </button>
        </div>
      </div>

      {/* Financial Metric Cards (Protected) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            Resumo Financeiro da Tesouraria (Mês Atual)
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold border ${
              isSigiloModeActive
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
            }`}>
              <Lock className="w-3 h-3" />
              <span>{isSigiloModeActive ? 'Modo Sigilo Ativo' : 'Modo Nominal'}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Entradas Totais */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Entradas do Mês</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-extrabold text-white font-mono">
                {financialSummary.mesAtualEntradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <p className="text-[11px] text-emerald-400 mt-1">Dízimos, Ofertas e Votos</p>
            </div>
          </div>

          {/* Card 2: Saídas / Despesas */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Despesas / Saídas</span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-extrabold text-white font-mono">
                {financialSummary.mesAtualSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Luz, Água, Missões e Obras</p>
            </div>
          </div>

          {/* Card 3: Saldo Líquido em Caixa */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saldo em Tesouraria</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className={`text-2xl font-extrabold font-mono ${financialSummary.saldoAtual >= 0 ? 'text-amber-300' : 'text-rose-400'}`}>
                {financialSummary.saldoAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <p className="text-[11px] text-amber-400/80 mt-1">Disponível em conta e caixa</p>
            </div>
          </div>

          {/* Card 4: Sustento Missionário */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fundo Missionário</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-extrabold text-white font-mono">
                {financialSummary.totalMissoes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <p className="text-[11px] text-blue-400 mt-1">Campos e Assistência Social</p>
            </div>
          </div>

        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Box 1: Cultos */}
        <button
          onClick={() => onNavigateTab('cultos')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 text-left transition-all hover:shadow-xl group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded">
              {schedules.length} cultos
            </span>
          </div>
          <div>
            <h4 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
              Programação Semanal
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Editar horários, ministérios e dirigentes dos cultos.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-semibold">
            <span>Gerenciar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Box 2: Eventos */}
        <button
          onClick={() => onNavigateTab('eventos')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 text-left transition-all hover:shadow-xl group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded">
              {events.length} eventos
            </span>
          </div>
          <div>
            <h4 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
              Eventos & Congressos
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Criar novos eventos, fotos de capa e ver inscrições.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-semibold">
            <span>Gerenciar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Box 3: Pastas de Mídia */}
        <button
          onClick={() => onNavigateTab('midia')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 text-left transition-all hover:shadow-xl group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded">
              {mediaFolders.length} pastas ({mediaItems.length} mídias)
            </span>
          </div>
          <div>
            <h4 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
              Pastas de Fotos & Vídeos
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Organizar álbuns e links de vídeos das celebrações.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-semibold">
            <span>Gerenciar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Box 4: Gabinete de Oração */}
        <button
          onClick={() => onNavigateTab('oracao')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 text-left transition-all hover:shadow-xl group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            {pendingPrayers > 0 && (
              <span className="text-xs font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-full animate-pulse">
                {pendingPrayers} novo(s)
              </span>
            )}
          </div>
          <div>
            <h4 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
              Pedidos de Oração
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Gabinete pastoral e motivos enviados pelos fiéis.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-semibold">
            <span>Ver Motivos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

      </div>

    </div>
  );
};
