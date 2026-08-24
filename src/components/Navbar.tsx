import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Search, 
  Heart, 
  Lock, 
  Phone, 
  MapPin, 
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useChurch } from '../context/ChurchContext';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdminLogin: () => void;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onOpenAdminLogin,
  activeSection = 'inicio',
  setActiveSection
}) => {
  const { churchInfo, adminSession } = useChurch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'inicio', label: 'INÍCIO' },
    { id: 'historia', label: 'SOBRE NÓS' },
    { id: 'cultos', label: 'CULTOS & HORÁRIOS' },
    { id: 'eventos', label: 'EVENTOS' },
    { id: 'midia', label: 'GALERIA' },
    { id: 'oracao', label: 'ORAÇÃO' },
    { id: 'contribuir', label: 'DÍZIMOS (PIX)' },
    { id: 'contato', label: 'CONTATO' }
  ];

  const handleLinkClick = (id: string) => {
    if (setActiveSection) {
      setActiveSection(id);
    }
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase();
    if (query.includes('pix') || query.includes('dizimo') || query.includes('oferta')) {
      handleLinkClick('contribuir');
    } else if (query.includes('culto') || query.includes('horario') || query.includes('domingo')) {
      handleLinkClick('cultos');
    } else if (query.includes('oracao') || query.includes('pastor') || query.includes('pedido')) {
      handleLinkClick('oracao');
    } else if (query.includes('historia') || query.includes('fundador') || query.includes('mello')) {
      handleLinkClick('historia');
    } else if (query.includes('evento') || query.includes('congresso')) {
      handleLinkClick('eventos');
    } else if (query.includes('foto') || query.includes('video') || query.includes('midia')) {
      handleLinkClick('midia');
    } else {
      handleLinkClick('historia');
    }
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header 
      id="main-navbar" 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2 border-b border-slate-200' 
          : 'bg-white/95 backdrop-blur-sm py-3.5 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Church Logo */}
        <button 
          id="nav-brand-btn"
          onClick={() => handleLinkClick('inicio')} 
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <img 
            src="/obpc-logo.svg" 
            alt="Igreja O Brasil Para Cristo" 
            className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </button>

        {/* Desktop Nav Links (Clean Uppercase Template Style) */}
        <nav className="hidden xl:flex items-center gap-5 text-[12px] font-bold tracking-wider text-slate-700">
          {navLinks.map((link) => (
            <button
              key={link.id}
              id={`nav-link-${link.id}`}
              onClick={() => handleLinkClick(link.id)}
              className={`transition-colors uppercase pb-1 relative hover:text-[#70b83b] ${
                activeSection === link.id
                  ? 'text-[#70b83b] font-extrabold border-b-2 border-[#70b83b]'
                  : 'text-slate-700'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Search & Actions */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Search trigger */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  placeholder="Buscar culto, história, PIX..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-48 sm:w-60 px-3 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded-full focus:outline-none focus:border-[#70b83b] text-slate-800"
                />
                <button 
                  type="button" 
                  onClick={() => setSearchOpen(false)}
                  className="ml-1.5 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                title="Pesquisar no portal"
                className="p-2 text-slate-600 hover:text-[#70b83b] transition-colors rounded-full hover:bg-slate-100"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Donate CTA */}
          <button
            id="nav-quick-give-btn"
            onClick={() => handleLinkClick('contribuir')}
            className="flex items-center gap-1.5 bg-[#70b83b] hover:bg-[#61a332] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>Contribuir PIX</span>
          </button>

          {/* Secret Pastoral / Admin Entrance */}
          <button
            id="nav-admin-trigger-btn"
            onClick={onOpenAdminLogin}
            title={adminSession ? `Painel Pastoral Ativo (${adminSession.role})` : 'Acesso Pastoral & Tesouraria'}
            className={`p-2 rounded-full text-xs font-medium transition-all ${
              adminSession
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex xl:hidden items-center gap-2">
          <button
            onClick={() => handleLinkClick('contribuir')}
            className="bg-[#70b83b] text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase"
          >
            PIX
          </button>

          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                  activeSection === link.id
                    ? 'bg-[#70b83b]/10 text-[#70b83b] font-extrabold border-l-4 border-[#70b83b]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => handleLinkClick('contribuir')}
              className="w-full flex items-center justify-center gap-2 bg-[#70b83b] text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider shadow-sm"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Dízimos & Ofertas PIX</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminLogin();
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white text-xs py-2.5 rounded-xl font-bold"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{adminSession ? 'Painel Pastoral Ativo' : 'Área da Liderança'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
