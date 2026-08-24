import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Mic, 
  Music, 
  Sparkles, 
  CheckCircle, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { useChurch } from '../context/ChurchContext';
import { ChurchEvent } from '../types';
import { EventRegistrationModal } from './EventRegistrationModal';

interface EventsSectionProps {
  onSelectEventForRegistration?: (event: ChurchEvent) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ onSelectEventForRegistration }) => {
  const { events } = useChurch();
  const [selectedEventForReg, setSelectedEventForReg] = useState<ChurchEvent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Congresso', 'Missões', 'Vigília', 'Batismo'];

  const filteredEvents = selectedCategory === 'Todos'
    ? events
    : events.filter(e => e.category === selectedCategory);

  const mainHighlight = events.find(e => e.highlight) || events[0];

  // Countdown for highlight event
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!mainHighlight) return;
    const targetDate = new Date(`${mainHighlight.date}T${mainHighlight.time.split(' - ')[0] || '19:00'}:00`).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [mainHighlight]);

  const handleRegisterClick = (evt: ChurchEvent) => {
    if (onSelectEventForRegistration) {
      onSelectEventForRegistration(evt);
    } else {
      setSelectedEventForReg(evt);
    }
  };

  return (
    <section id="eventos" className="py-20 bg-white text-slate-800 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#70b83b] block mb-1">
            Grandes Momentos da Fé
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display uppercase mb-3">
            PRÓXIMOS EVENTOS & CONGRESSOS
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Congressos, vigílias de clamor, cruzadas evangelísticas e encontros especiais.
          </p>
        </div>

        {/* Featured Main Event Banner with Countdown */}
        {mainHighlight && (
          <div className="mb-14 relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Image & Overlay */}
              <div className="lg:col-span-6 relative min-h-[280px] lg:min-h-[400px]">
                <img
                  src={mainHighlight.bannerUrl}
                  alt={mainHighlight.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1 bg-[#70b83b] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow">
                    <Sparkles className="w-3 h-3 fill-white" />
                    Destaque do Mês
                  </span>
                </div>
              </div>

              {/* Content & Countdown */}
              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-amber-400 font-semibold mb-3">
                    <span className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(mainHighlight.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                      {mainHighlight.endDate && ` a ${new Date(mainHighlight.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}`}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded">
                      <Clock className="w-3.5 h-3.5" />
                      {mainHighlight.time}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
                    {mainHighlight.title}
                  </h3>
                  {mainHighlight.subtitle && (
                    <p className="text-sm font-medium text-amber-300 mb-2">
                      {mainHighlight.subtitle}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {mainHighlight.description}
                  </p>
                </div>

                {/* Countdown Block & Action */}
                <div>
                  <div className="mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Contagem regressiva para o início:
                    </span>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-slate-800 p-2 rounded-lg">
                        <span className="text-lg sm:text-xl font-bold text-[#fbc02d]">
                          {String(timeLeft.days).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] text-slate-400 block uppercase">Dias</span>
                      </div>
                      <div className="bg-slate-800 p-2 rounded-lg">
                        <span className="text-lg sm:text-xl font-bold text-[#fbc02d]">
                          {String(timeLeft.hours).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] text-slate-400 block uppercase">Horas</span>
                      </div>
                      <div className="bg-slate-800 p-2 rounded-lg">
                        <span className="text-lg sm:text-xl font-bold text-[#fbc02d]">
                          {String(timeLeft.minutes).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] text-slate-400 block uppercase">Min</span>
                      </div>
                      <div className="bg-slate-800 p-2 rounded-lg">
                        <span className="text-lg sm:text-xl font-bold text-[#fbc02d]">
                          {String(timeLeft.seconds).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] text-slate-400 block uppercase">Seg</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {mainHighlight.registrationOpen ? (
                      <button
                        onClick={() => handleRegisterClick(mainHighlight)}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#70b83b] hover:bg-[#61a332] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Garantir Vaga Gratuita</span>
                      </button>
                    ) : (
                      <div className="text-xs text-amber-300 bg-amber-500/20 px-4 py-2.5 rounded-lg border border-amber-500/30 font-semibold">
                        Entrada Livre • Não necessita inscrição prévia
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#70b83b] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Other Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-[#70b83b] hover:shadow-md transition-all group"
            >
              <div className="relative h-44 overflow-hidden bg-slate-200">
                <img
                  src={evt.bannerUrl}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white px-2.5 py-1 rounded">
                  {evt.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#70b83b] font-bold mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(evt.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-600">{evt.time}</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 group-hover:text-[#70b83b] transition-colors mb-2">
                    {evt.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="line-clamp-1">{evt.location}</span>
                  </div>

                  {evt.registrationOpen ? (
                    <button
                      onClick={() => handleRegisterClick(evt)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#70b83b] hover:bg-[#61a332] px-3 py-1.5 rounded-md transition-colors"
                    >
                      <span>Inscrever</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Entrada Franca
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Registration Modal fallback */}
      {selectedEventForReg && (
        <EventRegistrationModal
          event={selectedEventForReg}
          onClose={() => setSelectedEventForReg(null)}
        />
      )}
    </section>
  );
};
