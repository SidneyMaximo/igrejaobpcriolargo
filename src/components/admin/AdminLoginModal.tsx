import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  KeyRound, 
  ShieldAlert, 
  Check, 
  UserCheck, 
  Sparkles, 
  ShieldCheck, 
  Church,
  User,
  Eye,
  EyeOff
} from 'lucide-react';
import { useChurch } from '../../context/ChurchContext';
import { RoleType } from '../../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { loginAdmin, users } = useChurch();
  const [loginMode, setLoginMode] = useState<'username' | 'pin'>('username');
  
  // Fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pin, setPin] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleType>('pastor');
  const [customName, setCustomName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (loginMode === 'username') {
      if (!username.trim() || !password.trim()) {
        setErrorMsg('Preencha seu usuário e senha.');
        return;
      }

      const ok = loginAdmin(password, undefined, undefined, username);
      if (ok) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg('Usuário ou senha incorretos. Verifique suas credenciais.');
      }
    } else {
      if (!pin.trim()) {
        setErrorMsg('Digite o PIN de acesso.');
        return;
      }

      const ok = loginAdmin(pin, selectedRole, customName || undefined);
      if (ok) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg('PIN incorreto. Tente "1234", "obpc2026" ou o PIN pastoral.');
      }
    }
  };

  const fillQuickUser = (userLogin: string, pass: string) => {
    setLoginMode('username');
    setUsername(userLogin);
    setPassword(pass);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 p-0.5 mx-auto mb-3 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white">Painel da Liderança & CRM</h3>
          <p className="text-xs text-slate-400 mt-1">
            Igreja O Brasil Para Cristo • Autenticação de Usuários
          </p>
        </div>

        {/* Login Mode Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-4">
          <button
            type="button"
            onClick={() => { setLoginMode('username'); setErrorMsg(''); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              loginMode === 'username'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Usuário & Senha
          </button>
          <button
            type="button"
            onClick={() => { setLoginMode('pin'); setErrorMsg(''); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              loginMode === 'pin'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            PIN Master
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          {loginMode === 'username' ? (
            <>
              {/* Username Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Login de Usuário
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ex: pastor, tesouraria, secretaria"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Senha de Acesso
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
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
            </>
          ) : (
            <>
              {/* Role selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Selecione seu Perfil de Acesso
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('pastor')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      selectedRole === 'pastor'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    Pastor Titular
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('tesoureiro')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      selectedRole === 'tesoureiro'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    Tesouraria
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('secretaria')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      selectedRole === 'secretaria'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    Mídia / Sec.
                  </button>
                </div>
              </div>

              {/* Password / PIN input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  PIN Master
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Digite o PIN master (ex: 1234)..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>Entrar no Painel Seguro</span>
            </button>
          </div>

          {/* Quick preset login for fast testing */}
          <div className="pt-3 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-2 font-medium text-center">
              Contas Rápidas Cadastradas:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => fillQuickUser('pastor', '1234')}
                className="text-[10px] bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-amber-300 px-2.5 py-1 rounded-md border border-slate-700 transition-colors"
              >
                Pr. Carlos (@pastor)
              </button>
              <button
                type="button"
                onClick={() => fillQuickUser('tesouraria', '1234')}
                className="text-[10px] bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-amber-300 px-2.5 py-1 rounded-md border border-slate-700 transition-colors"
              >
                Tesouraria (@tesouraria)
              </button>
              <button
                type="button"
                onClick={() => fillQuickUser('secretaria', '1234')}
                className="text-[10px] bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-amber-300 px-2.5 py-1 rounded-md border border-slate-700 transition-colors"
              >
                Secretaria (@secretaria)
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
