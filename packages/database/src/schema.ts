import { pgTable, text, varchar, timestamp, boolean, integer, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// --------------------------------------------------------
// 1. CORE IDENTITY & ACCESS CONTROL (RBAC)
// --------------------------------------------------------
export const users = pgTable('users', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: varchar('email', { length: 255 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 150 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  avatarUrl: text('avatar_url'),
  status: varchar('status', { length: 20 }).default('ACTIVE').notNull(),
  branchId: varchar('branch_id', { length: 36 }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('users_email_idx').on(table.email).where(sql`deleted_at IS NULL`),
  branchIdx: index('users_branch_idx').on(table.branchId),
}));

export const roles = pgTable('roles', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  description: text('description'),
  scope: varchar('scope', { length: 20 }).default('GLOBAL').notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  slugIdx: uniqueIndex('roles_slug_idx').on(table.slug).where(sql`deleted_at IS NULL`),
}));

export const userRoles = pgTable('user_roles', {
  userId: varchar('user_id', { length: 36 }).notNull(),
  roleId: varchar('role_id', { length: 36 }).notNull(),
  branchId: varchar('branch_id', { length: 36 }),
}, (table) => ({
  pk: index('user_roles_idx').on(table.userId, table.roleId),
}));

// --------------------------------------------------------
// 2. SCHOOL & MULTI-BRANCH ENTITIES
// --------------------------------------------------------
export const branches = pgTable('branches', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 200 }).notNull(),
  code: varchar('code', { length: 50 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  address: text('address').notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  coordinates: jsonb('coordinates'),
  isActive: boolean('is_active').default(true).notNull(),
  themeId: varchar('theme_id', { length: 36 }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  slugIdx: uniqueIndex('branches_slug_idx').on(table.slug).where(sql`deleted_at IS NULL`),
  codeIdx: uniqueIndex('branches_code_idx').on(table.code).where(sql`deleted_at IS NULL`),
}));

// --------------------------------------------------------
// 3. CMS & PAGE BUILDER HIERARCHY
// --------------------------------------------------------
export const templates = pgTable('templates', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 150 }).notNull(),
  code: varchar('code', { length: 100 }).notNull(),
  defaultStructure: jsonb('default_structure'),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  codeIdx: uniqueIndex('templates_code_idx').on(table.code).where(sql`deleted_at IS NULL`),
}));

export const pages = pgTable('pages', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  templateId: varchar('template_id', { length: 36 }),
  branchId: varchar('branch_id', { length: 36 }),
  status: varchar('status', { length: 20 }).default('DRAFT').notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  seoMetadataId: varchar('seo_metadata_id', { length: 36 }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  slugBranchIdx: uniqueIndex('pages_slug_branch_idx').on(table.slug, table.branchId).where(sql`deleted_at IS NULL`),
  branchIdx: index('pages_branch_idx').on(table.branchId),
}));

export const pageSections = pgTable('page_sections', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  pageId: varchar('page_id', { length: 36 }).notNull(),
  name: varchar('name', { length: 150 }).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  isVisible: boolean('is_visible').default(true).notNull(),
  settings: jsonb('settings').default({}).notNull(),
}, (table) => ({
  pageOrderIdx: index('page_sections_page_order_idx').on(table.pageId, table.sortOrder),
}));

export const pageBlocks = pgTable('page_blocks', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  sectionId: varchar('section_id', { length: 36 }).notNull(),
  type: varchar('type', { length: 100 }).notNull(),
  version: integer('version').default(1).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  config: jsonb('config').default({}).notNull(),
  customClasses: varchar('custom_classes', { length: 255 }),
}, (table) => ({
  sectionOrderIdx: index('page_blocks_section_order_idx').on(table.sectionId, table.sortOrder),
}));

// --------------------------------------------------------
// 4. EDITORIAL CONTENT (ARTICLES)
// --------------------------------------------------------
export const categories = pgTable('categories', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 150 }).notNull(),
  slug: varchar('slug', { length: 150 }).notNull(),
  parentId: varchar('parent_id', { length: 36 }),
  branchId: varchar('branch_id', { length: 36 }),
  sortOrder: integer('sort_order').default(0).notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  slugBranchIdx: uniqueIndex('categories_slug_branch_idx').on(table.slug, table.branchId).where(sql`deleted_at IS NULL`),
}));

export const articles = pgTable('articles', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  featuredImageUrl: text('featured_image_url'),
  categoryId: varchar('category_id', { length: 36 }),
  authorId: varchar('author_id', { length: 36 }),
  branchId: varchar('branch_id', { length: 36 }),
  status: varchar('status', { length: 20 }).default('DRAFT').notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  slugIdx: uniqueIndex('articles_slug_idx').on(table.slug).where(sql`deleted_at IS NULL`),
  branchIdx: index('articles_branch_idx').on(table.branchId),
  categoryIdx: index('articles_category_idx').on(table.categoryId),
}));

// --------------------------------------------------------
// 5. DYNAMIC FORMS & SUBMISSIONS
// --------------------------------------------------------
export const forms = pgTable('forms', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar('title', { length: 200 }).notNull(),
  code: varchar('code', { length: 100 }).notNull(),
  description: text('description'),
  submitButtonText: varchar('submit_button_text', { length: 50 }).default('Gửi hồ sơ').notNull(),
  successMessage: text('success_message').default('Cảm ơn Quý phụ huynh! Nhà trường sẽ liên hệ sớm nhất.').notNull(),
  branchId: varchar('branch_id', { length: 36 }),
  isActive: boolean('is_active').default(true).notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  codeIdx: uniqueIndex('forms_code_idx').on(table.code).where(sql`deleted_at IS NULL`),
}));

export const formSubmissions = pgTable('form_submissions', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  formId: varchar('form_id', { length: 36 }).notNull(),
  branchId: varchar('branch_id', { length: 36 }),
  status: varchar('status', { length: 20 }).default('NEW').notNull(),
  values: jsonb('values').default({}).notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  formStatusIdx: index('form_submissions_form_status_idx').on(table.formId, table.status, table.createdAt),
}));

// --------------------------------------------------------
// 6. SYSTEM, AUDIT LOGS & REVISIONS
// --------------------------------------------------------
export const auditLogs = pgTable('audit_logs', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }),
  action: varchar('action', { length: 50 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }).notNull(),
  entityId: varchar('entity_id', { length: 36 }).notNull(),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  entityIdx: index('audit_logs_entity_idx').on(table.entityType, table.entityId),
}));

export const revisions = pgTable('revisions', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  entityType: varchar('entity_type', { length: 50 }).notNull(),
  entityId: varchar('entity_id', { length: 36 }).notNull(),
  versionNumber: integer('version_number').notNull(),
  snapshotData: jsonb('snapshot_data').notNull(),
  createdBy: varchar('created_by', { length: 36 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  entityVersionIdx: index('revisions_entity_version_idx').on(table.entityType, table.entityId, table.versionNumber),
}));
