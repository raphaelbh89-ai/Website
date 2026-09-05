import React from 'react';
import { Page, ContentStatus } from '@school-cms/shared';
import {
  getCampusThemeTokens,
  generateCssVariablesStyleObject,
  CAMPUS_THEMES,
} from '@school-cms/theme';
import { DynamicPageRenderer } from '../../../components/DynamicPageRenderer';

interface BranchPageProps {
  params: {
    branchSlug: string;
  };
}

export default function BranchPage({ params }: BranchPageProps) {
  const campusInfo = CAMPUS_THEMES[params.branchSlug];
  const branchName = campusInfo
    ? campusInfo.campusName
    : params.branchSlug === 'bien-hoa'
    ? 'Alpha School - Cơ sở Biên Hòa'
    : params.branchSlug === 'thu-duc'
    ? 'Alpha School - Cơ sở TP. Thủ Đức'
    : `Alpha School - Cơ sở ${params.branchSlug.toUpperCase()}`;

  const campusTokens = getCampusThemeTokens(params.branchSlug);
  const campusStyle = generateCssVariablesStyleObject(campusTokens);

  // Page layout động theo cơ sở
  const branchPageData: Page = {
    id: `page-branch-${params.branchSlug}`,
    title: branchName,
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
              title: `Chào Đón Đến Với ${branchName}`,
              subtitle:
                'Không gian học tập chuẩn quốc tế với cơ sở vật chất hiện đại, bể bơi 4 mùa và phòng Lab STEM sáng tạo',
              primaryButtonText: `Đăng ký tham quan Cơ sở`,
              primaryButtonUrl: `/tuyen-sinh?branch=${params.branchSlug}`,
              secondaryButtonText: 'Xem học phí & ưu đãi',
              secondaryButtonUrl: '#sec-branch-programs',
              backgroundImageUrl:
                'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop',
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
              title: `Chương Trình Giảng Dạy Đang Triển Khai`,
              subtitle: `Các lộ trình học tập song ngữ quốc tế được tổ chức trực tiếp tại ${branchName}`,
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
              title: `Tin Tức & Sự Kiện Nổi Bật`,
              subtitle: `Cập nhật những hoạt động mới nhất của thầy cô và học sinh tại cơ sở`,
              limit: 3,
            },
          },
        ],
      },
    ],
  };

  return (
    <div
      id={`campus-root-${params.branchSlug}`}
      style={campusStyle}
      className="transition-colors duration-200"
    >
      {/* Campus Scoped Header Pill */}
      {campusInfo && (
        <div className="bg-slate-900 text-white py-2 px-4 border-b border-slate-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--color-primary)] text-white shadow-xs">
              {campusInfo.badge}
            </span>
            <span className="font-semibold text-slate-300">
              Bạn đang xem Cổng thông tin trực tiếp của {campusInfo.campusName}
            </span>
          </div>
        </div>
      )}
      <DynamicPageRenderer page={branchPageData} />
    </div>
  );
}
