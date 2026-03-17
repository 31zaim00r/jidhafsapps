
import React from 'react';
import { useAuth } from '../App';
import { User, Calendar, Mail, Shield, ShieldAlert, ShieldCheck, ChevronRight, Users } from 'lucide-react';
import { UserRole } from '../types';

const ProfilePage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();

  React.useEffect(() => {
    refreshUser();
  }, []);

  if (!user) return null;

  const roleIcon = () => {
    switch (user.role) {
      case UserRole.ADMIN: return <ShieldCheck className="text-red-500" />;
      default: return <Shield className="text-blue-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Profile Header */}
        <div className="relative h-48 bg-gold/10">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
          <div className="absolute -bottom-16 right-8 p-1 bg-white rounded-full">
            <div className="w-32 h-32 bg-gold/10 rounded-full flex items-center justify-center text-gold text-5xl font-black border-4 border-white shadow-lg overflow-hidden">
              {user.profile_image ? (
                <img src={user.profile_image} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
          </div>
        </div>

        <div className="pt-20 pb-12 px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
              <div className="flex items-center gap-2 text-gray-500">
                {roleIcon()}
                <span className="font-medium">
                  {user.role === UserRole.ADMIN ? 'مسؤول النظام' : 'مستكشف'}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={logout}
                className="px-6 py-2 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors font-medium"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>

          {user.role === UserRole.ADMIN && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b pb-2 text-red-600">لوحة التحكم (للإدارة)</h3>
              <div className="grid grid-cols-1 gap-3">
                <a
                  href="#/admin"
                  className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="text-red-500" size={20} />
                    <span className="font-bold text-red-700">إدارة المناسبات والأرشيف</span>
                  </div>
                  <ChevronRight size={18} className="text-red-300 group-hover:translate-x-[-4px] transition-transform" />
                </a>
                <a
                  href="#/admin/users"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Users className="text-gray-500" size={20} />
                    <span className="font-bold text-gray-700">إدارة المستخدمين والصلاحيات</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-[-4px] transition-transform" />
                </a>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <h3 className="text-lg font-bold border-b pb-2">بيانات الحساب</h3>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <Mail size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">البريد الإلكتروني</p>
                <p className="font-medium">{user.email || 'غير متوفر'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <Calendar size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">تاريخ الانضمام</p>
                <p className="font-medium">{new Date(user.created_at).toLocaleDateString('ar-BH')}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold border-b pb-2">الحالة</h3>
            <div className="p-8 bg-gray-50 rounded-2xl flex items-center justify-center gap-3">
              <div className={`p-2 rounded-lg ${user.can_upload ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {user.can_upload ? <ShieldCheck size={24} /> : <Shield size={24} />}
              </div>
              <p className="font-bold text-gray-700">
                {user.can_upload ? 'لديك صلاحية رفع القصائد' : 'لا تملك صلاحية الرفع حالياً'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
