
import { PoemClassification, UserRole } from './types';

export const INITIAL_OCCASIONS = [
  { id: '1', name: 'عاشوراء' },
  { id: '2', name: 'مولد النبي' },
  { id: '3', name: 'وفاة الإمام علي' },
  { id: '4', name: 'ليالي القدر' },
  { id: '5', name: 'عيد الفطر' }
];

export const APP_THEME = {
  primary: '#d4a373', // Golden tan from the image
  secondary: '#2d2d2d', // Deep charcoal for text
  accent: '#e67e22',
  bg: '#f5f0e6', // Soft beige background from the image
  surface: '#ffffff',
};

export const CLASSIFICATIONS = Object.values(PoemClassification);
export const ROLES = Object.values(UserRole);
