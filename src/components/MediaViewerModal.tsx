import React from 'react';
import { X, Play, Image as ImageIcon, Calendar, Tag } from 'lucide-react';
import { MediaItem } from '../types';

interface MediaViewerModalProps {
  item: MediaItem;
  onClose: () => void;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({ item, onClose }) => {
  // Helper to extract YouTube video ID if URL is youtube
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : null;
  };

  const embedUrl = item.type === 'video' ? getYouTubeEmbedUrl(item.url) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Top Close Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              {item.type === 'video' ? <Play className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
            </span>
            <h3 className="text-base font-bold text-white line-clamp-1">{item.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Content Display */}
        <div className="flex-1 bg-black flex items-center justify-center min-h-[320px] max-h-[65vh] overflow-hidden">
          {item.type === 'video' ? (
            embedUrl ? (
              <iframe
                src={embedUrl}
                title={item.title}
                className="w-full h-full min-h-[380px] border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={item.url}
                controls
                autoPlay
                className="w-full max-h-[65vh] object-contain"
              />
            )
          ) : (
            <img
              src={item.url}
              alt={item.title}
              className="w-full max-h-[65vh] object-contain"
            />
          )}
        </div>

        {/* Footer Details */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs sm:text-sm text-slate-300">
              {item.description || 'Registro fotográfico dos eventos e cultos da Igreja O Brasil Para Cristo.'}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR')}
              </span>
              <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {item.type === 'video' ? 'Vídeo Oficial' : 'Fotografia'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
