
import React, { useEffect, useState } from 'react';
import { poemService } from '../services/poemService';
import { Poem, Occasion } from '../types';
import { Download, Share2, Calendar, FileText, BookOpen, Heart } from 'lucide-react';
import CustomModal from '../components/CustomModal';

const PoemDetailsPage: React.FC<{ id: string }> = ({ id }) => {
  const [poem, setPoem] = useState<Poem | null>(null);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  // Modal State
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'success' | 'danger' | 'warning';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => { }
  });

  useEffect(() => {
    const loadPoem = async () => {
      try {
        const data = await poemService.getPoemById(id);
        if (data) {
          setPoem(data);
          if (data.occasion_id) {
            const occs = await poemService.getOccasions(false);
            setOccasion(occs.find(o => o.id === data.occasion_id) || null);
          }
          const favStatus = await poemService.isFavorite(id);
          setIsFav(favStatus);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadPoem();
  }, [id]);

  if (isLoading) return null;
  if (!poem) return <div className="text-center py-20 font-bold">القصيدة غير موجودة</div>;

  const handleToggleFavorite = async () => {
    try {
      setIsFavoriteLoading(true);
      const newState = await poemService.toggleFavorite(poem.id);
      setIsFav(newState);
    } catch (e: any) {
      console.error('Favorite toggle error:', e);
      setModal({
        isOpen: true,
        title: 'تنبيه',
        message: e.message || 'حدث خطأ أثناء تحديث المفضلة',
        type: 'warning',
        onConfirm: () => setModal(prev => ({ ...prev, isOpen: false }))
      });
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const mediaUrl = poem.media_url;
  const isPDF = mediaUrl?.toLowerCase().endsWith('.pdf');
  const isImage = mediaUrl && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(mediaUrl);

  return (
    <div className="flex flex-col min-h-screen animate-fadeIn pb-24 bg-soft-beige/30">
      {/* Reader / Viewer Section - Expanded for better visibility */}
      {mediaUrl && (
        <div className="px-3 pt-4 space-y-4">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-lg font-bold text-gray-900">محتوى القصيدة</h3>
            <span className="text-[10px] font-black text-gold bg-gold/10 px-3 py-1.5 rounded-full uppercase">
              {isPDF ? 'بصيغـة PDF' : isImage ? 'بصيغـة صورة' : 'مرفق نصي'}
            </span>
          </div>

          <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 min-h-[600px] relative flex flex-col">
            {isPDF ? (
              <div className="flex-grow w-full flex flex-col bg-white" dir="ltr">
                <iframe
                  src={`${mediaUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  className="w-full h-[850px] border-none"
                  title="PDF Reader"
                />
              </div>
            ) : isImage ? (
              <div className="p-2 flex items-center justify-center bg-gray-50/50 min-h-[500px] w-full flex-grow">
                <img
                  src={mediaUrl}
                  alt={poem.title}
                  className="w-full h-auto object-contain rounded-xl shadow-lg border-2 border-white mx-auto"
                />
              </div>
            ) : (
              <div className="p-20 text-center space-y-6">
                <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto rotate-3">
                  <FileText size={48} className="text-gray-200" />
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 font-bold">هذا النوع من الملفات يتطلب التحميل للمعاينة</p>
                  <a href={mediaUrl} className="inline-block text-gold font-black underline decoration-2 underline-offset-4">اضغط للفتح في نافذة مستقلة</a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info Section - Now at the Bottom */}
      <div className="px-6 py-8 space-y-8">
        <div className="relative bg-white rounded-[40px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100/50 space-y-8 overflow-hidden">
          {/* Subtle Background Icon Decoration */}
          <div className="absolute -top-12 -left-12 text-gold/5 rotate-12 pointer-events-none">
            <BookOpen size={240} />
          </div>

          <div className="relative flex flex-col items-center text-center space-y-4">
            <div className="bg-gold/10 px-4 py-1.5 rounded-full text-[10px] font-black text-gold uppercase tracking-[0.2em]">
              {poem.category || 'أرشيف القصائد'}
            </div>
            <h1 className="text-3xl md:text-5xl font-amiri font-bold text-gray-900 leading-tight">
              {poem.title}
            </h1>
            <div className="w-16 h-1 bg-gold/20 rounded-full"></div>
            <p className="text-xl font-bold text-gold italic">{poem.poet_name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 relative">
            <div className="bg-gray-50/50 backdrop-blur-sm p-5 rounded-3xl border border-white flex flex-col items-center text-center">
              <Calendar className="text-gold mb-2" size={20} />
              <span className="text-[10px] font-black text-gray-400 uppercase mb-1">السـنة</span>
              <span className="font-bold text-gray-800">{poem.year || 'غير محدد'} هـ</span>
            </div>
            <div className="bg-gray-50/50 backdrop-blur-sm p-5 rounded-3xl border border-white flex flex-col items-center text-center">
              <FileText className="text-gold mb-2" size={20} />
              <span className="text-[10px] font-black text-gray-400 uppercase mb-1">المناسبة</span>
              <span className="font-bold text-gray-800 truncate w-full px-2">{occasion?.name || 'قصيدة عامة'}</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <a
              href={mediaUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-grow bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
            >
              <Download size={18} />
              تحميل الملف
            </a>
            <button
              onClick={handleToggleFavorite}
              disabled={isFavoriteLoading}
              className={`p-4 rounded-2xl transition-all border border-gray-100 ${isFav ? 'bg-red-50 text-red-500 scale-110' : 'bg-gray-50 text-gray-400 hover:text-gold'}`}
            >
              <Heart size={24} className={isFav ? 'fill-current' : ''} />
            </button>
            <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-gold transition-colors border border-gray-100">
              <Share2 size={24} />
            </button>
          </div>
        </div>
      </div>

      <CustomModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        onCancel={() => setModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div >
  );
};

export default PoemDetailsPage;
