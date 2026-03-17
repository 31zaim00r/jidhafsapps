import React from 'react';
import { Home, Search, Bookmark, Plus, User } from 'lucide-react';
import { useAuth } from '../App';
import { UserRole } from '../types';

interface BottomNavProps {
    currentPath: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentPath }) => {
    const { user } = useAuth();
    const path = currentPath.split('?')[0];

    const canUpload = user?.role === UserRole.ADMIN || user?.can_upload;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-6 py-3 flex justify-between items-end z-50 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
            <a href="#/" className={`flex flex-col items-center gap-1.5 pb-2 transition-all ${path === '#/' ? 'text-gold scale-110' : 'text-gray-400'}`}>
                <Home size={22} strokeWidth={path === '#/' ? 2.5 : 2} />
                <span className="text-[10px] font-bold">الرئيسية</span>
            </a>
            <a href="#/search" className={`flex flex-col items-center gap-1.5 pb-2 transition-all ${path === '#/search' || path === '#/poems' ? 'text-gold scale-110' : 'text-gray-400'}`}>
                <Search size={22} strokeWidth={path === '#/search' || path === '#/poems' ? 2.5 : 2} />
                <span className="text-[10px] font-bold">البحث</span>
            </a>

            {/* Fab Center Button */}
            <div className="relative -top-6">
                <a
                    href="#/add-poem"
                    className="w-14 h-14 bg-gold rounded-2xl flex items-center justify-center text-white shadow-[0_8px_20px_rgba(191,155,48,0.4)] hover:scale-110 active:scale-90 transition-all border-4 border-white"
                >
                    <Plus size={32} strokeWidth={3} />
                </a>
            </div>

            <a href="#/favorites" className={`flex flex-col items-center gap-1.5 pb-2 transition-all ${path === '#/favorites' ? 'text-gold scale-110' : 'text-gray-400'}`}>
                <Bookmark size={22} strokeWidth={path === '#/favorites' ? 2.5 : 2} />
                <span className="text-[10px] font-bold">مفضلتي</span>
            </a>
            <a href="#/profile" className={`flex flex-col items-center gap-1.5 pb-2 transition-all ${path === '#/profile' ? 'text-gold scale-110' : 'text-gray-400'}`}>
                <User size={22} strokeWidth={path === '#/profile' ? 2.5 : 2} />
                <span className="text-[10px] font-bold">حسابي</span>
            </a>
        </div>
    );
};

export default BottomNav;
