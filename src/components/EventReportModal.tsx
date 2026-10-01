import React from 'react';
import {
  X,
  Calendar,
  MapPin,
  Users,
  HeartHandshake,
  Droplets,
  Sparkles,
  Quote,
  Printer,
  Church,
  Share2,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { ChurchEvent } from '../types';
import { useChurch } from '../context/ChurchContext';

interface EventReportModalProps {
  event: ChurchEvent;
  onClose: () => void;
}

export const EventReportModal: React.FC<EventReportModalProps> = ({ event, onClose }) => {
  const { churchInfo } = useChurch();
  const report = event.report;

  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const text = `Confira o relatório do evento "${event.title}" na ${churchInfo.name}: ${report.summary}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Relatório: ${event.title}`,
          text: text,
          url: window.location.href
        });
      } catch {
        // User cancelled or not supported
      }
    } else {
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      alert('Resumo do relatório copiado para a área de transferência!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white text-slate-800 rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <img 
              src={churchInfo.logoWhiteUrl || churchInfo.logoUrl || "/obpc-logo-white.svg"} 
              alt="Logo" 
              className="h-8 w-auto object-contain" 
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#70b83b] block">
                {churchInfo.name}
              </span>
              <h3 className="text-sm font-bold text-white">Relatório Oficial de Atividades do Evento</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Compartilhar"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Imprimir Relatório"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* Banner & Title Section */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white min-h-[160px] flex flex-col justify-end p-6">
            <img
              src={event.bannerUrl}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
            
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#70b83b] text-white px-2.5 py-0.5 rounded shadow">
                  {event.category}
                </span>
                <span className="text-[10px] font-semibold bg-white/20 text-white px-2.5 py-0.5 rounded backdrop-blur-sm">
                  Evento Concluído
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-2">
                {event.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#70b83b]" />
                  {new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                  {event.endDate && ` a ${new Date(event.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}`}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#70b83b]" />
                  {event.location}
                </span>
              </div>
            </div>
          </div>

          {/* Impact Stats Cards (If filled) */}
          {(report.conversionsCount || report.attendeesCount || report.baptismsCount) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {report.attendeesCount !== undefined && report.attendeesCount > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                  <div className="w-8 h-8 mx-auto rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mb-1">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-extrabold text-slate-900 block font-display">
                    {report.attendeesCount}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Público Presente
                  </span>
                </div>
              )}

              {report.conversionsCount !== undefined && report.conversionsCount > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center">
                  <div className="w-8 h-8 mx-auto rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mb-1">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-extrabold text-rose-600 block font-display">
                    {report.conversionsCount}
                  </span>
                  <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
                    Vidas p/ Cristo / Decisões
                  </span>
                </div>
              )}

              {report.baptismsCount !== undefined && report.baptismsCount > 0 && (
                <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4 text-center">
                  <div className="w-8 h-8 mx-auto rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center mb-1">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-extrabold text-cyan-700 block font-display">
                    {report.baptismsCount}
                  </span>
                  <span className="text-[11px] font-bold text-cyan-900 uppercase tracking-wider">
                    Batismos Realizados
                  </span>
                </div>
              )}

            </div>
          )}

          {/* Main Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#70b83b] mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>O Que Aconteceu no Evento</span>
            </h4>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {report.summary}
            </p>
          </div>

          {/* Highlights */}
          {report.highlights && report.highlights.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Momentos Marcantes & Destaques</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {report.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#70b83b] shrink-0 mt-0.5" />
                    <span className="font-medium leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Featured Testimony */}
          {report.testimony && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6 relative">
              <Quote className="w-8 h-8 text-amber-300 absolute top-4 right-4 opacity-50" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
                Testemunho de Impacto
              </h4>
              <p className="text-sm italic text-amber-950 leading-relaxed">
                "{report.testimony}"
              </p>
            </div>
          )}

          {/* Photos Gallery */}
          {report.photos && report.photos.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                Registros Fotográficos
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {report.photos.map((photo, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 group">
                    <img
                      src={photo}
                      alt={`Registro do evento ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Author & Verification Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              <strong>Relatado por:</strong> {report.authorName || 'Corpo Pastoral OBPC'}
            </div>
            {report.reportDate && (
              <div>
                <strong>Data de Registro:</strong> {new Date(report.reportDate + 'T00:00:00').toLocaleDateString('pt-BR')}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Fechar Relatório
          </button>
        </div>

      </div>
    </div>
  );
};
