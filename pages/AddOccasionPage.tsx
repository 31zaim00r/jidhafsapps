
import React, { useState } from 'react';
import { poemService } from '../services/poemService';
import { Layout, Calendar, CheckCircle, Info, Hash } from 'lucide-react';

const AddOccasionPage: React.FC = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_active: true
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return;

        setIsUploading(true);
        try {
            await poemService.manageOccasion({
                name: formData.name,
                description: formData.description || null,
                is_active: formData.is_active
            }, selectedFile || undefined);

            setIsSuccess(true);
            setTimeout(() => (window.location.hash = '#/admin'), 2000);
        } catch (e) {
            alert('خطأ أثناء الإضافة: ' + (e as Error).message);
        } finally {
            setIsUploading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-96 px-6 text-center animate-bounce">
                <CheckCircle size={80} className="text-green-500 mb-4" />
                <h2 className="text-2xl font-bold">تمت إضافة المناسبة!</h2>
                <p className="text-gray-500 mt-2">جاري العودة للوحة التحكم...</p>
            </div>
        );
    }

    return (
        <div className="px-6 py-6 pb-24 space-y-8 page-transition">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h1 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <Calendar className="text-gold" />
                    إضافة مناسبة جديدة
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">اسم المناسبة *</label>
                        <div className="relative">
                            <input
                                required
                                type="text"
                                placeholder="مثال: عاشوراء، مولد النبي..."
                                className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-gold/20"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <Layout size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">وصف قصير (اختياري)</label>
                        <div className="relative">
                            <textarea
                                rows={3}
                                placeholder="تفاصيل إضافية عن المناسبة..."
                                className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-gold/20 resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                            <Info size={20} className="absolute left-4 top-4 text-gray-300" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">صورة المناسبة</label>
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-gold transition-colors"
                                    onClick={() => document.getElementById('image-upload')?.click()}
                                >
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-gray-300 flex flex-col items-center">
                                            <Hash size={24} />
                                            <span className="text-[10px] mt-1">اختر صورة</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('image-upload')?.click()}
                                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        تحميل صورة
                                    </button>
                                    <p className="text-[10px] text-gray-400 mt-2">يفضل استخدام صورة مربعة وبجودة عالية</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="block text-sm font-bold text-gray-700 mb-2">الحالة</label>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                className={`flex-grow rounded-xl font-bold flex items-center justify-center gap-2 transition-all p-4 ${formData.is_active ? 'bg-green-50 text-green-600 border-2 border-green-100' : 'bg-gray-50 text-gray-400 border-2 border-transparent'}`}
                            >
                                {formData.is_active ? 'نشطة للعموم' : 'مخفية مؤقتاً'}
                            </button>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="w-full bg-gold text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isUploading ? 'جاري الحفظ...' : 'تأكيد إضافة المناسبة'}
                        </button>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="w-full bg-transparent text-gray-400 py-4 mt-2 font-bold hover:text-gray-600"
                        >
                            إلغاء والعودة
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddOccasionPage;
