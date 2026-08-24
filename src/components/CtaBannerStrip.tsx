import React from 'react';
import { Heart, Clock, ArrowRight } from 'lucide-react';

interface CtaBannerStripProps {
  onNavigate: (sectionId: string) => void;
}

export const CtaBannerStrip: React.FC<CtaBannerStripProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#1e2024] text-white py-8 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Side Text & Heart Icon (Template Style) */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 mx-auto md:mx-0">
            <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
              Faça Parte Desta Obra de Amor, Fé e Transformação Social
            </h3>
            <p className="text-xs text-slate-400">
              Sua contribuição e suas orações sustentam missionários e acolhem famílias carentes.
            </p>
          </div>
        </div>

        {/* Right Side Buttons (Yellow Single Donation & Green Regular Donation style) */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
          {/* Yellow Single Donation / Contribuir PIX */}
          <button
            onClick={() => onNavigate('contribuir')}
            className="bg-[#fbc02d] hover:bg-[#f57f17] text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider py-3.5 px-6 rounded-lg shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Heart className="w-4 h-4 fill-slate-950" />
            <span>Fazer Doação PIX</span>
          </button>

          {/* Green Regular Donation / Ver Horários */}
          <button
            onClick={() => onNavigate('cultos')}
            className="bg-[#70b83b] hover:bg-[#61a332] text-white font-bold text-xs sm:text-sm uppercase tracking-wider py-3.5 px-6 rounded-lg shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            <span>Programação Semanal</span>
          </button>
        </div>

      </div>
    </div>
  );
};
