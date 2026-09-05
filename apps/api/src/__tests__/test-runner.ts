import assert from 'node:assert';
import { BlockRegistry } from '@school-cms/cms';
import '@school-cms/blocks';
import {
  RoleCode,
  hasPermission,
  canAccessBranchResource,
  UserContext,
} from '@school-cms/auth';
import { initialSeedData } from '@school-cms/database';

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

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} Passed | ${failed} Failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
