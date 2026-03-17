import React, { useState, useEffect, useCallback } from 'react';
import { poemService } from '../services/poemService';
import { Poem, Occasion, PoemCategory } from '../types';
import PoemCard from '../components/PoemCard';
import { Search as SearchIcon, Filter, Trash2, Calendar } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Poem[]>([]);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [filters, setFilters] = useState<{
    occasionId?: string;
    category?: PoemCategory;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  const updateUrl = useCallback((q: string, currentFilters: typeof filters) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (currentFilters.occasionId) params.set('occ', currentFilters.occasionId);
    if (currentFilters.category) params.set('cat', currentFilters.category);

    const newHash = `#/poems?${params.toString()}`;
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
  }, []);

  const performSearch = async (q: string, currentFilters: typeof filters) => {
    setIsLoading(true);
    try {
      const searchResults = await poemService.getAllPoems({
        search: q,
        occasionId: currentFilters.occasionId || undefined,
        category: currentFilters.category || undefined,
      });
      setResults(searchResults);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const occs = await poemService.getOccasions();
        setOccasions(occs);

        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        const q = params.get('q') || '';
        const occId = params.get('occ') || '';
        const cat = params.get('cat') as PoemCategory || '';

        setQuery(q);
        const initialFilters = {
          occasionId: occId || undefined,
          category: cat || undefined,
        };
        setFilters(initialFilters);

        await performSearch(q, initialFilters);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [window.location.hash]); // Only depend on hash changes to trigger re-search

  const handleSearch = () => {
    updateUrl(query, filters);
  };

  const clearFilters = () => {
    setFilters({});
    setQuery('');
    updateUrl('', {});
  };

  return (
    <div className="px-6 py-6 space-y-8 pb-24">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">البحث في الأرشيف</h1>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="ابحث بالعنوان أو الشاعر..."
            className="w-full py-4 pr-12 pl-6 rounded-2xl bg-white shadow-sm border-none focus:ring-2 focus:ring-gold/20 text-gray-900 font-medium"
          />
          <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Enhanced Category Chips */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">التصنيف الشعري</label>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => {
              const newFilters = { ...filters, category: undefined };
              setFilters(newFilters);
              updateUrl(query, newFilters);
            }}
            className={`px-6 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${!filters.category ? 'bg-gray-900 text-white border-gray-900 shadow-lg' : 'bg-white text-gray-500 border-gray-100 hover:border-gold/30'}`}
          >
            الكل
          </button>
          {Object.values(PoemCategory).map(cat => (
            <button
              key={cat}
              onClick={() => {
                const newFilters = { ...filters, category: cat };
                setFilters(newFilters);
                updateUrl(query, newFilters);
              }}
              className={`px-6 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${filters.category === cat ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20' : 'bg-white text-gray-500 border-gray-100 hover:border-gold/30'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Occasion Filter Dropdown (Simplified) */}
      <div className="flex gap-4 items-center">
        <div className="flex-grow relative">
          <select
            value={filters.occasionId || ''}
            onChange={e => {
              const newFilters = { ...filters, occasionId: e.target.value || undefined };
              setFilters(newFilters);
              updateUrl(query, newFilters);
            }}
            className="w-full bg-white border-none rounded-2xl px-12 py-4 text-sm font-bold text-gray-700 shadow-sm appearance-none focus:ring-2 focus:ring-gold/20"
          >
            <option value="">كل المناسبات</option>
            {occasions.map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
        </div>

        <button
          onClick={handleSearch}
          className="bg-gray-900 text-white p-4 rounded-2xl shadow-lg active:scale-95 transition-all"
        >
          <Filter size={20} />
        </button>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">
          {isLoading ? 'جاري البحث...' : `${results.length} نتائج`}
        </h2>
        {(filters.occasionId || filters.category || query) && (
          <button onClick={clearFilters} className="text-red-500 text-sm flex items-center gap-1">
            <Trash2 size={14} /> مسح
          </button>
        )}
      </div>

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {results.map(poem => (
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
      ) : !isLoading && (
        <div className="text-center py-20 opacity-50">
          <SearchIcon size={48} className="mx-auto mb-4" />
          <p>لا توجد قصائد مطابقة لبحثك</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
