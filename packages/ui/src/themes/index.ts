import { foodTheme } from './food/tokens.js';
import { clothingTheme } from './clothing/tokens.js';
import { appliancesTheme } from './appliances/tokens.js';

export type ThemeType = 'food' | 'clothing' | 'appliances';

export interface ThemeTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  font: string;
  radius: string;
}

export interface ThemeConfig {
  tokens: ThemeTokens;
  productCard: string;
  heroSection: string;
  categoryDisplay: string;
  homeSections: string[];
}

export const themeRegistry: Record<ThemeType, ThemeConfig> = {
  food: {
    tokens: foodTheme,
    productCard: 'FoodCard',
    heroSection: 'FoodHero',
    categoryDisplay: 'MenuSection',
    homeSections: ['HeroSection', 'CategoryMenuSection', 'FeaturedDishesSection', 'PopularSection'],
  },
  clothing: {
    tokens: clothingTheme,
    productCard: 'LookbookCard',
    heroSection: 'EditorialHero',
    categoryDisplay: 'StyleGrid',
    homeSections: ['EditorialHeroSection', 'NewArrivalsSection', 'CategoryStyleGrid', 'TrendingSection'],
  },
  appliances: {
    tokens: appliancesTheme,
    productCard: 'SpecCard',
    heroSection: 'ProductHero',
    categoryDisplay: 'CategoryList',
    homeSections: ['ProductHeroSection', 'ShopByCategorySection', 'FeaturedSpecsSection', 'BrandTrustSection'],
  },
};

export function resolveTheme(
  themeType: ThemeType,
  overrides?: Partial<ThemeTokens['colors']> & { fontFamily?: string; borderRadius?: number }
): ThemeTokens {
  const preset = themeRegistry[themeType].tokens;
  return {
    colors: {
      primary: overrides?.primary ?? preset.colors.primary,
      secondary: overrides?.secondary ?? preset.colors.secondary,
      accent: overrides?.accent ?? preset.colors.accent,
      bg: overrides?.bg ?? preset.colors.bg,
      surface: overrides?.surface ?? preset.colors.surface,
      text: overrides?.text ?? preset.colors.text,
      textSecondary: overrides?.textSecondary ?? preset.colors.textSecondary,
      border: overrides?.border ?? preset.colors.border,
    },
    font: overrides?.fontFamily ?? preset.font,
    radius: overrides?.borderRadius !== undefined ? `${overrides.borderRadius}px` : preset.radius,
  };
}

export function themeToCssVars(theme: ThemeTokens): Record<string, string> {
  return {
    '--color-primary': theme.colors.primary,
    '--color-secondary': theme.colors.secondary,
    '--color-accent': theme.colors.accent,
    '--color-bg': theme.colors.bg,
    '--color-surface': theme.colors.surface,
    '--color-text': theme.colors.text,
    '--color-text-secondary': theme.colors.textSecondary,
    '--color-border': theme.colors.border,
    '--font-family': `'${theme.font}', Georgia, serif`,
    '--radius-base': theme.radius,
  };
}

export { foodTheme, clothingTheme, appliancesTheme };