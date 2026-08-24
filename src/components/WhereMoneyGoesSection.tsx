import React from 'react';
import { Check, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

interface WhereMoneyGoesSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const WhereMoneyGoesSection: React.FC<WhereMoneyGoesSectionProps> = ({ onNavigate }) => {
  const pillars = [
    { label: 'Missões & Evangelismo', percentage: 85, heightClass: 'h-64 sm:h-72' },
    { label: 'Ação Social & Cestas', percentage: 75, heightClass: 'h-52 sm:h-60' },
    { label: 'Ensino Bíblico & EBD', percentage: 80, heightClass: 'h-56 sm:h-64' },
    { label: 'Juventude & Louvor', percentage: 73, heightClass: 'h-48 sm:h-56' },
    { label: 'Famílias & Acolhimento', percentage: 92, heightClass: 'h-72 sm:h-80' }
  ];

  const categories = [
    'Sustento e Envio de Missionários no Brasil e Exterior',
    'Distribuição de Alimentos e Cestas Básicas a Famílias',
    'Manutenção, Segurança e Acessibilidade do Templo',
    'Escola Bíblica Dominical (EBD) e Material das Crianças',
    'Cruzadas de Avivamento e Congressos de Juventude',
    'Suporte e Aconselhamento Pastoral Gratuito 24 Horas'
  ];

  return (
    <section id="transparencia" className="py-20 bg-white text-slate-800 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Explanatory Breakdown (Direct match to Template) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display uppercase mb-2">
                PARA ONDE VÃO OS RECURSOS
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Transparência e fidelidade na administração dos dízimos, ofertas voluntárias e doações sociais.
              </p>
            </div>

            {/* Bullet list with Orange Dots (Template Style) */}
            <ul className="space-y-3 pt-2">
              {categories.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5a1f] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <button
                onClick={() => onNavigate('contribuir')}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#70b83b] hover:text-[#61a332] hover:underline"
              >
                <span>Fazer Contribuição via PIX</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: 5 Green Vertical Bar Pillars with Percentages (Direct match to Template) */}
          <div className="lg:col-span-7 flex items-end justify-between gap-3 sm:gap-6 pt-8 lg:pt-0">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center group">
                
                {/* Top Percentage Label */}
                <span className="text-sm sm:text-base font-black text-[#70b83b] mb-2 tracking-tight">
                  {pillar.percentage}%
                </span>

                {/* Vertical Green Pillar Bar */}
                <div 
                  className={`w-full max-w-[56px] bg-[#70b83b] group-hover:bg-[#61a332] rounded-t-lg transition-all duration-500 flex items-center justify-center p-2 relative overflow-hidden shadow-sm ${pillar.heightClass}`}
                >
                  {/* Vertical Text inside bar (Template Style) */}
                  <span 
                    className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap -rotate-90 select-none block"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    {pillar.label}
                  </span>
                </div>

                {/* Bottom Base Line */}
                <div className="w-full h-1 bg-slate-300 rounded-full mt-1" />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
