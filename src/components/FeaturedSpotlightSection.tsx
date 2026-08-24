import React from 'react';
import { ArrowRight, Phone, HeartHandshake, Sparkles } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';

interface FeaturedSpotlightSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const FeaturedSpotlightSection: React.FC<FeaturedSpotlightSectionProps> = ({ onNavigate }) => {
  const { churchInfo } = useChurch();

  const handleWhatsAppContact = () => {
    if (churchInfo.whatsapp) {
      const cleanPhone = churchInfo.whatsapp.replace(/\D/g, '');
      const msg = encodeURIComponent("A paz do Senhor! Gostaria de uma palavra pastoral e conhecer mais sobre os cultos da Igreja O Brasil Para Cristo.");
      window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, '_blank');
    } else {
      onNavigate('oracao');
    }
  };

  return (
    <section className="bg-[#141518] text-white py-16 lg:py-24 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Portrait Photo (Black & White style from template) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700 bg-slate-900 group">
              <img
                src="https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=900&q=85"
                alt="Acolhimento Pastoral O Brasil Para Cristo"
                className="w-full h-full object-cover filter grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#fbc02d]">
                  Você Não Está Sozinho
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Title & Yellow CTA (Direct match to Template) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Acolhimento & Oração Diária</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display uppercase tracking-tight leading-tight">
              UM LUGAR DE PAZ E RECOMEÇO PARA SUA VIDA
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Não importa as batalhas, angústias ou incertezas que você tem enfrentado nos últimos tempos. Na Igreja O Brasil Para Cristo você encontra um ambiente de amor fraternal, oração de cura, ensino bíblico e a presença restauradora do Espírito Santo.
            </p>

            {/* Bright Yellow Template Button */}
            <div className="pt-2">
              <button
                onClick={handleWhatsAppContact}
                className="inline-flex items-center justify-center gap-3 bg-[#fbc02d] hover:bg-[#f57f17] text-slate-950 font-black text-sm uppercase tracking-wider px-8 py-4 rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <span>Falar com o Pastor Agora</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>

            {/* Subtitle Link (Template Style: WWW.BACKTOSCHOOL.COM) */}
            <div className="pt-2">
              <button 
                onClick={() => onNavigate('cultos')}
                className="text-xs font-mono font-bold tracking-widest text-[#fbc02d] hover:underline uppercase"
              >
                WWW.OBRASILPARACRISTO.ORG.BR
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
