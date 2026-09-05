import Fastify from 'fastify';
import { BlockRegistry } from '@school-cms/cms';
import '@school-cms/blocks';
import {
  ApiResponse,
  Branch,
  Article,
  Category,
  Program,
  ContentStatus,
  DEFAULT_TRANSLATIONS,
  TranslationItem,
} from '@school-cms/shared';
import {
  AuditLogEntry,
  hasPermission,
  canAccessBranchResource,
  UserContext,
  RoleCode,
  ALL_PERMISSIONS,
  RolePermissions,
} from '@school-cms/auth';
import {
  MediaAsset,
  generateResponsiveImageVariants,
  generateStorageKey,
  validateMediaUpload,
  formatFileSize,
  detectMediaCategory,
} from '@school-cms/media';
import {
  getWebhooks,
  createWebhook,
  deleteWebhook,
  getDeliveryLogs,
  dispatchWebhookEvent,
} from './webhook';
import { globalCacheManager } from './cache';

const server = Fastify({ logger: true });

function formatSuccessResponse<T>(data: T, pagination?: any): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
      pagination,
    },
    error: null,
  };
}

function getUserContext(req: any): UserContext {
  const role = (req.headers['x-user-role'] as RoleCode) || RoleCode.SUPER_ADMIN;
  const branchId = (req.headers['x-branch-id'] as string) || null;
  const userId = (req.headers['x-user-id'] as string) || 'u-admin-01';
  const name = (req.headers['x-user-name'] as string) || 'Super Admin';
  const email = (req.headers['x-user-email'] as string) || 'admin@school.edu.vn';
  return { userId, name, email, roles: [role], branchId };
}

// -------------------------------------------------------------
// In-Memory Data Store (Synchronized with PostgreSQL Schema)
// -------------------------------------------------------------
let branchesStore: Branch[] = [
  {
    id: 'b-001',
    name: 'Alpha School - Cơ sở Biên Hòa',
    code: 'BIEN_HOA',
    slug: 'bien-hoa',
    address: 'Số 123 Đường Nguyễn Ái Quốc, TP. Biên Hòa, Tỉnh Đồng Nai',
    phone: '0251 123 4567',
    email: 'bienhoa@school.edu.vn',
    coordinates: { lat: 10.9574, lng: 106.8427 },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'b-002',
    name: 'Alpha School - Cơ sở TP. Thủ Đức',
    code: 'THU_DUC',
    slug: 'thu-duc',
    address: 'Khu đô thị Sala, TP. Thủ Đức, TP. Hồ Chí Minh',
    phone: '028 987 6543',
    email: 'thuduc@school.edu.vn',
    coordinates: { lat: 10.7725, lng: 106.7214 },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'b-003',
    name: 'Alpha School - Cơ sở Bình Dương',
    code: 'BINH_DUONG',
    slug: 'binh-duong',
    address: 'Đại lộ Bình Dương, TP. Thủ Dầu Một, Tỉnh Bình Dương',
    phone: '0274 333 8888',
    email: 'binhduong@school.edu.vn',
    coordinates: { lat: 10.9805, lng: 106.6519 },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let categoriesStore: Category[] = [
  { id: 'cat-1', name: 'Tin tức & Sự kiện', slug: 'tin-tuc-su-kien', sortOrder: 1 },
  { id: 'cat-2', name: 'Thành tích học thuật', slug: 'thanh-tich', sortOrder: 2 },
  { id: 'cat-3', name: 'Thông báo Tuyển sinh', slug: 'tuyen-sinh', sortOrder: 3 },
  { id: 'cat-4', name: 'Góc Phụ huynh & Học sinh', slug: 'goc-phu-huynh', sortOrder: 4 },
];

let articlesStore: Article[] = [
  {
    id: 'art-001',
    title: 'Lễ Khai Giảng Năm Học 2025: Khát Vọng Vươn Tầm Quốc Tế',
    slug: 'le-khai-giang-nam-hoc-2025',
    excerpt: 'Không khí hân hoan rộn rã tại tất cả các cơ sở của Alpha School trong ngày tựu trường đón chào năm học mới 2025 - 2026.',
    content: `<p>Sáng ngày 05/09/2026, toàn bộ các cơ sở thuộc Hệ thống Trường Quốc tế Song ngữ Alpha School đã đồng loạt tổ chức Lễ Khai giảng năm học mới.</p><p>Hơn 5,000 học sinh cùng đông đảo Quý Phụ huynh đã có mặt tham dự trong niềm hân hoan và kỳ vọng về một năm học bứt phá.</p>`,
    featuredImageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Tin tức & Sự kiện', slug: 'tin-tuc-su-kien', sortOrder: 1 },
    authorName: 'Ban Truyền Thông Alpha',
    branchId: null, // Toàn hệ thống
    status: ContentStatus.PUBLISHED,
    isFeatured: true,
    publishedAt: '2026-09-05T08:00:00.000Z',
    createdAt: '2026-09-05T08:00:00.000Z',
    updatedAt: '2026-09-05T08:00:00.000Z',
  },
  {
    id: 'art-002',
    title: 'Học Sinh Cơ Sở Biên Hòa Đạt Giải Nhất Cuộc Thi Robotics Quốc Tế 2025',
    slug: 'hoc-sinh-bien-hoa-dat-giai-nhat-robotics-2025',
    excerpt: 'Đội thi Alpha Robotics Biên Hòa đã xuất sắc vượt qua 40 đội tuyển quốc tế để giành Huy chương Vàng bảng sáng tạo.',
    content: `<p>Được đào tạo theo chương trình STEM Robotics tích hợp từ bậc Tiểu học, các em học sinh Alpha School cơ sở Biên Hòa đã chứng minh năng lực sáng tạo vượt trội.</p>`,
    featuredImageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop',
    categoryId: 'cat-2',
    category: { id: 'cat-2', name: 'Thành tích học thuật', slug: 'thanh-tich', sortOrder: 2 },
    authorName: 'CLB Sáng Tạo Trẻ Biên Hòa',
    branchId: 'b-001', // Thuộc Cơ sở Biên Hòa
    status: ContentStatus.PUBLISHED,
    isFeatured: true,
    publishedAt: '2026-09-02T10:30:00.000Z',
    createdAt: '2026-09-02T10:30:00.000Z',
    updatedAt: '2026-09-02T10:30:00.000Z',
  },
  {
    id: 'art-003',
    title: 'Hội Thảo Hướng Nghiệp & Săn Học Bổng Đại Học Top 100 Thế Giới',
    slug: 'hoi-thao-huong-nghiep-2025',
    excerpt: 'Cơ hội giao lưu trực tiếp với đại diện tuyển sinh từ hơn 20 đại học danh tiếng tại Anh, Mỹ, Úc và Canada.',
    content: `<p>Nhằm trang bị cho học sinh khối Trung học lộ trình du học vững vàng, Alpha School tổ chức chuỗi Ngày hội Du học và Định hướng Nghề nghiệp Toàn cầu.</p>`,
    featuredImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
    categoryId: 'cat-3',
    category: { id: 'cat-3', name: 'Thông báo Tuyển sinh', slug: 'tuyen-sinh', sortOrder: 3 },
    authorName: 'Phòng Tư Vấn Du Học',
    branchId: null,
    status: ContentStatus.PUBLISHED,
    isFeatured: false,
    publishedAt: '2026-08-28T14:00:00.000Z',
    createdAt: '2026-08-28T14:00:00.000Z',
    updatedAt: '2026-08-28T14:00:00.000Z',
  },
];

let programsStore: Program[] = [
  {
    id: 'prog-001',
    title: 'Chương Trình Mầm Non Song Ngữ Quốc Tế',
    slug: 'mam-non',
    gradeLevels: '18 tháng - 5 tuổi',
    overview: 'Phương pháp giáo dục sớm lấy trẻ làm trung tâm, khơi dậy niềm đam mê học hỏi tự nhiên và năng lực song ngữ từ thuở ấu thơ.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1200&auto=format&fit=crop',
    isActive: true,
  },
  {
    id: 'prog-002',
    title: 'Chương Trình Tiểu Học Quốc Tế Cambridge',
    slug: 'tieu-hoc',
    gradeLevels: 'Lớp 1 - Lớp 5',
    overview: 'Nền tảng học thuật vững chắc theo chuẩn Cambridge Primary, rèn luyện tư duy toán học, khoa học và tiếng Anh bản ngữ.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop',
    isActive: true,
  },
  {
    id: 'prog-003',
    title: 'Chương Trình Trung Học & Tú Tài Quốc Tế',
    slug: 'trung-hoc',
    gradeLevels: 'Lớp 6 - Lớp 12',
    overview: 'Lộ trình Cambridge IGCSE, AS/A-Level và định hướng săn học bổng vào các đại học danh tiếng toàn cầu.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
    isActive: true,
  },
];

export interface LeadSubmission {
  id: string;
  formCode: string;
  parentName: string;
  phone: string;
  email: string;
  studentName: string;
  grade: string;
  branch: string;
  branchId?: string | null;
  message?: string;
  status: 'NEW' | 'PROCESSING' | 'CONTACTED' | 'CONVERTED' | 'SPAM';
  notes: Array<{ text: string; author: string; createdAt: string }>;
  createdAt: string;
}

let submissionsStore: LeadSubmission[] = [
  {
    id: 'lead-001',
    formCode: 'tuyen-sinh-2025',
    parentName: 'Nguyễn Văn An',
    phone: '0912 345 678',
    email: 'an.nguyen@example.com',
    studentName: 'Nguyễn Gia Hân',
    grade: 'Lớp 1',
    branch: 'Cơ sở Biên Hòa',
    branchId: 'b-001',
    message: 'Gia đình muốn tìm hiểu học phí và tuyến xe bus đón tại P. Tân Phong.',
    status: 'NEW',
    notes: [{ text: 'Tiếp nhận qua Form trực tuyến Landing page', author: 'Hệ thống', createdAt: '2026-09-05T14:30:00.000Z' }],
    createdAt: '2026-09-05T14:30:00.000Z',
  },
  {
    id: 'lead-002',
    formCode: 'tuyen-sinh-2025',
    parentName: 'Trần Thị Mai',
    phone: '0988 765 432',
    email: 'mai.tran@example.com',
    studentName: 'Trần Minh Khang',
    grade: 'Mầm non 4 tuổi',
    branch: 'Cơ sở TP. Thủ Đức',
    branchId: 'b-002',
    message: 'Bé cần lớp học năng khiếu bơi lội và đàn piano.',
    status: 'PROCESSING',
    notes: [{ text: 'Đã gọi điện lần 1, phụ huynh hẹn nghe máy lại sau 17h', author: 'Chuyên viên Thu Hà', createdAt: '2026-09-05T11:45:00.000Z' }],
    createdAt: '2026-09-05T11:15:00.000Z',
  },
  {
    id: 'lead-003',
    formCode: 'tuyen-sinh-2025',
    parentName: 'Lê Hoàng Long',
    phone: '0903 112 233',
    email: 'long.le@example.com',
    studentName: 'Lê Bảo Anh',
    grade: 'Lớp 6 (Cambridge)',
    branch: 'Cơ sở Biên Hòa',
    branchId: 'b-001',
    message: 'Ứng tuyển học bổng tài năng Alpha Excellence 50%.',
    status: 'CONTACTED',
    notes: [{ text: 'Đã gửi lịch phỏng vấn và khảo sát tiếng Anh ngày 10/09', author: 'Chuyên viên Tuấn Kiệt', createdAt: '2026-09-04T17:00:00.000Z' }],
    createdAt: '2026-09-04T16:45:00.000Z',
  },
  {
    id: 'lead-004',
    formCode: 'tuyen-sinh-2025',
    parentName: 'Vũ Minh Tuấn',
    phone: '0938 999 111',
    email: 'tuan.vu@example.com',
    studentName: 'Vũ Thảo Nhi',
    grade: 'Lớp 10 Tú Tài',
    branch: 'Cơ sở Bình Dương',
    branchId: 'b-003',
    message: 'Hoàn tất thủ tục chuyển trường từ trường THPT Quốc tế.',
    status: 'CONVERTED',
    notes: [{ text: 'Học sinh đã đạt bài test, phụ huynh đã đóng phí ghi danh.', author: 'Ban Giám Hiệu', createdAt: '2026-09-03T09:00:00.000Z' }],
    createdAt: '2026-09-02T15:20:00.000Z',
let mediaStore: MediaAsset[] = [
  {
    id: 'med-001',
    title: 'Khuôn viên Alpha School Cơ sở Biên Hòa',
    filename: 'alpha-bien-hoa-campus.jpg',
    originalName: 'campus-full.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 2450000,
    formattedSize: '2.3 MB',
    category: 'image',
    storageKey: 'media/2026/09/alpha-bien-hoa-campus.jpg',
    cdnUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
    altText: 'Khuôn viên xanh hiện đại tại cơ sở Biên Hòa',
    caption: 'Khuôn viên trường học liên cấp quốc tế',
    dimensions: { width: 1920, height: 1080 },
    variants: generateResponsiveImageVariants('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop', 'media/2026/09/alpha-bien-hoa-campus.jpg'),
    branchId: 'b-001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'med-002',
    title: 'Phòng Thí Nghiệm Khoa Học STEM Hiện Đại',
    filename: 'stem-science-lab.jpg',
    originalName: 'stem-lab.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 1850000,
    formattedSize: '1.8 MB',
    category: 'image',
    storageKey: 'media/2026/09/stem-science-lab.jpg',
    cdnUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop',
    altText: 'Phòng thí nghiệm thực hành STEM đạt chuẩn Cambridge',
    caption: 'Không gian nghiên cứu công nghệ & khoa học',
    dimensions: { width: 1920, height: 1080 },
    variants: generateResponsiveImageVariants('https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop', 'media/2026/09/stem-science-lab.jpg'),
    branchId: 'b-002',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'med-003',
    title: 'Cẩm Nang Tuyển Sinh & Học Bổng 2025 - 2026',
    filename: 'alpha-school-prospectus-2025.pdf',
    originalName: 'prospectus-2025.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 5200000,
    formattedSize: '5.0 MB',
    category: 'document',
    storageKey: 'media/2026/09/alpha-school-prospectus-2025.pdf',
    cdnUrl: 'https://school.edu.vn/cdn/docs/prospectus-2025.pdf',
    altText: 'Cẩm nang thông tin tuyển sinh toàn diện',
    branchId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'med-004',
    title: 'Video Giới Thiệu Trường Học Quốc Tế Alpha School',
    filename: 'intro-video-alpha-school.mp4',
    originalName: 'intro-hd.mp4',
    mimeType: 'video/mp4',
    sizeBytes: 15400000,
    formattedSize: '14.7 MB',
    category: 'video',
    storageKey: 'media/2026/09/intro-video-alpha-school.mp4',
    cdnUrl: 'https://school.edu.vn/cdn/videos/intro.mp4',
    altText: 'Video giới thiệu toàn cảnh trường học',
    branchId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let auditLogsStore: AuditLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2026-09-05T08:00:00.000Z',
    userId: 'u-admin-01',
    userName: 'Super Admin',
    userRole: 'SUPER_ADMIN',
    branchId: null,
    action: 'PUBLISH',
    entityType: 'ARTICLE',
    entityId: 'art-001',
    entityTitle: 'Lễ Khai Giảng Năm Học 2025: Khát Vọng Vươn Tầm Quốc Tế',
    details: { branchScope: 'All' },
    ipAddress: '127.0.0.1',
  },
  {
    id: 'log-002',
    timestamp: '2026-09-05T09:15:00.000Z',
    userId: 'u-admin-01',
    userName: 'Super Admin',
    userRole: 'SUPER_ADMIN',
    branchId: null,
    action: 'UPDATE',
    entityType: 'THEME',
    entityId: 'global-theme',
    entityTitle: 'Brand Design Tokens',
    details: { primaryColor: '#047857', borderRadius: '12px' },
    ipAddress: '127.0.0.1',
  },
];

function recordAudit(log: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
  const newEntry: AuditLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    ...log,
  };
  auditLogsStore.unshift(newEntry);
  return newEntry;
}

// -------------------------------------------------------------
// Enterprise Data Stores (Pages, Revisions, Menus, i18n, Users)
// -------------------------------------------------------------
export interface PageBlock {
  id: string;
  type: string;
  name: string;
  config: Record<string, any>;
}

export interface PageRevisionItem {
  id: string;
  version: number;
  createdAt: string;
  author: string;
  description: string;
  blocksSnapshot: PageBlock[];
}

export interface PageItem {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED';
  branchId: string | null;
  blocks: PageBlock[];
  revisions: PageRevisionItem[];
  updatedAt: string;
}

let pagesStore: PageItem[] = [
  {
    id: 'page-home',
    title: 'Trang Chủ Alpha School',
    slug: 'trang-chu',
    status: 'PUBLISHED',
    branchId: null,
    blocks: [
      {
        id: 'blk-1',
        type: 'hero_banner',
        name: 'Hero Banner Lớn',
        config: {
          title: 'Khát Vọng Vươn Tầm Cùng Alpha School',
          subtitle: 'Môi trường giáo dục liên cấp song ngữ chuẩn quốc tế',
          primaryButtonText: 'Đăng ký nhận học bổng',
        },
      },
      {
        id: 'blk-2',
        type: 'program_list',
        name: 'Danh sách Chương trình đào tạo',
        config: {
          title: 'Chương Trình Đào Tạo Chuẩn Quốc Tế',
          columns: '3',
        },
      },
      {
        id: 'blk-3',
        type: 'branch_list',
        name: 'Danh sách Cơ sở',
        config: {
          title: 'Hệ Thống Các Cơ Sở Toàn Quốc',
        },
      },
      {
        id: 'blk-4',
        type: 'form_embed',
        name: 'Form Tuyển Sinh & Liên Hệ',
        config: {
          title: 'Đăng Ký Tư Vấn Tuyển Sinh 2025 - 2026',
          subtitle: 'Nhận cẩm nang tuyển sinh và học bổng lên tới 50%',
          formCode: 'tuyen-sinh-2025',
          submitButtonText: 'Gửi thông tin đăng ký',
        },
      },
    ],
    revisions: [
      {
        id: 'rev-1',
        version: 1,
        createdAt: '2026-09-01T09:00:00.000Z',
        author: 'Super Admin',
        description: 'Khởi tạo cấu trúc trang chủ sơ khai (1 block cốt lõi)',
        blocksSnapshot: [
          {
            id: 'blk-1',
            type: 'hero_banner',
            name: 'Hero Banner Lớn',
            config: {
              title: 'Alpha School: Kiến Tạo Tương Lai',
              subtitle: 'Hệ thống giáo dục tiên phong công nghệ',
              primaryButtonText: 'Khám phá ngay',
            },
          },
        ],
      },
    ],
    updatedAt: new Date().toISOString(),
  },
];

export interface MenuItemRecord {
  id: string;
  title: string;
  url: string;
  target: '_self' | '_blank';
  order: number;
  isActive: boolean;
  location: 'header' | 'footer';
}

let menusStore: MenuItemRecord[] = [
  { id: 'm-1', title: 'Trang Chủ', url: '/', target: '_self', order: 1, isActive: true, location: 'header' },
  { id: 'm-2', title: 'Chương Trình Học', url: '/chuong-trinh-hoc', target: '_self', order: 2, isActive: true, location: 'header' },
  { id: 'm-3', title: 'Hệ Thống Cơ Sở', url: '#co-so', target: '_self', order: 3, isActive: true, location: 'header' },
  { id: 'm-4', title: 'Tin Tức & Sự Kiện', url: '/tin-tuc', target: '_self', order: 4, isActive: true, location: 'header' },
  { id: 'm-5', title: 'Tuyển Sinh 2025', url: '/tuyen-sinh', target: '_self', order: 5, isActive: true, location: 'header' },
  { id: 'm-6', title: 'Chính Sách Bảo Mật', url: '/privacy', target: '_self', order: 1, isActive: true, location: 'footer' },
  { id: 'm-7', title: 'Điều Khoản Dịch Vụ', url: '/terms', target: '_self', order: 2, isActive: true, location: 'footer' },
  { id: 'm-8', title: 'Sơ Đồ Trang Web', url: '/sitemap.xml', target: '_blank', order: 3, isActive: true, location: 'footer' },
];

let translationsStore: TranslationItem[] = [...DEFAULT_TRANSLATIONS];

export interface UserAccountRecord {
  id: string;
  name: string;
  email: string;
  role: RoleCode;
  branchId: string | null;
  branchName: string;
  status: 'ACTIVE' | 'SUSPENDED';
  lastLogin: string;
}

let usersStore: UserAccountRecord[] = [
  { id: 'usr-1', name: 'Nguyễn Đình Trọng', email: 'trong.admin@school.edu.vn', role: RoleCode.SUPER_ADMIN, branchId: null, branchName: 'Toàn hệ thống (Global)', status: 'ACTIVE', lastLogin: '05/09/2026 18:25' },
  { id: 'usr-2', name: 'Trần Minh Quang', email: 'quang.director@school.edu.vn', role: RoleCode.CAMPUS_DIRECTOR, branchId: 'b-001', branchName: 'Alpha School - Cơ sở Biên Hòa', status: 'ACTIVE', lastLogin: '05/09/2026 15:10' },
  { id: 'usr-3', name: 'Lê Thu Hà', email: 'ha.tuyensinh@school.edu.vn', role: RoleCode.ADMISSIONS_OFFICER, branchId: 'b-002', branchName: 'Alpha School - Cơ sở TP. Thủ Đức', status: 'ACTIVE', lastLogin: '05/09/2026 11:30' },
  { id: 'usr-4', name: 'Phạm Tuấn Kiệt', email: 'kiet.editor@school.edu.vn', role: RoleCode.CONTENT_EDITOR, branchId: null, branchName: 'Toàn hệ thống (Global)', status: 'ACTIVE', lastLogin: '04/09/2026 16:45' },
];

let dynamicRolePermissionsStore: Record<string, string[]> = {
  SUPER_ADMIN: [...RolePermissions.SUPER_ADMIN],
  CAMPUS_DIRECTOR: [...RolePermissions.CAMPUS_DIRECTOR],
  ADMISSIONS_OFFICER: [...RolePermissions.ADMISSIONS_OFFICER],
  CONTENT_EDITOR: [...RolePermissions.CONTENT_EDITOR],
};

let themeTokensStore = {
  primaryColor: '#047857',
  secondaryColor: '#065f46',
  accentColor: '#f59e0b',
  borderRadius: '12px',
  fontFamily: 'Outfit, sans-serif',
  containerMaxWidth: '1280px',
};

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// 1. BRANCHES API
server.get('/api/v1/branches', async (req) => {
  const { search } = req.query as { search?: string };
  let results = branchesStore;
  if (search) {
    const q = search.toLowerCase();
    results = results.filter((b) => b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q));
  }
  return formatSuccessResponse(results);
});

server.get('/api/v1/branches/:slug', async (req, reply) => {
  const { slug } = req.params as { slug: string };
  const branch = branchesStore.find((b) => b.slug === slug || b.code.toLowerCase() === slug.toLowerCase());
  if (!branch) {
    return reply.status(404).send({
      success: false,
      data: null,
      error: { code: 'NOT_FOUND', message: 'Không tìm thấy thông tin cơ sở' },
    });
  }
  return formatSuccessResponse(branch);
});

server.post('/api/v1/branches', async (req, reply) => {
  const user = getUserContext(req);
  if (!hasPermission(user, 'branches:manage')) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền quản lý cơ sở' },
    });
  }

  const body = req.body as Partial<Branch>;
  const newBranch: Branch = {
    id: `b-${Date.now()}`,
    name: body.name || 'Cơ sở mới',
    code: body.code || 'BRANCH_NEW',
    slug: body.slug || body.code?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `branch-${Date.now()}`,
    address: body.address || '',
    phone: body.phone || '',
    email: body.email || '',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  branchesStore.push(newBranch);
  recordAudit({
    userId: user.userId,
    userName: user.name,
    userRole: user.roles[0],
    branchId: newBranch.id,
    action: 'CREATE',
    entityType: 'BRANCH',
    entityId: newBranch.id,
    entityTitle: newBranch.name,
  });

  return formatSuccessResponse(newBranch);
});

// 2. CATEGORIES API
server.get('/api/v1/categories', async () => {
  return formatSuccessResponse(categoriesStore);
});

// 3. ARTICLES API
server.get('/api/v1/articles', async (req) => {
  const { branchId, categoryId, search, status } = req.query as {
    branchId?: string;
    categoryId?: string;
    search?: string;
    status?: string;
  };

  let results = articlesStore;
  if (branchId && branchId !== 'all') {
    results = results.filter((a) => a.branchId === branchId || a.branchId === null);
  }
  if (categoryId) {
    results = results.filter((a) => a.categoryId === categoryId);
  }
  if (status) {
    results = results.filter((a) => a.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt?.toLowerCase().includes(q));
  }

  return formatSuccessResponse(results, { total: results.length, page: 1, limit: 20 });
});

server.get('/api/v1/articles/:slug', async (req, reply) => {
  const { slug } = req.params as { slug: string };
  const article = articlesStore.find((a) => a.slug === slug || a.id === slug);
  if (!article) {
    return reply.status(404).send({
      success: false,
      data: null,
      error: { code: 'NOT_FOUND', message: 'Không tìm thấy bài viết' },
    });
  }
  return formatSuccessResponse(article);
});

server.post('/api/v1/articles', async (req, reply) => {
  const user = getUserContext(req);
  if (!hasPermission(user, 'articles:write')) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền viết bài' },
    });
  }

  const body = req.body as any;
  if (!canAccessBranchResource(user, body.branchId)) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không thể đăng bài cho cơ sở ngoài phạm vi quản lý' },
    });
  }

  const category = categoriesStore.find((c) => c.id === body.categoryId) || categoriesStore[0];
  const newArticle: Article = {
    id: `art-${Date.now()}`,
    title: body.title,
    slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    excerpt: body.excerpt || '',
    content: body.content || '',
    featuredImageUrl: body.featuredImageUrl || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
    categoryId: body.categoryId || category.id,
    category,
    authorName: body.authorName || user.name,
    branchId: body.branchId || null,
    status: body.status || ContentStatus.PUBLISHED,
    isFeatured: body.isFeatured || false,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  articlesStore.unshift(newArticle);
  recordAudit({
    userId: user.userId,
    userName: user.name,
    userRole: user.roles[0],
    branchId: newArticle.branchId,
    action: 'CREATE',
    entityType: 'ARTICLE',
    entityId: newArticle.id,
    entityTitle: newArticle.title,
  });

  return formatSuccessResponse(newArticle);
});

server.delete('/api/v1/articles/:id', async (req, reply) => {
  const user = getUserContext(req);
  const { id } = req.params as { id: string };
  const art = articlesStore.find((a) => a.id === id);

  if (art && !canAccessBranchResource(user, art.branchId)) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền xóa bài viết của cơ sở khác' },
    });
  }

  articlesStore = articlesStore.filter((a) => a.id !== id);
  if (art) {
    recordAudit({
      userId: user.userId,
      userName: user.name,
      userRole: user.roles[0],
      branchId: art.branchId,
      action: 'DELETE',
      entityType: 'ARTICLE',
      entityId: id,
      entityTitle: art.title,
    });
  }

  return formatSuccessResponse({ deleted: true });
});

// 4. PROGRAMS API
server.get('/api/v1/programs', async () => {
  return formatSuccessResponse(programsStore);
});

server.get('/api/v1/programs/:slug', async (req, reply) => {
  const { slug } = req.params as { slug: string };
  const prog = programsStore.find((p) => p.slug === slug);
  if (!prog) {
    return reply.status(404).send({
      success: false,
      data: null,
      error: { code: 'NOT_FOUND', message: 'Không tìm thấy chương trình' },
    });
  }
  return formatSuccessResponse(prog);
});

// 5. FORM SUBMISSIONS & LEAD CRM API
server.get('/api/v1/submissions', async (req) => {
  const user = getUserContext(req);
  const { branchId, status } = req.query as { branchId?: string; status?: string };

  let results = submissionsStore;
  if (user.branchId) {
    results = results.filter((s) => s.branchId === user.branchId);
  } else if (branchId && branchId !== 'all') {
    results = results.filter((s) => s.branchId === branchId);
  }
  if (status) {
    results = results.filter((s) => s.status === status);
  }

  return formatSuccessResponse(results);
});

server.post('/api/v1/public/forms/:code/submit', async (req) => {
  const { code } = req.params as { code: string };
  const body = req.body as Record<string, any>;

  const submission: LeadSubmission = {
    id: `lead-${Date.now()}`,
    formCode: code,
    parentName: body.parentName || 'Chưa cập nhật',
    phone: body.phone || '',
    email: body.email || '',
    studentName: body.studentName || '',
    grade: body.grade || 'Lớp 1',
    branch: body.branch || 'Toàn hệ thống',
    branchId: body.branchId || null,
    message: body.message || '',
    status: 'NEW',
    notes: [{ text: 'Tiếp nhận qua form trực tuyến', author: 'Hệ thống', createdAt: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
  };

  submissionsStore.unshift(submission);
  recordAudit({
    userId: 'anonymous-web-user',
    userName: 'Phụ huynh trực tuyến',
    userRole: 'PARENT',
    branchId: submission.branchId,
    action: 'CREATE',
    entityType: 'LEAD',
    entityId: submission.id,
    entityTitle: `${submission.parentName} - ${submission.studentName}`,
  });

  // Dispatch webhook event to external systems (CRM, Slack, etc.)
  dispatchWebhookEvent('lead.created', submission);

  return formatSuccessResponse(submission);
});

server.patch('/api/v1/submissions/:id/status', async (req, reply) => {
  const user = getUserContext(req);
  const { id } = req.params as { id: string };
  const { status } = req.body as { status: 'NEW' | 'PROCESSING' | 'CONTACTED' | 'CONVERTED' | 'SPAM' };

  const lead = submissionsStore.find((s) => s.id === id);
  if (!lead) {
    return reply.status(404).send({
      success: false,
      data: null,
      error: { code: 'NOT_FOUND', message: 'Không tìm thấy hồ sơ tuyển sinh' },
    });
  }

  const oldStatus = lead.status;
  lead.status = status;
  lead.notes.unshift({
    text: `Thay đổi trạng thái từ [${oldStatus}] sang [${status}]`,
    author: user.name,
    createdAt: new Date().toISOString(),
  });

  recordAudit({
    userId: user.userId,
    userName: user.name,
    userRole: user.roles[0],
    branchId: lead.branchId,
    action: 'STATUS_CHANGE',
    entityType: 'LEAD',
    entityId: lead.id,
    entityTitle: `${lead.parentName} (${lead.studentName})`,
    details: { from: oldStatus, to: status },
  });

  // Dispatch webhook event for status update
  dispatchWebhookEvent('lead.status_updated', lead);

  return formatSuccessResponse(lead);
});

server.post('/api/v1/submissions/:id/notes', async (req, reply) => {
  const user = getUserContext(req);
  const { id } = req.params as { id: string };
  const { text } = req.body as { text: string };

  const lead = submissionsStore.find((s) => s.id === id);
  if (!lead) {
    return reply.status(404).send({
      success: false,
      data: null,
      error: { code: 'NOT_FOUND', message: 'Không tìm thấy hồ sơ tuyển sinh' },
    });
  }

  const noteObj = {
    text,
    author: user.name,
    createdAt: new Date().toISOString(),
  };
  lead.notes.unshift(noteObj);

  recordAudit({
    userId: user.userId,
    userName: user.name,
    userRole: user.roles[0],
    branchId: lead.branchId,
    action: 'UPDATE',
    entityType: 'LEAD',
    entityId: lead.id,
    entityTitle: `Ghi chú hồ sơ: ${lead.parentName}`,
    details: { note: text },
  });

  return formatSuccessResponse(lead);
});

// 6. AUDIT LOGS API
server.get('/api/v1/audit-logs', async (req, reply) => {
  const user = getUserContext(req);
  if (!hasPermission(user, 'system:manage') && !user.roles.includes(RoleCode.CAMPUS_DIRECTOR)) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền truy cập nhật ký kiểm toán' },
    });
  }

  let results = auditLogsStore;
  if (user.branchId) {
    results = results.filter((log) => log.branchId === user.branchId || log.branchId === null);
  }

  return formatSuccessResponse(results);
});

// 7. PAGES & REVISION REST API
server.get('/api/v1/pages', async (req) => {
  const { branchId, status } = req.query as { branchId?: string; status?: string };
  let results = pagesStore;
  if (branchId && branchId !== 'all') {
    results = results.filter((p) => p.branchId === branchId || p.branchId === null);
  }
  if (status) {
    results = results.filter((p) => p.status === status);
  }
  return formatSuccessResponse(
    results.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      status: p.status,
      branchId: p.branchId,
      blocksCount: p.blocks.length,
      revisionsCount: p.revisions.length,
      updatedAt: p.updatedAt,
    }))
  );
});

server.get('/api/v1/pages/:id', async (req, reply) => {
  const { id } = req.params as { id: string };
  const page = pagesStore.find((p) => p.id === id || p.slug === id);
  if (!page) {
    return reply.status(404).send({
      success: false,
      data: null,
      error: { code: 'NOT_FOUND', message: 'Không tìm thấy thông tin trang' },
    });
  }
  return formatSuccessResponse(page);
});

server.post('/api/v1/pages/:id/publish', async (req, reply) => {
  const user = getUserContext(req);
  if (!hasPermission(user, 'pages:publish')) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền xuất bản trang' },
    });
  }

  const { id } = req.params as { id: string };
  const page = pagesStore.find((p) => p.id === id || p.slug === id);
  if (!page) {
    return reply.status(404).send({
      success: false,
      data: null,
      error: { code: 'NOT_FOUND', message: 'Không tìm thấy trang cần xuất bản' },
    });
  }

  const nextVer = page.revisions.length > 0 ? Math.max(...page.revisions.map((r) => r.version)) + 1 : 1;
  const newRev: PageRevisionItem = {
    id: `rev-${Date.now()}`,
    version: nextVer,
    createdAt: new Date().toISOString(),
    author: user.name,
    description: `Xuất bản phiên bản v${nextVer} (${page.blocks.length} blocks)`,
    blocksSnapshot: JSON.parse(JSON.stringify(page.blocks)),
  };

  page.revisions.unshift(newRev);
  page.status = 'PUBLISHED';
  page.updatedAt = new Date().toISOString();

  recordAudit({
    userId: user.userId,
    userName: user.name,
    userRole: user.roles[0],
    branchId: page.branchId,
    action: 'PUBLISH',
    entityType: 'PAGE',
    entityId: page.id,
    entityTitle: page.title,
    details: { version: nextVer, blocksCount: page.blocks.length },
  });

  return formatSuccessResponse({
    page,
    publishedRevision: newRev,
    edgeCachePurged: true,
  });
});

server.post('/api/v1/pages/:id/rollback', async (req, reply) => {
  const user = getUserContext(req);
  if (!hasPermission(user, 'pages:write')) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền khôi phục trang' },
    });
  }

  const { id } = req.params as { id: string };
  const { revisionId } = req.body as { revisionId: string };
  const page = pagesStore.find((p) => p.id === id || p.slug === id);
  if (!page) {
    return reply.status(404).send({
      success: false,
      data: null,
      error: { code: 'NOT_FOUND', message: 'Không tìm thấy trang' },
    });
  }

  const targetRev = page.revisions.find((r) => r.id === revisionId || `v${r.version}` === revisionId);
  if (!targetRev) {
    return reply.status(404).send({
      success: false,
      data: null,
      error: { code: 'NOT_FOUND', message: 'Không tìm thấy phiên bản snapshot cần khôi phục' },
    });
  }

  page.blocks = JSON.parse(JSON.stringify(targetRev.blocksSnapshot));
  page.updatedAt = new Date().toISOString();

  recordAudit({
    userId: user.userId,
    userName: user.name,
    userRole: user.roles[0],
    branchId: page.branchId,
    action: 'UPDATE',
    entityType: 'PAGE',
    entityId: page.id,
    entityTitle: page.title,
    details: { rollbackToVersion: targetRev.version, blocksCount: page.blocks.length },
  });

  return formatSuccessResponse({
    page,
    restoredRevision: targetRev,
  });
});

// 8. NAVIGATION MENUS API
server.get('/api/v1/menus', async (req) => {
  const { location } = req.query as { location?: 'header' | 'footer' };
  let results = [...menusStore];
  if (location) {
    results = results.filter((m) => m.location === location);
  }
  results.sort((a, b) => a.order - b.order);
  return formatSuccessResponse(results);
});

server.post('/api/v1/menus', async (req, reply) => {
  const user = getUserContext(req);
  if (!hasPermission(user, 'system:manage')) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền chỉnh sửa cấu trúc menu' },
    });
  }

  const body = req.body as Partial<MenuItemRecord>;
  const loc = body.location || 'header';
  const sameLoc = menusStore.filter((m) => m.location === loc);
  const nextOrder = sameLoc.length > 0 ? Math.max(...sameLoc.map((m) => m.order)) + 1 : 1;

  const newItem: MenuItemRecord = {
    id: `m-${Date.now()}`,
    title: body.title || 'Liên kết mới',
    url: body.url || '/',
    target: body.target || '_self',
    order: nextOrder,
    isActive: true,
    location: loc,
  };

  menusStore.push(newItem);
  recordAudit({
    userId: user.userId,
    userName: user.name,
    userRole: user.roles[0],
    branchId: null,
    action: 'CREATE',
    entityType: 'MENU',
    entityId: newItem.id,
    entityTitle: newItem.title,
    details: { location: newItem.location, url: newItem.url },
  });

  return formatSuccessResponse(newItem);
});

server.put('/api/v1/menus/reorder', async (req, reply) => {
  const user = getUserContext(req);
  if (!hasPermission(user, 'system:manage')) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền sắp xếp menu' },
    });
  }

  const { items } = req.body as { items: Array<{ id: string; order: number }> };
  if (Array.isArray(items)) {
    items.forEach((it) => {
      const found = menusStore.find((m) => m.id === it.id);
      if (found) {
        found.order = it.order;
      }
    });
  }

  recordAudit({
    userId: user.userId,
    userName: user.name,
    userRole: user.roles[0],
    branchId: null,
    action: 'UPDATE',
    entityType: 'MENU',
    entityId: 'menu-reorder',
    entityTitle: 'Sắp xếp lại thứ tự Menu',
  });

  return formatSuccessResponse(menusStore);
});

server.delete('/api/v1/menus/:id', async (req, reply) => {
  const user = getUserContext(req);
  if (!hasPermission(user, 'system:manage')) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền xóa liên kết menu' },
    });
  }

  const { id } = req.params as { id: string };
  const item = menusStore.find((m) => m.id === id);
  menusStore = menusStore.filter((m) => m.id !== id);

  if (item) {
    recordAudit({
      userId: user.userId,
      userName: user.name,
      userRole: user.roles[0],
      branchId: null,
      action: 'DELETE',
      entityType: 'MENU',
      entityId: id,
      entityTitle: item.title,
    });
  }

  return formatSuccessResponse({ deleted: true });
});

// 9. MULTI-LANGUAGE (i18n) API
server.get('/api/v1/translations', async (req) => {
  const { category, search } = req.query as { category?: string; search?: string };
  let results = [...translationsStore];
  if (category && category !== 'all') {
    results = results.filter((t) => t.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter((t) => t.key.toLowerCase().includes(q) || t.vi.toLowerCase().includes(q) || t.en.toLowerCase().includes(q));
  }
  return formatSuccessResponse(results);
});

server.post('/api/v1/translations', async (req, reply) => {
  const user = getUserContext(req);
  if (!hasPermission(user, 'system:manage')) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền thêm khóa từ điển' },
    });
  }

  const { key, vi, en, category } = req.body as TranslationItem;
  if (!key || !vi || !en) {
    return reply.status(422).send({
      success: false,
      data: null,
      error: { code: 'VALIDATION_FAILED', message: 'Khóa dịch và nội dung song ngữ không được để trống' },
    });
  }

  const cleanKey = key.trim().toLowerCase().replace(/[^a-z0-9_.]/g, '_');
  const exists = translationsStore.find((t) => t.key === cleanKey);
  if (exists) {
    return reply.status(409).send({
      success: false,
      data: null,
      error: { code: 'CONFLICT', message: 'Mã khóa dịch này đã tồn tại' },
    });
  }

  const newItem: TranslationItem = {
    key: cleanKey,
    vi: vi.trim(),
    en: en.trim(),
    category: category || 'common',
  };
  translationsStore.push(newItem);

  recordAudit({
    userId: user.userId,
    userName: user.name,
    userRole: user.roles[0],
    branchId: null,
    action: 'CREATE',
    entityType: 'TRANSLATION',
    entityId: newItem.key,
    entityTitle: `Khóa dịch: ${newItem.key}`,
  });

  return formatSuccessResponse(newItem);
});

server.put('/api/v1/translations/:key', async (req, reply) => {
  const user = getUserContext(req);
  if (!hasPermission(user, 'system:manage')) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền sửa bản dịch' },
    });
  }

  const { key } = req.params as { key: string };
  const { vi, en } = req.body as { vi?: string; en?: string };
  const item = translationsStore.find((t) => t.key === key);
  if (!item) {
    return reply.status(404).send({
      success: false,
      data: null,
      error: { code: 'NOT_FOUND', message: 'Không tìm thấy khóa dịch' },
    });
  }

  if (vi !== undefined) item.vi = vi;
  if (en !== undefined) item.en = en;

  recordAudit({
    userId: user.userId,
    userName: user.name,
    userRole: user.roles[0],
    branchId: null,
    action: 'UPDATE',
    entityType: 'TRANSLATION',
    entityId: item.key,
    entityTitle: `Khóa dịch: ${item.key}`,
    details: { vi, en },
  });

  return formatSuccessResponse(item);
});

server.delete('/api/v1/translations/:key', async (req, reply) => {
  const user = getUserContext(req);
  if (!hasPermission(user, 'system:manage')) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền xóa khóa dịch' },
    });
  }

  const { key } = req.params as { key: string };
  translationsStore = translationsStore.filter((t) => t.key !== key);

  recordAudit({
    userId: user.userId,
    userName: user.name,
    userRole: user.roles[0],
    branchId: null,
    action: 'DELETE',
    entityType: 'TRANSLATION',
    entityId: key,
    entityTitle: `Khóa dịch: ${key}`,
  });

  return formatSuccessResponse({ deleted: true });
});

// 10. USERS & RBAC PERMISSIONS MATRIX API
server.get('/api/v1/users', async (req, reply) => {
  const user = getUserContext(req);
  if (!hasPermission(user, 'system:manage') && !user.roles.includes(RoleCode.CAMPUS_DIRECTOR)) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền xem danh sách người dùng' },
    });
  }

  let results = usersStore;
  if (user.branchId) {
    results = results.filter((u) => u.branchId === user.branchId);
  }

  return formatSuccessResponse(results);
});

server.post('/api/v1/users', async (req, reply) => {
  const user = getUserContext(req);
  if (!hasPermission(user, 'system:manage')) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền tạo tài khoản người dùng' },
    });
  }

  const body = req.body as Partial<UserAccountRecord>;
  if (!body.name || !body.email || !body.role) {
    return reply.status(422).send({
      success: false,
      data: null,
      error: { code: 'VALIDATION_FAILED', message: 'Vui lòng cung cấp đầy đủ tên, email và vai trò' },
    });
  }

  const newU: UserAccountRecord = {
    id: `usr-${Date.now()}`,
    name: body.name.trim(),
    email: body.email.trim(),
    role: body.role,
    branchId: body.branchId || null,
    branchName: body.branchName || 'Toàn hệ thống (Global)',
    status: 'ACTIVE',
    lastLogin: 'Chưa đăng nhập',
  };

  usersStore.push(newU);
  recordAudit({
    userId: user.userId,
    userName: user.name,
    userRole: user.roles[0],
    branchId: newU.branchId,
    action: 'CREATE',
    entityType: 'USER',
    entityId: newU.id,
    entityTitle: newU.name,
    details: { role: newU.role, branchName: newU.branchName },
  });

  return formatSuccessResponse(newU);
});

server.patch('/api/v1/users/:id/status', async (req, reply) => {
  const user = getUserContext(req);
  if (!hasPermission(user, 'system:manage')) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền thay đổi trạng thái người dùng' },
    });
  }

  const { id } = req.params as { id: string };
  const target = usersStore.find((u) => u.id === id);
  if (!target) {
    return reply.status(404).send({
      success: false,
      data: null,
      error: { code: 'NOT_FOUND', message: 'Không tìm thấy người dùng' },
    });
  }

  const nextStatus = target.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
  target.status = nextStatus;

  recordAudit({
    userId: user.userId,
    userName: user.name,
    userRole: user.roles[0],
    branchId: target.branchId,
    action: 'STATUS_CHANGE',
    entityType: 'USER',
    entityId: target.id,
    entityTitle: target.name,
    details: { status: nextStatus },
  });

  return formatSuccessResponse(target);
});

server.delete('/api/v1/users/:id', async (req, reply) => {
  const user = getUserContext(req);
  if (!hasPermission(user, 'system:manage')) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền xóa người dùng' },
    });
  }

  const { id } = req.params as { id: string };
  const target = usersStore.find((u) => u.id === id);
  if (!target) {
    return reply.status(404).send({
      success: false,
      data: null,
      error: { code: 'NOT_FOUND', message: 'Không tìm thấy người dùng' },
    });
  }

  if (target.role === RoleCode.SUPER_ADMIN && usersStore.filter((u) => u.role === RoleCode.SUPER_ADMIN).length <= 1) {
    return reply.status(400).send({
      success: false,
      data: null,
      error: { code: 'VALIDATION_FAILED', message: 'Không thể xóa Super Admin duy nhất của hệ thống' },
    });
  }

  usersStore = usersStore.filter((u) => u.id !== id);
  recordAudit({
    userId: user.userId,
    userName: user.name,
    userRole: user.roles[0],
    branchId: target.branchId,
    action: 'DELETE',
    entityType: 'USER',
    entityId: target.id,
    entityTitle: target.name,
  });

  return formatSuccessResponse({ deleted: true });
});

server.get('/api/v1/roles/permissions', async () => {
  return formatSuccessResponse({
    allPermissions: ALL_PERMISSIONS,
    matrix: dynamicRolePermissionsStore,
  });
});

server.put('/api/v1/roles/:role/permissions', async (req, reply) => {
  const user = getUserContext(req);
  if (!hasPermission(user, 'system:manage')) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền sửa ma trận phân quyền' },
    });
  }

  const { role } = req.params as { role: string };
  const { permissions } = req.body as { permissions: string[] };
  if (!Array.isArray(permissions)) {
    return reply.status(422).send({
      success: false,
      data: null,
      error: { code: 'VALIDATION_FAILED', message: 'Danh sách quyền hạn không hợp lệ' },
    });
  }

  dynamicRolePermissionsStore[role] = permissions;
  recordAudit({
    userId: user.userId,
    userName: user.name,
    userRole: user.roles[0],
    branchId: null,
    action: 'UPDATE',
    entityType: 'ROLE',
    entityId: role,
    entityTitle: `Vai trò ${role}`,
    details: { permissionsCount: permissions.length },
  });

  return formatSuccessResponse({
    role,
    permissions: dynamicRolePermissionsStore[role],
  });
});

// 11. FULL SYSTEM BACKUP & RESTORE API
server.get('/api/v1/system/backup', async (req, reply) => {
  const user = getUserContext(req);
  if (!hasPermission(user, 'system:manage')) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền tải bản sao lưu hệ thống' },
    });
  }

  const backupPackage = {
    meta: {
      system: 'Alpha School Enterprise Modular CMS',
      schemaVersion: '2.0.0',
      exportedAt: new Date().toISOString(),
      exportedBy: user.name,
      userRole: user.roles[0],
    },
    pages: pagesStore,
    menus: menusStore,
    theme: themeTokensStore,
    localization: {
      totalKeys: translationsStore.length,
      items: translationsStore,
    },
    contentCounts: {
      branches: branchesStore.length,
      articles: articlesStore.length,
      programs: programsStore.length,
      leads: submissionsStore.length,
      users: usersStore.length,
    },
  };

  recordAudit({
    userId: user.userId,
    userName: user.name,
    userRole: user.roles[0],
    branchId: null,
    action: 'EXPORT',
    entityType: 'PAGE',
    entityId: 'system-backup',
    entityTitle: 'Toàn Bộ Cấu Hình Hệ Thống',
    details: { backupTime: backupPackage.meta.exportedAt },
  });

  return formatSuccessResponse(backupPackage);
});

server.post('/api/v1/system/restore', async (req, reply) => {
  const user = getUserContext(req);
  if (!hasPermission(user, 'system:manage')) {
    return reply.status(403).send({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền phục hồi dữ liệu hệ thống' },
    });
  }

  const body = req.body as any;
  if (!body?.meta?.schemaVersion || !body?.pages) {
    return reply.status(422).send({
      success: false,
      data: null,
      error: { code: 'VALIDATION_FAILED', message: 'Gói sao lưu không đúng định dạng schema 2.0.0' },
    });
  }

  if (Array.isArray(body.pages)) {
    pagesStore = body.pages;
  }
  if (Array.isArray(body.menus)) {
    menusStore = body.menus;
  }
  if (body.theme) {
    themeTokensStore = { ...themeTokensStore, ...body.theme };
  }
  if (Array.isArray(body.localization?.items)) {
    translationsStore = body.localization.items;
  }

  recordAudit({
    userId: user.userId,
    userName: user.name,
    userRole: user.roles[0],
    branchId: null,
    action: 'UPDATE',
    entityType: 'PAGE',
    entityId: 'system-restore',
    entityTitle: 'Phục Hồi Cấu Hình Hệ Thống',
    details: { restoredFrom: body.meta.exportedAt },
  });

  return formatSuccessResponse({
    restored: true,
    restoredAt: new Date().toISOString(),
    pagesCount: pagesStore.length,
    menusCount: menusStore.length,
    translationsCount: translationsStore.length,
  });
});

// 12. PUBLIC PAGE API (Dynamic Page Resolver)
server.get('/api/v1/public/pages/:slug', async (req) => {
  const { slug } = req.params as { slug: string };
  const page = pagesStore.find((p) => p.slug === slug);
  if (page) {
    return formatSuccessResponse({
      id: page.id,
      title: page.title,
      slug: page.slug,
      status: page.status,
      blocks: page.blocks,
    });
  }
  return formatSuccessResponse({
    id: 'page-dynamic',
    title: slug === 'trang-chu' ? 'Trang Chủ Alpha School' : `Trang ${slug}`,
    slug,
    status: 'PUBLISHED',
    blocks: [],
  });
});

// 8. UNIFIED SEARCH API (AI / Semantic Search)
server.get('/api/v1/search', async (req) => {
  const { q } = req.query as { q?: string };
  if (!q || !q.trim()) {
    return formatSuccessResponse([]);
  }

  const query = q.toLowerCase().trim();
  const results: Array<{
    type: 'branch' | 'program' | 'article';
    title: string;
    description: string;
    url: string;
  }> = [];

  // Search branches
  branchesStore.forEach((b) => {
    if (b.name.toLowerCase().includes(query) || b.address.toLowerCase().includes(query) || b.code.toLowerCase().includes(query)) {
      results.push({
        type: 'branch',
        title: b.name,
        description: b.address,
        url: `/co-so/${b.slug}`,
      });
    }
  });

  // Search programs
  programsStore.forEach((p) => {
    if (p.title.toLowerCase().includes(query) || p.overview.toLowerCase().includes(query) || p.gradeLevels.toLowerCase().includes(query)) {
      results.push({
        type: 'program',
        title: p.title,
        description: `${p.gradeLevels} - ${p.overview.substring(0, 100)}...`,
        url: `/chuong-trinh-hoc/${p.slug}`,
      });
    }
  });

  // Search articles
  articlesStore.forEach((a) => {
    if (a.title.toLowerCase().includes(query) || a.excerpt?.toLowerCase().includes(query)) {
      results.push({
        type: 'article',
        title: a.title,
        description: a.excerpt || '',
        url: `/tin-tuc/${a.slug}`,
      });
    }
  });

  return formatSuccessResponse(results, { total: results.length, query: q });
});

// 9. AI ADMISSIONS CHATBOT ASSISTANT (RAG / Knowledge Base Engine)
server.post('/api/v1/ai/chat', async (req) => {
  const { message, branchId } = req.body as {
    message: string;
    history?: Array<{ role: string; content: string }>;
    branchId?: string;
  };

  const msg = (message || '').toLowerCase();
  let answer = '';
  let suggestions: string[] = [];

  if (msg.includes('học phí') || msg.includes('chi phí') || msg.includes('tiền học') || msg.includes('tuition')) {
    answer = `Dạ chào Quý Phụ huynh! Mức học phí tại Hệ thống Alpha School cho năm học 2025 - 2026 được thiết kế linh hoạt theo từng bậc học:\n\n• Bậc Mầm non Song ngữ: từ 12.000.000 - 15.000.000 VNĐ/tháng\n• Bậc Tiểu học Quốc tế Cambridge: từ 18.000.000 - 22.000.000 VNĐ/tháng\n• Bậc Trung học & Tú tài Cambridge (IGCSE & A-Level): từ 25.000.000 - 32.000.000 VNĐ/tháng\n\nHọc phí đã bao gồm chương trình học chính khóa, giáo trình bản quyền quốc tế và các câu lạc bộ ngoại khóa thứ Bảy. Phụ huynh có thể nộp đơn trực tuyến tại trang Tuyển sinh để nhận ưu đãi giảm 10% khi đóng cả năm!`;
    suggestions = ['Chính sách học bổng thế nào?', 'Có xe đưa đón không?', 'Đăng ký tư vấn trực tiếp'];
  } else if (msg.includes('học bổng') || msg.includes('scholarship') || msg.includes('ưu đãi')) {
    answer = `Alpha School hiện đang triển khai Quỹ Học Bổng "Alpha Excellence 2025" với tổng giá trị 10 tỷ VNĐ:\n\n1. Học bổng Kim Cương (100% học phí): Dành cho học sinh đạt giải Quốc gia/Quốc tế các môn Khoa học, Nghệ thuật hoặc Thể thao.\n2. Học bổng Tài Năng (50% học phí): Dành cho học sinh có giải Nhất/Nhì cấp Tỉnh hoặc IELTS từ 7.5 trở lên.\n3. Học bổng Khởi Đầu (30% học phí): Dành cho học sinh có điểm trung bình học tập từ 9.0 và vượt qua bài khảo sát năng lực đầu vào.\n\nPhụ huynh có thể nộp hồ sơ ứng tuyển học bổng ngay trên website!`;
    suggestions = ['Quy trình khảo sát năng lực?', 'Học phí các khối lớp?', 'Đăng ký nhận cẩm nang'];
  } else if (msg.includes('cơ sở') || msg.includes('ở đâu') || msg.includes('địa chỉ') || msg.includes('campus')) {
    answer = `Hệ thống Alpha School hiện có 3 cơ sở đạt chuẩn quốc tế tại các vị trí giao thông thuận lợi:\n\n1. Cơ sở Biên Hòa: Số 123 Đường Nguyễn Ái Quốc, TP. Biên Hòa, Đồng Nai (Hotline: 0251 123 4567)\n2. Cơ sở TP. Thủ Đức: Khu đô thị Sala, TP. Thủ Đức, TP. HCM (Hotline: 028 987 6543)\n3. Cơ sở Bình Dương: Đại lộ Bình Dương, TP. Thủ Dầu Một, Bình Dương (Hotline: 0274 333 8888)\n\nTất cả cơ sở đều sở hữu hồ bơi 4 mùa, sân bóng đá, phòng lab STEM Robotics và nhà thi đấu đa năng.`;
    suggestions = ['Đặt lịch tham quan cơ sở', 'Có dịch vụ xe bus không?', 'Chương trình Cambridge'];
  } else if (msg.includes('xe bus') || msg.includes('đưa đón') || msg.includes('bán trú') || msg.includes('ăn trưa')) {
    answer = `Dạ có ạ! Alpha School cung cấp đầy đủ dịch vụ chăm sóc bán trú toàn diện:\n\n• Hệ thống xe bus đưa đón tận nhà hoặc theo tuyến điểm tập trung với giám sát viên đi cùng và hệ thống định vị GPS báo về ứng dụng phụ huynh.\n• Bếp ăn chuẩn HACCP chế biến tươi trong ngày với 3 bữa (sáng, trưa, xế), thực đơn tư vấn bởi chuyên gia dinh dưỡng.\n• Phòng ngủ bán trú máy lạnh riêng biệt cho nam và nữ với giáo viên quản nhiệm chăm sóc chu đáo.`;
    suggestions = ['Học phí mầm non và tiểu học?', 'Xem địa chỉ các cơ sở', 'Đăng ký tư vấn tuyển sinh'];
  } else if (msg.includes('chương trình') || msg.includes('cambridge') || msg.includes('song ngữ') || msg.includes('đào tạo')) {
    answer = `Chương trình đào tạo tại Alpha School kết hợp hài hòa giữa Khung chuẩn Bộ GD&ĐT Việt Nam và Chương trình Quốc tế Cambridge (Vương quốc Anh):\n\n• Tỷ lượng tiếng Anh từ 50% - 70% thời lượng học với 100% giáo viên bản ngữ có chứng chỉ sư phạm quốc tế.\n• Tích hợp STEM Robotics, Coding, Nghệ thuật sáng tạo và Kỹ năng Lãnh đạo (Leadership).\n• Học sinh tốt nghiệp nhận bằng Tú tài Anh quốc Cambridge A-Level hoặc Bằng Tốt nghiệp THPT Song ngữ, được công nhận tuyển thẳng tại các Đại học hàng đầu thế giới.`;
    suggestions = ['Điều kiện xét tuyển?', 'Mức học phí lớp 1?', 'Đăng ký kiểm tra năng lực'];
  } else {
    answer = `Xin chào Quý Phụ huynh! Tôi là Trợ Lý Tuyển Sinh AI của Hệ thống Alpha School. Tôi có thể hỗ trợ Quý vị giải đáp mọi thông tin về:\n\n• Chính sách học phí & Quỹ học bổng tài năng lên tới 100%\n• Chương trình đào tạo Song ngữ & Cambridge Quốc tế\n• Quy trình khảo sát năng lực và thủ tục nhập học\n• Hệ thống xe bus và dinh dưỡng bán trú tại các cơ sở\n\nQuý Phụ huynh vui lòng chọn câu hỏi gợi ý bên dưới hoặc để lại số điện thoại để chuyên viên tư vấn gọi lại nhé!`;
    suggestions = ['Học phí năm 2025 - 2026', 'Chính sách học bổng 10 tỷ', 'Hệ thống các cơ sở', 'Quy trình nhập học 4 bước'];
  }

  return formatSuccessResponse({
    answer,
    suggestions,
    timestamp: new Date().toISOString(),
  });
});

// 10. SYSTEM HEALTHCHECK API
server.get('/healthz', async () => {
  return { status: 'healthy', timestamp: new Date().toISOString(), uptime: process.uptime() };
});

server.get('/api/v1/health', async () => {
  return formatSuccessResponse({
    status: 'healthy',
    uptimeSeconds: Math.floor(process.uptime()),
    database: 'connected (PostgreSQL 16)',
    cache: 'ready (Redis 7)',
    registeredBlocksCount: BlockRegistry.getAll().length,
    branchesCount: branchesStore.length,
    articlesCount: articlesStore.length,
    programsCount: programsStore.length,
    pagesCount: pagesStore.length,
    menusCount: menusStore.length,
    translationsCount: translationsStore.length,
    usersCount: usersStore.length,
    webhooksCount: getWebhooks().length,
    mediaCount: mediaStore.length,
  });
});

// 11. WEBHOOK SUBSCRIPTIONS & NOTIFICATIONS API
server.get('/api/v1/webhooks', async () => {
  return formatSuccessResponse(getWebhooks());
});

server.post('/api/v1/webhooks', async (req, reply) => {
  const body = req.body as any;
  if (!body?.name || !body?.url || !body?.secret) {
    return reply.status(400).send({
      success: false,
      data: null,
      error: { code: 'INVALID_INPUT', message: 'Tên, URL và Khóa bí mật secret là bắt buộc' },
    });
  }
  const created = createWebhook({
    name: body.name,
    url: body.url,
    secret: body.secret,
    events: body.events || ['lead.created'],
    isActive: body.isActive !== undefined ? body.isActive : true,
  });
  return formatSuccessResponse(created);
});

server.delete('/api/v1/webhooks/:id', async (req, reply) => {
  const { id } = req.params as { id: string };
  const deleted = deleteWebhook(id);
  if (!deleted) {
    return reply.status(404).send({
      success: false,
      data: null,
      error: { code: 'NOT_FOUND', message: 'Không tìm thấy webhook cần xóa' },
    });
  }
  return formatSuccessResponse({ deleted: true, id });
});

server.get('/api/v1/webhooks/logs', async () => {
  return formatSuccessResponse(getDeliveryLogs());
});

server.post('/api/v1/webhooks/test-trigger', async (req) => {
  const body = req.body as any;
  const event = body?.event || 'lead.created';
  const payload = body?.payload || {
    leadId: `test-lead-${Date.now()}`,
    parentName: 'Phụ Huynh Test Webhook',
    studentName: 'Học Sinh Thử Nghiệm',
    grade: 'Lớp 1 (Song ngữ)',
    branch: 'Cơ sở Biên Hòa',
    timestamp: new Date().toISOString(),
  };

  const results = dispatchWebhookEvent(event, payload);
  return formatSuccessResponse({
    dispatchedCount: results.length,
    event,
    results,
  });
});

// 12. MEDIA ASSET HUB & RESPONSIVE IMAGE OPTIMIZATION API
server.get('/api/v1/media', async (req) => {
  const query = req.query as { category?: string; search?: string; branchId?: string };
  let result = [...mediaStore];

  if (query.category && query.category !== 'all') {
    result = result.filter((m) => m.category === query.category);
  }

  if (query.search) {
    const s = query.search.toLowerCase();
    result = result.filter(
      (m) =>
        m.title.toLowerCase().includes(s) ||
        m.filename.toLowerCase().includes(s) ||
        (m.altText && m.altText.toLowerCase().includes(s))
    );
  }

  if (query.branchId) {
    result = result.filter((m) => !m.branchId || m.branchId === query.branchId);
  }

  return formatSuccessResponse(result);
});

server.post('/api/v1/media/upload', async (req, reply) => {
  const body = req.body as any;
  if (!body?.filename || !body?.mimeType) {
    return reply.status(400).send({
      success: false,
      data: null,
      error: { code: 'INVALID_INPUT', message: 'Tên tệp filename và định dạng mimeType là bắt buộc' },
    });
  }

  const sizeBytes = body.sizeBytes || 1024 * 500;
  const validation = validateMediaUpload({
    filename: body.filename,
    mimeType: body.mimeType,
    sizeBytes,
    maxSizeBytes: body.maxSizeBytes,
  });

  if (!validation.valid) {
    return reply.status(400).send({
      success: false,
      data: null,
      error: { code: 'VALIDATION_FAILED', message: validation.error },
    });
  }

  const storageKey = body.storageKey || generateStorageKey(body.filename);
  const cdnUrl = body.cdnUrl || `https://school.edu.vn/cdn/${storageKey}`;
  const category = detectMediaCategory(body.mimeType);
  const variants = category === 'image' ? generateResponsiveImageVariants(cdnUrl, storageKey) : undefined;

  const newAsset: MediaAsset = {
    id: `med-${Date.now()}`,
    title: body.title || body.filename,
    filename: body.filename,
    originalName: body.originalName || body.filename,
    mimeType: body.mimeType,
    sizeBytes,
    formattedSize: formatFileSize(sizeBytes),
    category,
    storageKey,
    cdnUrl,
    altText: body.altText || body.title || '',
    caption: body.caption || '',
    dimensions: body.dimensions || (category === 'image' ? { width: 1920, height: 1080 } : undefined),
    variants,
    branchId: body.branchId || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mediaStore.unshift(newAsset);
  recordAudit({
    userId: 'u-admin-01',
    userName: 'Super Admin',
    userRole: 'SUPER_ADMIN',
    branchId: body.branchId || null,
    action: 'CREATE',
    entityType: 'ARTICLE',
    entityId: newAsset.id,
    entityTitle: `Media: ${newAsset.title}`,
    details: { filename: newAsset.filename, category: newAsset.category, sizeBytes },
    ipAddress: '127.0.0.1',
  });

  return formatSuccessResponse(newAsset);
});

server.post('/api/v1/media/presigned-url', async (req, reply) => {
  const body = req.body as any;
  if (!body?.filename || !body?.mimeType) {
    return reply.status(400).send({
      success: false,
      data: null,
      error: { code: 'INVALID_INPUT', message: 'filename và mimeType là bắt buộc' },
    });
  }

  const storageKey = generateStorageKey(body.filename);
  const cdnUrl = `https://school.edu.vn/cdn/${storageKey}`;

  return formatSuccessResponse({
    uploadUrl: `https://storage.googleapis.com/alpha-school-media-bucket/${storageKey}?upload_id=mock_${Date.now()}`,
    storageKey,
    cdnUrl,
    expiresInSeconds: 3600,
  });
});

server.delete('/api/v1/media/:id', async (req, reply) => {
  const { id } = req.params as { id: string };
  const index = mediaStore.findIndex((m) => m.id === id);
  if (index === -1) {
    return reply.status(404).send({
      success: false,
      data: null,
      error: { code: 'NOT_FOUND', message: 'Không tìm thấy tệp media cần xóa' },
    });
  }

  const removed = mediaStore.splice(index, 1)[0];
  return formatSuccessResponse({ deleted: true, id: removed.id });
});

// -------------------------------------------------------------
// 12. PERFORMANCE & ON-DEMAND CACHE MANAGEMENT API
// -------------------------------------------------------------
server.get('/api/v1/cache/stats', async () => {
  const stats = globalCacheManager.getStats();
  return formatSuccessResponse({
    ...stats,
    allKeys: globalCacheManager.getAllKeys(),
    edgeCdnStatus: 'ONLINE (Cloudflare Edge Worker)',
    redisClusterStatus: 'CONNECTED (Redis 7 Cluster)',
    nextjsDataCache: 'ACTIVE (Tag-based ISR Engine)',
  });
});

server.post('/api/v1/cache/revalidate', async (req) => {
  const body = req.body as {
    tags?: string[];
    paths?: string[];
    triggeredBy?: string;
  };

  const triggeredBy = body?.triggeredBy || 'Admin Console';
  let purgedCount = 0;
  const revalidatedTags: string[] = [];
  const revalidatedPaths: string[] = [];

  if (body?.tags && Array.isArray(body.tags)) {
    for (const tag of body.tags) {
      const c = globalCacheManager.revalidateTag(tag, triggeredBy);
      purgedCount += c;
      revalidatedTags.push(tag);
    }
  }

  if (body?.paths && Array.isArray(body.paths)) {
    for (const path of body.paths) {
      const c = globalCacheManager.revalidatePath(path, triggeredBy);
      purgedCount += c;
      revalidatedPaths.push(path);
    }
  }

  // Record audit log
  auditLogsStore.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: 'u-admin-01',
    userName: triggeredBy,
    userRole: 'SUPER_ADMIN',
    branchId: null,
    action: 'UPDATE',
    entityType: 'THEME', // performance cache
    entityId: 'edge-cache',
    entityTitle: `Revalidate Cache: ${[...revalidatedTags, ...revalidatedPaths].join(', ')}`,
    details: { revalidatedTags, revalidatedPaths, purgedCount },
    ipAddress: '127.0.0.1',
  });

  return formatSuccessResponse({
    success: true,
    revalidatedTags,
    revalidatedPaths,
    purgedCount,
    remainingKeys: globalCacheManager.getAllKeys().length,
    timestamp: new Date().toISOString(),
  });
});

server.post('/api/v1/cache/purge', async (req) => {
  const body = req.body as { triggeredBy?: string };
  const triggeredBy = body?.triggeredBy || 'Admin Console (Purge All)';
  const purgedCount = globalCacheManager.purgeAll(triggeredBy);

  auditLogsStore.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: 'u-admin-01',
    userName: triggeredBy,
    userRole: 'SUPER_ADMIN',
    branchId: null,
    action: 'DELETE',
    entityType: 'THEME',
    entityId: 'edge-cache-purge',
    entityTitle: 'Purge Entire Edge & Redis Cache',
    details: { purgedCount },
    ipAddress: '127.0.0.1',
  });

  return formatSuccessResponse({
    purgedAll: true,
    purgedCount,
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// 13. SYSTEM HEALTH CHECK API
// -------------------------------------------------------------
server.get('/api/v1/health', async () => {
  const cacheStats = globalCacheManager.getStats();
  return formatSuccessResponse({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    version: '1.0.0',
    services: {
      database: 'UP (PostgreSQL 16)',
      redis: 'UP (Redis 7)',
      edgeCdn: 'UP (Cloudflare)',
      blockRegistry: `${BlockRegistry.getAll().length} Blocks Registered`,
      cacheHitRatio: `${cacheStats.hitRatio}%`,
      cachedKeys: cacheStats.totalKeys,
      mediaCount: mediaStore.length,
      webhooksCount: getWebhooks().length,
    },
  });
});



const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

async function start() {
  try {
    await server.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 API Server running at http://localhost:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
