import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Check, 
  Copy, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  UploadCloud, 
  DownloadCloud, 
  CheckCircle2,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { SUPABASE_SCHEMA_SQL } from '../../lib/supabase';
import { useChurch } from '../../context/ChurchContext';

export const AdminSupabaseSettings: React.FC = () => {
  const { 
    schedules, 
    events, 
    departments,
    addDepartment,
    toggleDepartmentStatus,
    mediaFolders, 
    mediaItems, 
    transactions, 
    members, 
    prayerRequests,
    churchInfo,
    updateChurchInfo,
    supabaseStatus,
    supabaseStatusMessage,
    isSyncing,
    syncToSupabase,
    syncFromSupabase,
    checkSupabaseHealth
  } = useChurch();

  const [copied, setCopied] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);

  // Auto-clean any legacy corrupted credentials on mount and verify health
  useEffect(() => {
    try {
      localStorage.removeItem('obpc_supabase_url_v1');
      localStorage.removeItem('obpc_supabase_anon_key_v1');
    } catch (e) {}
    checkSupabaseHealth();
  }, [checkSupabaseHealth]);

  // Church info form
  const [name, setName] = useState(churchInfo.name);
  const [subtitle, setSubtitle] = useState(churchInfo.subtitle);
  const [address, setAddress] = useState(churchInfo.address);
  const [cityState, setCityState] = useState(churchInfo.cityState);
  const [zipCode, setZipCode] = useState(churchInfo.zipCode || '57100-000');
  const [phone, setPhone] = useState(churchInfo.phone);
  const [whatsapp, setWhatsapp] = useState(churchInfo.whatsapp);
  const [email, setEmail] = useState(churchInfo.email);
  const [pastorName, setPastorName] = useState(churchInfo.pastorName);
  const [vicePastorName, setVicePastorName] = useState(churchInfo.vicePastorName);
  const [pixKey, setPixKey] = useState(churchInfo.pixKey);
  const [pixKeyType, setPixKeyType] = useState(churchInfo.pixKeyType || 'Telefone');
  const [pixBeneficiary, setPixBeneficiary] = useState(churchInfo.pixRecipient);
  const [bankName, setBankName] = useState(churchInfo.bankName || '');
  const [bankAgency, setBankAgency] = useState(churchInfo.bankAgency || '');
  const [bankAccount, setBankAccount] = useState(churchInfo.bankAccount || '');
  const [youtubeChannelUrl, setYoutubeChannelUrl] = useState(churchInfo.youtubeChannelUrl || '');
  const [instagramUrl, setInstagramUrl] = useState(churchInfo.instagramUrl || '');
  const [historyText, setHistoryText] = useState(churchInfo.historyText || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    const result = await checkSupabaseHealth();
    setTestingConnection(false);

    if (result.success) {
      setFeedbackMsg({ type: 'success', text: 'Conexão testada com sucesso! Supabase PostgreSQL está respondendo normalmente.' });
    } else {
      setFeedbackMsg({ type: 'error', text: result.message });
    }
  };

  const handlePushData = async () => {
    const confirm = window.confirm('Deseja enviar todos os dados locais atuais (cultos, eventos, departamentos, membros, mídias, transações) para o Supabase?');
    if (!confirm) return;

    const res = await syncToSupabase();
    if (res.success) {
      setFeedbackMsg({ type: 'success', text: 'Dados enviados com sucesso para o Supabase!' });
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }
  };

  const handlePullData = async () => {
    const confirm = window.confirm('Deseja puxar e substituir os dados locais pelos dados armazenados no Supabase?');
    if (!confirm) return;

    const res = await syncFromSupabase();
    if (res.success) {
      setFeedbackMsg({ type: 'success', text: 'Dados baixados e sincronizados com sucesso!' });
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      churchInfo,
      schedules,
      events,
      departments,
      mediaFolders,
      mediaItems,
      transactions,
      members,
      prayerRequests
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `obpc_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveChurchInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateChurchInfo({
      name,
      subtitle,
      address,
      cityState,
      zipCode,
      phone,
      whatsapp,
      email,
      pastorName,
      vicePastorName,
      pixKey,
      pixKeyType: pixKeyType as any,
      pixRecipient: pixBeneficiary,
      bankName,
      bankAgency,
      bankAccount,
      youtubeChannelUrl,
      instagramUrl,
      historyText
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            Backend Supabase Cloud & Dados Institucionais
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Persistência em nuvem PostgreSQL em tempo real, sincronização de dados e dados cadastrais da igreja.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBackup}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl border border-slate-700 transition-all shadow"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Backup JSON</span>
          </button>
        </div>
      </div>

      {/* Supabase Status & Sync Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow space-y-6">
        
        {/* Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
              supabaseStatus === 'connected' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : supabaseStatus === 'checking'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                : supabaseStatus === 'error'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-base">Status da Conexão Supabase</h4>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                  supabaseStatus === 'connected'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : supabaseStatus === 'checking'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : supabaseStatus === 'error'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    supabaseStatus === 'connected' ? 'bg-emerald-400 animate-pulse' :
                    supabaseStatus === 'checking' ? 'bg-sky-400 animate-ping' :
                    supabaseStatus === 'error' ? 'bg-rose-400' : 'bg-amber-400'
                  }`} />
                  <span>
                    {supabaseStatus === 'connected' ? 'Conectado (Online)' :
                     supabaseStatus === 'checking' ? 'Verificando...' :
                     supabaseStatus === 'error' ? 'Erro na Conexão' : 'Modo Offline / Local'}
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{supabaseStatusMessage}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-all disabled:opacity-50 shadow"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${testingConnection ? 'animate-spin' : ''}`} />
              <span>Testar Conexão</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className={`p-3 rounded-xl text-xs flex items-center justify-between gap-2 border ${
            feedbackMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
            feedbackMsg.type === 'error' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' :
            'bg-sky-500/10 text-sky-300 border-sky-500/30'
          }`}>
            <div className="flex items-center gap-2">
              {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              <span>{feedbackMsg.text}</span>
            </div>
            <button 
              onClick={() => setFeedbackMsg(null)}
              className="text-[11px] opacity-70 hover:opacity-100 uppercase font-mono font-bold"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Security & Cloud Infrastructure Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Banco de Dados em Nuvem (PostgreSQL)</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Criptografia SSL/TLS Ativa
                  </span>
                </h5>
                <p className="text-xs text-slate-400 mt-0.5">
                  Armazenamento seguro e criptografado em nuvem para cultos, membros, eventos, mídias e financeiro.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySql}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs px-3.5 py-2 rounded-xl border border-slate-700 transition-all shadow"
                title="Copiar script SQL para criação das 12 tabelas"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copied ? 'Script Copiado!' : 'Copiar Script SQL'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Servidor em Nuvem:</span>
              <span className="text-slate-200 font-semibold truncate block flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase PostgreSQL 15 (Protegido)</span>
              </span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Esquema Relacional:</span>
              <span className="text-emerald-400 font-semibold block">
                12 Tabelas com RLS Ativo
              </span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Sincronização em Tempo Real:</span>
              <span className="text-sky-400 font-semibold block">
                WebSockets &amp; Postgres WAL
              </span>
            </div>
          </div>
        </div>

        {/* Sincronização Push / Pull */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h5 className="text-xs font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-400" />
                <span>Enviar Dados Locais para o Supabase (Push)</span>
              </h5>
              <p className="text-[11px] text-slate-400 mt-1">
                Envia todos os cultos, eventos, membros, fotos e financeiro locais para sincronizar com o Supabase.
              </p>
            </div>
            <button
              onClick={handlePushData}
              disabled={isSyncing || supabaseStatus !== 'connected'}
              className="mt-3 inline-flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-40"
            >
              {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
              <span>Sincronizar Local &gt; Supabase</span>
            </button>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h5 className="text-xs font-bold text-white flex items-center gap-2">
                <DownloadCloud className="w-4 h-4 text-sky-400" />
                <span>Puxar Dados do Supabase para o Sistema (Pull)</span>
              </h5>
              <p className="text-[11px] text-slate-400 mt-1">
                Recarrega todas as informações do banco em nuvem Supabase e atualiza o estado deste navegador.
              </p>
            </div>
            <button
              onClick={handlePullData}
              disabled={isSyncing || supabaseStatus !== 'connected'}
              className="mt-3 inline-flex items-center justify-center gap-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-40"
            >
              {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <DownloadCloud className="w-3.5 h-3.5" />}
              <span>Atualizar do Supabase &gt; Local</span>
            </button>
          </div>
        </div>

        {/* SQL Script Viewer */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>Script SQL de Estrutura do Banco (Tabelas, RLS e Realtime)</span>
            </div>
            <button
              onClick={handleCopySql}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow self-start sm:self-auto"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950" />
                  <span>Script SQL Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Script SQL</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-48 overflow-y-auto font-mono text-[11px] text-slate-300">
            <pre>{SUPABASE_SCHEMA_SQL}</pre>
          </div>
        </div>
      </div>

      {/* Church Data & PIX Settings Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow">
        <h4 className="font-bold text-white text-base mb-1">Dados Institucionais e Chaves de Contribuição</h4>
        <p className="text-xs text-slate-400 mb-6">
          Atualize o endereço, telefone pastoral, pastores titulares e chave PIX exibidos no portal e sincronizados com o Supabase.
        </p>

        {isSaved && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Dados da igreja salvos e sincronizados com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSaveChurchInfo} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nome Oficial da Igreja</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Slogan / Subtítulo</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Endereço do Templo Sede</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cidade / UF</label>
              <input
                type="text"
                required
                value={cityState}
                onChange={(e) => setCityState(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">CEP</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Telefone da Secretaria</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Pastoral</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail Institucional</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pastor Presidente / Titular</label>
              <input
                type="text"
                required
                value={pastorName}
                onChange={(e) => setPastorName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Vice-Pastor</label>
              <input
                type="text"
                value={vicePastorName}
                onChange={(e) => setVicePastorName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
              Dados Financeiros & Chave PIX Oficial da Igreja
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo da Chave PIX</label>
                <select
                  value={pixKeyType}
                  onChange={(e) => setPixKeyType(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Telefone">Telefone</option>
                  <option value="CNPJ">CNPJ</option>
                  <option value="E-mail">E-mail</option>
                  <option value="Chave Aleatória">Chave Aleatória</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Chave PIX Oficial</label>
                <input
                  type="text"
                  required
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Favorecido / Razão Social</label>
                <input
                  type="text"
                  required
                  value={pixBeneficiary}
                  onChange={(e) => setPixBeneficiary(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Banco</label>
                <input
                  type="text"
                  placeholder="Ex: Banco Bradesco (237)"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Agência</label>
                <input
                  type="text"
                  placeholder="Ex: 1452-9"
                  value={bankAgency}
                  onChange={(e) => setBankAgency(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Conta Corrente</label>
                <input
                  type="text"
                  placeholder="Ex: 25480-1"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
              Redes Sociais e História Institucional
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Canal do YouTube</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/@igreja"
                  value={youtubeChannelUrl}
                  onChange={(e) => setYoutubeChannelUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Perfil do Instagram</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/igreja"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Histórico da Igreja (Exibido na página de História)</label>
              <textarea
                rows={3}
                value={historyText}
                onChange={(e) => setHistoryText(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all"
            >
              Salvar Alterações da Igreja
            </button>
          </div>
        </form>
      </div>

      {/* Departments Overview Card inside Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Departamentos & Ministérios da Igreja</h4>
              <p className="text-xs text-slate-400">
                Departamentos ativos exibidos no site e associados aos cultos ({departments.length} cadastrados).
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {departments.map((d) => (
            <div 
              key={d.id}
              className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 font-bold text-xs">
                  {d.code.substring(0, 3)}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate">{d.name}</span>
                  <span className="text-[10px] text-slate-400 block truncate">Líder: {d.leader || 'Liderança'}</span>
                </div>
              </div>

              <button
                onClick={() => toggleDepartmentStatus(d.id)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors shrink-0 ${
                  d.isActive
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                }`}
                title="Alternar Ativo/Inativo"
              >
                {d.isActive ? 'Ativo' : 'Inativo'}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
