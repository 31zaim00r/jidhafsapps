
import React, { useState } from 'react';
import { useAuth } from '../App';
import { UserPlus, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import CustomModal from '../components/CustomModal';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const data: any = await register(fullName, email, password, phone);
      if (!data?.session) {
        setModal({
          isOpen: true,
          title: 'تم التسجيل بنجاح',
          message: 'يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك قبل تسجيل الدخول.',
          type: 'success',
          onConfirm: () => {
            setModal(prev => ({ ...prev, isOpen: false }));
            window.location.hash = '#/login';
          }
        });
      }
      setIsLoading(false); // Reset loading state after successful registration
    } catch (err: any) {
      setError(err.message || 'خطأ في إنشاء الحساب');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-gray-50 text-center animate-scaleIn">
        <h1 className="text-3xl font-amiri font-black text-gray-900 mb-2">إنشاء حساب جديد</h1>
        <p className="text-gray-500 mb-8 font-bold text-sm">أهلاً بك في أرشيف موكب عزاء جدحفص</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 text-xs font-bold border border-red-100 animate-shake">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-right">
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 mr-1">الاسم الكامل</label>
            <div className="relative">
              <input
                required
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full p-4 pr-12 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all font-bold"
                placeholder="أدخل اسمك الكامل"
              />
              <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 mr-1">البريد الإلكتروني</label>
            <div className="relative">
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-4 pr-12 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all font-bold"
                placeholder="name@example.com"
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 mr-1">رقم الهاتف (اختياري)</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-4 pr-12 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all font-bold"
                placeholder="973XXXXXXXX"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 text-right">
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 mr-1">كلمة المرور</label>
              <div className="relative">
                <input
                  required
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-4 pr-12 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all font-bold"
                  placeholder="••••••••"
                  minLength={6}
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 mr-1">تأكيد كلمة المرور</label>
              <div className="relative">
                <input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full p-4 pr-12 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all font-bold shadow-sm"
                  placeholder="••••••••"
                  minLength={6}
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-gray-900 text-white rounded-[24px] font-black shadow-xl shadow-gray-200 hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <UserPlus size={22} />
                تأكيد إنشاء الحساب
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-50 text-xs font-bold text-gray-400">
          لديك حساب بالفعل؟{' '}
          <a href="#/login" className="text-gold font-black hover:underline mr-1">سجل دخولك الآن</a>
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

export default RegisterPage;
