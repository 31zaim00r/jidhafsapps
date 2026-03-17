
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Profile, UserRole } from './types';
import { authService } from './services/authService';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import PoemDetailsPage from './pages/PoemDetailsPage';
import AdminDashboard from './pages/AdminDashboard';
import UploadPoemPage from './pages/UploadPoemPage';
import ProfilePage from './pages/ProfilePage';
import OccasionsPage from './pages/OccasionsPage';
import MyPoemsPage from './pages/MyPoemsPage';
import ManageUsersPage from './pages/ManageUsersPage';
import AddOccasionPage from './pages/AddOccasionPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FavoritesPage from './pages/FavoritesPage';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';

interface AuthContextType {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, phone: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setCurrentPath(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);

    refreshUser(true);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const refreshUser = async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      const profile = await authService.getCurrentUser();
      setUser(profile);
    } catch (e) {
      setUser(null);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) refreshUser(false);
  }, [currentPath]);

  const login = async (email: string, pass: string) => {
    const profile = await authService.login(email, pass);
    setUser(profile);
    window.location.hash = '#/';
  };

  const register = async (name: string, email: string, pass: string, phone: string) => {
    const data = await authService.register(name, email, pass, phone);

    if (data?.session) {
      await refreshUser();
      window.location.hash = '#/';
    }
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    window.location.hash = '#/login';
  };

  const renderPage = () => {
    const path = currentPath.split('?')[0];
    const params = new URLSearchParams(currentPath.split('?')[1]);

    // Protection
    const isAdmin = user?.role === UserRole.ADMIN;
    const canUpload = user?.can_upload || isAdmin;

    switch (path) {
      case '#/': return <HomePage />;
      case '#/login': return <LoginPage />;
      case '#/register': return <RegisterPage />;
      case '#/poems': return <SearchPage />;
      case '#/search': return <SearchPage />;
      case '#/poem': return <PoemDetailsPage id={params.get('id') || ''} />;
      case '#/add-poem': return canUpload ? <UploadPoemPage /> : <HomePage />;
      case '#/my-poems': return user ? <MyPoemsPage /> : <LoginPage />;
      case '#/occasions': return <OccasionsPage />;
      case '#/admin': return isAdmin ? <AdminDashboard /> : <HomePage />;
      case '#/admin/users': return isAdmin ? <ManageUsersPage /> : <HomePage />;
      case '#/admin/add-occasion': return isAdmin ? <AddOccasionPage /> : <HomePage />;
      case '#/profile': return user ? <ProfilePage /> : <LoginPage />;
      case '#/about': return <AboutPage />;
      case '#/contact': return <ContactPage />;
      case '#/favorites': return user ? <FavoritesPage /> : <LoginPage />;
      default: return <HomePage />;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, refreshUser }}>
      <div className="min-h-screen flex flex-col pb-24 bg-soft-beige">
        <Header currentPath={currentPath} />
        <main className="flex-grow">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : renderPage()}
        </main>
        <BottomNav currentPath={currentPath} />
        <Footer />
      </div>
    </AuthContext.Provider>
  );
};

export default App;
