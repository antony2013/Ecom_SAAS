export const clothingTheme = {
  colors: {
    primary: '#1a1a1a',
    secondary: '#c9a84c',
    accent: '#e8c4b8',
    bg: '#fafafa',
    surface: '#ffffff',
    text: '#0a0a0a',
    textSecondary: '#6b6b6b',
    border: 'rgba(0,0,0,0.08)',
  },
  font: 'Cormorant Garamond',
  radius: '2px',
} as const;

export type ClothingTheme = typeof clothingTheme;