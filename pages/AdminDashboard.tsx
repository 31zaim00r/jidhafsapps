
import React, { useEffect, useState } from 'react';
import { poemService } from '../services/poemService';
import { Occasion } from '../types';
import { Settings, Plus, Edit2, Trash2, Users, Layout, Eye, EyeOff } from 'lucide-react';
import CustomModal from '../components/CustomModal';

const AdminDashboard: React.FC = () => {
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingOcc, setEditingOcc] = useState<Partial<Occasion> | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await poemService.getOccasions(false);
      setOccasions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSaveOccasion = async () => {
    if (!editingOcc?.name) return;
    try {
      await poemService.manageOccasion(editingOcc, selectedFile || undefined);
      setEditingOcc(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      loadData();
      setModal({
        isOpen: true,
        title: 'تم بنجاح',
        message: 'تم حفظ بيانات المناسبة بنجاح',
        type: 'success',
        onConfirm: () => setModal(prev => ({ ...prev, isOpen: false }))
      });
    } catch (e) {
      setModal({
        isOpen: true,
        title: 'خطأ',
        message: 'فشل حفظ بيانات المناسبة، يرجى المحاولة لاحقاً',
        type: 'danger',
        onConfirm: () => setModal(prev => ({ ...prev, isOpen: false }))
      });
    }
  };

  const handleDeleteOccasion = (id: string) => {
    setModal({
      isOpen: true,
      title: 'تأكيد الحذف',
      message: 'حذف هذه المناسبة سيؤثر على القصائد المرتبطة بها. هل أنت متأكد؟',
      type: 'danger',
      onConfirm: async () => {
        try {
          await poemService.deleteOccasion(id);
          setModal(prev => ({ ...prev, isOpen: false }));
          loadData();
        } catch (e) {
          setModal({
            isOpen: true,
            title: 'خطأ',
            message: 'فشل حذف المناسبة',
            type: 'danger',
            onConfirm: () => setModal(prev => ({ ...prev, isOpen: false }))
          });
        }
      }
    });
  };

  return (
    <div className="px-6 py-6 pb-24 space-y-8 page-transition">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">لوحة الإدارة</h1>
        <a href="#/admin/users" className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:text-gold transition-colors">
          <Users size={18} />
          المستخدمين
        </a>
      </div>

      {/* Occasions Management */}
      <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Layout size={20} className="text-gold" />
            إدارة المناسبات
          </h2>
          <button
            onClick={() => window.location.hash = '#/admin/add-occasion'}
            className="p-2 bg-gray-50 rounded-xl text-gold hover:bg-gold hover:text-white transition-all"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {occasions.map(occ => (
            <div key={occ.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden flex items-center justify-center text-xl">
                  {occ.icon?.startsWith('http') ? (
                    <img src={occ.icon} alt="" className="w-full h-full object-cover" />
                  ) : (
                    occ.icon || '🌙'
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{occ.name}</p>
                  <p className="text-[10px] text-gray-400">
                    {occ.is_active ? 'نشطة' : 'مخفية'} • {occ.id.substring(0, 8)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => {
                  setEditingOcc(occ);
                  setPreviewUrl(occ.icon?.startsWith('http') ? occ.icon : null);
                }} className="p-2 text-gray-400 hover:text-gold"><Edit2 size={18} /></button>
                <button onClick={() => handleDeleteOccasion(occ.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upsert Modal (Simple) */}
      {editingOcc && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6 text-right" dir="rtl">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold">{editingOcc.id ? 'تعديل مناسبة' : 'إضافة مناسبة جديدة'}</h3>
            <div className="space-y-4 text-right">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">اسم المناسبة</label>
                <input
                  placeholder="اسم المناسبة"
                  className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-gold/20"
                  value={editingOcc.name || ''}
                  onChange={e => setEditingOcc({ ...editingOcc, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">صورة المناسبة</label>
                <div className="flex items-center gap-4">
                  <div
                    className="w-20 h-20 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
                    onClick={() => document.getElementById('modal-image-upload')?.click()}
                  >
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Plus className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <input
                      id="modal-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('modal-image-upload')?.click()}
                      className="text-gold text-sm font-bold"
                    >
                      تغيير الصورة
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 py-2">
                <label className="text-sm font-bold text-gray-700">تفعيل المناسبة للعموم</label>
                <button
                  type="button"
                  onClick={() => setEditingOcc({ ...editingOcc, is_active: !editingOcc.is_active })}
                  className={`p-2 rounded-lg transition-colors ${editingOcc.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                >
                  {editingOcc.is_active ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSaveOccasion}
                className="flex-grow bg-gold text-white py-4 rounded-xl font-bold shadow-lg"
              >
                حفظ التغييرات
              </button>
              <button
                onClick={() => setEditingOcc(null)}
                className="px-6 bg-gray-100 text-gray-500 py-4 rounded-xl font-bold"
              >
                إلغاء
              </button>
            </div>
          </div>
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

export default AdminDashboard;
