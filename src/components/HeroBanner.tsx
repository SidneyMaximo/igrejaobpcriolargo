import React from 'react';
import { 
  ArrowRight, 
  Heart, 
  Calendar, 
  BookOpen, 
  Sparkles, 
  Clock, 
  MapPin, 
  Phone
} from 'lucide-react';
import { useChurch } from '../context/ChurchContext';

interface HeroBannerProps {
  onNavigate: (sectionId: string) => void;
  onSelectEvent?: (event: any) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate }) => {
  const { churchInfo } = useChurch();

  return (
    <section 
      id="inicio" 
      className="pt-24 lg:pt-28 bg-[#071d5e] bg-[url('/bg-obpc.svg')] bg-cover bg-center bg-no-repeat text-white min-h-[640px] lg:min-h-[720px] flex items-center relative overflow-hidden"
    >
      {/* Subtle overlay to guarantee crisp text legibility while showing the watermark clearly */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/40 to-slate-950/75 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Official OBPC Welcoming & Ministry Card (Replaced portrait photo) */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md lg:max-w-none rounded-2xl overflow-hidden shadow-2xl border border-blue-400/30 bg-slate-950/75 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between group">
              
              {/* Top Card Header */}
              <div className="flex items-center justify-between gap-3 border-b border-blue-500/20 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#082269] border border-blue-400/40 p-1.5 flex items-center justify-center shadow-inner">
                    <img 
                      src="/obpc-symbol.svg" 
                      alt="Brasão O Brasil Para Cristo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#70b83b] block">
                      Convenção Nacional
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                      O Brasil Para Cristo
                    </h3>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-md border border-amber-500/30 shrink-0">
                  Desde 1956
                </span>
              </div>

              {/* Central Scripture / Moto */}
              <div className="my-6 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>"Desperta Brasil, Jesus te ama!"</span>
                </div>
                
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif-title italic">
                  "Pregai o Evangelho a toda criatura. E estes sinais seguirão aos que crerem: em meu nome expulsarão os demônios; falarão novas línguas; e porão as mãos sobre os enfermos, e os curarão."
                </p>
                <span className="text-[11px] text-[#70b83b] font-bold block uppercase tracking-wider">
                  — Marcos 16:15-18
                </span>
              </div>

              {/* Quick Action Badges inside card */}
              <div className="space-y-2.5 pt-4 border-t border-blue-500/20">
                <div className="flex items-center justify-between text-xs text-slate-300 bg-blue-950/50 p-2.5 rounded-lg border border-blue-900/40">
                  <span className="flex items-center gap-2 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    Cultos Dominicais
                  </span>
                  <strong className="text-white">18h Forene • 19h Sede</strong>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 bg-blue-950/50 p-2.5 rounded-lg border border-blue-900/40">
                  <span className="flex items-center gap-2 font-medium">
                    <Heart className="w-3.5 h-3.5 text-[#ff5a1f]" />
                    Círculo de Oração
                  </span>
                  <strong className="text-white">Seg 19h • Ter 19:30h</strong>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Title & CTA */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-center lg:text-left">
            
            {/* Eyebrow / Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-blue-400/30 text-slate-200 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Igreja Evangélica Pentecostal O Brasil Para Cristo</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-display drop-shadow-sm">
              Por Que Servir a Deus e Cuidar de Vidas?
            </h1>

            {/* Subtitle */}
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              Somos uma comunidade viva dedicada ao Evangelho de Jesus Cristo, ao avivamento bíblico, à oração pelos enfermos e ao acolhimento amoroso de cada família.
            </p>

            {/* Main CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                id="hero-how-help-btn"
                onClick={() => onNavigate('causas')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#ff5a1f] hover:bg-[#e44a12] text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 group"
              >
                <span>Como Você Pode Participar?</span>
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </button>

              <button
                onClick={() => onNavigate('cultos')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-sm text-slate-100 font-bold text-sm px-6 py-4 rounded-xl border border-blue-400/30 transition-all shadow"
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Horários dos Cultos</span>
              </button>
            </div>

            {/* Bottom Quick Feature Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-blue-500/20 text-left">
              <div className="p-3 rounded-xl bg-slate-950/60 backdrop-blur-sm border border-blue-500/20">
                <span className="text-[11px] font-bold text-[#70b83b] uppercase block">Culto da Família</span>
                <strong className="text-xs text-white">Dom 18h Forene • 19h Sede</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 backdrop-blur-sm border border-blue-500/20">
                <span className="text-[11px] font-bold text-amber-400 uppercase block">Culto de Ensino</span>
                <strong className="text-xs text-white">Sábados 19:30h (Sede)</strong>
              </div>
              <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-slate-950/60 backdrop-blur-sm border border-blue-500/20">
                <span className="text-[11px] font-bold text-rose-400 uppercase block">Sala de Oração</span>
                <strong className="text-xs text-white">Domingos 05h (Sede)</strong>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
