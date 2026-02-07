
export const API_URL = 'http://192.168.1.115:5000/api';

export const COLORS = {
  // Colores primarios - Púrpura 
  primary: '#7C3AED',
  primaryDark: '#5B21B6',
  primaryLight: '#A78BFA',
  
  // Colores secundarios - Cyan/Teal
  secondary: '#14B8A6',
  secondaryDark: '#0F766E',
  secondaryLight: '#5EEAD4',
  
  // Acentos
  accent: '#F59E0B',
  
  // Backgrounds
  background: '#F9FAFB',
  backgroundDark: '#1F2937',
  surface: '#FFFFFF',
  surfaceDark: '#374151',
  
  // Estados
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Textos
  text: '#111827',
  textLight: '#6B7280',
  textDark: '#FFFFFF',
  
  // Bordes y divisores
  border: '#E5E7EB',
  divider: '#F3F4F6',
  
  // Sombras y overlays
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Gradientes
export const GRADIENTS = {
  primary: ['#7C3AED', '#5B21B6'],
  secondary: ['#14B8A6', '#0F766E'],
  sunset: ['#F59E0B', '#EF4444'],
  ocean: ['#3B82F6', '#14B8A6'],
};

// Constantes de negocio
export const MAX_TABLES_PER_RESTAURANT = 15;
export const MAX_RESERVATIONS_PER_DAY = 20;

// Espaciado consistente
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Tipografía
export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: 'normal' },
  caption: { fontSize: 14, fontWeight: 'normal' },
  small: { fontSize: 12, fontWeight: 'normal' },
};

// Bordes redondeados
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};