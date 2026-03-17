
import React, { useEffect, useState } from 'react';
import { poemService } from '../services/poemService';
import { Poem } from '../types';
import PoemCard from '../components/PoemCard';
import { Heart, Search } from 'lucide-react';

const FavoritesPage: React.FC = () => {
    const [favorites, setFavorites] = useState<Poem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const data = await poemService.getFavorites();
                setFavorites(data);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        loadFavorites();
    }, []);

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold"></div>
        </div>
    );

    return (
        <div className="px-6 py-8 pb-32 space-y-10 animate-fadeIn">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-2 border border-red-100">
                    <Heart size={32} className="fill-current" />
                </div>
                <h1 className="text-3xl font-amiri font-bold text-gray-900">مفضلتي</h1>
                <p className="text-gray-500 font-medium italic">قصائدك المفضلة التي قمت بحفظها</p>
                <div className="w-12 h-1 bg-red-100 rounded-full mx-auto mt-4"></div>
            </div>

            {/* Content */}
            {favorites.length > 0 ? (
                <div className="grid grid-cols-2 gap-5">
                    {favorites.map(poem => (
                        <PoemCard
                            key={poem.id}
                            poem={{
                                ...poem,
                                name: poem.title,
                                poetName: poem.poet_name,
                                classification: poem.category as any,
                                pdfUrl: poem.media_url || '',
                                year: poem.year || 0
                            } as any}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white/50 backdrop-blur-sm rounded-[50px] p-20 border-2 border-dashed border-gray-100 text-center space-y-6">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                        <Heart size={40} className="text-gray-200" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-800">قائمتك فارغة</h3>
                        <p className="text-gray-400 text-sm">ابدأ بإضافة القصائد التي تعجبك إلى مفضلتك لتتمكن من الوصول إليها لاحقاً.</p>
                    </div>
                    <a
                        href="#/search"
                        className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-black transition-all"
                    >
                        <Search size={18} />
                        استعرض القصائد
                    </a>
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;
