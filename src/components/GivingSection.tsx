import React, { useState } from 'react';
import { 
  Heart, 
  Copy, 
  Check, 
  QrCode, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  Lock, 
  ArrowRight
} from 'lucide-react';
import { useChurch } from '../context/ChurchContext';

export const GivingSection: React.FC = () => {
  const { churchInfo } = useChurch();
  const [copiedKey, setCopiedKey] = useState(false);

  const copyPixKey = () => {
    navigator.clipboard.writeText(churchInfo.pixKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PIX:${encodeURIComponent(churchInfo.pixKey)}&bgcolor=ffffff&color=111827&margin=1`;

  return (
    <section id="contribuir" className="py-20 bg-white text-slate-800 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#70b83b] block mb-1">
            Fidelidade & Generosidade
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display uppercase mb-3">
            DÍZIMOS E OFERTAS (PIX)
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            "Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria." (2 Coríntios 9:7)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column 1: PIX Quick Contribution Card */}
          <div className="lg:col-span-6 bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#70b83b]">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Contribuição Instantânea via PIX</h3>
                    <p className="text-xs text-slate-500">Seguro, sem taxas e creditado na hora</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#70b83b] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Online 24h
                </span>
              </div>

              {/* QR Code & Key Container */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-36 h-36 bg-slate-50 p-2 rounded-lg border border-slate-200 shrink-0 flex items-center justify-center shadow-inner">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code PIX Igreja O Brasil Para Cristo"
                    className="w-full h-full object-contain rounded"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 w-full space-y-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
                      Tipo de Chave: {churchInfo.pixKeyType}
                    </span>
                    <div className="mt-1 flex items-center justify-between gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                      <code className="text-xs sm:text-sm font-mono text-slate-900 font-bold select-all break-all">
                        {churchInfo.pixKey}
                      </code>
                    </div>
                  </div>

                  <button
                    onClick={copyPixKey}
                    className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      copiedKey
                        ? 'bg-[#70b83b] text-white shadow-sm'
                        : 'bg-[#fbc02d] hover:bg-[#f57f17] text-slate-950 shadow-sm'
                    }`}
                  >
                    {copiedKey ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Chave PIX Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar Chave PIX</span>
                      </>
                    )}
                  </button>

                  <div className="text-[11px] text-slate-500">
                    Favorecido: <strong className="text-slate-800">{churchInfo.pixRecipient}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Confidentiality Guarantee Notice */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-600">
              <Lock className="w-4 h-4 text-[#ff5a1f] shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block mb-0.5">Sigilo Pastoral & Discrição Absoluta</strong>
                <span>
                  O valor e a identidade dos dizimistas e ofertantes são tratados sob rigoroso sigilo eclesiástico e pastoral.
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Bank Transfer Details & Ministries Sustained */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            {/* Bank Transfer Box */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Transferência / Depósito Bancário</h3>
                  <p className="text-xs text-slate-500">Conta corrente oficial da igreja</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Instituição</span>
                  <strong className="text-slate-900 text-xs">{churchInfo.bankName}</strong>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Titular</span>
                  <strong className="text-slate-900 text-xs">{churchInfo.name}</strong>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Agência</span>
                  <strong className="text-slate-900 text-xs">{churchInfo.bankAgency}</strong>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Conta Corrente</span>
                  <strong className="text-slate-900 text-xs">{churchInfo.bankAccount}</strong>
                </div>
              </div>
            </div>

            {/* Where your giving is invested */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ff5a1f]" />
                  Onde a sua oferta é investida no Reino
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#70b83b] mt-1.5 shrink-0" />
                    <span><strong>Sustento Missionário:</strong> Envio de missionários em campos transculturais e sertão.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#70b83b] mt-1.5 shrink-0" />
                    <span><strong>Ação Social & Comunidade:</strong> Distribuição de cestas básicas e auxílio comunitário.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#70b83b] mt-1.5 shrink-0" />
                    <span><strong>Manutenção do Templo:</strong> Climatização, salas infantis e multimídia.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>Prestação de contas regular em Assembleia</span>
                <ShieldCheck className="w-4 h-4 text-[#70b83b]" />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
