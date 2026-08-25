import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  KeyRound, 
  ShieldCheck, 
  Lock, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Sparkles, 
  RefreshCw, 
  UserCheck, 
  UserX, 
  AlertCircle,
  Phone,
  Mail,
  Clock,
  Shield,
  Search
} from 'lucide-react';
import { useChurch } from '../../context/ChurchContext';
import { RoleType, SystemUser } from '../../types';

export const AdminUsersManager: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, toggleUserStatus, adminSession } = useChurch();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<RoleType>('pastor');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [formMsg, setFormMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const openCreateModal = () => {
    setEditingUserId(null);
    setName('');
    setUsername('');
    setPassword('');
    setShowPassword(false);
    setRole('secretaria');
    setEmail('');
    setPhone('');
    setIsActive(true);
    setFormMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (u: SystemUser) => {
    setEditingUserId(u.id);
    setName(u.name);
    setUsername(u.username);
    setPassword(u.password || '');
    setShowPassword(false);
    setRole(u.role);
    setEmail(u.email || '');
    setPhone(u.phone || '');
    setIsActive(u.isActive);
    setFormMsg(null);
    setIsModalOpen(true);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    setShowPassword(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);

    if (!name.trim() || !username.trim()) {
      setFormMsg({ type: 'error', text: 'Preencha o nome completo e o login de acesso.' });
      return;
    }

    if (!editingUserId && !password.trim()) {
      setFormMsg({ type: 'error', text: 'Defina uma senha de acesso para o novo usuário.' });
      return;
    }

    if (editingUserId) {
      const res = updateUser(editingUserId, {
        name: name.trim(),
        username: username.trim(),
        role,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        isActive,
        ...(password.trim() ? { password: password.trim() } : {})
      });

      if (res.success) {
        setIsModalOpen(false);
      } else {
        setFormMsg({ type: 'error', text: res.message });
      }
    } else {
      const res = addUser({
        name: name.trim(),
        username: username.trim(),
        password: password.trim(),
        role,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        isActive
      });

      if (res.success) {
        setIsModalOpen(false);
      } else {
        setFormMsg({ type: 'error', text: res.message });
      }
    }
  };

  const handleDelete = (u: SystemUser) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário "${u.name}" (${u.username})?`)) {
      const res = deleteUser(u.id);
      if (!res.success) {
        alert(res.message);
      }
    }
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const getRoleBadge = (r: RoleType) => {
    switch (r) {
      case 'pastor':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Pastor Titular</span>;
      case 'tesoureiro':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Tesouraria</span>;
      case 'secretaria':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">Secretaria & Mídia</span>;
      case 'lider':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">Líder de Ministério</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            Gestão de Usuários & Senhas de Acesso
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre líderes, tesoureiros e obreiros com senhas individuais e perfis de permissão controlados.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 text-slate-950" />
          <span>Novo Usuário / Criar Senha</span>
        </button>
      </div>

      {/* Permissions Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
            <Shield className="w-4 h-4" />
            <span>Pastor Titular</span>
          </div>
          <p className="text-[11px] text-slate-400">Acesso irrestrito a todos os módulos, financeiro, membros e configurações do banco.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
            <Shield className="w-4 h-4" />
            <span>Tesouraria</span>
          </div>
          <p className="text-[11px] text-slate-400">Lançamento de dízimos, ofertas, despesas, recibos térmicos e relatórios de assembleia.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs mb-1">
            <Shield className="w-4 h-4" />
            <span>Secretaria & Mídia</span>
          </div>
          <p className="text-[11px] text-slate-400">Gestão de horários de cultos, publicações de eventos, fotos, vídeos e pedidos de oração.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs mb-1">
            <Shield className="w-4 h-4" />
            <span>Líder de Ministério</span>
          </div>
          <p className="text-[11px] text-slate-400">Acesso a programações do ministério (ADOBRAC, UFEBRAC, Jovens) e orações.</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, login ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Perfil:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todos os Perfis ({users.length})</option>
            <option value="pastor">Pastores</option>
            <option value="tesoureiro">Tesouraria</option>
            <option value="secretaria">Secretaria & Mídia</option>
            <option value="lider">Líderes</option>
          </select>
        </div>
      </div>

      {/* Users Table / Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5 font-bold">Usuário / Nome</th>
                <th className="px-4 py-3.5 font-bold">Login de Acesso</th>
                <th className="px-4 py-3.5 font-bold">Perfil / Nível</th>
                <th className="px-4 py-3.5 font-bold">Contato</th>
                <th className="px-4 py-3.5 font-bold">Último Login</th>
                <th className="px-4 py-3.5 font-bold text-center">Status</th>
                <th className="px-5 py-3.5 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500 text-xs">
                    Nenhum usuário encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Name */}
                    <td className="px-5 py-3.5 font-semibold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0">
                          {u.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="block font-bold">{u.name}</span>
                          <span className="text-[10px] text-slate-500">Cadastrado em {u.createdAt || '2026'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Username */}
                    <td className="px-4 py-3.5 font-mono text-amber-300 font-semibold">
                      @{u.username}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3.5">
                      {getRoleBadge(u.role)}
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-0.5 text-[11px]">
                        {u.phone && (
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{u.phone}</span>
                          </div>
                        )}
                        {u.email && (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Mail className="w-3 h-3 text-slate-500" />
                            <span className="truncate max-w-[140px]">{u.email}</span>
                          </div>
                        )}
                        {!u.phone && !u.email && <span className="text-slate-600">-</span>}
                      </div>
                    </td>

                    {/* Last Login */}
                    <td className="px-4 py-3.5 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{u.lastLogin || 'Nunca acessou'}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                          u.isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                        }`}
                        title="Clique para alternar status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        <span>{u.isActive ? 'Ativo' : 'Bloqueado'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors border border-slate-700"
                          title="Editar Usuário / Trocar Senha"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(u)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors border border-rose-500/30"
                          title="Excluir Usuário"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 text-white shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    {editingUserId ? 'Editar Usuário & Senha' : 'Novo Usuário do Sistema'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Defina o login, perfil e senha de acesso ao painel da igreja.
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

            {/* Error Message */}
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Pr. Janildo Manoel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Login de Acesso (Username) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: pastor, tesoureiro"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Password Input & Generator */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{editingUserId ? 'Redefinir Senha (opcional)' : 'Senha de Acesso *'}</span>
                  </label>
                  
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Gerar Senha Forte</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={editingUserId ? 'Deixe em branco para manter a senha atual' : 'Digite a senha do usuário'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Perfil de Acesso & Nível de Permissão</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('pastor')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                      role === 'pastor'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-bold'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <span>Pastor Titular</span>
                    {role === 'pastor' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('tesoureiro')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                      role === 'tesoureiro'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 font-bold'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <span>Tesouraria</span>
                    {role === 'tesoureiro' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('secretaria')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                      role === 'secretaria'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/60 font-bold'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <span>Secretaria & Mídia</span>
                    {role === 'secretaria' && <Check className="w-3.5 h-3.5 text-sky-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('lider')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                      role === 'lider'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/60 font-bold'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <span>Líder de Ministério</span>
                    {role === 'lider' && <Check className="w-3.5 h-3.5 text-purple-400" />}
                  </button>
                </div>
              </div>

              {/* Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="usuario@obpc.org.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="user-active-toggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="user-active-toggle" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Conta Ativa (permite login imediato no sistema)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
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
                  {editingUserId ? 'Salvar Alterações' : 'Cadastrar Usuário'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
