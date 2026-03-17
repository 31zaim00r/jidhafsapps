
import { DatabaseSchema, UserRole, PoemClassification } from '../types';
import { INITIAL_OCCASIONS } from '../constants';

const DB_KEY = 'azaa_jidhafs_db';

const INITIAL_DATA: DatabaseSchema = {
  users: [
    {
      id: 'admin-1',
      fullName: 'مدير النظام',
      email: 'admin@azaa.com',
      role: UserRole.ADMIN,
      createdAt: new Date().toISOString()
    },
    {
      id: 'editor-1',
      fullName: 'محرر محتوى',
      email: 'editor@azaa.com',
      role: UserRole.EDITOR,
      createdAt: new Date().toISOString()
    }
  ],
  poems: [
    {
      id: 'p1',
      name: 'يا ليلة القدر',
      poetName: 'سيد ناصر الموسوي',
      occasionId: '4',
      classification: PoemClassification.QASIDA,
      year: 1445,
      pdfUrl: '#',
      uploaderId: 'admin-1',
      downloadCount: 124,
      createdAt: new Date().toISOString()
    },
    {
      id: 'p2',
      name: 'أهل البيت هم النجاة',
      poetName: 'الشاعر جاسم الجمري',
      occasionId: '2',
      classification: PoemClassification.MUWASHSHAH,
      year: 1444,
      pdfUrl: '#',
      uploaderId: 'editor-1',
      downloadCount: 89,
      createdAt: new Date().toISOString()
    }
  ],
  occasions: INITIAL_OCCASIONS,
  favorites: {}
};

export const getDb = (): DatabaseSchema => {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }

  const parsed = JSON.parse(data);
  // If the database exists but poems are empty, re-inject initial data for local development
  if (!parsed.poems || parsed.poems.length === 0) {
    localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }

  return parsed;
};

export const saveDb = (data: DatabaseSchema) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

// Global helper for debugging/resetting
if (typeof window !== 'undefined') {
  (window as any).resetAzaDb = () => {
    localStorage.removeItem(DB_KEY);
    window.location.reload();
  };
}
