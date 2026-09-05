import { ContentStatus } from './enums';

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  branchId?: string | null;
  sortOrder: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageUrl?: string;
  categoryId: string;
  category?: Category;
  authorId?: string;
  authorName?: string;
  branchId?: string | null;
  status: ContentStatus;
  isFeatured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
