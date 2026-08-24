import React, { useState } from 'react';
import { 
  Heart, 
  Send, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  Phone, 
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useChurch } from '../context/ChurchContext';

export const PrayerRequestSection: React.FC = () => {
  const { addPrayerRequest } = useChurch();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isConfidential, setIsConfidential] = useState(true);
  const [requestType, setRequestType] = useState<'Família' | 'Saúde' | 'Vida Espiritual' | 'Financeiro' | 'Libertação' | 'Gratidão' | 'Outro'>('Família');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addPrayerRequest({
      name: name.trim() || 'Irmão(ã) em Cristo',
      phone: phone.trim(),
      isConfidential,
      requestType,
      message: message.trim()
    });

    setSubmitted(true);
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {}
  };

  return (
    <section id="oracao" className="py-20 bg-slate-50 text-slate-800 border-t border-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#ff5a1f] block mb-1">
            Gabinete & Intercessão
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display uppercase mb-3">
            PEDIDO DE ORAÇÃO
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Nossa equipe de oração e o corpo pastoral oram diariamente por cada motivo colocado no altar.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-8 space-y-4 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#70b83b] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Seu pedido foi colocado no Altar!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Nosso Círculo de Oração e o pastor já receberam o seu pedido. Cremos no poder de Deus para agir na sua vida e na sua família.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setName('');
                    setPhone('');
                    setMessage('');
                    setSubmitted(false);
                  }}
                  className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg"
                >
                  Enviar Outro Pedido
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Seu Nome (Opcional)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Maria Santos"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#70b83b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp para Contato (Opcional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 98765-4321"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#70b83b]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Motivo da Oração
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(['Família', 'Saúde', 'Vida Espiritual', 'Financeiro', 'Libertação', 'Gratidão', 'Outro'] as const).map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setRequestType(type)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        requestType === type
                          ? 'bg-[#70b83b] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descreva o seu pedido *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva como podemos orar por você..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#70b83b] resize-none"
                />
              </div>

              {/* Confidentiality */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="confidential-prayer-check"
                  checked={isConfidential}
                  onChange={(e) => setIsConfidential(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#70b83b] focus:ring-[#70b83b]"
                />
                <label htmlFor="confidential-prayer-check" className="text-xs text-slate-600 cursor-pointer">
                  <strong className="text-slate-800 block">Manter Sigilo Pastoral Estrito</strong>
                  <span>Apenas o Pastor Titular terá acesso à leitura do seu pedido.</span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#ff5a1f] hover:bg-[#e44a12] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Pedido de Oração</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </section>
  );
};
