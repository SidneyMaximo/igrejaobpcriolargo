import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Youtube, 
  Instagram, 
  Facebook, 
  ExternalLink,
  Clock
} from 'lucide-react';
import { useChurch } from '../context/ChurchContext';

export const ChurchLocationSection: React.FC = () => {
  const { churchInfo } = useChurch();

  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${churchInfo.name} ${churchInfo.address} ${churchInfo.cityState}`
  )}`;

  const cleanWhatsAppNumber = churchInfo.whatsapp.replace(/\D/g, '');
  const whatsappLink = `https://wa.me/55${cleanWhatsAppNumber}?text=${encodeURIComponent(
    'A paz do Senhor! Gostaria de mais informações sobre a Igreja O Brasil Para Cristo.'
  )}`;

  return (
    <section id="contato" className="py-20 bg-white text-slate-800 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Address and Direct Contact */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#70b83b] block mb-1">
                Onde Estamos
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display uppercase mb-3">
                LOCALIZAÇÃO & CONTATO
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Nossas portas estão abertas para receber você e sua família com amor fraternal.
              </p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#70b83b] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <strong className="text-slate-900 block text-sm mb-0.5">Endereço do Templo Sede</strong>
                  <p className="text-slate-600">{churchInfo.address}</p>
                  <p className="text-slate-500">{churchInfo.cityState} • CEP {churchInfo.zipCode}</p>
                  <a
                    href={googleMapsSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#70b83b] hover:underline font-bold mt-2"
                  >
                    <span>Abrir no Google Maps / GPS</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-xs block mb-0.5">Telefone</span>
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Phone className="w-3.5 h-3.5 text-[#ff5a1f]" />
                    <span>{churchInfo.phone}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-xs block mb-0.5">WhatsApp Pastoral</span>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-[#70b83b] hover:underline font-bold text-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{churchInfo.whatsapp}</span>
                  </a>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#70b83b]" />
                  <span className="text-slate-700 text-xs font-medium">{churchInfo.email}</span>
                </div>
                <span className="text-[11px] text-slate-400">Atendimento Regular</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Map Box */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Santuário e Dependências</h3>
                    <p className="text-xs text-slate-500">{churchInfo.address}, {churchInfo.cityState}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-[#70b83b] text-xs font-bold border border-emerald-200">
                    Sede
                  </span>
                </div>

                <div className="w-full h-44 rounded-xl bg-slate-200 border border-slate-300 relative overflow-hidden flex items-center justify-center group">
                  <div 
                    className="absolute inset-0 opacity-40 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')`
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-900/40" />
                  
                  <div className="relative z-10 text-center p-4">
                    <div className="w-10 h-10 rounded-full bg-[#fbc02d] text-slate-950 flex items-center justify-center mx-auto mb-2 shadow">
                      <MapPin className="w-5 h-5 fill-slate-950" />
                    </div>
                    <p className="text-xs font-bold text-white drop-shadow">O Brasil Para Cristo</p>
                    <a
                      href={googleMapsSearchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-md bg-white text-slate-900 text-xs font-bold shadow hover:bg-slate-100"
                    >
                      <span>Abrir GPS</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Pastores</span>
                  <strong className="text-slate-900 text-xs">{churchInfo.pastorName}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={churchInfo.youtubeChannelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200"
                    title="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a
                    href={churchInfo.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-white hover:bg-pink-50 text-slate-600 hover:text-pink-600 border border-slate-200"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={churchInfo.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200"
                    title="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
