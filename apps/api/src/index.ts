import Fastify from 'fastify';
import { ApiResponse } from '@school-cms/shared';

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

// Health check
server.get('/health', async () => {
  return { status: 'healthy', timestamp: new Date().toISOString() };
});

// Mock / Default Page API Endpoint
server.get('/api/v1/public/pages/:slug', async (request, reply) => {
  const { slug } = request.params as { slug: string };

  const mockPage = {
    id: 'p-001',
    title: slug === 'trang-chu' ? 'Trang Chủ Alpha School' : `Trang ${slug}`,
    slug,
    templateCode: 'campus_landing',
    branchId: null,
    status: 'PUBLISHED',
    sections: [
      {
        id: 'sec-hero',
        pageId: 'p-001',
        name: 'Hero Section',
        sortOrder: 1,
        isVisible: true,
        settings: { layout: { width: 'full_width' } },
        blocks: [
          {
            id: 'blk-hero',
            type: 'hero_banner',
            version: 1,
            sortOrder: 1,
            isActive: true,
            config: {
              title: 'Kiến Tạo Tương Lai Cùng Alpha School',
              subtitle: 'Hệ thống giáo dục liên cấp song ngữ chuẩn quốc tế hàng đầu',
              primaryButtonText: 'Đăng ký tư vấn ngay',
              primaryButtonUrl: '/tuyen-sinh',
            },
          },
        ],
      },
      {
        id: 'sec-programs',
        pageId: 'p-001',
        name: 'Chương trình đào tạo',
        sortOrder: 2,
        isVisible: true,
        settings: { layout: { width: 'container' } },
        blocks: [
          {
            id: 'blk-programs',
            type: 'program_list',
            version: 1,
            sortOrder: 1,
            isActive: true,
            config: {},
          },
        ],
      },
      {
        id: 'sec-branches',
        pageId: 'p-001',
        name: 'Hệ thống cơ sở',
        sortOrder: 3,
        isVisible: true,
        settings: { layout: { width: 'container' } },
        blocks: [
          {
            id: 'blk-branches',
            type: 'branch_list',
            version: 1,
            sortOrder: 1,
            isActive: true,
            config: {},
          },
        ],
      },
      {
        id: 'sec-partners',
        pageId: 'p-001',
        name: 'Đối tác',
        sortOrder: 4,
        isVisible: true,
        settings: { layout: { width: 'full_width' } },
        blocks: [
          {
            id: 'blk-partners',
            type: 'partner_slider',
            version: 1,
            sortOrder: 1,
            isActive: true,
            config: {},
          },
        ],
      },
      {
        id: 'sec-news',
        pageId: 'p-001',
        name: 'Tin tức',
        sortOrder: 5,
        isVisible: true,
        settings: { layout: { width: 'container' } },
        blocks: [
          {
            id: 'blk-news',
            type: 'news_list',
            version: 1,
            sortOrder: 1,
            isActive: true,
            config: {},
          },
        ],
      },
    ],
  };

  return reply.send(formatSuccessResponse(mockPage));
});

// Form submission endpoint
server.post('/api/v1/public/forms/:code/submit', async (request, reply) => {
  const { code } = request.params as { code: string };
  const body = request.body as Record<string, any>;

  return reply.send(
    formatSuccessResponse({
      submissionId: crypto.randomUUID(),
      message: 'Cảm ơn Quý phụ huynh! Hồ sơ đã được tiếp nhận thành công.',
      formCode: code,
      receivedValues: body,
    })
  );
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
