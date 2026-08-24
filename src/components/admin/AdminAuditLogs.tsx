import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  User, 
  KeyRound, 
  DollarSign, 
  Calendar, 
  Heart, 
  Users, 
  Database, 
  Settings,
  RefreshCw,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { useChurch } from '../../context/ChurchContext';
import { AuditLog, LogActionCategory } from '../../types';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs, clearAllAuditLogs } = useChurch();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Stats
  const totalLogs = auditLogs.length;
  const authLogsCount = auditLogs.filter(l => l.category === 'AUTH').length;
  const financialLogsCount = auditLogs.filter(l => l.category === 'FINANCEIRO').length;
  const userLogsCount = auditLogs.filter(l => l.category === 'USUARIOS').length;

  const filteredLogs = auditLogs.filter(l => {
    const term = searchTerm.toLowerCase();
    const matchSearch = 
      l.action.toLowerCase().includes(term) ||
      l.details.toLowerCase().includes(term) ||
      l.userName.toLowerCase().includes(term);
    const matchCat = selectedCategory === 'all' || l.category === selectedCategory;
    const matchStatus = selectedStatus === 'all' || l.status === selectedStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const exportLogsCSV = () => {
    const headers = ['ID', 'Data/Hora', 'Usuario', 'Perfil', 'Categoria', 'Acao', 'Detalhes', 'Status'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      `"${l.userName}"`,
      l.userRole,
      l.category,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      l.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_auditoria_obpc_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportLogsJSON = () => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_auditoria_obpc_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm('Tem certeza de que deseja limpar todo o histórico de logs de auditoria? Esta ação não pode ser desfeita.')) {
      clearAllAuditLogs();
    }
  };

  const getCategoryBadge = (cat: LogActionCategory) => {
    switch (cat) {
      case 'AUTH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <KeyRound className="w-3 h-3" />
            <span>Autenticação</span>
          </span>
        );
      case 'FINANCEIRO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <DollarSign className="w-3 h-3" />
            <span>Financeiro</span>
          </span>
        );
      case 'MEMBROS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Users className="w-3 h-3" />
            <span>Membros</span>
          </span>
        );
      case 'EVENTOS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Calendar className="w-3 h-3" />
            <span>Eventos</span>
          </span>
        );
      case 'CULTOS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Clock className="w-3 h-3" />
            <span>Cultos</span>
          </span>
        );
      case 'ORACAO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Heart className="w-3 h-3" />
            <span>Oração</span>
          </span>
        );
      case 'USUARIOS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <User className="w-3 h-3" />
            <span>Usuários</span>
          </span>
        );
      case 'CONFIGURACAO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <Settings className="w-3 h-3" />
            <span>Configuração</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <Activity className="w-3 h-3" />
            <span>Sistema</span>
          </span>
        );
    }
  };

  const getStatusIcon = (status: 'sucesso' | 'aviso' | 'erro') => {
    switch (status) {
      case 'sucesso':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'aviso':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'erro':
        return <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            Trilha de Auditoria & Logs de Atividade
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Registro cronológico e imutável de todas as ações realizadas no sistema (logins, dízimos, cultos, edições e usuários).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportLogsCSV}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition-all"
            title="Exportar como planilha CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={exportLogsJSON}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition-all"
            title="Exportar como JSON"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Exportar JSON</span>
          </button>

          {auditLogs.length > 0 && (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold px-3 py-2 rounded-xl border border-rose-500/30 transition-all"
              title="Limpar todos os logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Logs</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total de Eventos</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2 font-mono">{totalLogs}</p>
          <span className="text-[10px] text-slate-500">Registros em memória e nuvem</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Logins & Acessos</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2 font-mono">{authLogsCount}</p>
          <span className="text-[10px] text-slate-500">Tentativas e sessões</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Ações Financeiras</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2 font-mono">{financialLogsCount}</p>
          <span className="text-[10px] text-slate-500">Dízimos, ofertas e despesas</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Gestão de Usuários</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2 font-mono">{userLogsCount}</p>
          <span className="text-[10px] text-slate-500">Criações e alterações de senha</span>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por ação, usuário ou detalhes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todas as Categorias</option>
            <option value="AUTH">Autenticação / Login</option>
            <option value="FINANCEIRO">Financeiro / Dízimos</option>
            <option value="MEMBROS">Membros</option>
            <option value="EVENTOS">Eventos</option>
            <option value="CULTOS">Cultos</option>
            <option value="MIDIA">Mídia / Galeria</option>
            <option value="ORACAO">Gabinete de Oração</option>
            <option value="USUARIOS">Usuários & Senhas</option>
            <option value="CONFIGURACAO">Configurações & Supabase</option>
            <option value="SISTEMA">Sistema & Backup</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todos os Status</option>
            <option value="sucesso">Sucesso</option>
            <option value="aviso">Avisos</option>
            <option value="erro">Erros / Bloqueios</option>
          </select>
        </div>

      </div>

      {/* Audit Log Table / Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5 font-bold">Data & Hora</th>
                <th className="px-4 py-3.5 font-bold">Usuário / Responsável</th>
                <th className="px-4 py-3.5 font-bold">Categoria</th>
                <th className="px-4 py-3.5 font-bold">Ação Realizada</th>
                <th className="px-5 py-3.5 font-bold">Detalhes do Evento</th>
                <th className="px-4 py-3.5 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500 text-xs">
                    Nenhum registro de log encontrado para os critérios selecionados.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Timestamp */}
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    {/* User */}
                    <td className="px-4 py-3.5 font-semibold text-white whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{log.userName}</span>
                        {log.userRole && log.userRole !== 'sistema' && (
                          <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-950 px-1 py-0.5 rounded border border-slate-800">
                            {log.userRole}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {getCategoryBadge(log.category)}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 font-bold text-slate-100 whitespace-nowrap">
                      {log.action}
                    </td>

                    {/* Details */}
                    <td className="px-5 py-3.5 text-slate-300 text-[11px] max-w-md">
                      <p className="line-clamp-2">{log.details}</p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center">
                        {getStatusIcon(log.status)}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
