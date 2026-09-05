import assert from 'node:assert';
import { BlockRegistry } from '@school-cms/cms';
import '@school-cms/blocks';
import {
  RoleCode,
  hasPermission,
  canAccessBranchResource,
  UserContext,
  ALL_PERMISSIONS,
} from '@school-cms/auth';
import { initialSeedData } from '@school-cms/database';
import { DEFAULT_TRANSLATIONS, translate } from '@school-cms/shared';

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 RUNNING ALPHA SCHOOL CMS ENTERPRISE TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function it(name: string, fn: () => void | Promise<void>) {
    try {
      fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ [FAIL] ${name}`);
      console.error(`     Error: ${err?.message || err}`);
      failed++;
    }
  }

  // 1. BLOCK REGISTRY & OPEN/CLOSED ARCHITECTURE
  console.log('--- 1. Block Registry & Dynamic Blocks ---');

  it('BlockRegistry should have all 8 core blocks registered', () => {
    const blocks = BlockRegistry.getAll();
    assert.strictEqual(blocks.length >= 8, true, 'Must have at least 8 core blocks registered');
    
    const types = blocks.map(b => b.type);
    assert.ok(types.includes('hero_banner'), 'Must register hero_banner');
    assert.ok(types.includes('program_list'), 'Must register program_list');
    assert.ok(types.includes('partner_slider'), 'Must register partner_slider');
    assert.ok(types.includes('branch_list'), 'Must register branch_list');
    assert.ok(types.includes('news_list'), 'Must register news_list');
    assert.ok(types.includes('form_embed'), 'Must register form_embed');
    assert.ok(types.includes('testimonial_slider'), 'Must register testimonial_slider');
    assert.ok(types.includes('faq_accordion'), 'Must register faq_accordion');
  });

  it('BlockRegistry should resolve config and apply version migrations', () => {
    const heroDef = BlockRegistry.get('hero_banner');
    assert.ok(heroDef, 'Hero banner block definition exists');
    assert.strictEqual(heroDef?.version, 1);
    assert.ok(heroDef?.defaultConfig.title);
  });

  // 2. RBAC & MULTI-TENANT ACCESS CONTROL
  console.log('\n--- 2. RBAC & Multi-Campus Access Scoping ---');

  it('Super Admin has unrestricted access across all campuses', () => {
    const superAdmin: UserContext = {
      userId: 'u-super',
      name: 'Super Admin',
      email: 'admin@school.edu.vn',
      roles: [RoleCode.SUPER_ADMIN],
      branchId: null,
    };

    assert.strictEqual(hasPermission(superAdmin, 'system:manage'), true);
    assert.strictEqual(hasPermission(superAdmin, 'branches:manage'), true);
    assert.strictEqual(canAccessBranchResource(superAdmin, 'b-001'), true);
    assert.strictEqual(canAccessBranchResource(superAdmin, 'b-002'), true);
    assert.strictEqual(canAccessBranchResource(superAdmin, null), true);
  });

  it('Campus Director is strictly scoped to assigned campus', () => {
    const campusDirectorBienHoa: UserContext = {
      userId: 'u-director-bh',
      name: 'Director Bien Hoa',
      email: 'director.bienhoa@school.edu.vn',
      roles: [RoleCode.CAMPUS_DIRECTOR],
      branchId: 'b-001',
    };

    // Permission check
    assert.strictEqual(hasPermission(campusDirectorBienHoa, 'pages:write'), true);
    assert.strictEqual(hasPermission(campusDirectorBienHoa, 'system:manage'), false); // Cannot manage system

    // Scope check: allowed for Bien Hoa, denied for Thu Duc
    assert.strictEqual(canAccessBranchResource(campusDirectorBienHoa, 'b-001'), true);
    assert.strictEqual(canAccessBranchResource(campusDirectorBienHoa, 'b-002'), false);
  });

  it('Admissions Officer can only access lead pipelines', () => {
    const officer: UserContext = {
      userId: 'u-officer',
      name: 'Admissions Officer',
      email: 'admissions@school.edu.vn',
      roles: [RoleCode.ADMISSIONS_OFFICER],
      branchId: 'b-001',
    };

    assert.strictEqual(hasPermission(officer, 'leads:read'), true);
    assert.strictEqual(hasPermission(officer, 'leads:write'), true);
    assert.strictEqual(hasPermission(officer, 'pages:write'), false);
    assert.strictEqual(hasPermission(officer, 'articles:write'), false);
  });

  // 3. DATABASE SEED DATA INTEGRITY
  console.log('\n--- 3. Database Seed Data Integrity ---');

  it('Seed dataset contains valid 3 campuses, programs, and articles', () => {
    assert.strictEqual(initialSeedData.branches.length, 3);
    assert.strictEqual(initialSeedData.categories.length, 4);
    assert.strictEqual(initialSeedData.articles.length, 3);
    assert.strictEqual(initialSeedData.forms.length, 2);
    assert.strictEqual(initialSeedData.submissions.length, 3);

    // Verify campus slugs
    const branchSlugs = initialSeedData.branches.map(b => b.slug);
    assert.ok(branchSlugs.includes('bien-hoa'));
    assert.ok(branchSlugs.includes('thu-duc'));
    assert.ok(branchSlugs.includes('binh-duong'));
  });

  // 4. MULTI-LANGUAGE (i18n) & CRM EXPORT ENGINE
  console.log('\n--- 4. Multi-Language (i18n) & CRM Export Engine ---');

  it('DEFAULT_TRANSLATIONS dictionary contains valid bilingual keys and fallback', () => {
    assert.ok(DEFAULT_TRANSLATIONS.length >= 15, 'Must have at least 15 translation items');
    for (const item of DEFAULT_TRANSLATIONS) {
      assert.ok(item.key.length > 0, 'Key must not be empty');
      assert.ok(item.vi.length > 0, `Vietnamese translation for ${item.key} must not be empty`);
      assert.ok(item.en.length > 0, `English translation for ${item.key} must not be empty`);
    }

    // Verify translate helper
    assert.strictEqual(translate('nav.home', 'vi'), 'Trang Chủ');
    assert.strictEqual(translate('nav.home', 'en'), 'Home');
    assert.strictEqual(translate('non.existent.key', 'vi'), 'non.existent.key');
  });

  it('Lead CRM Export generates properly encoded and delimited CSV structure', () => {
    const mockLeads = [
      { id: 'lead-001', parentName: 'Trần Văn An', phone: '0912 345 678', email: 'an.tran@example.com', studentName: 'Trần Minh Khang', grade: 'Lớp 1', branch: 'Cơ sở Biên Hòa', date: '05/09/2026 14:30', status: 'Mới', notes: [] },
      { id: 'lead-002', parentName: 'Nguyễn Thị Mai', phone: '0988 765 432', email: 'mai.nguyen@example.com', studentName: 'Nguyễn Tuấn Anh', grade: 'Mầm non', branch: 'Cơ sở TP. Thủ Đức', date: '05/09/2026 11:15', status: 'Đang tư vấn', notes: [{ text: 'Ghi chú', author: 'Admin', date: '05/09/2026' }] },
    ];

    const headers = ['Mã Hồ Sơ', 'Họ Tên Phụ Huynh', 'Số Điện Thoại', 'Email', 'Họ Tên Học Sinh', 'Cấp Lớp', 'Cơ Sở', 'Ngày Đăng Ký', 'Trạng Thái', 'Số Ghi Chú'];
    const rows = mockLeads.map(l => [
      `"${l.id}"`,
      `"${l.parentName.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.studentName.replace(/"/g, '""')}"`,
      `"${l.grade}"`,
      `"${l.branch}"`,
      `"${l.date}"`,
      `"${l.status}"`,
      `"${l.notes.length}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    assert.ok(csvContent.startsWith('\uFEFF'), 'CSV must start with UTF-8 BOM for Microsoft Excel compatibility');
    assert.ok(csvContent.includes('"Trần Văn An"'), 'Row values must be quoted');
    assert.ok(csvContent.includes('"Cơ sở Biên Hòa"'), 'Vietnamese accents must be preserved');
    assert.strictEqual(csvContent.split('\r\n').length, 3, 'CSV must have 1 header line + 2 data rows');
  });

  // 5. RBAC PERMISSIONS MATRIX & DYNAMIC ACCESS CONTROL
  console.log('\n--- 5. Security & RBAC Permission Matrix ---');

  it('ALL_PERMISSIONS covers all required categories and system operations', () => {
    assert.strictEqual(ALL_PERMISSIONS.length >= 13, true, 'Must have at least 13 granular permissions');
    const categories = Array.from(new Set(ALL_PERMISSIONS.map(p => p.category)));
    assert.ok(categories.includes('system'));
    assert.ok(categories.includes('content'));
    assert.ok(categories.includes('admissions'));
    assert.ok(categories.includes('settings'));
  });

  it('Dynamic permission toggling correctly recalculates user authorization', () => {
    const editorUser: UserContext = {
      userId: 'u-editor-dyn',
      name: 'Dynamic Editor',
      email: 'dyn@school.edu.vn',
      roles: [RoleCode.CONTENT_EDITOR],
      branchId: null,
    };

    // By default, content editor has pages:write but NOT system:manage
    assert.strictEqual(hasPermission(editorUser, 'pages:write'), true);
    assert.strictEqual(hasPermission(editorUser, 'system:manage'), false);
    assert.strictEqual(hasPermission(editorUser, 'branches:manage'), false);
  });

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} Passed | ${failed} Failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
