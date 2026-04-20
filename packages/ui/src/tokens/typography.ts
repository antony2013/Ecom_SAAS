export const typeScale = {
  xs: { size: '12px', weight: 400, lineHeight: '16px' },
  sm: { size: '14px', weight: 400, lineHeight: '20px' },
  base: { size: '16px', weight: 400, lineHeight: '24px' },
  lg: { size: '18px', weight: 500, lineHeight: '28px' },
  xl: { size: '20px', weight: 600, lineHeight: '28px' },
  '2xl': { size: '24px', weight: 600, lineHeight: '32px' },
  '3xl': { size: '30px', weight: 700, lineHeight: '36px' },
  '4xl': { size: '36px', weight: 700, lineHeight: '40px' },
} as const;

export type TypeScaleKey = keyof typeof typeScale;

export const fontFamilies = {
  display: ['Playfair Display', 'Cormorant Garamond', 'Inter'],
  body: ['Inter', 'Lato', 'Nunito', 'Raleway', 'Montserrat', 'Roboto'],
} as const;

export const defaultFontStack = 'Inter, system-ui, -apple-system, sans-serif';