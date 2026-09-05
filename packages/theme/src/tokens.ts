import { DesignTokens, defaultDesignTokens } from '@school-cms/shared';

/**
 * Chuyển đổi đối tượng DesignTokens thành chuỗi CSS Variables tiêm vào :root hoặc style container
 */
export function generateCssVariables(tokens: DesignTokens = defaultDesignTokens): string {
  return `
    --color-primary: ${tokens.colors.primary};
    --color-primary-hover: ${tokens.colors.primaryHover};
    --color-secondary: ${tokens.colors.secondary};
    --color-accent: ${tokens.colors.accent};
    --color-text: ${tokens.colors.text};
    --color-text-muted: ${tokens.colors.textMuted};
    --color-bg: ${tokens.colors.background};
    --color-bg-subtle: ${tokens.colors.backgroundSubtle};
    --color-border: ${tokens.colors.border};
    --font-heading: ${tokens.typography.fontHeading};
    --font-body: ${tokens.typography.fontBody};
    --radius-sm: ${tokens.radius.sm};
    --radius-base: ${tokens.radius.base};
    --radius-lg: ${tokens.radius.lg};
    --radius-full: ${tokens.radius.full};
    --spacing-section-y: ${tokens.spacing.sectionPaddingY};
    --container-max-w: ${tokens.spacing.containerMaxWidth};
  `.trim();
}

/**
 * Trả về style object dùng trực tiếp cho React `style` prop
 */
export function generateCssVariablesStyleObject(tokens: DesignTokens = defaultDesignTokens): Record<string, string> {
  return {
    '--color-primary': tokens.colors.primary,
    '--color-primary-hover': tokens.colors.primaryHover,
    '--color-secondary': tokens.colors.secondary,
    '--color-accent': tokens.colors.accent,
    '--color-text': tokens.colors.text,
    '--color-text-muted': tokens.colors.textMuted,
    '--color-bg': tokens.colors.background,
    '--color-bg-subtle': tokens.colors.backgroundSubtle,
    '--color-border': tokens.colors.border,
    '--font-heading': tokens.typography.fontHeading,
    '--font-body': tokens.typography.fontBody,
    '--radius-sm': tokens.radius.sm,
    '--radius-base': tokens.radius.base,
    '--radius-lg': tokens.radius.lg,
    '--radius-full': tokens.radius.full,
    '--spacing-section-y': tokens.spacing.sectionPaddingY,
    '--container-max-w': tokens.spacing.containerMaxWidth,
  };
}
