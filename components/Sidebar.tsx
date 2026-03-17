
import React from 'react';
import { X, Home, BookOpen, Info, ShieldCheck, Mail, LogOut, ChevronLeft } from 'lucide-react';
import { useAuth } from '../App';
import { UserRole } from '../types';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();

    const menuItems = [
        { title: 'الرئيسية', icon: <Home size={20} />, href: '#/' },
        { title: 'كافة المناسبات', icon: <BookOpen size={20} />, href: '#/occasions' },
        { title: 'عن الأرشيف', icon: <Info size={20} />, href: '#/about' },
        { title: 'تواصل معنا', icon: <Mail size={20} />, href: '#/contact' },
    ];

    const isAdmin = user?.role === UserRole.ADMIN;

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar Panel */}
            <div className={`fixed top-0 right-0 h-full w-4/5 max-w-[320px] bg-white z-[101] shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} rounded-l-[40px] overflow-hidden flex flex-col`}>

                {/* Header Decoration */}
                <div className="bg-gold/10 p-8 pt-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <button onClick={onClose} className="p-2 bg-white rounded-xl shadow-sm text-gray-500">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-2 mt-4 text-center">
                        <h2 className="text-2xl font-black text-gray-900 leading-tight">القائمة <span className="text-gold">الرئيسية</span></h2>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">أرشيف موكب جدحفص</p>
                    </div>
                </div>

                {/* User Profile Summary (Simplified) */}
                {user && (
                    <div className="px-8 py-6 border-b border-gray-50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold text-xl font-bold border-2 border-white shadow-sm overflow-hidden">
                                {user.profile_image ? (
                                    <img src={user.profile_image} className="w-full h-full object-cover" />
                                ) : (
                                    user.name.charAt(0)
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 line-clamp-1">{user.name}</p>
                                <p className="text-[10px] text-gold font-black">{isAdmin ? 'مسؤول النظام' : 'عضو الأرشيف'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Menu Items */}
                <div className="flex-grow overflow-y-auto px-6 py-6 space-y-2">
                    {menuItems.map((item, idx) => (
                        <a
                            key={idx}
                            href={item.href}
                            onClick={onClose}
                            className="flex items-center justify-between p-4 rounded-2xl hover:bg-gold/5 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="text-gray-400 group-hover:text-gold transition-colors">
                                    {item.icon}
                                </div>
                                <span className="font-bold text-gray-700 group-hover:text-gray-900">{item.title}</span>
                            </div>
                            <ChevronLeft size={16} className="text-gray-300 group-hover:text-gold transition-all" />
                        </a>
                    ))}

                    {isAdmin && (
                        <div className="pt-4 mt-4 border-t border-gray-100">
                            <h4 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">الإدارة</h4>
                            <a href="#/admin" onClick={onClose} className="flex items-center gap-4 p-4 rounded-2xl bg-red-50/50 text-red-600 font-bold mb-2">
                                <ShieldCheck size={20} />
                                <span>لوحة التحكم</span>
                            </a>
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className="p-8 border-t border-gray-50">
                    {user ? (
                        <button
                            onClick={() => { logout(); onClose(); }}
                            className="w-full py-4 flex items-center justify-center gap-3 bg-gray-50 rounded-2xl text-gray-500 font-bold hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                            <LogOut size={20} />
                            <span>تسجيل الخروج</span>
                        </button>
                    ) : (
                        <a
                            href="#/login"
                            onClick={onClose}
                            className="w-full py-4 flex items-center justify-center gap-3 bg-gold text-white rounded-2xl font-bold shadow-lg shadow-gold/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <span>تسجيل الدخول</span>
                        </a>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
