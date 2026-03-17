
import React, { useState } from 'react';
import { useAuth } from '../App';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'خطأ في تسجيل الدخول');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-gray-50 text-center animate-scaleIn">
        <h1 className="text-3xl font-amiri font-black text-gray-900 mb-2">تسجيل الدخول</h1>
        <p className="text-gray-500 mb-8 font-bold text-sm">أهلاً بك مجدداً في أرشيف موكب جدحفص</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 text-xs font-bold border border-red-100 animate-shake">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-right">
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 mr-1">البريد الإلكتروني</label>
            <div className="relative">
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-4 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                placeholder="name@example.com"
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 mr-1">كلمة المرور</label>
            <div className="relative">
              <input
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-4 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                placeholder="••••••••"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn size={20} />
                تسجيل الدخول
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-500">
          ليس لديك حساب؟{' '}
          <a href="#/register" className="text-primary font-bold hover:underline">أنشئ حسابك الآن</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
