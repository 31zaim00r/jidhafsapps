
import React, { useState, useEffect } from 'react';
import { poemService } from '../services/poemService';
import { Occasion, PoemCategory } from '../types';
import { useAuth } from '../App';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import CustomModal from '../components/CustomModal';

const UploadPoemPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [isUploading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    poet_name: '',
    year: new Date().getFullYear(),
    category: PoemCategory.QASIDA,
    occasion_id: ''
  });

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
    refreshUser(false); // Refresh in background on mount
    poemService.getOccasions().then(setOccasions);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.poet_name) return;

    setIsLoading(true);
    try {
      await poemService.addPoem({
        title: formData.title,
        poet_name: formData.poet_name,
        year: formData.year,
        category: formData.category,
        occasion_id: formData.occasion_id || null,
        media_url: null,
        content: null
      }, file || undefined);

      setIsSuccess(true);
      setTimeout(() => (window.location.hash = '#/my-poems'), 2000);
    } catch (e: any) {
      setModal({
        isOpen: true,
        title: 'خطأ أثناء الرفع',
        message: e.message || 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً',
        type: 'danger',
        onConfirm: () => setModal(prev => ({ ...prev, isOpen: false }))
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-96 px-6 text-center animate-bounce">
        <CheckCircle size={80} className="text-green-500 mb-4" />
        <h2 className="text-2xl font-bold">تم الرفع بنجاح!</h2>
        <p className="text-gray-500 mt-2">سيتم تحويلك إلى صفحة قصائدي...</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 pb-24 space-y-8 page-transition">
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <Upload className="text-gold" />
          إضافة قصيدة جديدة
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">عنوان القصيدة *</label>
            <input
              required
              type="text"
              className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-gold/20"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">اسم الشاعر *</label>
            <input
              required
              type="text"
              className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-gold/20"
              value={formData.poet_name}
              onChange={e => setFormData({ ...formData, poet_name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">التصنيف</label>
              <select
                className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-gold/20"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as PoemCategory })}
              >
                {Object.values(PoemCategory).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">السنة (هـ)</label>
              <input
                type="number"
                className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-gold/20"
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">المناسبة</label>
            <select
              className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-gold/20"
              value={formData.occasion_id}
              onChange={e => setFormData({ ...formData, occasion_id: e.target.value })}
            >
              <option value="">غير محدد</option>
              {occasions.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <label className="block text-sm font-bold text-gray-700 mb-4">الملف المرفق (PDF, Word, Image)</label>
            <div className="relative border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center hover:border-gold transition-colors cursor-pointer group">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={e => setFile(e.target.files?.[0] || null)}
              />
              <div className="flex flex-col items-center gap-2">
                <FileText size={40} className={file ? 'text-gold' : 'text-gray-300'} />
                <span className="text-sm font-bold text-gray-500">
                  {file ? file.name : 'اسحب الملف هنا أو اضغط للاختيار'}
                </span>
              </div>
            </div>

            {/* File Preview Section */}
            {file && (
              <div className="mt-6 p-4 bg-gray-50 rounded-3xl border border-gray-100 animate-fadeIn">
                <h4 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest px-2">معاينة الملف المختـار</h4>

                {file.type.startsWith('image/') ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-inner bg-white">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : file.type === 'application/pdf' ? (
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-inner bg-white border border-gray-200">
                    <iframe
                      src={URL.createObjectURL(file)}
                      className="w-full h-full"
                      title="PDF Preview"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm">
                    <div className="p-4 bg-gold/10 rounded-xl text-gold">
                      <FileText size={32} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{file.name}</p>
                      <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="mt-4 w-full text-red-500 text-xs font-bold hover:underline"
                >
                  إزالة الملف واختيار آخر
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full bg-gold text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 mt-6"
          >
            {isUploading ? 'جاري الرفع والاتصال بالخادم...' : 'تأكيد الإضافة'}
          </button>
        </form>
      </div>

      <CustomModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        onCancel={() => setModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default UploadPoemPage;
