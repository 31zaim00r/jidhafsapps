
import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { Profile, UserRole } from '../types';
import { Shield, ShieldAlert, CheckCircle2, XCircle, Search, Key, Phone } from 'lucide-react';
import CustomModal from '../components/CustomModal';

const ManageUsersPage: React.FC = () => {
    const [users, setUsers] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Modal State
    const [passwordInput, setPasswordInput] = useState('');
    const [phoneInput, setPhoneInput] = useState('');
    const [modal, setModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'info' | 'success' | 'danger' | 'warning';
        confirmText?: string;
        onConfirm: () => void;
        showInput?: boolean;
        inputValue?: string;
        targetUserId?: string;
        actionType?: 'password' | 'phone';
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: () => { }
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await authService.getAllUsers();
            setUsers(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleUpload = async (userId: string, current: boolean) => {
        setModal({
            isOpen: true,
            title: 'تعديل الصلاحية',
            message: `هل أنت متأكد من ${current ? 'إلغاء' : 'تفعيل'} صلاحية الرفع لهذا المستخدم؟`,
            type: 'warning',
            confirmText: 'تحديث',
            onConfirm: async () => {
                try {
                    const success = await authService.updateUserPermissions(userId, { can_upload: !current });
                    if (!success) throw new Error('لم يتم العثور على سجل للمستخدم في قاعدة البيانات');

                    setModal(prev => ({ ...prev, isOpen: false }));
                    loadUsers();
                } catch (e: any) {
                    setModal({
                        isOpen: true,
                        title: 'خطأ',
                        message: e.message || 'فشل تفعيل الصلاحية، يرجى المحاولة لاحقاً',
                        type: 'danger',
                        onConfirm: () => setModal(prev => ({ ...prev, isOpen: false }))
                    });
                }
            }
        });
    };

    const changeRole = async (userId: string, current: UserRole) => {
        const newRole = current === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN;
        setModal({
            isOpen: true,
            title: 'تغيير الرتبة',
            message: `هل أنت متأكد من تحويل العضو إلى ${newRole === UserRole.ADMIN ? 'مدير' : 'عضو عادي'}؟`,
            type: 'danger',
            confirmText: 'تغيير الآن',
            onConfirm: async () => {
                try {
                    await authService.updateUserPermissions(userId, { role: newRole });
                    setModal(prev => ({ ...prev, isOpen: false }));
                    loadUsers();
                } catch (e) {
                    setModal({
                        isOpen: true,
                        title: 'خطأ',
                        message: 'فشل تغيير الرتبة',
                        type: 'danger',
                        onConfirm: () => setModal(prev => ({ ...prev, isOpen: false }))
                    });
                }
            }
        });
    };

    const resetPassword = (userId: string) => {
        setPasswordInput('');
        setModal({
            isOpen: true,
            title: 'إعادة تعيين كلمة المرور',
            message: 'أدخل كلمة المرور الجديدة للمستخدم (6 أحرف على الأقل):',
            type: 'info',
            confirmText: 'تحديث الكلمة',
            showInput: true,
            targetUserId: userId,
            actionType: 'password',
            onConfirm: () => { }
        });
    };

    const editPhone = (userId: string, currentPhone: string | null) => {
        setPhoneInput(currentPhone || '');
        setModal({
            isOpen: true,
            title: 'تحديث رقم الهاتف',
            message: 'أدخل رقم الهاتف الجديد للمستخدم:',
            type: 'info',
            confirmText: 'حفظ الرقم',
            showInput: true,
            targetUserId: userId,
            actionType: 'phone',
            onConfirm: () => { }
        });
    };

    const handleConfirmReset = async (userId: string, pass: string) => {
        if (!pass || pass.length < 6) {
            setModal({
                isOpen: true,
                title: 'تنبيه',
                message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
                type: 'warning',
                onConfirm: () => resetPassword(userId)
            });
            return;
        }
        try {
            await authService.updateUserPermissions(userId, { password: pass });
            setModal({
                isOpen: true,
                title: 'نجاح',
                message: 'تم تحديث كلمة المرور بنجاح',
                type: 'success',
                onConfirm: () => {
                    setModal(prev => ({ ...prev, isOpen: false }));
                    loadUsers();
                }
            });
        } catch (e) {
            setModal({
                isOpen: true,
                title: 'خطأ',
                message: 'حدث خطأ أثناء تحديث كلمة المرور',
                type: 'danger',
                onConfirm: () => setModal(prev => ({ ...prev, isOpen: false }))
            });
        }
    };

    const handleConfirmPhone = async (userId: string, phone: string) => {
        try {
            await authService.updateUserPermissions(userId, { phone_number: phone });
            setModal({
                isOpen: true,
                title: 'نجاح',
                message: 'تم تحديث رقم الهاتف بنجاح',
                type: 'success',
                onConfirm: () => {
                    setModal(prev => ({ ...prev, isOpen: false }));
                    loadUsers();
                }
            });
        } catch (e) {
            setModal({
                isOpen: true,
                title: 'خطأ',
                message: 'حدث خطأ أثناء التحديث',
                type: 'danger',
                onConfirm: () => setModal(prev => ({ ...prev, isOpen: false }))
            });
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="px-6 py-6 pb-24 space-y-8 page-transition">
            <div className="space-y-4">
                <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="البحث بالاسم أو البريد..."
                        className="w-full bg-white border-none rounded-2xl py-4 pr-12 pl-6 shadow-sm focus:ring-2 focus:ring-gold/20 font-bold"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                </div>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
                        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                        <p className="font-bold text-sm">جاري جلب قائمة المستخدمين...</p>
                    </div>
                ) : filteredUsers.length > 0 ? (
                    filteredUsers.map(u => (
                        <div key={u.id} className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col gap-5">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl ${u.role === UserRole.ADMIN ? 'bg-red-500 shadow-lg shadow-red-100' : 'bg-gold shadow-lg shadow-gold/20'}`}>
                                        {(u.name || u.email || '?').charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{u.name || 'مستخدم جديد'}</h3>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-[10px] font-bold text-gray-400">{u.email}</p>
                                            {u.phone_number && (
                                                <p className="text-[10px] font-black text-gold flex items-center gap-1">
                                                    <Phone size={10} /> {u.phone_number}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${u.role === UserRole.ADMIN ? 'bg-red-50 text-red-600' : 'bg-gold/10 text-gold'}`}>
                                    {u.role === UserRole.ADMIN ? 'مدير النظام' : 'عضو الأرشيف'}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => toggleUpload(u.id, u.can_upload)}
                                    className={`flex items-center justify-center gap-3 py-4 rounded-3xl text-[10px] font-black transition-all ${u.can_upload ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-50 text-gray-400 border border-transparent'}`}
                                >
                                    {u.can_upload ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                    صلاحية الرفع
                                </button>

                                <button
                                    onClick={() => resetPassword(u.id)}
                                    className="flex items-center justify-center gap-3 py-4 rounded-3xl text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-100 active:scale-95 transition-all"
                                >
                                    <Key size={18} />
                                    تغيير السر
                                </button>

                                <button
                                    onClick={() => changeRole(u.id, u.role || UserRole.USER)}
                                    className={`flex items-center justify-center gap-3 py-4 rounded-3xl text-[10px] font-black transition-all ${u.role === UserRole.ADMIN ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-gray-900 text-white shadow-md'}`}
                                >
                                    {u.role === UserRole.ADMIN ? <ShieldAlert size={18} /> : <Shield size={18} />}
                                    تغيير الرتبة
                                </button>

                                <button
                                    onClick={() => editPhone(u.id, u.phone_number)}
                                    className="flex items-center justify-center gap-3 py-4 rounded-3xl text-[10px] font-black bg-gold/10 text-gold border border-gold/10 active:scale-95 transition-all"
                                >
                                    <Phone size={18} />
                                    تحديث الهاتف
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 opacity-40 bg-white rounded-[40px] border border-dashed border-gray-200">
                        <Search size={48} className="mx-auto mb-4" />
                        <p className="font-bold">لا يوجد مستخدمين لعرضهم</p>
                    </div>
                )}
            </div>

            <CustomModal
                isOpen={modal.isOpen}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                confirmText={modal.confirmText}
                onConfirm={() => {
                    if (modal.showInput && modal.targetUserId) {
                        if (modal.actionType === 'password') {
                            handleConfirmReset(modal.targetUserId, passwordInput);
                        } else if (modal.actionType === 'phone') {
                            handleConfirmPhone(modal.targetUserId, phoneInput);
                        }
                    } else {
                        modal.onConfirm();
                    }
                }}
                onCancel={() => setModal(prev => ({ ...prev, isOpen: false }))}
                showInput={modal.showInput}
                inputValue={modal.actionType === 'password' ? passwordInput : phoneInput}
                onInputChange={modal.actionType === 'password' ? setPasswordInput : setPhoneInput}
                placeholder={modal.actionType === 'password' ? '••••••••' : '973XXXXXXXX'}
            />
        </div>
    );
};

export default ManageUsersPage;
