export interface Branch {
  id: string;
  name: string;
  code: string;
  slug: string;
  address: string;
  phone: string;
  email: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
  themeId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  gradeLevels: string;
  overview: string;
  featuredImageUrl?: string;
  isActive: boolean;
}

export interface Facility {
  id: string;
  branchId: string;
  title: string;
  description: string;
  galleryUrls: string[];
  sortOrder: number;
}
