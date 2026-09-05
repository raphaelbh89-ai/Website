import { ContentStatus, DeviceVisibility, SectionLayoutWidth } from './enums';

export interface BlockInstance<TConfig = Record<string, any>> {
  id: string;
  type: string;
  version: number;
  sortOrder: number;
  isActive: boolean;
  config: TConfig;
  customClasses?: string;
}

export interface SectionSettings {
  layout?: {
    width?: SectionLayoutWidth;
    columns?: number;
    columnGap?: string;
  };
  spacing?: {
    paddingTop?: string;
    paddingBottom?: string;
    marginTop?: string;
    marginBottom?: string;
  };
  background?: {
    type?: 'none' | 'color' | 'image';
    colorValue?: string;
    imageUrl?: string;
    overlayOpacity?: number;
  };
  visibility?: {
    device?: DeviceVisibility;
    startDate?: string | null;
    endDate?: string | null;
  };
}

export interface PageSection {
  id: string;
  pageId: string;
  name: string;
  sortOrder: number;
  isVisible: boolean;
  settings: SectionSettings;
  blocks: BlockInstance[];
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  templateCode: string;
  branchId?: string | null;
  status: ContentStatus;
  publishedAt?: string;
  sections: PageSection[];
  createdAt: string;
  updatedAt: string;
}
