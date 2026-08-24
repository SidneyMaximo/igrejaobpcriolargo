import React from 'react';
import { Heart, Sparkles, ArrowRight, CheckCircle2, Copy } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';

interface CausesSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const CausesSection: React.FC<CausesSectionProps> = ({ onNavigate }) => {
  const { churchInfo } = useChurch();
  const [copiedKey, setCopiedKey] = React.useState(false);

  const handleQuickPix = () => {
    if (churchInfo.pixKey) {
      navigator.clipboard.writeText(churchInfo.pixKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 3000);
    }
    onNavigate('contribuir');
  };

  const causes = [
    {
      id: 1,
      title: 'Ação Social & Cestas Básicas',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
      description: 'Atendimento a famílias em vulnerabilidade social com alimentos, roupas e suporte pastoral contínuo.',
      raised: 'R$ 4.850,00',
      goal: 'R$ 8.000,00',
      percentage: 61
    },
    {
      id: 2,
      title: 'Escola Bíblica & Discipulado (EBD)',
      image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80',
      description: 'Aquisição de material didático cristão, Bíblias de estudo e capacitação contínua de professores da Escola Bíblica.',
      raised: 'R$ 5.340,00',
      goal: 'R$ 9.000,00',
      percentage: 59
    },
    {
      id: 3,
      title: 'Sustento Missionário no Sertão',
      image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=800&q=80',
      description: 'Apoio integral a pastores e missionários da OBPC que dedicam suas vidas em frentes do sertão e campos pioneiros.',
      raised: 'R$ 7.520,00',
      goal: 'R$ 9.000,00',
      percentage: 84
    }
  ];

  return (
    <section id="causas" className="py-20 bg-slate-50 text-slate-800 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header (OUR CAUSES Style) */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display uppercase mb-3">
            NOSSAS CAUSAS
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Você pode transformar vidas através do amor e da generosidade.{' '}
            <button 
              onClick={() => onNavigate('contribuir')}
              className="text-[#70b83b] hover:underline font-semibold"
            >
              Conheça todas as frentes de auxílio.
            </button>
          </p>
        </div>

        {/* 3 Cause Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {causes.map((cause) => (
            <div 
              key={cause.id}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Top Image */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                  <img
                    src={cause.image}
                    alt={cause.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md">
                    OBPC Ação
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#70b83b] transition-colors">
                    {cause.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                    {cause.description}
                  </p>

                  {/* Progress Stats */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">
                        Arrecadado: <strong className="text-slate-900">{cause.raised}</strong>
                      </span>
                      <span className="text-slate-500">
                        Meta: <strong className="text-slate-900">{cause.goal}</strong>
                      </span>
                    </div>

                    {/* Orange / Amber Progress Bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#ff5a1f] to-amber-500 rounded-full transition-all duration-1000"
                        style={{ width: `${cause.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Action (Yellow Template Button) */}
              <div className="p-6 pt-0">
                <button
                  onClick={handleQuickPix}
                  className="w-full bg-[#fbc02d] hover:bg-[#f57f17] text-slate-950 font-bold text-xs uppercase tracking-wider py-3 rounded-lg shadow-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  <Heart className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Contribuir (PIX)</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Floating Quick Copied Toast Feedback */}
        {copiedKey && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-semibold animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span>Chave PIX copiada: {churchInfo.pixKey}</span>
          </div>
        )}

      </div>
    </section>
  );
};
