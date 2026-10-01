import React, { useState, useRef } from 'react';
import {
  X,
  FileText,
  Users,
  HeartHandshake,
  Droplets,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  Plus,
  Trash2,
  CheckCircle2,
  Printer,
  Upload,
  RefreshCw,
  Quote,
  Flame,
  FileCheck
} from 'lucide-react';
import { ChurchEvent, EventReport } from '../../types';
import { useChurch } from '../../context/ChurchContext';
import { supabaseStorageService } from '../../lib/supabase';

interface AdminEventReportModalProps {
  event: ChurchEvent;
  onClose: () => void;
}

export const AdminEventReportModal: React.FC<AdminEventReportModalProps> = ({ event, onClose }) => {
  const { saveEventReport, deleteEventReport, adminSession } = useChurch();

  const existingReport = event.report;

  const [summary, setSummary] = useState(existingReport?.summary || '');
  const [attendeesCount, setAttendeesCount] = useState<number | undefined>(
    existingReport?.attendeesCount ?? (event.registeredCount || undefined)
  );
  const [conversionsCount, setConversionsCount] = useState<number | undefined>(
    existingReport?.conversionsCount ?? undefined
  );
  const [baptismsCount, setBaptismsCount] = useState<number | undefined>(
    existingReport?.baptismsCount ?? undefined
  );
  const [highlights, setHighlights] = useState<string[]>(existingReport?.highlights || []);
  const [newHighlight, setNewHighlight] = useState('');
  const [testimony, setTestimony] = useState(existingReport?.testimony || '');
  const [authorName, setAuthorName] = useState(
    existingReport?.authorName || adminSession?.username || 'Pr. Janildo Manoel'
  );
  const [reportDate, setReportDate] = useState(
    existingReport?.reportDate || new Date().toISOString().split('T')[0]
  );
  const [photos, setPhotos] = useState<string[]>(existingReport?.photos || []);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddHighlight = (text?: string) => {
    const valueToAdd = (text || newHighlight).trim();
    if (!valueToAdd) return;
    if (!highlights.includes(valueToAdd)) {
      setHighlights(prev => [...prev, valueToAdd]);
    }
    setNewHighlight('');
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddPhotoUrl = () => {
    if (!newPhotoUrl.trim()) return;
    setPhotos(prev => [...prev, newPhotoUrl.trim()]);
    setNewPhotoUrl('');
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhoto(true);
    for (let i = 0; i < files.length; i++) {
      const res = await supabaseStorageService.uploadFile(files[i], 'events');
      if (res.success && res.url) {
        setPhotos(prev => [...prev, res.url!]);
      } else {
        alert(res.message || 'Erro ao enviar foto.');
      }
    }
    setIsUploadingPhoto(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleApplyTemplate = () => {
    setSummary(
      `O evento "${event.title}" foi realizado com grande mover do Espírito Santo, reunindo a igreja e a comunidade em uma atmosfera de adoração, comunhão e edificação pela Palavra de Deus. As famílias foram ricamente abençoadas e a glória de Deus se manifestou com poder.`
    );
    if (highlights.length === 0) {
      setHighlights([
        'Forte presença de Deus e ministração profunda da Palavra',
        'Comunhão abençoada entre os irmãos e visitantes da comunidade',
        'Momento especial de clamor e intercessão pelas famílias',
        'Testemunhos de gratidão e vidas impactadas'
      ]);
    }
    if (!testimony) {
      setTestimony('Visitantes e membros testemunharam a renovação espiritual e o carinho no acolhimento.');
    }
    if (!conversionsCount) setConversionsCount(3);
    if (!attendeesCount) setAttendeesCount(150);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) {
      alert('Por favor, informe um breve resumo do que aconteceu no evento.');
      return;
    }

    const reportData: EventReport = {
      summary: summary.trim(),
      attendeesCount: attendeesCount ? Number(attendeesCount) : undefined,
      conversionsCount: conversionsCount ? Number(conversionsCount) : undefined,
      baptismsCount: baptismsCount ? Number(baptismsCount) : undefined,
      highlights: highlights.length > 0 ? highlights : undefined,
      testimony: testimony.trim() || undefined,
      authorName: authorName.trim() || undefined,
      reportDate: reportDate || undefined,
      photos: photos.length > 0 ? photos : undefined
    };

    saveEventReport(event.id, reportData);
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Deseja realmente remover o relatório deste evento?')) {
      deleteEventReport(event.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 text-slate-950">
            <FileCheck className="w-6 h-6" />
          </div>
          <div className="flex-1 pr-6">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                Relatório Pós-Evento
              </span>
              {existingReport ? (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Publicado
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                  Novo Relatório
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-white leading-tight">
              {event.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Realizado em {new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR')} • {event.location}</span>
            </p>
          </div>
        </div>

        {/* Quick Suggestion Button */}
        {!summary && (
          <div className="mb-6 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Deseja preencher rapidamente com um modelo padrão de relatório?</span>
            </div>
            <button
              type="button"
              onClick={handleApplyTemplate}
              className="text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-xl shrink-0 transition-colors"
            >
              Usar Modelo Padrão
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Summary */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Breve Relatório / O que aconteceu no Evento *</span>
            </label>
            <textarea
              required
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Descreva como foi o evento, as ministrações da Palavra, louvores, impacto espiritual, acolhimento e o mover de Deus..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Spiritual & Attendance Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-3.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>Público Presente (Estimado)</span>
              </label>
              <input
                type="number"
                min={0}
                value={attendeesCount ?? ''}
                onChange={(e) => setAttendeesCount(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 350"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-3.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
                <span>Decisões / Vidas p/ Cristo</span>
              </label>
              <input
                type="number"
                min={0}
                value={conversionsCount ?? ''}
                onChange={(e) => setConversionsCount(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 12"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-3.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>Batismos Realizados</span>
              </label>
              <input
                type="number"
                min={0}
                value={baptismsCount ?? ''}
                onChange={(e) => setBaptismsCount(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 8 (se houver)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

          </div>

          {/* Highlights */}
          <div className="bg-slate-800/50 border border-slate-700/70 rounded-2xl p-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Destaques & Momentos Marcantes</span>
            </label>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddHighlight();
                  }
                }}
                placeholder="Ex: Entrega de cestas básicas, clamor especial pelos enfermos..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => handleAddHighlight()}
                className="inline-flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar</span>
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {[
                'Ministração com unção e autoridade',
                'Decisões e reconciliações',
                'Batismo no Espírito Santo',
                'Ação social e doações entregues',
                'Santa Ceia de comunhão'
              ].map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => handleAddHighlight(sug)}
                  className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/80 transition-colors"
                >
                  + {sug}
                </button>
              ))}
            </div>

            {/* List of active highlights */}
            {highlights.length > 0 ? (
              <div className="space-y-1.5">
                {highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-slate-900/80 border border-slate-700/60 px-3 py-2 rounded-xl text-xs text-slate-200"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      {item}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(idx)}
                      className="text-slate-400 hover:text-rose-400 p-1"
                      title="Remover destaque"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic">Nenhum destaque adicionado ainda.</p>
            )}
          </div>

          {/* Featured Testimony */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-amber-400" />
              <span>Testemunho ou Relato de Milagre de Destaque (Opcional)</span>
            </label>
            <textarea
              rows={2}
              value={testimony}
              onChange={(e) => setTestimony(e.target.value)}
              placeholder="Ex: Uma irmã relatou que recebeu cura durante a oração de encerramento..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all resize-none"
            />
          </div>

          {/* Author & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Relatado por / Responsável
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Pr. Janildo Manoel"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Data do Relatório
              </label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Photos Attachment */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Fotos do Pós-Evento ({photos.length})</span>
              </label>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold"
              >
                {isUploadingPhoto ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Enviando fotos...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3 h-3" />
                    <span>Upload de Foto</span>
                  </>
                )}
              </button>
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* URL input fallback */}
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="Ou cole o link de uma imagem (https://...)"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleAddPhotoUrl}
                className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1.5 rounded-xl transition-colors"
              >
                Adicionar Link
              </button>
            </div>

            {/* Photos Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
                {photos.map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden group border border-slate-700">
                    <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 p-1 bg-rose-600/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remover foto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              {existingReport && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir Relatório</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>Salvar & Publicar Relatório</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
