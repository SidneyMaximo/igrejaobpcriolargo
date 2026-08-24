import React, { useState, useRef } from 'react';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  MapPin, 
  X, 
  Sparkles, 
  Users, 
  Image as ImageIcon,
  CheckCircle2,
  Upload,
  RefreshCw,
  UploadCloud
} from 'lucide-react';
import { useChurch } from '../../context/ChurchContext';
import { ChurchEvent } from '../../types';
import { supabaseStorageService } from '../../lib/supabase';

export const AdminEvents: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useChurch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ChurchEvent | null>(null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const bannerInputRef = React.useRef<HTMLInputElement>(null);

  // Form
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [date, setDate] = useState('2026-10-10');
  const [endDate, setEndDate] = useState('');
  const [time, setTime] = useState('19:30');
  const [location, setLocation] = useState('Templo Sede OBPC');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [category, setCategory] = useState<ChurchEvent['category']>('Congresso');
  const [highlight, setHighlight] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [registrationLimit, setRegistrationLimit] = useState<number | undefined>(300);
  const [guestSpeaker, setGuestSpeaker] = useState('');
  const [musicalGuest, setMusicalGuest] = useState('');

  const sampleBanners = [
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1510525009512-ab7522cabb6b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80'
  ];

  const openAddModal = () => {
    setEditingEvent(null);
    setTitle('');
    setSubtitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setTime('19:30');
    setLocation('Templo Sede OBPC');
    setDescription('');
    setBannerUrl(sampleBanners[0]);
    setCategory('Congresso');
    setHighlight(false);
    setRegistrationOpen(true);
    setRegistrationLimit(300);
    setGuestSpeaker('');
    setMusicalGuest('');
    setIsModalOpen(true);
  };

  const openEditModal = (evt: ChurchEvent) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setSubtitle(evt.subtitle || '');
    setDate(evt.date);
    setEndDate(evt.endDate || '');
    setTime(evt.time);
    setLocation(evt.location);
    setDescription(evt.description);
    setBannerUrl(evt.bannerUrl);
    setCategory(evt.category);
    setHighlight(evt.highlight);
    setRegistrationOpen(evt.registrationOpen);
    setRegistrationLimit(evt.registrationLimit);
    setGuestSpeaker(evt.guestSpeaker || '');
    setMusicalGuest(evt.musicalGuest || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        date,
        endDate: endDate.trim() || undefined,
        time: time.trim(),
        location: location.trim(),
        description: description.trim(),
        bannerUrl: bannerUrl.trim() || sampleBanners[0],
        category,
        highlight,
        registrationOpen,
        registrationLimit: registrationLimit ? Number(registrationLimit) : undefined,
        guestSpeaker: guestSpeaker.trim() || undefined,
        musicalGuest: musicalGuest.trim() || undefined
      });
    } else {
      addEvent({
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        date,
        endDate: endDate.trim() || undefined,
        time: time.trim(),
        location: location.trim(),
        description: description.trim(),
        bannerUrl: bannerUrl.trim() || sampleBanners[0],
        category,
        highlight,
        registrationOpen,
        registrationLimit: registrationLimit ? Number(registrationLimit) : undefined,
        guestSpeaker: guestSpeaker.trim() || undefined,
        musicalGuest: musicalGuest.trim() || undefined
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            Gerenciamento de Eventos, Congressos e Inscrições
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre os grandes eventos da igreja, defina o destaque da página inicial e controle as vagas.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Cadastrar Novo Evento</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-md"
          >
            {/* Banner with highlight badge */}
            <div className="relative h-44 bg-slate-950">
              <img
                src={evt.bannerUrl}
                alt={evt.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 text-amber-400 px-2 py-0.5 rounded border border-slate-700">
                  {evt.category}
                </span>
                {evt.highlight && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 fill-slate-950" />
                    Destaque
                  </span>
                )}
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg">
                <button
                  onClick={() => openEditModal(evt)}
                  className="p-1 text-slate-300 hover:text-white"
                  title="Editar Evento"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Deseja excluir o evento "${evt.title}"?`)) {
                      deleteEvent(evt.id);
                    }
                  }}
                  className="p-1 text-slate-400 hover:text-rose-400"
                  title="Excluir Evento"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-xs text-amber-400 font-semibold mb-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(evt.date + 'T00:00:00').toLocaleDateString('pt-BR')} às {evt.time}</span>
                </div>
                <h4 className="font-bold text-white text-base mb-1 line-clamp-1">{evt.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">{evt.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <strong>{evt.registeredCount || 0}</strong> inscritos
                  {evt.registrationLimit ? ` / ${evt.registrationLimit}` : ''}
                </span>
                <span className={evt.registrationOpen ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                  {evt.registrationOpen ? 'Inscrições Abertas' : 'Entrada Franca'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">
              {editingEvent ? 'Editar Evento' : 'Novo Evento da Igreja'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título do Evento *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Congresso Estadual da Família 2026"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Lema / Subtítulo</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Ex: Edificando Lares na Rocha"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    {['Congresso', 'Culto Especial', 'Vigília', 'Batismo', 'Juventude', 'Infantil', 'Casais', 'Missões'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Data Início</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Data Término (Opcional)</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Horário</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="19:00"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Preletor / Convidado</label>
                  <input
                    type="text"
                    value={guestSpeaker}
                    onChange={(e) => setGuestSpeaker(e.target.value)}
                    placeholder="Ex: Pr. Josué Gonçalves"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Louvor / Cantor</label>
                  <input
                    type="text"
                    value={musicalGuest}
                    onChange={(e) => setMusicalGuest(e.target.value)}
                    placeholder="Ex: Coral Som do Céu"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                ref={bannerInputRef}
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;
                  setIsUploadingBanner(true);
                  const res = await supabaseStorageService.uploadFile(files[0], 'events');
                  setIsUploadingBanner(false);
                  if (res.success && res.url) {
                    setBannerUrl(res.url);
                  } else {
                    alert(res.message || 'Erro ao enviar banner.');
                  }
                }}
                className="hidden"
              />

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">Banner Oficial do Evento</label>
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    disabled={isUploadingBanner}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                  >
                    {isUploadingBanner ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Enviando para o Storage...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3 h-3" />
                        <span>Upload do Computador</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {bannerUrl && (
                    <img
                      src={bannerUrl}
                      alt="Banner"
                      className="w-16 h-12 object-cover rounded-xl border border-slate-700 shrink-0"
                    />
                  )}
                  <input
                    type="url"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição Completa</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalhes da programação..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highlight}
                    onChange={(e) => setHighlight(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700"
                  />
                  <span>Destacar na Página Inicial (Contagem Regressiva)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={registrationOpen}
                    onChange={(e) => setRegistrationOpen(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700"
                  />
                  <span>Permitir Inscrições Online</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
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
                  {editingEvent ? 'Salvar Alterações' : 'Publicar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
