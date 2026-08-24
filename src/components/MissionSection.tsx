import React from 'react';
import { Heart, Globe2, HandHeart, ArrowRight, BookOpen, ShieldCheck, Users } from 'lucide-react';

interface MissionSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const MissionSection: React.FC<MissionSectionProps> = ({ onNavigate }) => {
  const pillars = [
    {
      icon: Heart,
      title: 'Pregação Genuína da Palavra',
      description: 'Promover a fé viva, o avivamento bíblico e o poder transformador do Evangelho de Jesus Cristo em todas as fases da vida.'
    },
    {
      icon: Globe2,
      title: 'Missões Nacionais & Globais',
      description: 'Apoiar frentes missionárias no sertão brasileiro e em diversos países, levando esperança, assistência social e salvação.'
    },
    {
      icon: HandHeart,
      title: 'Acolhimento & Cuidado Familiar',
      description: 'Oferecer suporte pastoral contínuo, oração por enfermos, fortalecimento de lares e assistência às famílias em vulnerabilidade.'
    }
  ];

  return (
    <section id="missao" className="py-20 bg-white text-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (OUR MISSION Style) */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display uppercase mb-3">
            NOSSA MISSÃO
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Proclamando a verdade do Evangelho, a salvação em Cristo e o cuidado integral com cada família
          </p>
        </div>

        {/* 3 Circular Green Outline Badges (Matching Template Exactly) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 mb-14 text-center">
          {pillars.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center group">
                
                {/* Icon Container with Green Border */}
                <div className="w-24 h-24 rounded-full border-2 border-[#70b83b] flex items-center justify-center text-[#70b83b] bg-emerald-50/50 mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#70b83b] group-hover:text-white shadow-sm">
                  <IconComp className="w-10 h-10" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs">
                  {item.description}
                </p>

              </div>
            );
          })}
        </div>

        {/* Green CTA Pill Button (Learn more about Hope style) */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('historia')}
            className="inline-flex items-center gap-2.5 bg-[#70b83b] hover:bg-[#61a332] text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <span>Conhecer Nossa História & Fundamento</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
