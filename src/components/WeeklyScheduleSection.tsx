import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  User, 
  MapPin, 
  Sparkles, 
  HeartHandshake, 
  Flame, 
  BookOpen, 
  Zap, 
  Shield, 
  CheckCircle2,
  Bell
} from 'lucide-react';
import { useChurch } from '../context/ChurchContext';
import { WeeklySchedule } from '../types';

export const WeeklyScheduleSection: React.FC = () => {
  const { schedules, churchInfo } = useChurch();
  const [selectedDay, setSelectedDay] = useState<string>('Todos');
  const [selectedLocation, setSelectedLocation] = useState<string>('Todos');
  const [reminderSavedId, setReminderSavedId] = useState<string | null>(null);

  const daysFilter = ['Todos', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sábado', 'Domingo'];
  const locationsFilter = ['Todos', 'Sede', 'Forene'];

  const filteredSchedules = schedules.filter(s => {
    const matchesDay = selectedDay === 'Todos' || s.dayOfWeek === selectedDay;
    const matchesLoc = selectedLocation === 'Todos' || s.location.toLowerCase().includes(selectedLocation.toLowerCase());
    return matchesDay && matchesLoc;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'book-open': return <BookOpen className="w-5 h-5" />;
      case 'heart-handshake': return <HeartHandshake className="w-5 h-5" />;
      case 'flame': return <Flame className="w-5 h-5" />;
      case 'zap': return <Zap className="w-5 h-5" />;
      case 'shield': return <Shield className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const handleSaveReminder = (schedule: WeeklySchedule) => {
    setReminderSavedId(schedule.id);
    setTimeout(() => setReminderSavedId(null), 3000);
  };

  return (
    <section id="cultos" className="py-20 bg-slate-50 text-slate-800 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Template Style) */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#70b83b] block mb-1">
            Programação Regular
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display uppercase mb-3">
            HORÁRIOS DOS CULTOS
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Há sempre um lugar especial reservado para você e sua família. Confira nossos encontros semanais.
          </p>
        </div>

        {/* Day & Location Filter Pills */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Days */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {daysFilter.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedDay === day
                    ? 'bg-[#70b83b] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Location selector */}
          <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 uppercase px-2">Local:</span>
            {locationsFilter.map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedLocation === loc
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Schedules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-[#70b83b] hover:shadow-md transition-all p-5 flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge & Time */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-[#70b83b] border border-emerald-200">
                    <Calendar className="w-3 h-3" />
                    {schedule.dayOfWeek}
                  </span>
                  
                  <div className="flex items-center gap-1 text-xs font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    <Clock className="w-3.5 h-3.5 text-[#ff5a1f]" />
                    <span>{schedule.time}</span>
                  </div>
                </div>

                {/* Service Title & Ministry */}
                <div className="flex items-start gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#70b83b] flex items-center justify-center shrink-0">
                    {getIcon(schedule.iconName)}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#70b83b] transition-colors leading-tight">
                      {schedule.title}
                    </h3>
                    <p className="text-[11px] text-[#70b83b] font-semibold mt-0.5">
                      {schedule.ministry}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {schedule.description}
                </p>
              </div>

              {/* Footer Meta Details */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    schedule.location.toLowerCase().includes('forene')
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    <MapPin className="w-3 h-3" />
                    {schedule.location}
                  </span>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <User className="w-3 h-3 text-slate-400" />
                    <span className="truncate max-w-[120px]">{schedule.leader}</span>
                  </div>
                </div>

                {/* Reminder action */}
                <button
                  onClick={() => handleSaveReminder(schedule)}
                  className="w-full mt-2 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                >
                  {reminderSavedId === schedule.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Lembrete Ativado!</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5 text-[#ff5a1f]" />
                      <span>Salvar Lembrete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
