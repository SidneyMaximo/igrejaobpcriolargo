import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Users, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Music, 
  BookOpen, 
  Flame, 
  Clock, 
  User, 
  AlertCircle,
  Eye,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { useChurch } from '../../context/ChurchContext';
import { ChurchDepartment } from '../../types';

export const AdminDepartmentsManager: React.FC = () => {
  const { 
    departments, 
    addDepartment, 
    updateDepartment, 
    deleteDepartment, 
    toggleDepartmentStatus 
  } = useChurch();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [leader, setLeader] = useState('');
  const [meetingSchedule, setMeetingSchedule] = useState('');
  const [colorTag, setColorTag] = useState<string>('emerald');
  const [iconName, setIconName] = useState<string>('users');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [formMsg, setFormMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const availableColors = [
    { id: 'emerald', label: 'Verde Esmeralda', bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/40' },
    { id: 'rose', label: 'Rosa / Carmim', bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/40' },
    { id: 'blue', label: 'Azul Real', bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/40' },
    { id: 'amber', label: 'Âmbar / Dourado', bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/40' },
    { id: 'purple', label: 'Roxo / Púrpura', bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/40' },
    { id: 'sky', label: 'Azul Céu', bg: 'bg-sky-500/20', text: 'text-sky-400', border: 'border-sky-500/40' },
    { id: 'indigo', label: 'Índigo / Violeta', bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/40' },
    { id: 'teal', label: 'Teal / Turquesa', bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/40' }
  ];

  const availableIcons = [
    { id: 'users', label: 'Usuários / Juventude', icon: Users },
    { id: 'heart', label: 'Coração / Mulheres', icon: Heart },
    { id: 'shield', label: 'Escudo / Homens', icon: ShieldCheck },
    { id: 'sparkles', label: 'Estrelas / Crianças', icon: Sparkles },
    { id: 'zap', label: 'Raio / Adolescentes', icon: Zap },
    { id: 'music', label: 'Música / Louvor', icon: Music },
    { id: 'book-open', label: 'Bíblia / Ensino', icon: BookOpen },
    { id: 'flame', label: 'Fogo / Oração', icon: Flame }
  ];

  const renderIcon = (iconKey?: string, className: string = 'w-5 h-5') => {
    switch (iconKey) {
      case 'heart':
        return <Heart className={className} />;
      case 'shield':
        return <ShieldCheck className={className} />;
      case 'sparkles':
        return <Sparkles className={className} />;
      case 'zap':
        return <Zap className={className} />;
      case 'music':
        return <Music className={className} />;
      case 'book-open':
        return <BookOpen className={className} />;
      case 'flame':
        return <Flame className={className} />;
      case 'users':
      default:
        return <Users className={className} />;
    }
  };

  const getColorStyles = (colorKey: string) => {
    switch (colorKey) {
      case 'rose':
        return {
          bg: 'bg-rose-500/10',
          text: 'text-rose-400',
          border: 'border-rose-500/30',
          hoverBorder: 'hover:border-rose-500/50',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
        };
      case 'blue':
        return {
          bg: 'bg-blue-500/10',
          text: 'text-blue-400',
          border: 'border-blue-500/30',
          hoverBorder: 'hover:border-blue-500/50',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
        };
      case 'amber':
        return {
          bg: 'bg-amber-500/10',
          text: 'text-amber-400',
          border: 'border-amber-500/30',
          hoverBorder: 'hover:border-amber-500/50',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500/10',
          text: 'text-purple-400',
          border: 'border-purple-500/30',
          hoverBorder: 'hover:border-purple-500/50',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
        };
      case 'sky':
        return {
          bg: 'bg-sky-500/10',
          text: 'text-sky-400',
          border: 'border-sky-500/30',
          hoverBorder: 'hover:border-sky-500/50',
          badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40'
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-500/10',
          text: 'text-indigo-400',
          border: 'border-indigo-500/30',
          hoverBorder: 'hover:border-indigo-500/50',
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
        };
      case 'teal':
        return {
          bg: 'bg-teal-500/10',
          text: 'text-teal-400',
          border: 'border-teal-500/30',
          hoverBorder: 'hover:border-teal-500/50',
          badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40'
        };
      case 'emerald':
      default:
        return {
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-400',
          border: 'border-emerald-500/30',
          hoverBorder: 'hover:border-emerald-500/50',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        };
    }
  };

  const openCreateModal = () => {
    setEditingDeptId(null);
    setCode('');
    setName('');
    setLeader('');
    setMeetingSchedule('');
    setColorTag('emerald');
    setIconName('users');
    setDescription('');
    setIsActive(true);
    setFormMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (d: ChurchDepartment) => {
    setEditingDeptId(d.id);
    setCode(d.code);
    setName(d.name);
    setLeader(d.leader || '');
    setMeetingSchedule(d.meetingSchedule || '');
    setColorTag(d.colorTag || 'emerald');
    setIconName(d.iconName || 'users');
    setDescription(d.description || '');
    setIsActive(d.isActive);
    setFormMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);

    if (!code.trim() || !name.trim()) {
      setFormMsg({ type: 'error', text: 'Por favor, preencha a sigla/código e o nome do departamento.' });
      return;
    }

    if (editingDeptId) {
      const res = updateDepartment(editingDeptId, {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        leader: leader.trim() || 'Liderança do Departamento',
        meetingSchedule: meetingSchedule.trim() || undefined,
        colorTag,
        iconName,
        description: description.trim(),
        isActive
      });

      if (res.success) {
        setIsModalOpen(false);
      } else {
        setFormMsg({ type: 'error', text: res.message });
      }
    } else {
      const res = addDepartment({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        leader: leader.trim() || 'Liderança do Departamento',
        meetingSchedule: meetingSchedule.trim() || undefined,
        colorTag,
        iconName,
        description: description.trim(),
        isActive,
        order: departments.length + 1
      });

      if (res.success) {
        setIsModalOpen(false);
      } else {
        setFormMsg({ type: 'error', text: res.message });
      }
    }
  };

  const handleDelete = (d: ChurchDepartment) => {
    if (window.confirm(`Tem certeza que deseja excluir o departamento "${d.name}" (${d.code})?`)) {
      const res = deleteDepartment(d.id);
      if (!res.success) {
        alert(res.message);
      }
    }
  };

  const filteredDepartments = departments.filter(d => {
    const matchSearch = 
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.leader && d.leader.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && d.isActive) || 
      (statusFilter === 'inactive' && !d.isActive);

    return matchSearch && matchStatus;
  });

  const activeCount = departments.filter(d => d.isActive).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            Gestão & Criação de Departamentos e Ministérios
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre novos departamentos da igreja (JUBRAC, UFEBRAC, MENBRAC, Louvor, etc.) com líderes, horários e cores personalizadas.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Criar Novo Departamento</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Total de Departamentos</span>
            <span className="text-xl font-extrabold text-white font-mono">{departments.length}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Departamentos Ativos</span>
            <span className="text-xl font-extrabold text-emerald-400 font-mono">{activeCount}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Visibilidade Pública</span>
            <span className="text-xs font-bold text-sky-300">Exibido no Site e Rodapé</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por sigla, nome ou líder..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Status:</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({departments.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'active' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Ativos ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'inactive' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Inativos ({departments.length - activeCount})
            </button>
          </div>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDepartments.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-500 text-xs">
            Nenhum departamento encontrado. Clique em &quot;Criar Novo Departamento&quot; para cadastrar.
          </div>
        ) : (
          filteredDepartments.map((d) => {
            const styles = getColorStyles(d.colorTag);

            return (
              <div 
                key={d.id}
                className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl ${
                  d.isActive ? `${styles.border} ${styles.hoverBorder}` : 'border-slate-800 opacity-60'
                }`}
              >
                <div>
                  
                  {/* Top card header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${styles.bg} ${styles.text} ${styles.border}`}>
                        {renderIcon(d.iconName, 'w-5 h-5')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${styles.badge}`}>
                            {d.code}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${d.isActive ? 'bg-emerald-400' : 'bg-rose-400'}`} title={d.isActive ? 'Ativo' : 'Inativo'} />
                        </div>
                        <h4 className="font-bold text-white text-sm mt-0.5 line-clamp-1">
                          {d.name}
                        </h4>
                      </div>
                    </div>

                    {/* Status badge */}
                    <button
                      onClick={() => toggleDepartmentStatus(d.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                        d.isActive 
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                      }`}
                      title="Clique para alternar status"
                    >
                      {d.isActive ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>

                  {/* Leader & Meeting Info */}
                  <div className="space-y-1.5 py-2.5 border-y border-slate-800/80 my-3 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-slate-400">Líder:</span>
                      <span className="font-semibold text-white truncate">{d.leader || 'Liderança'}</span>
                    </div>

                    {d.meetingSchedule && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="text-slate-400">Reuniões:</span>
                        <span className="text-slate-200 truncate">{d.meetingSchedule}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {d.description || 'Sem descrição cadastrada.'}
                  </p>

                </div>

                {/* Card Actions Footer */}
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Cadastrado em {d.createdAt || '2026'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(d)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors border border-slate-700"
                      title="Editar Departamento"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(d)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors border border-rose-500/30"
                      title="Excluir Departamento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Modal Criar / Editar Departamento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    {editingDeptId ? 'Editar Departamento' : 'Criar Novo Departamento'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Preencha as informações do departamento ministerial da igreja.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error / Feedback Message */}
            {formMsg && (
              <div className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 border ${
                formMsg.type === 'error' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formMsg.text}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sigla / Código *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: JUBRAC"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Departamento *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: JUBRAC (Juventude)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Líder / Responsável</label>
                  <input
                    type="text"
                    placeholder="Ex: Liderança JUBRAC"
                    value={leader}
                    onChange={(e) => setLeader(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Dia & Horário de Reunião</label>
                  <input
                    type="text"
                    placeholder="Ex: Sábados às 19:30"
                    value={meetingSchedule}
                    onChange={(e) => setMeetingSchedule(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ícone do Departamento</label>
                <div className="grid grid-cols-4 gap-2">
                  {availableIcons.map((ic) => {
                    const IconComp = ic.icon;
                    const isSelected = iconName === ic.id;
                    return (
                      <button
                        key={ic.id}
                        type="button"
                        onClick={() => setIconName(ic.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-semibold border transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow'
                            : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-750 hover:text-slate-200'
                        }`}
                      >
                        <IconComp className={`w-4 h-4 mb-1 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                        <span className="truncate max-w-full">{ic.label.split('/')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Tag Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tema de Cor</label>
                <div className="grid grid-cols-4 gap-2">
                  {availableColors.map((c) => {
                    const isSelected = colorTag === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setColorTag(c.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
                          isSelected
                            ? `${c.bg} ${c.text} ${c.border} font-bold shadow`
                            : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-750'
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${c.text.replace('text-', 'bg-')}`} />
                        <span className="truncate">{c.label.split('/')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição & Propósito Ministerial</label>
                <textarea
                  rows={3}
                  placeholder="Descreva a atuação, propósito e atividades deste departamento..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="dept-active-toggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="dept-active-toggle" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Departamento Ativo (visível no portal e nas programações)
                </label>
              </div>

              {/* Live Card Preview */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Pré-visualização do Departamento
                </span>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${getColorStyles(colorTag).bg} ${getColorStyles(colorTag).text} border ${getColorStyles(colorTag).border}`}>
                    {renderIcon(iconName, 'w-4 h-4')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${getColorStyles(colorTag).badge}`}>
                        {code || 'SIGLA'}
                      </span>
                      <span className="text-xs font-bold text-white">{name || 'Nome do Departamento'}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Líder: {leader || 'Liderança'} {meetingSchedule ? `• ${meetingSchedule}` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  {editingDeptId ? 'Salvar Alterações' : 'Cadastrar Departamento'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
