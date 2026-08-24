import React, { useState } from 'react';
import { 
  Heart, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Lock, 
  Phone, 
  User, 
  MessageSquare, 
  Edit3,
  Filter,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { useChurch } from '../../context/ChurchContext';
import { PrayerRequest } from '../../types';

export const AdminPrayers: React.FC = () => {
  const { prayerRequests, updatePrayerStatus, deletePrayerRequest } = useChurch();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pendente' | 'em_oracao' | 'atendido'>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const filtered = statusFilter === 'all'
    ? prayerRequests
    : prayerRequests.filter(p => p.status === statusFilter);

  const handleSaveNotes = (id: string) => {
    updatePrayerStatus(id, prayerRequests.find(p => p.id === id)?.status || 'em_oracao', noteText);
    setEditingNotesId(null);
  };

  const startEditNotes = (prayer: PrayerRequest) => {
    setEditingNotesId(prayer.id);
    setNoteText(prayer.pastorNotes || '');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            Gabinete Pastoral & Clamor Intercessório
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Motivos de oração enviados pelos membros e visitantes com controle de sigilo e acompanhamento pastoral.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              statusFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            Todos ({prayerRequests.length})
          </button>
          <button
            onClick={() => setStatusFilter('pendente')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              statusFilter === 'pendente' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            Pendentes
          </button>
          <button
            onClick={() => setStatusFilter('em_oracao')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              statusFilter === 'em_oracao' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            Em Oração
          </button>
          <button
            onClick={() => setStatusFilter('atendido')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              statusFilter === 'atendido' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            Atendidos
          </button>
        </div>
      </div>

      {/* Prayers List */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-200">Nenhum pedido de oração neste filtro</h4>
          <p className="text-xs text-slate-400 mt-1">
            Os pedidos enviados pelo formulário da página inicial chegam instantaneamente aqui.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((prayer) => (
            <div
              key={prayer.id}
              className={`bg-slate-900 border rounded-2xl p-5 transition-all shadow-md ${
                prayer.isConfidential
                  ? 'border-amber-500/30 bg-slate-900/90'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-400" />
                    {prayer.name}
                  </span>

                  {prayer.phone && (
                    <a
                      href={`https://wa.me/55${prayer.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{prayer.phone}</span>
                    </a>
                  )}

                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium border border-slate-700">
                    {prayer.requestType}
                  </span>

                  {prayer.isConfidential ? (
                    <span className="text-xs font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Sigilo Pastoral Estrito
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      Público para a Igreja
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[11px] text-slate-400">
                    {prayer.createdAt}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm('Deseja excluir este pedido de oração?')) {
                        deletePrayerRequest(prayer.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message text */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 mb-4 text-xs sm:text-sm text-slate-200 leading-relaxed">
                "{prayer.message}"
              </div>

              {/* Status Actions & Pastoral Notes */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-slate-800">
                
                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Status:</span>
                  <button
                    onClick={() => updatePrayerStatus(prayer.id, 'pendente')}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      prayer.status === 'pendente'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Pendente
                  </button>
                  <button
                    onClick={() => updatePrayerStatus(prayer.id, 'em_oracao')}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                      prayer.status === 'em_oracao'
                        ? 'bg-blue-500 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>Em Oração</span>
                  </button>
                  <button
                    onClick={() => updatePrayerStatus(prayer.id, 'atendido')}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                      prayer.status === 'atendido'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Atendido / Testemunho</span>
                  </button>
                </div>

                {/* Pastoral Notes Toggle */}
                <div className="text-xs">
                  {editingNotesId === prayer.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Nota interna do pastor..."
                        className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                      <button
                        onClick={() => handleSaveNotes(prayer.id)}
                        className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingNotesId(null)}
                        className="px-2 py-1 text-slate-400 hover:text-white"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {prayer.pastorNotes ? (
                        <span className="text-slate-300 italic">
                          <strong className="text-amber-400 not-italic">Nota Pastoral:</strong> {prayer.pastorNotes}
                        </span>
                      ) : (
                        <span className="text-slate-400">Sem anotação interna</span>
                      )}
                      <button
                        onClick={() => startEditNotes(prayer)}
                        className="text-amber-400 hover:text-amber-300 font-semibold underline text-[11px]"
                      >
                        {prayer.pastorNotes ? 'Editar' : '+ Anotar'}
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
