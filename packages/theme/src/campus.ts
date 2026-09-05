import { DesignTokens, defaultDesignTokens } from '@school-cms/shared';

export interface CampusThemeInfo {
  branchSlug: string;
  campusName: string;
  badge: string;
  tokens: DesignTokens;
}

/**
 * Dedicated Campus Theme Tokens adhering to Section 10.4 of docs/10-multi-branch.md
 */
export const CAMPUS_THEMES: Record<string, CampusThemeInfo> = {
  'bien-hoa': {
    branchSlug: 'bien-hoa',
    campusName: 'Alpha School Cơ Sở Biên Hòa',
    badge: 'Alpha Đồng Nai',
    tokens: {
      ...defaultDesignTokens,
      colors: {
        ...defaultDesignTokens.colors,
        primary: '#047857', // Emerald Green 700
        primaryHover: '#065f46',
        secondary: '#0f766e',
        accent: '#f59e0b', // Amber 500
      },
      typography: {
        ...defaultDesignTokens.typography,
        fontHeading: "'Outfit', sans-serif",
      },
    },
  },
  'thu-duc': {
    branchSlug: 'thu-duc',
    campusName: 'Alpha School Cơ Sở TP. Thủ Đức',
    badge: 'Alpha TP. Hồ Chí Minh',
    tokens: {
      ...defaultDesignTokens,
      colors: {
        ...defaultDesignTokens.colors,
        primary: '#1d4ed8', // Royal Blue 700
        primaryHover: '#1e40af',
        secondary: '#0369a1',
        accent: '#38bdf8', // Sky Blue 400
      },
      typography: {
        ...defaultDesignTokens.typography,
        fontHeading: "'Outfit', sans-serif",
      },
    },
  },
  'cau-giay': {
    branchSlug: 'cau-giay',
    campusName: 'Alpha School Cơ Sở Cầu Giấy',
    badge: 'Alpha Hà Nội',
    tokens: {
      ...defaultDesignTokens,
      colors: {
        ...defaultDesignTokens.colors,
        primary: '#b91c1c', // Academic Crimson Red 700
        primaryHover: '#991b1b',
        secondary: '#9a3412',
        accent: '#fbbf24', // Golden Amber 400
      },
      typography: {
        ...defaultDesignTokens.typography,
        fontHeading: "'Outfit', sans-serif",
      },
    },
  },
};

/**
 * Retrieves the theme tokens for a specific campus, falling back to default global tokens
 */
export function getCampusThemeTokens(branchSlug?: string | null): DesignTokens {
  if (!branchSlug) return defaultDesignTokens;
  const campus = CAMPUS_THEMES[branchSlug];
  return campus ? campus.tokens : defaultDesignTokens;
}

/**
 * Resolves campus branch slug from incoming HTTP Host header
 * Examples:
 * - 'bienhoa.school.edu.vn' -> 'bien-hoa'
 * - 'bien-hoa.localhost:3000' -> 'bien-hoa'
 * - 'thuduc.school.edu.vn' -> 'thu-duc'
 * - 'caugiay.school.edu.vn' -> 'cau-giay'
 * - 'truongbienhoa.edu.vn' (custom domain) -> 'bien-hoa'
 * - 'school.edu.vn' or 'localhost:3000' -> null (Global Root)
 */
export function resolveCampusFromHost(
  hostname: string,
  customDomainMap: Record<string, string> = {
    'truongbienhoa.edu.vn': 'bien-hoa',
    'truongthuduc.edu.vn': 'thu-duc',
    'truongcaugiay.edu.vn': 'cau-giay',
  }
): string | null {
  if (!hostname) return null;

  const cleanHost = hostname.toLowerCase().split(':')[0].trim();

  // 1. Check custom domain mapping
  if (customDomainMap[cleanHost]) {
    return customDomainMap[cleanHost];
  }

  // 2. Extract subdomain
  // Matches e.g. 'bienhoa.school.edu.vn' or 'bien-hoa.localhost'
  const parts = cleanHost.split('.');
  if (parts.length >= 2) {
    const sub = parts[0];
    if (sub === 'bienhoa' || sub === 'bien-hoa') return 'bien-hoa';
    if (sub === 'thuduc' || sub === 'thu-duc') return 'thu-duc';
    if (sub === 'caugiay' || sub === 'cau-giay') return 'cau-giay';
  }

  return null;
}
