import Fastify from 'fastify';
import { ApiResponse, Branch, Article, Category, Program, ContentStatus } from '@school-cms/shared';
import {
  AuditLogEntry,
  hasPermission,
  canAccessBranchResource,
  UserContext,
  RoleCode,
} from '@school-cms/auth';

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

// 7. PUBLIC PAGE API (Dynamic Page Resolver)
server.get('/api/v1/public/pages/:slug', async (req) => {
  const { slug } = req.params as { slug: string };
  return formatSuccessResponse({
    id: 'page-dynamic',
    title: slug === 'trang-chu' ? 'Trang Chủ Alpha School' : `Trang ${slug}`,
    slug,
    status: 'PUBLISHED',
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
