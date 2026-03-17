
import React from 'react';
import { useAuth } from '../App';
import { Menu, Bell, User, ChevronRight } from 'lucide-react';
import Sidebar from './Sidebar';

interface HeaderProps {
  currentPath: string;
}

const Header: React.FC<HeaderProps> = ({ currentPath }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const isHome = currentPath === '#/' || currentPath === '';

  return (
    <>
      <header className="px-6 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {!isHome ? (
              <button
                onClick={() => window.history.back()}
                className="p-2 -ml-2 text-gray-700 hover:text-gold transition-colors flex items-center gap-1"
              >
                <ChevronRight size={24} />
                <span className="font-bold">رجوع</span>
              </button>
            ) : (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-gray-700 hover:text-gold transition-colors"
                id="hamburger-menu"
              >
                <Menu size={24} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <a href="#/" className="text-xl font-black text-gray-900 tracking-tighter">
              موكب عزاء <span className="text-gold">جدحفص</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-700 hover:text-gold transition-colors hidden sm:block">
              <Bell size={24} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#f5f0e6]">
                3
              </span>
            </button>

            <a href="#/profile" className="w-10 h-10 rounded-full bg-white shadow-sm border-2 border-white overflow-hidden flex items-center justify-center transition-transform active:scale-95">
              {user ? (
                user.profile_image ? (
                  <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gold/10 flex items-center justify-center text-gold font-black text-sm">
                    {user.name.charAt(0)}
                  </div>
                )
              ) : (
                <User size={20} className="text-gray-300" />
              )}
            </a>
          </div>
        </div>
      </header>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Header;
