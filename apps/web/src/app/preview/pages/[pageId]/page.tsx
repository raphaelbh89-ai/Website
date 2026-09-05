import React from 'react';
import { Page, ContentStatus } from '@school-cms/shared';
import { verifyPreviewToken } from '@school-cms/cms';
import { DynamicPageRenderer } from '../../../../components/DynamicPageRenderer';

interface PreviewPageProps {
  params: {
    pageId: string;
  };
  searchParams: {
    revisionId?: string;
    expires?: string;
    signature?: string;
  };
}

export default function PreviewPage({ params, searchParams }: PreviewPageProps) {
  const { pageId } = params;
  const { revisionId, expires, signature } = searchParams;

  if (!revisionId || !expires || !signature) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl border border-slate-700 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 text-2xl flex items-center justify-center mx-auto">
            ⚠️
          </div>
          <h2 className="text-xl font-bold">Liên Kết Xem Trước Không Hợp Lệ</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Thiếu các tham số chữ ký điện tử hoặc phiên bản bản nháp. Vui lòng tạo lại liên kết từ CMS Admin.
          </p>
        </div>
      </div>
    );
  }

  const verification = verifyPreviewToken(pageId, revisionId, expires, signature);

  if (!verification.valid) {
    const isExpired = verification.error === 'EXPIRED';
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl border border-slate-700 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 text-2xl flex items-center justify-center mx-auto">
            {isExpired ? '⏳' : '🛡️'}
          </div>
          <h2 className="text-xl font-bold">
            {isExpired ? 'Liên Kết Xem Trước Đã Hết Hạn' : 'Chữ Ký Điện Tử Không Khớp'}
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            {isExpired
              ? 'Thời gian xem trước an toàn đã kết thúc. Vui lòng liên hệ Ban Quản Trị CMS để nhận liên kết mới.'
              : 'Chữ ký số HMAC-SHA256 không hợp lệ hoặc liên kết đã bị chỉnh sửa bất hợp pháp.'}
          </p>
        </div>
      </div>
    );
  }

  const expiresDate = new Date(Number(expires));
  const timeFormatted = expiresDate.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const dateFormatted = expiresDate.toLocaleDateString('vi-VN');

  // Mock draft page layout for preview
  const previewDraftPage: Page = {
    id: pageId,
    title: `[Xem Trước Bản Nháp] Trang Chủ Alpha School (${revisionId})`,
    slug: 'preview-draft',
    templateCode: 'home_landing',
    branchId: null,
    status: ContentStatus.DRAFT,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'sec-preview-hero',
        pageId,
        name: 'Hero Banner Xem Trước',
        sortOrder: 1,
        isVisible: true,
        settings: { layout: { width: 'full_width' as any } },
        blocks: [
          {
            id: 'blk-preview-1',
            type: 'hero_banner',
            version: 1,
            sortOrder: 1,
            isActive: true,
            config: {
              title: 'Khát Vọng Vươn Tầm Cùng Alpha School (Bản Nháp)',
              subtitle: 'Bản xem trước dành riêng cho Ban Giám Hiệu & Hội Đồng Quản Trị thẩm định',
              primaryButtonText: 'Đăng ký xét tuyển',
              primaryButtonUrl: '/tuyen-sinh',
              backgroundImageUrl:
                'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop',
              overlayOpacity: 0.5,
              textAlignment: 'center',
            },
          },
        ],
      },
      {
        id: 'sec-preview-programs',
        pageId,
        name: 'Chương trình đào tạo',
        sortOrder: 2,
        isVisible: true,
        settings: { layout: { width: 'container' as any } },
        blocks: [
          {
            id: 'blk-preview-2',
            type: 'program_list',
            version: 1,
            sortOrder: 1,
            isActive: true,
            config: {
              title: 'Chương Trình Đào Tạo Chuẩn Cambridge',
              subtitle: 'Lộ trình học tập song ngữ quốc tế liên cấp từ Tiểu học đến THPT',
              columns: '3',
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Sticky Security & Audit Preview Ribbon */}
      <div className="sticky top-0 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 shadow-lg border-b border-amber-600/30 flex items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-2.5 max-w-7xl mx-auto w-full">
          <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
            🔒 DRAFT PREVIEW
          </span>
          <span className="font-semibold">
            Đang xem trước bản nháp ({revisionId}) đã ký số HMAC-SHA256
          </span>
          <span className="hidden sm:inline text-slate-800">|</span>
          <span className="hidden sm:inline text-slate-800">
            Hết hạn lúc: <strong>{timeFormatted} ngày {dateFormatted}</strong>
          </span>
        </div>
      </div>

      {/* Render Dynamic Draft Layout */}
      <DynamicPageRenderer page={previewDraftPage} />
    </div>
  );
}
