
import React, { useEffect, useState } from 'react';
import { poemService } from '../services/poemService';
import { Poem, Occasion, PoemCategory } from '../types';
import PoemCard from '../components/PoemCard';
import { ChevronLeft, Calendar, Layers, Music, Zap, Play, Sparkles, BookOpen } from 'lucide-react';

const HomePage: React.FC = () => {
  const [latestPoems, setLatestPoems] = useState<Poem[]>([]);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [poems, occs] = await Promise.all([
          poemService.getLatestPoems(7),
          poemService.getOccasions(true)
        ]);
        setLatestPoems(poems);
        setOccasions(occs);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const featuredPoem = latestPoems.length > 0 ? latestPoems[0] : null;
  const regularPoems = latestPoems.length > 0 ? latestPoems.slice(1) : [];

  if (isLoading) return null;

  return (
    <div className="pb-8 page-transition">
      {/* Featured Hero Section */}
      {featuredPoem ? (
      <section className="relative px-6 py-8 mt-2 mx-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[32px] shadow-2xl overflow-hidden border border-slate-700">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="relative z-10 text-white flex flex-col justify-center min-h-[150px]">
          <div className="flex items-center justify-between w-full mb-4">
             <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
               <Sparkles size={14} className="text-gold" />
               <span className="text-[10px] font-bold tracking-widest text-gold uppercase mt-0.5">جديد الأرشيف</span>
             </div>
             <a href={`#/poem?id=${featuredPoem.id}`} className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/10 transition-all shadow-lg hover:scale-105 active:scale-95">
                <Play size={18} className="translate-x-[-1px] translate-y-[1px]" fill="currentColor" />
             </a>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-amiri leading-tight mb-3 text-white drop-shadow-lg line-clamp-2">
            {featuredPoem.title}
          </h1>
          <p className="text-sm text-gray-300 font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(212,163,115,0.8)]"></span>
            {featuredPoem.poet_name}
          </p>
        </div>
      </section>
      ) : (
      <section className="px-6 py-10 text-center bg-white/60 backdrop-blur-md rounded-[32px] shadow-sm mb-4 mx-4 border border-white">
        <h1 className="text-3xl font-black text-gray-900 mb-2 leading-tight">مكتبة رقمية</h1>
        <p className="text-gold font-bold italic text-sm">للأرشيف والقصائد الحسينية بجدحفص</p>
      </section>
      )}

      {/* Occasions Shelf */}
      <section className="mt-8">
        <div className="px-6 flex justify-between items-center mb-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <Calendar size={20} className="text-gold" />
            المناسبات
          </h2>
          <a href="#/occasions" className="text-gray-400 hover:text-gold text-xs font-bold flex items-center transition-colors">
            عرض الكل <ChevronLeft size={16} />
          </a>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 no-scrollbar pb-4 pt-1">
          {occasions.map(occ => (
            <a key={occ.id} href={`#/poems?occ=${occ.id}`} className="flex flex-col items-center gap-2.5 min-w-[72px] group relative">
              <div className="w-[72px] h-[72px] rounded-[24px] bg-gradient-to-br from-white to-gray-50 shadow-[0_4px_10px_rgba(0,0,0,0.03)] flex items-center justify-center text-3xl border border-gray-100 group-hover:border-gold/50 group-hover:shadow-[0_8px_15px_rgba(212,163,115,0.15)] transition-all overflow-hidden group-active:scale-95">
                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 drop-shadow-sm group-hover:scale-110 transition-transform">
                  {occ.icon?.startsWith('http') ? (
                    <img src={occ.icon} alt={occ.name} className="w-full h-full object-cover" />
                  ) : (
                    occ.icon || '🌙'
                  )}
                </div>
              </div>
              <span className="text-[11px] font-bold text-gray-500 text-center whitespace-nowrap group-hover:text-gold transition-colors">{occ.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Categories Modern Pills */}
      <section className="mt-6">
        <div className="px-6 flex justify-between items-center mb-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <Layers size={20} className="text-gold" />
            التصنيفات
          </h2>
        </div>
        <div className="flex gap-3 overflow-x-auto px-6 no-scrollbar pb-4 pt-1">
          {Object.values(PoemCategory).map((cat) => (
             <a key={cat} href={`#/poems?cat=${cat}`} className="flex items-center gap-3 px-5 py-3.5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-100/80 hover:border-gold hover:shadow-[0_4px_12px_rgba(212,163,115,0.1)] transition-all whitespace-nowrap group active:scale-95">
                 <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                     {cat === 'وقفة' ? <BookOpen size={16} /> : cat === 'موشح' ? <Music size={16} /> : <Zap size={16} />}
                 </div>
                 <span className="font-bold text-sm text-gray-700 group-hover:text-gray-900">{cat}</span>
             </a>
          ))}
        </div>
      </section>

      {/* Newest Poems */}
      {regularPoems.length > 0 && (
      <section className="mt-6 mb-8">
        <div className="px-6 flex justify-between items-center mb-6">
          <h2 className="text-lg font-black text-gray-900">المضاف مؤخراً</h2>
          <a href="#/poems" className="text-gray-400 hover:text-gold text-xs font-bold flex items-center transition-colors">
            تصفح الكل <ChevronLeft size={16} />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 px-6 md:grid-cols-3 lg:grid-cols-4">
          {regularPoems.map(poem => (
            <PoemCard
              key={poem.id}
              poem={{
                ...poem,
                name: poem.title,
                poetName: poem.poet_name,
                occasionId: poem.occasion_id || '',
                classification: poem.category as any,
                year: poem.year || 0,
                pdfUrl: poem.media_url || '',
                uploaderId: poem.created_by,
                downloadCount: 0,
                createdAt: poem.created_at
              }}
            />
          ))}
        </div>
      </section>
      )}
    </div>
  );
};

export default HomePage;
