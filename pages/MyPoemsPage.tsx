
import React, { useEffect, useState } from 'react';
import { poemService } from '../services/poemService';
import { Poem } from '../types';
import PoemCard from '../components/PoemCard';
import { FileText, Plus, Trash2 } from 'lucide-react';
import CustomModal from '../components/CustomModal';

const MyPoemsPage: React.FC = () => {
    const [poems, setPoems] = useState<Poem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
        loadMyPoems();
    }, []);

    const loadMyPoems = async () => {
        try {
            const data = await poemService.getMyPoems();
            setPoems(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        setModal({
            isOpen: true,
            title: 'تأكيد الحذف',
            message: 'هل أنت متأكد من حذف هذه القصيدة؟ لا يمكن التراجع عن هذا الإجراء.',
            type: 'danger',
            onConfirm: async () => {
                try {
                    await poemService.deletePoem(id);
                    setPoems(prev => prev.filter(p => p.id !== id));
                    setModal(prev => ({ ...prev, isOpen: false }));
                } catch (e) {
                    setModal({
                        isOpen: true,
                        title: 'خطأ',
                        message: 'فشل حذف القصيدة، يرجى المحاولة لاحقاً',
                        type: 'danger',
                        onConfirm: () => setModal(prev => ({ ...prev, isOpen: false }))
                    });
                }
            }
        });
    };

    if (isLoading) return null;

    return (
        <div className="px-6 py-6 pb-24 space-y-8 page-transition">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">قصائدي المرفوعة</h1>
                <a
                    href="#/add-poem"
                    className="bg-gold text-white p-3 rounded-2xl shadow-lg active:scale-95 transition-all"
                >
                    <Plus size={24} />
                </a>
            </div>

            {poems.length > 0 ? (
                <div className="space-y-4">
                    {poems.map(poem => (
                        <div key={poem.id} className="relative group">
                            <PoemCard
                                variant="list"
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
                            <button
                                onClick={() => handleDelete(poem.id)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 italic text-gray-400">
                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                    لم تقم برفع أي قصائد بعد
                </div>
            )}

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

export default MyPoemsPage;
