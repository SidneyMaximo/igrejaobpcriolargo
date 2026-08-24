import React, { useState, useRef } from 'react';
import { 
  Folder, 
  Plus, 
  Image as ImageIcon, 
  Video, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  Play, 
  Calendar, 
  X, 
  Sparkles, 
  UploadCloud, 
  Eye, 
  CheckCircle2, 
  FolderPlus,
  Upload,
  RefreshCw,
  Layers,
  FileImage,
  AlertCircle,
  Database
} from 'lucide-react';
import { useChurch } from '../../context/ChurchContext';
import { MediaFolder, MediaItem } from '../../types';
import { supabaseStorageService } from '../../lib/supabase';

export const AdminMediaManager: React.FC = () => {
  const { 
    mediaFolders, 
    mediaItems, 
    addMediaFolder, 
    updateMediaFolder, 
    deleteMediaFolder,
    addMediaItem,
    updateMediaItem,
    deleteMediaItem
  } = useChurch();

  const [activeFolder, setActiveFolder] = useState<MediaFolder | null>(null);

  // Folder modal
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<MediaFolder | null>(null);
  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');
  const [folderCategory, setFolderCategory] = useState<MediaFolder['category']>('Cultos e Celebrações');
  const [folderCoverUrl, setFolderCoverUrl] = useState('');
  const [folderEventDate, setFolderEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Media Item modal
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [itemTitle, setItemTitle] = useState('');
  const [itemType, setItemType] = useState<'image' | 'video'>('image');
  const [itemUrl, setItemUrl] = useState('');
  const [itemThumbUrl, setItemThumbUrl] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemFeatured, setItemFeatured] = useState(false);
  const [isUploadingItem, setIsUploadingItem] = useState(false);

  // Batch Multi-Upload
  const [isBatchUploading, setIsBatchUploading] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ total: number; done: number }>({ total: 0, done: 0 });
  const batchInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const itemFileInputRef = useRef<HTMLInputElement>(null);

  const sampleCoverImages = [
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519744346861-a590c2941328?auto=format&fit=crop&w=800&q=80'
  ];

  // Folder Actions
  const openNewFolderModal = () => {
    setEditingFolder(null);
    setFolderName('');
    setFolderDescription('');
    setFolderCategory('Cultos e Celebrações');
    setFolderCoverUrl(sampleCoverImages[0]);
    setFolderEventDate(new Date().toISOString().split('T')[0]);
    setIsFolderModalOpen(true);
  };

  const openEditFolderModal = (folder: MediaFolder) => {
    setEditingFolder(folder);
    setFolderName(folder.name);
    setFolderDescription(folder.description);
    setFolderCategory(folder.category);
    setFolderCoverUrl(folder.coverUrl);
    setFolderEventDate(folder.eventDate);
    setIsFolderModalOpen(true);
  };

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingCover(true);
    const file = files[0];
    const res = await supabaseStorageService.uploadFile(file, 'covers');
    setIsUploadingCover(false);

    if (res.success && res.url) {
      setFolderCoverUrl(res.url);
    } else {
      alert(res.message || 'Erro ao enviar capa.');
    }
  };

  const handleFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    if (editingFolder) {
      updateMediaFolder(editingFolder.id, {
        name: folderName.trim(),
        description: folderDescription.trim(),
        category: folderCategory,
        coverUrl: folderCoverUrl.trim() || sampleCoverImages[0],
        eventDate: folderEventDate
      });
      if (activeFolder?.id === editingFolder.id) {
        setActiveFolder(prev => prev ? { ...prev, name: folderName, description: folderDescription } : null);
      }
    } else {
      addMediaFolder({
        name: folderName.trim(),
        description: folderDescription.trim(),
        category: folderCategory,
        coverUrl: folderCoverUrl.trim() || sampleCoverImages[0],
        eventDate: folderEventDate
      });
    }
    setIsFolderModalOpen(false);
  };

  // Media Item Actions
  const openNewMediaModal = () => {
    if (!activeFolder) return;
    setEditingItem(null);
    setItemTitle('');
    setItemType('image');
    setItemUrl('');
    setItemThumbUrl('');
    setItemDescription('');
    setItemFeatured(false);
    setIsMediaModalOpen(true);
  };

  const openEditMediaModal = (item: MediaItem) => {
    setEditingItem(item);
    setItemTitle(item.title);
    setItemType(item.type);
    setItemUrl(item.url);
    setItemThumbUrl(item.thumbnailUrl);
    setItemDescription(item.description || '');
    setItemFeatured(item.featured);
    setIsMediaModalOpen(true);
  };

  const handleSingleItemFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingItem(true);
    const file = files[0];
    const res = await supabaseStorageService.uploadFile(file, activeFolder ? `folders/${activeFolder.id}` : 'photos');
    setIsUploadingItem(false);

    if (res.success && res.url) {
      setItemUrl(res.url);
      if (!itemTitle) {
        const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setItemTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
      }
    } else {
      alert(res.message || 'Erro ao enviar foto para o storage.');
    }
  };

  // Multi-upload in current folder
  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeFolder) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files) as File[];
    setIsBatchUploading(true);
    setBatchProgress({ total: fileList.length, done: 0 });

    let doneCount = 0;
    for (const file of fileList) {
      const res = await supabaseStorageService.uploadFile(file, `folders/${activeFolder.id}`);
      if (res.success && res.url) {
        const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        addMediaItem({
          folderId: activeFolder.id,
          title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
          type: 'image',
          url: res.url,
          thumbnailUrl: res.url,
          description: `Foto do evento ${activeFolder.name}`,
          date: activeFolder.eventDate || new Date().toISOString().split('T')[0],
          featured: false
        });
      }
      doneCount++;
      setBatchProgress({ total: fileList.length, done: doneCount });
    }

    setIsBatchUploading(false);
    if (batchInputRef.current) batchInputRef.current.value = '';
  };

  const handleMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim() || !itemUrl.trim() || !activeFolder) return;

    const finalThumb = itemThumbUrl.trim() || (itemType === 'video' 
      ? 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80' 
      : itemUrl.trim());

    if (editingItem) {
      updateMediaItem(editingItem.id, {
        title: itemTitle.trim(),
        type: itemType,
        url: itemUrl.trim(),
        thumbnailUrl: finalThumb,
        description: itemDescription.trim(),
        featured: itemFeatured
      });
    } else {
      addMediaItem({
        folderId: activeFolder.id,
        title: itemTitle.trim(),
        type: itemType,
        url: itemUrl.trim(),
        thumbnailUrl: finalThumb,
        description: itemDescription.trim(),
        date: activeFolder.eventDate || new Date().toISOString().split('T')[0],
        featured: itemFeatured
      });
    }

    setIsMediaModalOpen(false);
  };

  const currentFolderItems = activeFolder
    ? mediaItems.filter(m => m.folderId === activeFolder.id)
    : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Hidden batch file input */}
      <input
        type="file"
        multiple
        accept="image/*"
        ref={batchInputRef}
        onChange={handleBatchUpload}
        className="hidden"
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            Galeria de Fotos & Supabase Storage
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Armazene fotos em alta definição diretamente no bucket seguro <span className="font-mono text-amber-300">obpc-media</span> do Supabase.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {activeFolder ? (
            <>
              <button
                onClick={() => batchInputRef.current?.click()}
                disabled={isBatchUploading}
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all disabled:opacity-50"
                title="Fazer upload de várias fotos de uma vez"
              >
                {isBatchUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Enviando ({batchProgress.done}/{batchProgress.total})...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Upload em Lote (Várias Fotos)</span>
                  </>
                )}
              </button>

              <button
                onClick={openNewMediaModal}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span>Nova Foto / Vídeo</span>
              </button>
            </>
          ) : (
            <button
              onClick={openNewFolderModal}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all"
            >
              <FolderPlus className="w-4 h-4 text-slate-950" />
              <span>Criar Nova Pasta / Álbum</span>
            </button>
          )}
        </div>
      </div>

      {/* Main View Mode 1: Folders List */}
      {!activeFolder && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mediaFolders.map((folder) => {
            const count = mediaItems.filter(m => m.folderId === folder.id).length;
            return (
              <div
                key={folder.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between group hover:border-slate-700 transition-all"
              >
                <div className="relative h-44 bg-slate-950 overflow-hidden">
                  <img
                    src={folder.coverUrl}
                    alt={folder.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 text-amber-400 px-2 py-0.5 rounded border border-slate-700">
                    {folder.category}
                  </span>

                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg">
                    <button
                      onClick={() => openEditFolderModal(folder)}
                      className="p-1 text-slate-300 hover:text-white"
                      title="Editar Pasta"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Deseja excluir a pasta "${folder.name}" e todas as suas ${count} mídias?`)) {
                          deleteMediaFolder(folder.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-400"
                      title="Excluir Pasta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base mb-1 line-clamp-1">{folder.name}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">{folder.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      <strong>{count}</strong> {count === 1 ? 'arquivo' : 'arquivos'}
                    </span>

                    <button
                      onClick={() => setActiveFolder(folder)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
                    >
                      <span>Abrir Pasta</span>
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main View Mode 2: Items inside selected folder */}
      {activeFolder && (
        <div className="space-y-6">
          
          {/* Breadcrumb / Back button */}
          <div className="flex items-center justify-between bg-slate-900/70 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveFolder(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Voltar para todas as pastas"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">
                  {activeFolder.category} • {activeFolder.eventDate}
                </span>
                <h4 className="text-lg font-bold text-white">{activeFolder.name}</h4>
              </div>
            </div>

            <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-semibold">
              {currentFolderItems.length} {currentFolderItems.length === 1 ? 'mídia' : 'mídias'}
            </span>
          </div>

          {/* Media Items Grid */}
          {currentFolderItems.length === 0 ? (
            <div className="bg-slate-900 border border-dashed border-slate-800 rounded-3xl p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h5 className="font-bold text-white text-base">Esta pasta ainda não possui fotos ou vídeos</h5>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-5">
                Faça o upload de fotos do seu computador ou celular para salvar direto no Supabase Storage.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => batchInputRef.current?.click()}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload de Várias Fotos</span>
                </button>
                <button
                  onClick={openNewMediaModal}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Foto Individual ou Vídeo</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentFolderItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-amber-400/40 transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-square bg-slate-950 overflow-hidden">
                    {item.type === 'video' ? (
                      <div className="w-full h-full relative">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                          <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow">
                            <Play className="w-4 h-4 ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    )}

                    {/* Storage Badge if in supabase */}
                    {item.url.includes('supabase.co') && (
                      <span className="absolute bottom-2 left-2 text-[9px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Database className="w-2.5 h-2.5" />
                        <span>Storage</span>
                      </span>
                    )}

                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/90 p-1 rounded-lg">
                      <button
                        onClick={() => openEditMediaModal(item)}
                        className="p-1 text-slate-300 hover:text-white"
                        title="Editar Detalhes"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Deseja excluir "${item.title}"?`)) {
                            deleteMediaItem(item.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-400"
                        title="Excluir Foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5">
                    <p className="font-bold text-white text-xs truncate" title={item.title}>
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Modal 1: Folder Create/Edit */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl">
            <button
              onClick={() => setIsFolderModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">
              {editingFolder ? 'Editar Pasta de Evento' : 'Nova Pasta de Mídia'}
            </h3>

            <input
              type="file"
              accept="image/*"
              ref={coverInputRef}
              onChange={handleCoverFileUpload}
              className="hidden"
            />

            <form onSubmit={handleFolderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Álbum / Pasta *</label>
                <input
                  type="text"
                  required
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Ex: Congresso de Jovens 2026"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria</label>
                  <select
                    value={folderCategory}
                    onChange={(e) => setFolderCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    {['Cultos e Celebrações', 'Congressos e Conferências', 'Ação Social', 'Juventude e Crianças', 'Batismos', 'Obras e Reformas'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Data do Evento</label>
                  <input
                    type="date"
                    required
                    value={folderEventDate}
                    onChange={(e) => setFolderEventDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Cover Photo with Supabase Storage Uploader */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Foto de Capa da Pasta</span>
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={isUploadingCover}
                    className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
                  >
                    {isUploadingCover ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Enviando para o Storage...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3 h-3" />
                        <span>Fazer Upload do Computador</span>
                      </>
                    )}
                  </button>
                </label>

                <div className="flex gap-3 items-center">
                  {folderCoverUrl && (
                    <img
                      src={folderCoverUrl}
                      alt="Capa"
                      className="w-16 h-12 object-cover rounded-xl border border-slate-700 shrink-0"
                    />
                  )}
                  <input
                    type="url"
                    value={folderCoverUrl}
                    onChange={(e) => setFolderCoverUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição Breve</label>
                <textarea
                  rows={2}
                  value={folderDescription}
                  onChange={(e) => setFolderDescription(e.target.value)}
                  placeholder="Ex: Registro dos 3 dias de congresso..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow"
                >
                  {editingFolder ? 'Salvar Alterações' : 'Criar Pasta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Media Item Create/Edit */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl">
            <button
              onClick={() => setIsMediaModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">
              {editingItem ? 'Editar Arquivo de Mídia' : 'Novo Arquivo no Álbum'}
            </h3>

            <input
              type="file"
              accept="image/*"
              ref={itemFileInputRef}
              onChange={handleSingleItemFileUpload}
              className="hidden"
            />

            <form onSubmit={handleMediaSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título da Foto ou Vídeo *</label>
                <input
                  type="text"
                  required
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder="Ex: Ministração de Abertura"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Arquivo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setItemType('image')}
                    className={`py-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 ${
                      itemType === 'image'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Fotografia</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setItemType('video')}
                    className={`py-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 ${
                      itemType === 'video'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Vídeo (YouTube/MP4)</span>
                  </button>
                </div>
              </div>

              {/* Upload to Supabase Storage Button for Images */}
              {itemType === 'image' && (
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload direto para o Supabase Storage</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => itemFileInputRef.current?.click()}
                      disabled={isUploadingItem}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isUploadingItem ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3 h-3" />
                          <span>Escolher Foto do Computador</span>
                        </>
                      )}
                    </button>
                  </div>

                  {itemUrl && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={itemUrl}
                        alt="Prévia"
                        className="w-14 h-14 object-cover rounded-xl border border-slate-700 shrink-0"
                      />
                      <div className="text-[11px] text-slate-400 truncate">
                        <span className="text-emerald-400 font-bold block flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Foto carregada
                        </span>
                        <span className="font-mono truncate block text-[10px]">{itemUrl}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {itemType === 'video' ? 'Link do Vídeo (YouTube ou MP4) *' : 'Ou Cole a URL da Imagem *'}
                </label>
                <input
                  type="url"
                  required
                  value={itemUrl}
                  onChange={(e) => setItemUrl(e.target.value)}
                  placeholder={itemType === 'video' ? 'https://www.youtube.com/watch?v=...' : 'https://...'}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Legenda / Descrição da Foto</label>
                <input
                  type="text"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="Ex: Momento de louvor com toda a congregação"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow"
                >
                  {editingItem ? 'Salvar Alterações' : 'Salvar Mídia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
