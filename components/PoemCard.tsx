
import React from 'react';
import { Poem, Occasion } from '../types';
import { BookOpen, ChevronLeft } from 'lucide-react';

interface PoemCardProps {
  poem: Poem;
  occasion?: Occasion;
  variant?: 'shelf' | 'list';
}

const PoemCard: React.FC<PoemCardProps> = ({ poem, occasion, variant = 'shelf' }) => {
  // Use either the mapped names or direct ones
  const title = poem.name || (poem as any).title;
  const poet = poem.poetName || (poem as any).poet_name;
  const category = poem.classification || (poem as any).category;

  // Premium color based on category or random for variety
  const getCoverColor = () => {
    const colors = [
      'from-slate-800 to-slate-900', // Charcoal
      'from-red-900 to-black',       // Deep Crimson
      'from-indigo-950 to-slate-900', // Navy
      'from-emerald-950 to-slate-900' // Forest
    ];
    // Simple hash to keep color consistent for same poem
    const index = title.length % colors.length;
    return colors[index];
  };

  if (variant === 'list') {
    return (
      <a href={`#/poem?id=${poem.id}`} className="flex items-center gap-4 p-4 bg-white rounded-3xl hover:shadow-md transition-all group border border-gray-100/50">
        <div className={`w-16 h-20 bg-gradient-to-br ${getCoverColor()} rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md relative`}>
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
          <div className="w-full h-full flex items-center justify-center border-l-2 border-white/10">
            <span className="text-gold font-amiri font-bold text-xl">{title.charAt(0)}</span>
          </div>
        </div>
        <div className="flex-grow">
          <h4 className="font-black text-gray-800 group-hover:text-gold transition-colors line-clamp-1">{title}</h4>
          <p className="text-xs font-bold text-gray-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gold/50"></span>
            {poet}
          </p>
        </div>
        <ChevronLeft size={18} className="text-gold group-hover:translate-x-[-4px] transition-transform" />
      </a>
    );
  }

  return (
    <a href={`#/poem?id=${poem.id}`} className="flex flex-col gap-3 group transition-all active:scale-95">
      <div className="relative aspect-[3/4.2] rounded-xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.1)] group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition-shadow">

        {/* The Book Body */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getCoverColor()} p-3.5 flex flex-col justify-between border-l-[4px] border-black/30 shadow-inner`}>

          {/* Subtle Arabesque Pattern Overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay"></div>

          {/* Subtle Background (The File Itself) */}
          {(poem.pdfUrl || (poem as any).media_url) && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(poem.pdfUrl || (poem as any).media_url) ? (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <img
                src={poem.pdfUrl || (poem as any).media_url}
                alt=""
                className="w-full h-full object-cover opacity-10 mix-blend-luminosity scale-110 group-hover:scale-100 transition-transform duration-700"
              />
            </div>
          ) : (poem.pdfUrl || (poem as any).media_url)?.toLowerCase().endsWith('.pdf') && (
            <div className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] bg-repeat"></div>
          )}

          {/* Top Line Decor */}
          <div className="relative border-t border-gold/30 pt-2 flex justify-between items-center text-[8px] font-black tracking-widest text-gold/60 z-10">
            <div className="flex items-center gap-1.5 uppercase">
              {category || 'أرشيف'}
              {(poem.pdfUrl || (poem as any).media_url)?.toLowerCase().endsWith('.pdf') && <span className="bg-gold/20 px-1 rounded text-[7px] border border-gold/30">PDF</span>}
            </div>
            <span>{(poem as any).year || ''}</span>
          </div>

          {/* Title Area */}
          <div className="relative py-2 z-10">
            <h3 className="text-white font-amiri font-bold text-base leading-snug text-center drop-shadow-lg line-clamp-3">
              {title}
            </h3>
            {/* Elegant Divider */}
            <div className="w-8 h-0.5 bg-gold/40 mx-auto mt-3 rounded-full"></div>
          </div>

          {/* Bottom Area */}
          <div className="relative flex justify-between items-end border-b border-gold/30 pb-1.5 z-10">
            <div className="flex flex-col max-w-[70%]">
              <span className="text-[8px] text-white/40 font-bold mb-0.5 uppercase tracking-tighter">الشاعر</span>
              <p className="text-[11px] text-gold font-bold italic line-clamp-1">{poet}</p>
            </div>
            <div className="p-1 bg-gold/10 rounded-lg backdrop-blur-sm border border-gold/20">
              <BookOpen size={12} className="text-gold" />
            </div>
          </div>
        </div>

        {/* Realistic Page Edges Effect */}
        <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-gradient-to-l from-white/10 to-transparent"></div>

        {/* Spine Embossed Look */}
        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-r from-black/40 via-white/5 to-transparent shadow-inner"></div>
      </div>

      {/* Info labels outside */}
      <div className="px-1 text-right">
        <h4 className="font-bold text-gray-900 text-xs line-clamp-1 group-hover:text-gold transition-colors">{title}</h4>
        <p className="text-[10px] font-bold text-gray-400 mt-0.5">{poet}</p>
      </div>
    </a>
  );
};

export default PoemCard;
