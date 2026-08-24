import React, { useState } from 'react';
import { RefreshCw, Quote } from 'lucide-react';
import { DAILY_VERSES } from '../data/seedData';

export const DailyVerseBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextVerse = () => {
    setCurrentIndex((prev) => (prev + 1) % DAILY_VERSES.length);
  };

  const current = DAILY_VERSES[currentIndex];

  return (
    <div className="bg-white border-y border-slate-200 py-6 px-4 relative">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#70b83b] shrink-0 mt-0.5">
            <Quote className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm sm:text-base text-slate-800 font-serif-title italic leading-relaxed">
              "{current.verse}"
            </p>
            <span className="text-xs font-bold text-[#70b83b] uppercase tracking-wider mt-1 block">
              — {current.reference}
            </span>
          </div>
        </div>

        <button
          onClick={nextVerse}
          title="Próximo versículo edificante"
          className="inline-flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-full shrink-0 border border-slate-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#ff5a1f]" />
          <span>Outro Versículo</span>
        </button>

      </div>
    </div>
  );
};
