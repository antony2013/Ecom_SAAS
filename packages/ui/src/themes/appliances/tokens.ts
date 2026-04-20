export const appliancesTheme = {
  colors: {
    primary: '#0052cc',
    secondary: '#172b4d',
    accent: '#36b37e',
    bg: '#f4f5f7',
    surface: '#ffffff',
    text: '#172b4d',
    textSecondary: '#5e6c84',
    border: 'rgba(23, 43, 77, 0.12)',
  },
  font: 'Inter',
  radius: '6px',
} as const;

export type AppliancesTheme = typeof appliancesTheme;