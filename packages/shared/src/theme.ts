export interface DesignTokens {
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    text: string;
    textMuted: string;
    background: string;
    backgroundSubtle: string;
    border: string;
  };
  typography: {
    fontHeading: string;
    fontBody: string;
  };
  radius: {
    sm: string;
    base: string;
    lg: string;
    full: string;
  };
  spacing: {
    sectionPaddingY: string;
    containerMaxWidth: string;
  };
}

export const defaultDesignTokens: DesignTokens = {
  colors: {
    primary: '#047857', // Emerald 700
    primaryHover: '#065f46',
    secondary: '#d97706', // Amber 600
    accent: '#2563eb', // Blue 600
    text: '#0f172a',
    textMuted: '#64748b',
    background: '#ffffff',
    backgroundSubtle: '#f8fafc',
    border: '#e2e8f0',
  },
  typography: {
    fontHeading: "'Outfit', sans-serif",
    fontBody: "'Inter', sans-serif",
  },
  radius: {
    sm: '4px',
    base: '8px',
    lg: '16px',
    full: '9999px',
  },
  spacing: {
    sectionPaddingY: '80px',
    containerMaxWidth: '1280px',
  },
};
