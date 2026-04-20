// System colors — never overridden by store theme
export const systemColors = {
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

// Store-themable color CSS variable references
export const themableColorVars = {
  primary: '--color-primary',
  secondary: '--color-secondary',
  accent: '--color-accent',
  background: '--color-bg',
  surface: '--color-surface',
  text: '--color-text',
  textSecondary: '--color-text-secondary',
  border: '--color-border',
} as const;

// Dashboard sidebar palette
export const dashboardColors = {
  sidebarBg: '#0f172a',
  sidebarText: '#e2e8f0',
  sidebarActive: 'var(--color-primary)',
  sidebarHover: '#1e293b',
  pageBg: '#f8fafc',
} as const;

export type SystemColor = keyof typeof systemColors;
export type ThemableColorVar = keyof typeof themableColorVars;