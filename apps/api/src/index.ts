import Fastify from 'fastify';
import { ApiResponse, Branch, Article, Category, Program, ContentStatus } from '@school-cms/shared';

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
    excerpt: 'Thầy và trò Alpha School tưng bừng chào đón năm học mới với nhiều mục tiêu giáo dục đột phá, sẵn sàng hội nhập toàn cầu.',
    content: `<p>Sáng ngày 05/09/2026, Hệ thống Trường Song ngữ Quốc tế Alpha School đã long trọng tổ chức Lễ Khai giảng Năm học 2025 - 2026 tại tất cả các cơ sở trên toàn quốc.</p>
    <p>Buổi lễ có sự tham dự của Ban Giám hiệu nhà trường, đại diện các tổ chức giáo dục quốc tế (Cambridge, Cognia), cùng toàn thể quý phụ huynh và hơn 3,000 học sinh xuất sắc.</p>
    <h2>Đổi Mới Phương Pháp Giảng Dạy Tiêu Chuẩn Quốc Tế</h2>
    <p>Trong năm học mới này, Alpha School tiếp tục đẩy mạnh ứng dụng công nghệ STEM/AI và các phương pháp học tập theo dự án (Project-based learning), giúp học sinh phát triển năng lực tư duy phản biện và khả năng sáng tạo không giới hạn.</p>`,
    featuredImageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Tin tức & Sự kiện', slug: 'tin-tuc-su-kien', sortOrder: 1 },
    authorName: 'Ban Truyền Thông Alpha School',
    branchId: null, // Toàn trường
    status: ContentStatus.PUBLISHED,
    isFeatured: true,
    publishedAt: '2026-09-05T08:00:00.000Z',
    createdAt: '2026-09-05T08:00:00.000Z',
    updatedAt: '2026-09-05T08:00:00.000Z',
  },
  {
    id: 'art-002',
    title: 'Học Sinh Alpha School Cơ Sở Biên Hòa Đạt Giải Nhất Robotics Quốc Tế',
    slug: 'dat-giai-nhat-robot-quoc-te',
    excerpt: 'Đội tuyển Robotics cơ sở Biên Hòa xuất sắc vượt qua 50 đối thủ quốc tế để bước lên bục vinh quang cao nhất.',
    content: `<p>Đội tuyển sáng tạo Robotics thuộc Alpha School Cơ sở Biên Hòa đã xuất sắc giành Huy chương Vàng tại giải đấu VEX Robotics Châu Á - Thái Bình Dương 2026.</p>
    <p>Đây là minh chứng rõ nét cho sự đầu tư bài bản về phòng Lab thực nghiệm và đội ngũ chuyên gia công nghệ tại cơ sở Biên Hòa.</p>`,
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

let submissionsStore: any[] = [];

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------

// Health check
server.get('/health', async () => {
  return { status: 'healthy', timestamp: new Date().toISOString() };
});

// 1. BRANCHES API
server.get('/api/v1/branches', async () => {
  return formatSuccessResponse(branchesStore);
});

server.post('/api/v1/branches', async (req) => {
  const body = req.body as any;
  const newBranch: Branch = {
    id: `b-${Date.now()}`,
    name: body.name,
    code: body.code || body.slug.toUpperCase(),
    slug: body.slug,
    address: body.address,
    phone: body.phone,
    email: body.email,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  branchesStore.push(newBranch);
  return formatSuccessResponse(newBranch);
});

server.put('/api/v1/branches/:id', async (req) => {
  const { id } = req.params as { id: string };
  const body = req.body as any;
  const idx = branchesStore.findIndex((b) => b.id === id);
  if (idx === -1) throw new Error('Branch not found');
  branchesStore[idx] = { ...branchesStore[idx], ...body, updatedAt: new Date().toISOString() };
  return formatSuccessResponse(branchesStore[idx]);
});

server.delete('/api/v1/branches/:id', async (req) => {
  const { id } = req.params as { id: string };
  branchesStore = branchesStore.filter((b) => b.id !== id);
  return formatSuccessResponse({ deleted: true });
});

// 2. CATEGORIES API
server.get('/api/v1/categories', async () => {
  return formatSuccessResponse(categoriesStore);
});

// 3. ARTICLES API
server.get('/api/v1/articles', async (req) => {
  const query = req.query as { branchId?: string; categoryId?: string; search?: string };
  let results = [...articlesStore];

  if (query.branchId) {
    results = results.filter((a) => a.branchId === query.branchId || a.branchId === null);
  }
  if (query.categoryId) {
    results = results.filter((a) => a.categoryId === query.categoryId);
  }
  if (query.search) {
    const q = query.search.toLowerCase();
    results = results.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
  }

  return formatSuccessResponse(results);
});

server.get('/api/v1/articles/:slug', async (req, reply) => {
  const { slug } = req.params as { slug: string };
  const article = articlesStore.find((a) => a.slug === slug);
  if (!article) {
    return reply.status(404).send({
      success: false,
      data: null,
      error: { code: 'NOT_FOUND', message: 'Không tìm thấy bài viết' },
    });
  }
  return formatSuccessResponse(article);
});

server.post('/api/v1/articles', async (req) => {
  const body = req.body as any;
  const category = categoriesStore.find((c) => c.id === body.categoryId);
  const newArticle: Article = {
    id: `art-${Date.now()}`,
    title: body.title,
    slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    excerpt: body.excerpt || '',
    content: body.content || '',
    featuredImageUrl: body.featuredImageUrl || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
    categoryId: body.categoryId,
    category,
    authorName: body.authorName || 'Ban Biên Tập',
    branchId: body.branchId || null,
    status: body.status || ContentStatus.PUBLISHED,
    isFeatured: body.isFeatured || false,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  articlesStore.unshift(newArticle);
  return formatSuccessResponse(newArticle);
});

server.delete('/api/v1/articles/:id', async (req) => {
  const { id } = req.params as { id: string };
  articlesStore = articlesStore.filter((a) => a.id !== id);
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

// 5. FORM SUBMISSIONS API
server.get('/api/v1/submissions', async () => {
  return formatSuccessResponse(submissionsStore);
});

server.post('/api/v1/public/forms/:code/submit', async (req) => {
  const { code } = req.params as { code: string };
  const body = req.body as Record<string, any>;
  const submission = {
    id: crypto.randomUUID(),
    formCode: code,
    values: body,
    status: 'NEW',
    createdAt: new Date().toISOString(),
  };
  submissionsStore.unshift(submission);
  return formatSuccessResponse(submission);
});

// 6. PUBLIC PAGE API (Dynamic Page Resolver)
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
