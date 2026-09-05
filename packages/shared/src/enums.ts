export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export enum RoleCode {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CAMPUS_DIRECTOR = 'CAMPUS_DIRECTOR',
  CONTENT_EDITOR = 'CONTENT_EDITOR',
  ADMISSIONS_OFFICER = 'ADMISSIONS_OFFICER',
  PARENT = 'PARENT',
  STUDENT = 'STUDENT'
}

export enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum SectionLayoutWidth {
  CONTAINER = 'container',
  FULL_WIDTH = 'full_width',
  NARROW = 'narrow'
}

export enum DeviceVisibility {
  ALL = 'all',
  DESKTOP = 'desktop',
  MOBILE = 'mobile'
}

export enum FormSubmissionStatus {
  NEW = 'NEW',
  PROCESSING = 'PROCESSING',
  CONTACTED = 'CONTACTED',
  CONVERTED = 'CONVERTED',
  SPAM = 'SPAM'
}

export enum TargetType {
  PAGE = 'PAGE',
  ARTICLE = 'ARTICLE',
  CATEGORY = 'CATEGORY',
  BRANCH = 'BRANCH',
  PROGRAM = 'PROGRAM',
  EXTERNAL_URL = 'EXTERNAL_URL',
  CUSTOM_PATH = 'CUSTOM_PATH'
}
