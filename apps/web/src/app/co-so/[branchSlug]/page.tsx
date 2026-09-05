import React from 'react';
import { Page, ContentStatus } from '@school-cms/shared';
import { DynamicPageRenderer } from '../../../components/DynamicPageRenderer';

interface BranchPageProps {
  params: {
    branchSlug: string;
  };
}

export default function BranchPage({ params }: BranchPageProps) {
  const branchName =
    params.branchSlug === 'bien-hoa'
      ? 'Biên Hòa - Đồng Nai'
      : params.branchSlug === 'thu-duc'
      ? 'TP. Thủ Đức - TP. HCM'
      : params.branchSlug.toUpperCase();

  // Page layout động theo cơ sở
  const branchPageData: Page = {
    id: `page-branch-${params.branchSlug}`,
    title: `Alpha School - Cơ sở ${branchName}`,
    slug: `co-so/${params.branchSlug}`,
    templateCode: 'campus_landing',
    branchId: params.branchSlug,
    status: ContentStatus.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'sec-branch-hero',
        pageId: `page-branch-${params.branchSlug}`,
        name: 'Branch Hero Section',
        sortOrder: 1,
        isVisible: true,
        settings: {
          layout: { width: 'full_width' as any },
        },
        blocks: [
          {
            id: 'blk-b-hero',
            type: 'hero_banner',
            version: 1,
            sortOrder: 1,
            isActive: true,
            config: {
              title: `Chào Đón Đến Với Alpha School Cơ Sở ${branchName}`,
              subtitle: 'Không gian học tập chuẩn quốc tế với cơ sở vật chất hiện đại, bể bơi 4 mùa và phòng Lab STEM',
              primaryButtonText: `Đăng ký tham quan Cơ sở ${branchName}`,
              primaryButtonUrl: `/tuyen-sinh?branch=${params.branchSlug}`,
              backgroundImageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop',
              overlayOpacity: 0.5,
              textAlignment: 'center',
            },
          },
        ],
      },
      {
        id: 'sec-branch-programs',
        pageId: `page-branch-${params.branchSlug}`,
        name: 'Chương trình tại cơ sở',
        sortOrder: 2,
        isVisible: true,
        settings: {
          layout: { width: 'container' as any },
        },
        blocks: [
          {
            id: 'blk-b-programs',
            type: 'program_list',
            version: 1,
            sortOrder: 1,
            isActive: true,
            config: {
              title: `Chương Trình Giảng Dạy Tại Cơ Sở ${branchName}`,
              subtitle: 'Các lộ trình học tập đang được triển khai trực tiếp tại cơ sở',
              columns: '3',
            },
          },
        ],
      },
      {
        id: 'sec-branch-news',
        pageId: `page-branch-${params.branchSlug}`,
        name: 'Tin tức tại cơ sở',
        sortOrder: 3,
        isVisible: true,
        settings: {
          layout: { width: 'container' as any },
        },
        blocks: [
          {
            id: 'blk-b-news',
            type: 'news_list',
            version: 1,
            sortOrder: 1,
            isActive: true,
            config: {
              title: `Tin Tức & Hoạt Động Cơ Sở ${branchName}`,
              subtitle: `Cập nhật những hoạt động mới nhất của thầy cô và học sinh cơ sở ${branchName}`,
              limit: 3,
            },
          },
        ],
      },
    ],
  };

  return <DynamicPageRenderer page={branchPageData} />;
}
