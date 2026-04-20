export const foodTheme = {
  colors: {
    primary: '#e85d04',
    secondary: '#370617',
    accent: '#faa307',
    bg: '#fffbf5',
    surface: '#fff8ee',
    text: '#1a0a00',
    textSecondary: '#7c4a1e',
    border: 'rgba(232, 93, 4, 0.15)',
  },
  font: 'Playfair Display',
  radius: '12px',
} as const;

export type FoodTheme = typeof foodTheme;