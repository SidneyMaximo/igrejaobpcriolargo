import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  User, 
  MapPin, 
  X, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { useChurch } from '../../context/ChurchContext';
import { WeeklySchedule } from '../../types';

export const AdminSchedules: React.FC = () => {
  const { schedules, addSchedule, updateSchedule, deleteSchedule, departments } = useChurch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<WeeklySchedule | null>(null);

  // Form states
  const [dayOfWeek, setDayOfWeek] = useState<WeeklySchedule['dayOfWeek']>('Domingo');
  const [time, setTime] = useState('19:00 - 21:00');
  const [title, setTitle] = useState('');
  const [ministry, setMinistry] = useState('');
  const [description, setDescription] = useState('');
  const [leader, setLeader] = useState('Pr. Janildo Manoel');
  const [location, setLocation] = useState('Templo Sede');
  const [iconName, setIconName] = useState('heart-handshake');

  const openAddModal = () => {
    setEditingSchedule(null);
    setDayOfWeek('Domingo');
    setTime('19:00 - 21:00');
    setTitle('');
    setMinistry('Ministério Geral');
    setDescription('');
    setLeader('Pr. Janildo Manoel');
    setLocation('Templo Sede');
    setIconName('heart-handshake');
    setIsModalOpen(true);
  };

  const openEditModal = (schedule: WeeklySchedule) => {
    setEditingSchedule(schedule);
    setDayOfWeek(schedule.dayOfWeek);
    setTime(schedule.time);
    setTitle(schedule.title);
    setMinistry(schedule.ministry);
    setDescription(schedule.description);
    setLeader(schedule.leader);
    setLocation(schedule.location);
    setIconName(schedule.iconName);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingSchedule) {
      updateSchedule(editingSchedule.id, {
        dayOfWeek,
        time,
        title: title.trim(),
        ministry: ministry.trim(),
        description: description.trim(),
        leader: leader.trim(),
        location: location.trim(),
        iconName
      });
    } else {
      addSchedule({
        dayOfWeek,
        time,
        title: title.trim(),
        ministry: ministry.trim(),
        description: description.trim(),
        leader: leader.trim(),
        location: location.trim(),
        iconName,
        colorTag: 'amber',
        order: schedules.length + 1
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            Gerenciamento de Cultos e Programação Semanal
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Defina os horários, dirigentes e descrições dos cultos exibidos publicamente no portal da igreja.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Adicionar Novo Culto</span>
        </button>
      </div>

      {/* Schedules Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {schedule.dayOfWeek} • {schedule.time}
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(schedule)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
                    title="Editar Culto"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Deseja remover "${schedule.title}" da programação?`)) {
                        deleteSchedule(schedule.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Excluir Culto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="font-bold text-white text-base mb-1">{schedule.title}</h4>
              <p className="text-xs text-amber-400 font-medium mb-2">{schedule.ministry}</p>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{schedule.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                <span>{schedule.leader}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{schedule.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              {editingSchedule ? 'Editar Horário do Culto' : 'Cadastrar Novo Culto'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Dia da Semana</label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Horário (Início - Fim)</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="Ex: 19:30 - 21:00"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título do Culto *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Culto de Ensino & Doutrina"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ministério / Departamento</label>
                  <input
                    type="text"
                    list="departments-list"
                    value={ministry}
                    onChange={(e) => setMinistry(e.target.value)}
                    placeholder="Ex: JUBRAC, UFEBRAC, Geral"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                  <datalist id="departments-list">
                    {departments.map((d) => (
                      <option key={d.id} value={d.name} />
                    ))}
                    <option value="Ministério Geral" />
                    <option value="Ministério de Ensino & Doutrina" />
                    <option value="Ministério de Louvor" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Dirigente / Pregador</label>
                  <input
                    type="text"
                    value={leader}
                    onChange={(e) => setLeader(e.target.value)}
                    placeholder="Ex: Pr. Janildo Manoel"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Local</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Templo Sede Principal"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição para os Fiéis</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explique o propósito deste culto especial..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow"
                >
                  {editingSchedule ? 'Salvar Alterações' : 'Criar Culto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
