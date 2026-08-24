import React, { useState } from 'react';
import { X, Check, Users, Sparkles, Phone, Mail, User, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChurchEvent } from '../types';
import { useChurch } from '../context/ChurchContext';

interface EventRegistrationModalProps {
  event: ChurchEvent;
  onClose: () => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  event,
  onClose
}) => {
  const { registerEvent } = useChurch();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isMember, setIsMember] = useState(true);
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMessage('Por favor, preencha seu nome completo e telefone WhatsApp.');
      return;
    }

    const res = registerEvent({
      eventId: event.id,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      isMember,
      notes: notes.trim()
    });

    if (res.success) {
      setIsSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore if not supported
      }
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-white max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">Inscrição Confirmada!</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Sua presença no evento <strong className="text-amber-400">{event.title}</strong> foi registrada com sucesso. Esperamos por você com muita alegria!
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md transition-all"
              >
                Concluir
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Inscrição Gratuita</span>
              </div>
              <h3 className="text-xl font-bold text-white">{event.title}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Data: {new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR')} às {event.time} • {event.location}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    WhatsApp / Telefone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 98765-4321"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    E-mail (Opcional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  id="is-member-check"
                  checked={isMember}
                  onChange={(e) => setIsMember(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-800"
                />
                <label htmlFor="is-member-check" className="text-xs text-slate-300 cursor-pointer">
                  Sou membro/frequentador da Igreja O Brasil Para Cristo
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Observações ou Necessidades Especiais (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Informações adicionais ou dúvidas para a equipe..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all"
                >
                  Confirmar Minha Inscrição
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
