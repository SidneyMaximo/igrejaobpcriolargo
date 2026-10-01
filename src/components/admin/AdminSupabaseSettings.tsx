import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, 
  Check, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  UploadCloud, 
  DownloadCloud, 
  CheckCircle2,
  Building2,
  ShieldCheck,
  Lock,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  Sparkles,
  Eye
} from 'lucide-react';
import { useChurch } from '../../context/ChurchContext';
import { supabaseStorageService } from '../../lib/supabase';

export const AdminSupabaseSettings: React.FC = () => {
  const { 
    schedules, 
    events, 
    departments,
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

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);

  // Logo & Identity Form
  const [logoUrl, setLogoUrl] = useState(churchInfo.logoUrl || '/obpc-logo.svg');
  const [logoWhiteUrl, setLogoWhiteUrl] = useState(churchInfo.logoWhiteUrl || '/obpc-logo-white.svg');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingLogoWhite, setIsUploadingLogoWhite] = useState(false);
  const [logoSavedSuccess, setLogoSavedSuccess] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const logoWhiteInputRef = useRef<HTMLInputElement>(null);

  // Hero Background & Banner Form
  const [heroBackgroundUrl, setHeroBackgroundUrl] = useState(churchInfo.heroBackgroundUrl || '/bg-obpc.svg');
  const [heroTitle, setHeroTitle] = useState(churchInfo.heroTitle || 'Por Que Servir a Deus e Cuidar de Vidas?');
  const [heroSubtitle, setHeroSubtitle] = useState(
    churchInfo.heroSubtitle ||
      'Somos uma comunidade viva dedicada ao Evangelho de Jesus Cristo, ao avivamento bíblico, à oração pelos enfermos e ao acolhimento amoroso de cada família.'
  );
  const [isUploadingHeroBg, setIsUploadingHeroBg] = useState(false);
  const [heroSavedSuccess, setHeroSavedSuccess] = useState(false);
  const heroBgInputRef = useRef<HTMLInputElement>(null);

  // Auto-clean any legacy corrupted credentials on mount and verify health
  useEffect(() => {
    try {
      localStorage.removeItem('obpc_supabase_url_v1');
      localStorage.removeItem('obpc_supabase_anon_key_v1');
    } catch (e) {
      console.warn('Could not clear legacy storage keys', e);
    }
    checkSupabaseHealth();
  }, [checkSupabaseHealth]);

  // Sync state if churchInfo changes
  useEffect(() => {
    if (churchInfo.logoUrl) setLogoUrl(churchInfo.logoUrl);
    if (churchInfo.logoWhiteUrl) setLogoWhiteUrl(churchInfo.logoWhiteUrl);
    if (churchInfo.heroBackgroundUrl) setHeroBackgroundUrl(churchInfo.heroBackgroundUrl);
    if (churchInfo.heroTitle) setHeroTitle(churchInfo.heroTitle);
    if (churchInfo.heroSubtitle) setHeroSubtitle(churchInfo.heroSubtitle);
  }, [churchInfo.logoUrl, churchInfo.logoWhiteUrl, churchInfo.heroBackgroundUrl, churchInfo.heroTitle, churchInfo.heroSubtitle]);

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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isWhite = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (isWhite) setIsUploadingLogoWhite(true);
    else setIsUploadingLogo(true);

    const res = await supabaseStorageService.uploadFile(files[0], 'branding');
    
    if (isWhite) setIsUploadingLogoWhite(false);
    else setIsUploadingLogo(false);

    if (res.success && res.url) {
      if (isWhite) {
        setLogoWhiteUrl(res.url);
        updateChurchInfo({ logoWhiteUrl: res.url });
      } else {
        setLogoUrl(res.url);
        updateChurchInfo({ logoUrl: res.url });
      }
      setFeedbackMsg({ type: 'success', text: `Logomarca ${isWhite ? 'branca' : 'principal'} enviada e atualizada com sucesso!` });
      setLogoSavedSuccess(true);
      setTimeout(() => setLogoSavedSuccess(false), 4000);
    } else {
      alert(res.message || 'Erro ao enviar imagem.');
    }
  };

  const handleResetLogo = (isWhite = false) => {
    if (isWhite) {
      setLogoWhiteUrl('/obpc-logo-white.svg');
      updateChurchInfo({ logoWhiteUrl: '/obpc-logo-white.svg' });
      setFeedbackMsg({ type: 'success', text: 'Logo branca restaurada para o padrão oficial OBPC!' });
    } else {
      setLogoUrl('/obpc-logo.svg');
      updateChurchInfo({ logoUrl: '/obpc-logo.svg' });
      setFeedbackMsg({ type: 'success', text: 'Logo principal restaurada para o padrão oficial OBPC!' });
    }
    setLogoSavedSuccess(true);
    setTimeout(() => setLogoSavedSuccess(false), 4000);
  };

  const handleSaveLogoDirectly = () => {
    updateChurchInfo({
      logoUrl: logoUrl.trim() || '/obpc-logo.svg',
      logoWhiteUrl: logoWhiteUrl.trim() || '/obpc-logo-white.svg'
    });
    setFeedbackMsg({ type: 'success', text: 'Logomarca da igreja atualizada com sucesso no site e painel!' });
    setLogoSavedSuccess(true);
    setTimeout(() => setLogoSavedSuccess(false), 4000);
  };

  const handleHeroBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingHeroBg(true);
    const res = await supabaseStorageService.uploadFile(files[0], 'banners');
    setIsUploadingHeroBg(false);

    if (res.success && res.url) {
      setHeroBackgroundUrl(res.url);
      updateChurchInfo({ heroBackgroundUrl: res.url });
      setFeedbackMsg({ type: 'success', text: 'Nova imagem de fundo do banner principal enviada e aplicada com sucesso!' });
      setHeroSavedSuccess(true);
      setTimeout(() => setHeroSavedSuccess(false), 4000);
    } else {
      alert(res.message || 'Erro ao enviar imagem de fundo.');
    }
  };

  const handleResetHeroBg = () => {
    setHeroBackgroundUrl('/bg-obpc.svg');
    updateChurchInfo({ heroBackgroundUrl: '/bg-obpc.svg' });
    setFeedbackMsg({ type: 'success', text: 'Fundo azul oficial OBPC restaurado com sucesso!' });
    setHeroSavedSuccess(true);
    setTimeout(() => setHeroSavedSuccess(false), 4000);
  };

  const handleSaveHeroDirectly = () => {
    updateChurchInfo({
      heroBackgroundUrl: heroBackgroundUrl.trim() || '/bg-obpc.svg',
      heroTitle: heroTitle.trim() || 'Por Que Servir a Deus e Cuidar de Vidas?',
      heroSubtitle: heroSubtitle.trim() || undefined
    });
    setFeedbackMsg({ type: 'success', text: 'Banner principal (imagem de fundo e títulos) salvo e aplicado com sucesso!' });
    setHeroSavedSuccess(true);
    setTimeout(() => setHeroSavedSuccess(false), 4000);
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
      logoUrl: logoUrl.trim() || '/obpc-logo.svg',
      logoWhiteUrl: logoWhiteUrl.trim() || '/obpc-logo-white.svg',
      heroBackgroundUrl: heroBackgroundUrl.trim() || '/bg-obpc.svg',
      heroTitle: heroTitle.trim() || 'Por Que Servir a Deus e Cuidar de Vidas?',
      heroSubtitle: heroSubtitle.trim() || undefined,
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
            Configurações &amp; Banco de Dados
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Persistência em nuvem PostgreSQL em tempo real, sincronização e dados cadastrais da igreja.
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

        {/* Elegant Infrastructure Notice */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Infraestrutura e Segurança de Dados</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Gerenciamento Seguro
                </span>
              </h5>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                As configurações de banco de dados e credenciais do Supabase agora são injetadas automaticamente de forma segura pelo servidor durante a construção do sistema. Nenhuma ação manual é necessária.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Ambiente</span>
                <span className="text-slate-200 font-semibold truncate block">Injeção Automática de Secrets</span>
              </div>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Comunicação</span>
                <span className="text-slate-200 font-semibold truncate block">Criptografia SSL/TLS Ativa</span>
              </div>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
              <Database className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Banco de Dados</span>
                <span className="text-slate-200 font-semibold truncate block">PostgreSQL Supabase</span>
              </div>
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
      </div>

      {/* Identidade Visual & Gestão de Logomarca */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Identidade Visual do Portal</span>
            </div>
            <h4 className="font-bold text-white text-lg">Logomarca Oficial da Igreja</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Altere a logomarca exibida na barra de navegação superior, rodapé, cabeçalho administrativo e relatórios oficiais.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSaveLogoDirectly}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all"
            >
              <Check className="w-4 h-4 text-slate-950" />
              <span>Salvar &amp; Aplicar Logomarca</span>
            </button>
          </div>
        </div>

        {logoSavedSuccess && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Logomarca atualizada com sucesso em todo o sistema!</span>
          </div>
        )}

        {/* Hidden inputs for uploading images */}
        <input
          type="file"
          accept="image/*,.svg"
          ref={logoInputRef}
          onChange={(e) => handleLogoUpload(e, false)}
          className="hidden"
        />
        <input
          type="file"
          accept="image/*,.svg"
          ref={logoWhiteInputRef}
          onChange={(e) => handleLogoUpload(e, true)}
          className="hidden"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. Logo Principal (Fundo Claro) */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#70b83b]" />
                  <span>Logo Colorida (Para Fundos Claros / Navbar)</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  Recomendado SVG ou PNG
                </span>
              </div>

              {/* Preview Box Light */}
              <div className="relative h-28 rounded-xl bg-white border border-slate-300 flex items-center justify-center p-4 overflow-hidden shadow-inner group">
                <img
                  src={logoUrl || '/obpc-logo.svg'}
                  alt="Logo Principal"
                  className="max-h-16 max-w-full object-contain transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/obpc-logo.svg';
                  }}
                />
                <div className="absolute top-2 right-2 text-[10px] bg-slate-900/80 text-white font-mono px-2 py-0.5 rounded backdrop-blur-sm">
                  Pré-visualização
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  URL da Imagem / Link Direto
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://... ou /obpc-logo.svg"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isUploadingLogo ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Fazer Upload do Computador</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleResetLogo(false)}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 text-xs px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                  title="Restaurar para a logomarca original"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrão OBPC</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Logo Versão Branca (Fundo Escuro) */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>Logo Branca / Negativa (Para Fundos Escuros / Rodapé / Painel)</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  Alto Contraste
                </span>
              </div>

              {/* Preview Box Dark */}
              <div className="relative h-28 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-4 overflow-hidden shadow-inner group">
                <img
                  src={logoWhiteUrl || '/obpc-logo-white.svg'}
                  alt="Logo Versão Branca"
                  className="max-h-16 max-w-full object-contain transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/obpc-logo-white.svg';
                  }}
                />
                <div className="absolute top-2 right-2 text-[10px] bg-slate-900/80 text-white font-mono px-2 py-0.5 rounded backdrop-blur-sm">
                  Pré-visualização
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  URL da Imagem / Link Direto
                </label>
                <input
                  type="text"
                  value={logoWhiteUrl}
                  onChange={(e) => setLogoWhiteUrl(e.target.value)}
                  placeholder="https://... ou /obpc-logo-white.svg"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => logoWhiteInputRef.current?.click()}
                  disabled={isUploadingLogoWhite}
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isUploadingLogoWhite ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Fazer Upload do Computador</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleResetLogo(true)}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 text-xs px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                  title="Restaurar para a logomarca original"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrão Branco</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Banner Principal da Página Inicial (Hero Background) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Página Inicial (Início)</span>
            </div>
            <h4 className="font-bold text-white text-lg">Banner Principal (Fundo Azul / Textura Hero)</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Altere a imagem de fundo (background), marca d'água e os títulos principais da seção de abertura do site.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSaveHeroDirectly}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all"
            >
              <Check className="w-4 h-4 text-slate-950" />
              <span>Salvar &amp; Aplicar Fundo do Banner</span>
            </button>
          </div>
        </div>

        {heroSavedSuccess && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Fundo e textos do banner principal atualizados com sucesso no site!</span>
          </div>
        )}

        {/* Hidden input for uploading hero background */}
        <input
          type="file"
          accept="image/*,.svg"
          ref={heroBgInputRef}
          onChange={handleHeroBgUpload}
          className="hidden"
        />

        <div className="space-y-6">
          
          {/* Live Preview Box of the Hero Banner */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Pré-visualização em Tempo Real do Banner Inicial</span>
            </label>

            <div 
              className="relative min-h-[220px] sm:min-h-[260px] rounded-2xl bg-[#071d5e] bg-cover bg-center bg-no-repeat border border-slate-700 overflow-hidden flex flex-col justify-center p-6 sm:p-8 text-white shadow-2xl transition-all"
              style={{
                backgroundImage: `url('${heroBackgroundUrl || '/bg-obpc.svg'}')`
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-slate-950/80 pointer-events-none" />

              <div className="relative z-10 max-w-xl space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-blue-400/30 text-slate-200 text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Igreja Evangélica Pentecostal O Brasil Para Cristo</span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight font-display drop-shadow">
                  {heroTitle || 'Por Que Servir a Deus e Cuidar de Vidas?'}
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium line-clamp-2">
                  {heroSubtitle || 'Somos uma comunidade viva dedicada ao Evangelho de Jesus Cristo, ao avivamento bíblico, à oração pelos enfermos e ao acolhimento amoroso de cada família.'}
                </p>

                <div className="pt-1 flex items-center gap-2">
                  <span className="text-[10px] bg-[#ff5a1f] text-white font-bold px-3 py-1.5 rounded-lg shadow">
                    Conheça Nossos Cultos
                  </span>
                  <span className="text-[10px] bg-slate-900/90 text-slate-300 font-bold px-3 py-1.5 rounded-lg border border-slate-700">
                    Próximos Eventos
                  </span>
                </div>
              </div>

              <div className="absolute top-3 right-3 text-[10px] bg-slate-900/90 text-white font-mono px-2.5 py-1 rounded-lg border border-slate-700 backdrop-blur-sm">
                Visualização do Visitante
              </div>
            </div>
          </div>

          {/* Background Image Inputs & Upload */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Imagem de Fundo do Banner (Background / Textura)</span>
              </span>
              <span className="text-[10px] text-slate-400">
                Recomendado: 1920x1080px (SVG, PNG, JPG ou WebP)
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                URL da Imagem de Fundo / Link Direto
              </label>
              <input
                type="text"
                value={heroBackgroundUrl}
                onChange={(e) => setHeroBackgroundUrl(e.target.value)}
                placeholder="https://... ou /bg-obpc.svg"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => heroBgInputRef.current?.click()}
                disabled={isUploadingHeroBg}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {isUploadingHeroBg ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Enviando imagem...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload de Imagem do Computador</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResetHeroBg}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 text-xs px-3.5 py-2.5 rounded-xl hover:bg-slate-800 border border-slate-800 transition-colors"
                title="Restaurar para a textura azul original da OBPC"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Fundo Padrão Azul OBPC</span>
              </button>
            </div>

            {/* Quick Suggestions Presets */}
            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Sugestões Rápidas de Fundos:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Fundo Azul Oficial OBPC', url: '/bg-obpc.svg' },
                  { label: 'Adoração & Louvor', url: 'https://images.unsplash.com/photo-1510525009512-ab7522cabb6b?auto=format&fit=crop&w=1920&q=80' },
                  { label: 'Bíblia Aberta & Luz', url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1920&q=80' },
                  { label: 'Comunhão & Ação Social', url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1920&q=80' }
                ].map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setHeroBackgroundUrl(preset.url);
                      updateChurchInfo({ heroBackgroundUrl: preset.url });
                      setHeroSavedSuccess(true);
                      setTimeout(() => setHeroSavedSuccess(false), 3000);
                    }}
                    className={`p-2 rounded-xl text-left text-[11px] border transition-all flex flex-col justify-between h-16 ${
                      heroBackgroundUrl === preset.url
                        ? 'bg-amber-500/15 border-amber-400 text-amber-300 font-bold'
                        : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="line-clamp-1">{preset.label}</span>
                    <span className="text-[9px] text-slate-500 truncate font-mono">
                      {preset.url.startsWith('/') ? 'Padrão Local' : 'Unsplash HD'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Title & Subtitle Customization */}
          <div className="grid grid-cols-1 gap-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Título Principal do Banner
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Por Que Servir a Deus e Cuidar de Vidas?"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Subtítulo / Mensagem de Acolhimento
              </label>
              <textarea
                rows={2}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Somos uma comunidade viva dedicada ao Evangelho de Jesus Cristo..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
              />
            </div>
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
              Dados Financeiros &amp; Chave PIX Oficial da Igreja
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
              <h4 className="font-bold text-white text-base">Departamentos &amp; Ministérios da Igreja</h4>
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
