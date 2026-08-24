import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Check, 
  Copy, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink,
  Sparkles,
  Terminal,
  Key,
  Globe,
  UploadCloud,
  DownloadCloud,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react';
import { SUPABASE_SCHEMA_SQL, getSupabaseCredentials } from '../../lib/supabase';
import { useChurch } from '../../context/ChurchContext';

export const AdminSupabaseSettings: React.FC = () => {
  const { 
    schedules, 
    events, 
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
    saveCredentials,
    clearCredentials,
    checkSupabaseHealth
  } = useChurch();

  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  
  // Credentials state
  const creds = getSupabaseCredentials();
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(creds.url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(creds.key);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);

  // Church info form
  const [name, setName] = useState(churchInfo.name);
  const [subtitle, setSubtitle] = useState(churchInfo.subtitle);
  const [address, setAddress] = useState(churchInfo.address);
  const [cityState, setCityState] = useState(churchInfo.cityState);
  const [zipCode, setZipCode] = useState(churchInfo.zipCode || '01310-200');
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

  useEffect(() => {
    const current = getSupabaseCredentials();
    setSupabaseUrlInput(current.url);
    setSupabaseKeyInput(current.key);
  }, [supabaseStatus]);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSaveSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrlInput || !supabaseKeyInput) {
      setFeedbackMsg({ type: 'error', text: 'Preencha a URL e a Anon Key do Supabase.' });
      return;
    }

    setTestingConnection(true);
    const result = await saveCredentials(supabaseUrlInput, supabaseKeyInput);
    setTestingConnection(false);

    if (result.success) {
      setFeedbackMsg({ type: 'success', text: 'Supabase configurado e conectado com sucesso!' });
    } else {
      setFeedbackMsg({ type: 'error', text: result.message });
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    const result = await checkSupabaseHealth();
    setTestingConnection(false);

    if (result.success) {
      setFeedbackMsg({ type: 'success', text: 'Conexão testada com sucesso! Supabase PostgreSQL está respondendo.' });
    } else {
      setFeedbackMsg({ type: 'error', text: result.message });
    }
  };

  const handlePushData = async () => {
    const confirm = window.confirm('Deseja enviar todos os dados locais atuais (cultos, eventos, membros, mídias, transações) para o Supabase?');
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

  const handleDisconnect = () => {
    if (window.confirm('Deseja desconectar o Supabase? O sistema voltará ao modo LocalStorage offline.')) {
      clearCredentials();
      setSupabaseUrlInput('');
      setSupabaseKeyInput('');
      setFeedbackMsg({ type: 'info', text: 'Supabase desconectado. O sistema está em modo LocalStorage.' });
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      churchInfo,
      schedules,
      events,
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

      {/* Supabase Status & Config Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow">
        
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

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${testingConnection ? 'animate-spin' : ''}`} />
              <span>Testar Conexão</span>
            </button>

            {supabaseStatus === 'connected' && (
              <button
                onClick={handleDisconnect}
                className="inline-flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-rose-500/30 transition-all"
                title="Desconectar Supabase"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Desconectar</span>
              </button>
            )}
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 border ${
            feedbackMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
            feedbackMsg.type === 'error' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' :
            'bg-sky-500/10 text-sky-300 border-sky-500/30'
          }`}>
            {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Supabase Credentials Form */}
        <form onSubmit={handleSaveSupabaseConfig} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>Supabase Project URL</span>
              </label>
              <input
                type="url"
                placeholder="https://exemplo.supabase.co"
                value={supabaseUrlInput}
                onChange={(e) => setSupabaseUrlInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Encontrado em: <em>Supabase Dashboard &gt; Project Settings &gt; API &gt; Project URL</em>
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Supabase anon Public Key</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1"
                >
                  {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showKey ? 'Ocultar' : 'Visualizar'}</span>
                </button>
              </label>
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseKeyInput}
                onChange={(e) => setSupabaseKeyInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Encontrado em: <em>Supabase Dashboard &gt; Project Settings &gt; API &gt; Project API keys (anon public)</em>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-slate-400">
              💡 As credenciais salvas aqui conectam o sistema instantaneamente sem precisar reiniciar o servidor.
            </div>

            <button
              type="submit"
              disabled={testingConnection}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {testingConnection ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>Salvar e Conectar Supabase</span>
            </button>
          </div>
        </form>

        {/* Sync Controls if connected */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h5 className="text-xs font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-400" />
                <span>Enviar Dados Locais para o Supabase (Push)</span>
              </h5>
              <p className="text-[11px] text-slate-400 mt-1">
                Envia todos os cultos, eventos, membros, fotos e financeiro locais para popular o Supabase pela primeira vez.
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

        {/* Step-by-Step Instructions */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            <span>Passo a Passo para Configurar o Supabase</span>
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-slate-300">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs mb-2">1</span>
              <p className="font-semibold text-white">Criar Projeto</p>
              <p className="text-[11px] text-slate-400 mt-1">Acesse <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-amber-400 underline">supabase.com</a> e crie um projeto gratuito.</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs mb-2">2</span>
              <p className="font-semibold text-white">SQL Editor</p>
              <p className="text-[11px] text-slate-400 mt-1">No menu lateral esquerdo, clique no ícone <strong>SQL Editor</strong> e crie uma <em>New Query</em>.</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs mb-2">3</span>
              <p className="font-semibold text-white">Executar Script</p>
              <p className="text-[11px] text-slate-400 mt-1">Copie o script SQL abaixo, cole na query e clique no botão verde <strong>RUN</strong>.</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs mb-2">4</span>
              <p className="font-semibold text-white">Copiar Chaves API</p>
              <p className="text-[11px] text-slate-400 mt-1">Vá em <em>Settings &gt; API</em>, copie a <strong>URL</strong> e a <strong>anon key</strong> e cole no formulário acima.</p>
            </div>
          </div>
        </div>

        {/* SQL Script Viewer */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>Script SQL Oficial com Tabelas, RLS e Realtime (Copie e Cole no Supabase)</span>
            </div>
            <button
              onClick={handleCopySql}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950" />
                  <span>Script SQL Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Script SQL Oficial</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-56 overflow-y-auto font-mono text-[11px] text-slate-300">
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pastores Titulares</label>
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

    </div>
  );
};
