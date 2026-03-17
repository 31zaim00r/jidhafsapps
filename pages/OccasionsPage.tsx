
import React, { useEffect, useState } from 'react';
import { poemService } from '../services/poemService';
import { Occasion } from '../types';
import { Calendar, ChevronLeft, Layers } from 'lucide-react';

const OccasionsPage: React.FC = () => {
    const [occasions, setOccasions] = useState<Occasion[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        poemService.getOccasions(true).then(data => {
            setOccasions(data);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) return null;

    return (
        <div className="px-6 py-8 pb-32 space-y-10 animate-fadeIn">
            {/* Page Header */}
            <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mb-2">
                    <Layers size={32} />
                </div>
                <h1 className="text-3xl font-amiri font-bold text-gray-900">المناسبات الحسينية</h1>
                <p className="text-gray-500 font-medium italic">تصنيفات الأرشيف الرقمي</p>
                <div className="w-12 h-1 bg-gold/20 rounded-full mt-4"></div>
            </div>

            {/* Occasions Grid - Premium Cards */}
            <div className="grid grid-cols-2 gap-5">
                {occasions.map(occ => (
                    <a
                        key={occ.id}
                        href={`#/poems?occ=${occ.id}`}
                        className="group relative bg-white p-6 rounded-[40px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-100 hover:border-gold/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all flex flex-col items-center gap-5 text-center active:scale-95 overflow-hidden"
                    >
                        {/* Decorative Background Glow */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/10 transition-colors"></div>

                        <div className="relative w-24 h-24 rounded-3xl bg-gray-50 border-4 border-white shadow-inner flex items-center justify-center text-4xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                            {occ.icon?.startsWith('http') ? (
                                <img src={occ.icon} alt={occ.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="drop-shadow-sm">{occ.icon || '🌙'}</span>
                            )}
                        </div>

                        <div className="relative space-y-1">
                            <h3 className="font-bold text-gray-900 group-hover:text-gold transition-colors text-lg line-clamp-1">{occ.name}</h3>
                            <div className="flex justify-center">
                                <span className="bg-gray-50 text-[10px] font-black text-gray-400 px-3 py-1 rounded-full group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                                    استعراض القصائد
                                </span>
                            </div>
                        </div>

                        {/* Hover Arrow */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronLeft size={16} className="text-gold" />
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default OccasionsPage;
