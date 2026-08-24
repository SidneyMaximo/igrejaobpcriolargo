import React, { useState } from 'react';
import { 
  Folder, 
  Image as ImageIcon, 
  Video, 
  Play, 
  ArrowLeft, 
  Calendar, 
  Film, 
  Eye, 
  FolderOpen
} from 'lucide-react';
import { useChurch } from '../context/ChurchContext';
import { MediaFolder, MediaItem } from '../types';
import { MediaViewerModal } from './MediaViewerModal';

export const MediaGallerySection: React.FC = () => {
  const { mediaFolders, mediaItems } = useChurch();
  const [selectedFolder, setSelectedFolder] = useState<MediaFolder | null>(null);
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [activeViewerItem, setActiveViewerItem] = useState<MediaItem | null>(null);

  // Filter items in current folder
  const currentItems = selectedFolder
    ? mediaItems.filter(item => {
        const matchFolder = item.folderId === selectedFolder.id;
        if (!matchFolder) return false;
        if (mediaTypeFilter === 'all') return true;
        return item.type === mediaTypeFilter;
      })
    : [];

  return (
    <section id="midia" className="py-20 bg-slate-50 text-slate-800 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#70b83b] block mb-1">
            Galeria & Momentos
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display uppercase mb-3">
            FOTOS E VÍDEOS DOS EVENTOS
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Reviva cultos, congressos e ações sociais organizados em álbuns da comunidade.
          </p>
        </div>

        {/* View Mode 1: All Folders List */}
        {!selectedFolder && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4 text-[#70b83b]" />
                Álbuns de Eventos ({mediaFolders.length})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mediaFolders.map((folder) => {
                const folderItemsCount = mediaItems.filter(m => m.folderId === folder.id).length;
                return (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder)}
                    className="group bg-white border border-slate-200 hover:border-[#70b83b] rounded-xl overflow-hidden text-left transition-all hover:shadow-md flex flex-col justify-between"
                  >
                    <div className="relative h-44 overflow-hidden bg-slate-100 w-full">
                      <img
                        src={folder.coverUrl}
                        alt={folder.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                      
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-bold text-slate-800 border border-slate-200 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-[#70b83b]" />
                        <span>{folderItemsCount}</span>
                      </div>

                      <div className="absolute bottom-3 left-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#70b83b] text-white px-2 py-0.5 rounded">
                          {folder.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#70b83b] transition-colors mb-1 line-clamp-1">
                          {folder.name}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                          {folder.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(folder.eventDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </span>
                        <span className="font-bold text-[#70b83b]">
                          Ver Álbum →
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* View Mode 2: Specific Folder Details & Items */}
        {selectedFolder && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Top Navigation & Actions Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedFolder(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 text-xs font-bold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar</span>
                </button>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-[#70b83b]" />
                    {selectedFolder.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedFolder.category} • {new Date(selectedFolder.eventDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* Type Filter Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setMediaTypeFilter('all')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                    mediaTypeFilter === 'all' ? 'bg-[#70b83b] text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Todos ({currentItems.length})
                </button>
                <button
                  onClick={() => setMediaTypeFilter('image')}
                  className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors ${
                    mediaTypeFilter === 'image' ? 'bg-[#70b83b] text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Fotos</span>
                </button>
                <button
                  onClick={() => setMediaTypeFilter('video')}
                  className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors ${
                    mediaTypeFilter === 'video' ? 'bg-[#70b83b] text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <Video className="w-3 h-3" />
                  <span>Vídeos</span>
                </button>
              </div>
            </div>

            {/* Media Items Grid */}
            {currentItems.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
                <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">Nenhum arquivo nesta pasta</h4>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveViewerItem(item)}
                    className="group bg-white rounded-xl border border-slate-200 overflow-hidden text-left hover:border-[#70b83b] hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={item.thumbnailUrl || item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

                      {item.type === 'video' ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-[#fbc02d] text-slate-950 flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                          </div>
                        </div>
                      ) : (
                        <div className="absolute top-2 right-2 p-1 rounded bg-white/80 text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#70b83b] transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                        <span>{new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                        <span className="capitalize text-[#70b83b] font-bold">
                          {item.type === 'video' ? 'Assistir' : 'Ver Foto'}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* Lightbox / Video Modal */}
      {activeViewerItem && (
        <MediaViewerModal
          item={activeViewerItem}
          onClose={() => setActiveViewerItem(null)}
        />
      )}
    </section>
  );
};
