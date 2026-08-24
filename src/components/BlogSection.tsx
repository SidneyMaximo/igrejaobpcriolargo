import React, { useState } from 'react';
import { Calendar, Eye, MessageCircle, Heart, ArrowRight, BookOpen, X } from 'lucide-react';

interface BlogSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onNavigate }) => {
  const [activeArticleModal, setActiveArticleModal] = useState<any | null>(null);

  const posts = [
    {
      id: 1,
      title: 'Como a Fé em Deus Restaura e Fortalece Lares em Crise?',
      image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1000&q=80',
      date: '24 de Agosto, 2026',
      views: 312,
      comments: 7,
      likes: 24,
      author: 'Pr. Manoel & Equipe Pastoral',
      excerpt: 'Uma reflexão bíblica sobre o poder da oração perseverante em família, o perdão diário e a fidelidade de Deus em meio a qualquer tempestade.',
      fullContent: `Em tempos de agitação e pressões emocionais, muitos lares sofrem com desânimo e incertezas. A Palavra de Deus em Josué 24:15 nos lembra da decisão inabalável: "Eu e a minha casa serviremos ao Senhor".\n\nQuando colocamos o altar de oração no centro do nosso lar, Deus renova as forças, restaura relacionamentos rompidos e derrama uma paz que excede todo o entendimento humano. Nunca desista de interceder pelos seus filhos e cônjuge.`
    },
    {
      id: 2,
      title: 'A Chama do Avivamento: A Juventude JUBRAC e o Voluntariado',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
      date: '18 de Agosto, 2026',
      views: 245,
      comments: 4,
      likes: 19,
      author: 'Liderança JUBRAC',
      excerpt: 'Descubra como a consagração juvenil, o louvor sincero e os projetos sociais transformam vidas e preparam líderes para a nova geração.',
      fullContent: `A juventude de O Brasil Para Cristo tem um chamado profético: ser sal da terra e luz do mundo. Através de congressos, vigílias, evangelismo nas praças e apoio a famílias necessitadas, nossos jovens experimentam o verdadeiro poder do Espírito Santo.\n\nServir a Deus na juventude é guardar o coração com alegria e propósito eterno.`
    }
  ];

  return (
    <section id="estudos" className="py-20 bg-slate-50 text-slate-800 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title (OUR BLOG Style) */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display uppercase mb-3">
            NOSSO BLOG & ESTUDOS
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Alimento espiritual, ensinamentos bíblicos e testemunhos da comunidade de fé.
          </p>
        </div>

        {/* 2 Big Editorial Cards (Direct match to Template) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Photo Top */}
                <div className="relative h-60 sm:h-72 overflow-hidden bg-slate-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#70b83b] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                    Estudo Bíblico
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                  {/* Green Title (Template Style) */}
                  <h3 
                    onClick={() => setActiveArticleModal(post)}
                    className="text-xl sm:text-2xl font-bold text-[#70b83b] hover:text-[#61a332] cursor-pointer transition-colors mb-3 leading-snug"
                  >
                    {post.title}
                  </h3>

                  {/* Metadata Icons (Date, Views, Comments, Likes) */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-4 pb-3 border-b border-slate-100 font-medium">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {post.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {post.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" />
                      {post.likes}
                    </span>
                  </div>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Green Action Button (Learn More style) */}
              <div className="p-6 sm:p-8 pt-0">
                <button
                  onClick={() => setActiveArticleModal(post)}
                  className="bg-[#70b83b] hover:bg-[#61a332] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>Ler Mensagem Completa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Article Detail Modal */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4 animate-in zoom-in-95">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#70b83b]">
                  {activeArticleModal.date} • {activeArticleModal.author}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  {activeArticleModal.title}
                </h3>
              </div>
              <button 
                onClick={() => setActiveArticleModal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={activeArticleModal.image}
              alt={activeArticleModal.title}
              className="w-full h-56 object-cover rounded-xl"
            />

            <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {activeArticleModal.fullContent}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveArticleModal(null)}
                className="bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-lg"
              >
                Fechar Artigo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
