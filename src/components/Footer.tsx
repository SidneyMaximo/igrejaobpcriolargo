import React, { useState } from 'react';
import { 
  Church,
  Heart, 
  Lock, 
  Send, 
  ArrowUp, 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { useChurch } from '../context/ChurchContext';

interface FooterProps {
  onOpenAdminLogin: () => void;
  onNavigate: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminLogin, onNavigate }) => {
  const { churchInfo, adminSession, departments } = useChurch();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSent(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSent(false), 5000);
  };

  return (
    <footer className="bg-[#1f2229] text-slate-400 font-sans border-t border-slate-800">
      
      {/* 1. TOP MAIN FOOTER INFO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Col 1: Brand & Historic Statement */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#70b83b]/20 flex items-center justify-center text-[#70b83b] border border-[#70b83b]/40">
                <Church className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif font-bold text-white text-base tracking-wide block uppercase">
                  {churchInfo.name || 'O Brasil Para Cristo'}
                </span>
                <span className="text-[11px] text-slate-400 uppercase tracking-widest block">
                  {churchInfo.cityState || 'Rio Largo - AL'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              Uma comunidade cristã evangélica pentecostal fundada em 1956 pelo Missionário Manoel de Mello. Comprometida com o avivamento bíblico, missões nacionais e mundiais, santidade e acolhimento com amor a todas as famílias.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1 font-mono">
              <p className="text-[#70b83b]">{churchInfo.email || 'contato@obpc.org.br'}</p>
              <p>{churchInfo.phone || '(11) 3456-7890'} • {churchInfo.address || 'Av. Principal, 1000'}</p>
            </div>
          </div>

          {/* Col 2: Partners / Ministries & Newsletter */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* OUR PARTNERS / MINISTÉRIOS */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-slate-200 mb-3">
                NOSSOS DEPARTAMENTOS
              </h4>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-300">
                {departments.filter(d => d.isActive).map((dept) => (
                  <span 
                    key={dept.id} 
                    className="px-2.5 py-1 bg-slate-800 rounded border border-slate-700 hover:border-amber-400 hover:text-white transition-colors"
                  >
                    {dept.name}
                  </span>
                ))}
              </div>
            </div>

            {/* NEWSLETTER SIGN-UP (Direct match to Template) */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-slate-200 mb-2">
                BOLETIM & DEVOCIONAIS
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="flex items-center">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-[#2a2d34] border border-slate-700 text-xs px-3.5 py-2.5 rounded-l-md text-white placeholder:text-slate-500 focus:outline-none focus:border-[#70b83b]"
                />
                <button
                  type="submit"
                  className="bg-[#70b83b] hover:bg-[#61a332] text-white font-bold text-xs uppercase px-4 py-2.5 rounded-r-md transition-colors shrink-0"
                >
                  Inscrever
                </button>
              </form>
              {newsletterSent && (
                <p className="text-[11px] text-[#70b83b] mt-1.5 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  E-mail cadastrado com sucesso no boletim da igreja!
                </p>
              )}
            </div>

          </div>

          {/* Col 3: Social & Secret Pastoral Login */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-slate-200 mb-3">
                CONECTE-SE CONOSCO
              </h4>
              <div className="flex items-center gap-3 text-slate-400">
                <a 
                  href={`https://wa.me/55${churchInfo.whatsapp?.replace(/\D/g, '') || '11998765432'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#70b83b] hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
                  title="WhatsApp Pastoral"
                >
                  WA
                </a>
                <a 
                  href={churchInfo.youtubeChannelUrl || 'https://youtube.com/@obpcriolargo'} 
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#70b83b] hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
                  title="Canal do YouTube @obpcriolargo"
                >
                  YT
                </a>
                <a 
                  href={churchInfo.instagramUrl || 'https://instagram.com/obpcriolargo'} 
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#70b83b] hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
                  title="Instagram @obpcriolargo"
                >
                  IG
                </a>
              </div>
            </div>

            <div>
              <button
                id="footer-admin-login-btn"
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors py-1"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>{adminSession ? 'Painel Pastoral Ativo' : 'Acesso da Liderança & Tesouraria'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Sub-footer (Direct match to Template) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Igreja Evangélica Pentecostal O Brasil Para Cristo. Todos os direitos reservados.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[11px] text-slate-400">
              Desenvolvido por{' '}
              <a
                href="https://maximosistemas.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 transition-colors"
              >
                maximosistemas.com
              </a>
            </span>
            {/* Green Square Back-to-Top Button (Template Style) */}
            <button
              onClick={scrollToTop}
              title="Voltar ao topo"
              className="w-8 h-8 bg-[#70b83b] hover:bg-[#61a332] text-white rounded flex items-center justify-center shadow transition-all hover:scale-105 active:scale-95"
            >
              <ArrowUp className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
