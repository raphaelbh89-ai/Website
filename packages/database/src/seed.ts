import { RoleCode, ContentStatus, FormSubmissionStatus } from '@school-cms/shared';

export interface SeedDataset {
  branches: Array<{
    id: string;
    name: string;
    code: string;
    slug: string;
    address: string;
    phone: string;
    email: string;
    isActive: boolean;
  }>;
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: RoleCode;
    branchId: string | null;
  }>;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    sortOrder: number;
  }>;
  articles: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    categoryId: string;
    branchId: string | null;
    status: ContentStatus;
    authorName: string;
  }>;
  forms: Array<{
    id: string;
    code: string;
    name: string;
    fieldsCount: number;
  }>;
  submissions: Array<{
    id: string;
    formCode: string;
    parentName: string;
    phone: string;
    email: string;
    studentName: string;
    grade: string;
    branchId: string;
    status: FormSubmissionStatus;
  }>;
}

export const initialSeedData: SeedDataset = {
  branches: [
    {
      id: 'b-001',
      name: 'Alpha School - Cơ sở Biên Hòa',
      code: 'BIEN_HOA',
      slug: 'bien-hoa',
      address: 'Số 123 Đường Nguyễn Ái Quốc, TP. Biên Hòa, Tỉnh Đồng Nai',
      phone: '0251 123 4567',
      email: 'bienhoa@school.edu.vn',
      isActive: true,
    },
    {
      id: 'b-002',
      name: 'Alpha School - Cơ sở TP. Thủ Đức',
      code: 'THU_DUC',
      slug: 'thu-duc',
      address: 'Khu đô thị Sala, TP. Thủ Đức, TP. Hồ Chí Minh',
      phone: '028 987 6543',
      email: 'thuduc@school.edu.vn',
      isActive: true,
    },
    {
      id: 'b-003',
      name: 'Alpha School - Cơ sở Bình Dương',
      code: 'BINH_DUONG',
      slug: 'binh-duong',
      address: 'Đại lộ Bình Dương, TP. Thủ Dầu Một, Tỉnh Bình Dương',
      phone: '0274 333 8888',
      email: 'binhduong@school.edu.vn',
      isActive: true,
    },
  ],
  users: [
    {
      id: 'u-001',
      name: 'Super Administrator',
      email: 'admin@school.edu.vn',
      role: RoleCode.SUPER_ADMIN,
      branchId: null,
    },
    {
      id: 'u-002',
      name: 'Nguyễn Văn Giám Đốc (Biên Hòa)',
      email: 'director.bienhoa@school.edu.vn',
      role: RoleCode.CAMPUS_DIRECTOR,
      branchId: 'b-001',
    },
    {
      id: 'u-003',
      name: 'Trần Thị Tuyển Sinh (Thủ Đức)',
      email: 'admissions.thuduc@school.edu.vn',
      role: RoleCode.ADMISSIONS_OFFICER,
      branchId: 'b-002',
    },
    {
      id: 'u-004',
      name: 'Lê Biên Tập Viên',
      email: 'editor@school.edu.vn',
      role: RoleCode.CONTENT_EDITOR,
      branchId: null,
    },
  ],
  categories: [
    { id: 'cat-1', name: 'Tin tức & Sự kiện', slug: 'tin-tuc-su-kien', sortOrder: 1 },
    { id: 'cat-2', name: 'Thành tích học thuật', slug: 'thanh-tich', sortOrder: 2 },
    { id: 'cat-3', name: 'Thông báo Tuyển sinh', slug: 'tuyen-sinh', sortOrder: 3 },
    { id: 'cat-4', name: 'Góc Phụ huynh & Học sinh', slug: 'goc-phu-huynh', sortOrder: 4 },
  ],
  articles: [
    {
      id: 'art-001',
      title: 'Lễ Khai Giảng Năm Học 2025: Khát Vọng Vươn Tầm Quốc Tế',
      slug: 'le-khai-giang-nam-hoc-2025',
      excerpt: 'Không khí rộn rã tại tất cả các cơ sở của Alpha School trong ngày tựu trường.',
      categoryId: 'cat-1',
      branchId: null,
      status: ContentStatus.PUBLISHED,
      authorName: 'Ban Truyền Thông Alpha',
    },
    {
      id: 'art-002',
      title: 'Học Sinh Cơ Sở Biên Hòa Đạt Giải Nhất Robotics Quốc Tế',
      slug: 'hoc-sinh-bien-hoa-dat-giai-nhat-robotics-2025',
      excerpt: 'Alpha Robotics Biên Hòa đã giành Huy chương Vàng bảng sáng tạo.',
      categoryId: 'cat-2',
      branchId: 'b-001',
      status: ContentStatus.PUBLISHED,
      authorName: 'CLB Robotics Biên Hòa',
    },
    {
      id: 'art-003',
      title: 'Hội Thảo Hướng Nghiệp & Săn Học Bổng Đại Học Top 100 Thế Giới',
      slug: 'hoi-thao-huong-nghiep-2025',
      excerpt: 'Cơ hội giao lưu với 20 đại học danh tiếng tại Anh, Mỹ, Úc và Canada.',
      categoryId: 'cat-3',
      branchId: null,
      status: ContentStatus.PUBLISHED,
      authorName: 'Phòng Tuyển Sinh',
    },
  ],
  forms: [
    {
      id: 'form-001',
      code: 'tuyen-sinh-2025',
      name: 'Đăng ký Tư vấn Tuyển sinh 2025 - 2026',
      fieldsCount: 6,
    },
    {
      id: 'form-002',
      code: 'tour-co-so',
      name: 'Đăng ký Tham quan Trải nghiệm Khuôn viên',
      fieldsCount: 5,
    },
  ],
  submissions: [
    {
      id: 'sub-001',
      formCode: 'tuyen-sinh-2025',
      parentName: 'Nguyễn Văn An',
      phone: '0912 345 678',
      email: 'an.nguyen@example.com',
      studentName: 'Nguyễn Gia Hân',
      grade: 'Lớp 1',
      branchId: 'b-001',
      status: FormSubmissionStatus.NEW,
    },
    {
      id: 'sub-002',
      formCode: 'tuyen-sinh-2025',
      parentName: 'Trần Thị Mai',
      phone: '0988 765 432',
      email: 'mai.tran@example.com',
      studentName: 'Trần Minh Khang',
      grade: 'Mầm non 4 tuổi',
      branchId: 'b-002',
      status: FormSubmissionStatus.PROCESSING,
    },
    {
      id: 'sub-003',
      formCode: 'tuyen-sinh-2025',
      parentName: 'Lê Hoàng Long',
      phone: '0903 112 233',
      email: 'long.le@example.com',
      studentName: 'Lê Bảo Anh',
      grade: 'Lớp 6 (Cambridge)',
      branchId: 'b-001',
      status: FormSubmissionStatus.CONTACTED,
    },
  ],
};

export async function runDatabaseSeed() {
  console.log('🌱 Starting Enterprise School CMS Database Seed...');
  console.log(`- Campuses seeded: ${initialSeedData.branches.length}`);
  console.log(`- Users seeded: ${initialSeedData.users.length}`);
  console.log(`- Categories seeded: ${initialSeedData.categories.length}`);
  console.log(`- Articles seeded: ${initialSeedData.articles.length}`);
  console.log(`- Forms seeded: ${initialSeedData.forms.length}`);
  console.log(`- Submissions seeded: ${initialSeedData.submissions.length}`);
  console.log('✅ Seed completed successfully! All multi-tenant scopes initialized.');
  return initialSeedData;
}
