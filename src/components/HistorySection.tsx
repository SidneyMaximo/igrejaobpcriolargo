import React, { useState } from 'react';
import { 
  BookOpen, 
  Radio, 
  Flame, 
  Building2, 
  Globe2, 
  Award, 
  ChevronRight, 
  Clock, 
  Users, 
  Sparkles, 
  ShieldCheck,
  Quote,
  ExternalLink,
  Heart
} from 'lucide-react';

export const HistorySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'founder' | 'legacy'>('timeline');
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(0);

  const TIMELINE_EVENTS = [
    {
      year: '1929 – 1952',
      title: 'Origens e o Chamado de Manoel de Mello',
      shortDesc: 'Nascimento em Pernambuco, cura milagrosa e consagração ao Evangelho.',
      tag: 'O Começo',
      icon: Flame,
      content: `Manoel de Mello e Silva nasceu em Água Preta (Pernambuco) em 20 de agosto de 1929. De origem humilde e trabalhador da construção civil, migrou para São Paulo em 1947. Convertido na Assembleia de Deus e posteriormente atuando com a Cruzada Nacional de Evangelização, foi acometido por uma gravíssima paralisia intestinal em 1952. Após orar intensamente e receber uma cura milagrosa comprovada pelos médicos, decidiu consagrar integralmente seus dias à pregação da Palavra de Deus.`,
      highlights: [
        'Migração nordestina para a capital paulista em 1947',
        'Cura milagrosa de paralisia intestinal em 1952',
        'Casamento com a missionária Ruth Lopes em 1951'
      ]
    },
    {
      year: '1955 – 1956',
      title: 'A Visão Divina e o Nascimento da OBPC',
      shortDesc: 'O brado "O Brasil Para Cristo" e a primeira reunião em Pirituba.',
      tag: 'Fundação Oficial',
      icon: Sparkles,
      content: `No final de 1955, o pastor Manoel de Mello teve uma visão espiritual de Jesus comissionando-o a incendiar a nação brasileira com o Evangelho, cura divina e salvação. Em janeiro de 1956, entrava no ar o lendário programa de rádio "A Voz do Brasil Para Cristo". Em 3 de março de 1956, no bairro de Pirituba, zona norte de São Paulo, realizou-se o primeiro culto oficial da Igreja Evangélica Pentecostal O Brasil Para Cristo, marcando o surgimento da primeira grande denominação pentecostal genuinamente brasileira.`,
      highlights: [
        'Janeiro de 1956: Estreia de "A Voz do Brasil Para Cristo" no rádio',
        '03 de Março de 1956: Primeiro culto oficial em Pirituba (SP)',
        'Primeira grande igreja pentecostal fundada por brasileiros'
      ]
    },
    {
      year: '1960 – 1970',
      title: 'A Era das Tendas e as Grandes Cruzadas',
      shortDesc: 'Milhares de pessoas reunidas em praças, tendas de lona e estádios de futebol.',
      tag: 'Avivamento Popular',
      icon: Radio,
      content: `A OBPC inovou na evangelização de massas com grandes tendas de lona itinerantes erguidas nos bairros operários e periferias de São Paulo, além de concentrações em estádios como o Pacaembu e Maracanã. As reuniões eram marcadas pelo fervor pentecostal, manifestação dos dons espirituais, curas e o brado patriótico e de fé: "Desperta Brasil!". O programa de rádio alcançou audiências recordes por mais de duas décadas consecutivas em todo o território nacional.`,
      highlights: [
        'Cruzadas evangelísticas em estádios e praças públicas',
        'Tendas de salvação que acolhiam operários e famílias',
        'Recordes de audiência nas principais emissoras de rádio do país'
      ]
    },
    {
      year: '1970 – 1980',
      title: 'A Construção do Megatemplo da Pompéia',
      shortDesc: 'O Grande Templo da Pompéia em SP: um dos maiores templos do mundo.',
      tag: 'Marco Arquitetônico',
      icon: Building2,
      content: `Com o crescimento vertiginoso, a igreja adquiriu o terreno na Pompéia (Água Branca, São Paulo) e iniciou a construção do Grande Templo de O Brasil Para Cristo. Projetado para abrigar dezenas de milhares de fiéis, tornou-se na época um dos maiores templos evangélicos do planeta, edificado com a dedicação voluntária e doações de caravanas que vinham de todos os cantos do Brasil. Em 1978, Manoel de Mello foi condecorado com o título de "O Bandeirante do Brasil Presente".`,
      highlights: [
        'Construção do Grande Templo Sede na Pompéia / Água Branca (SP)',
        'Marco histórico do protestantismo na América Latina',
        'Honraria cívica a Manoel de Mello em 1978'
      ]
    },
    {
      year: '1986 – Presente',
      title: 'Consolidação, Convenção Nacional e Missões',
      shortDesc: 'Mais de 4.000 congregações, convenções estaduais e campos no exterior.',
      tag: 'Expansão & Futuro',
      icon: Globe2,
      content: `Após o jubileu e o falecimento do missionário Manoel de Mello em maio de 1990, a Igreja O Brasil Para Cristo manteve sua solidez institucional através da Convenção Nacional (CONAMI / Conselho Nacional), das Convenções Estaduais e dos seus respeitados departamentos (JUBRAC, UFEBRAC, MENBRAC, UCEBRAC). Hoje a OBPC possui milhares de templos no Brasil, projetos sociais, creches, colégios teológicos e frentes missionárias na América Latina, África e Europa.`,
      highlights: [
        'Milhares de templos e congregações em todos os estados brasileiros',
        'Departamentos ativos: JUBRAC (Jovens), UFEBRAC (Mulheres), MENBRAC (Homens)',
        'Campos de missões transculturais em múltiplos continentes'
      ]
    }
  ];

  return (
    <section id="historia" className="py-20 bg-white text-slate-800 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#70b83b] block mb-1">
            Desde 1956 • Raízes Pentecostais
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display uppercase mb-3">
            NOSSA HISTÓRIA DE FÉ
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Conheça a trajetória da <strong>Igreja Evangélica Pentecostal O Brasil Para Cristo</strong>, fundada pelo Missionário Manoel de Mello.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-100 p-1.5 rounded-full flex flex-wrap justify-center gap-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'timeline'
                  ? 'bg-[#70b83b] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Linha do Tempo</span>
            </button>

            <button
              onClick={() => setActiveTab('founder')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'founder'
                  ? 'bg-[#70b83b] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Pr. Manoel de Mello</span>
            </button>

            <button
              onClick={() => setActiveTab('legacy')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'legacy'
                  ? 'bg-[#70b83b] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Departamentos</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Timeline Mode */}
        {activeTab === 'timeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Timeline Stepper Sidebar */}
            <div className="lg:col-span-4 space-y-2.5">
              {TIMELINE_EVENTS.map((event, idx) => {
                const isSelected = selectedTimelineIndex === idx;
                const IconComponent = event.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedTimelineIndex(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-emerald-50/70 border-[#70b83b] shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected 
                        ? 'bg-[#70b83b] text-white' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-mono font-bold text-[#70b83b]">
                          {event.year}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          {event.tag}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 truncate">
                        {event.title}
                      </h4>
                    </div>
                  </button>
                );
              })}

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <span>Fonte: Artigos históricos & Wikipédia</span>
                <a 
                  href="https://pt.wikipedia.org/wiki/Igreja_Evang%C3%A9lica_Pentecostal_O_Brasil_Para_Cristo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#70b83b] font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>Wikipédia</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Selected Phase Detail Content */}
            <div className="lg:col-span-8 bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-[#70b83b] bg-emerald-100 px-2.5 py-1 rounded-md">
                    Período: {TIMELINE_EVENTS[selectedTimelineIndex].year}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                    {TIMELINE_EVENTS[selectedTimelineIndex].title}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#70b83b]">
                  {React.createElement(TIMELINE_EVENTS[selectedTimelineIndex].icon, { className: 'w-5 h-5' })}
                </div>
              </div>

              {/* Narrative Content */}
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3">
                <p>
                  {TIMELINE_EVENTS[selectedTimelineIndex].content}
                </p>
              </div>

              {/* Highlights & Facts Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-2.5">
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#70b83b]" />
                  Fatos Marcantes Desta Época
                </h4>
                <ul className="space-y-1.5">
                  {TIMELINE_EVENTS[selectedTimelineIndex].highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#70b83b] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quote */}
              <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200/80 flex items-start gap-3">
                <Quote className="w-5 h-5 text-[#70b83b] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-700 italic">
                    "O Brasil Para Cristo nasceu como um brado profético de salvação, cura divina e avivamento a todos os brasileiros."
                  </p>
                  <span className="text-[10px] text-[#70b83b] font-bold mt-1 block">
                    — Memórias do Movimento Pentecostal Brasileiro
                  </span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Founder */}
        {activeTab === 'founder' && (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 space-y-3 text-center sm:text-left">
                <div className="relative mx-auto sm:mx-0 w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-2 border-[#70b83b]/40 shadow-lg">
                  <img
                    src="/pastor-manoel-de-mello.jpg"
                    alt="Missionário Manoel de Mello"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#70b83b] block">
                    Pioneiro do Avivamento (1929 – 1990)
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    Missionário Manoel de Mello
                  </h3>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-3 text-slate-600 text-xs sm:text-sm leading-relaxed">
                <p>
                  Manoel de Mello foi um dos maiores evangelistas do século XX no Brasil. Conhecido por sua oratória contundente e ousadia missionária, foi pioneiro no uso do rádio para a proclamação das boas novas.
                </p>
                <p>
                  Com o programa <em>"A Voz do Brasil Para Cristo"</em>, levou fé a milhões de famílias em tempos de intensa transformação social urbana. Reuniu multidões em estádios como o Pacaembu e edificou com o povo o emblemático Grande Templo da Pompéia.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Legacy & Departments */}
        {activeTab === 'legacy' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-[#70b83b] transition-colors">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#70b83b] flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">JUBRAC</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  <strong>Juventude de O Brasil Para Cristo:</strong> Responsável pela união, capacitação, congressos e despertamento espiritual dos jovens.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-rose-400 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">UFEBRAC</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  <strong>União Feminina:</strong> Círculo de Oração, intercessão contínua pelas famílias e suporte comunitário.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-400 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">MENBRAC</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  <strong>Ministério de Homens:</strong> Formação de sacerdotes do lar, fortalecimento de pais de família e evangelismo.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-amber-400 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">UCEBRAC</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  <strong>União de Crianças:</strong> Ensino bíblico infantil e valores cristãos na infância.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
