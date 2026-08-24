import React from 'react';
import { Heart, MessageSquareHeart, Clock, ArrowRight, Shield, Sparkles } from 'lucide-react';

interface HowYouCanHelpSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const HowYouCanHelpSection: React.FC<HowYouCanHelpSectionProps> = ({ onNavigate }) => {
  return (
    <section 
      id="como-ajudar" 
      className="relative py-24 bg-slate-900 text-white overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 15, 29, 0.85), rgba(10, 15, 29, 0.88)), url('https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Title (HOW YOU CAN HELP Style) */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display uppercase mb-16">
          COMO VOCÊ PODE AJUDAR
        </h2>

        {/* 3 Big Bright Yellow Numbers (Direct match to Template 12755, 100, 156030) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 mb-16">
          
          <div className="space-y-2">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#fbc02d] tracking-tight block">
              68+ Anos
            </span>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              História & Avivamento
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
              Fundada em 1956 pelo Missionário Manoel de Mello, mantendo acesa a chama pentecostal e amor ao Brasil.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#fbc02d] tracking-tight block">
              4.000+
            </span>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Templos & Frentes
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
              Presença eclesiástica em todos os estados brasileiros e em campos missionários transculturais.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#fbc02d] tracking-tight block">
              100.000+
            </span>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Vidas Transformadas
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
              Milhares de famílias alcançadas por orações, ações sociais, batismos e reconciliação com Cristo.
            </p>
          </div>

        </div>

        {/* 3 Colorful Action Buttons (Red, Orange, Green - Direct match to Template) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-4xl mx-auto">
          
          {/* Crimson Red Button (Give Monthly / Contribuir PIX) */}
          <button
            onClick={() => onNavigate('contribuir')}
            className="w-full sm:w-1/3 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs sm:text-sm uppercase tracking-wider py-4 px-5 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <span>Dízimos & Ofertas</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Orange Button (Fundraise / Pedido de Oração) */}
          <button
            onClick={() => onNavigate('oracao')}
            className="w-full sm:w-1/3 bg-[#ff5a1f] hover:bg-[#e44a12] text-white font-bold text-xs sm:text-sm uppercase tracking-wider py-4 px-5 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <span>Pedido de Oração</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Green Button (Partner With Us / Programação dos Cultos) */}
          <button
            onClick={() => onNavigate('cultos')}
            className="w-full sm:w-1/3 bg-[#70b83b] hover:bg-[#61a332] text-white font-bold text-xs sm:text-sm uppercase tracking-wider py-4 px-5 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <span>Nossos Cultos</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </section>
  );
};
