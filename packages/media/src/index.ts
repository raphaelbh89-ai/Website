export interface PresignedUploadRequest {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  branchId?: string | null;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  storageKey: string;
  cdnUrl: string;
  expiresInSeconds: number;
}

export type MediaCategory = 'image' | 'document' | 'video' | 'other';

export interface ImageVariants {
  thumbnail: string;   // 150px (Avatar / Table rows)
  card_small: string;  // 480px (Mobile screen)
  card_large: string;  // 800px (Desktop cards / Grid)
  hero_full: string;   // 1920px (Full-width banners)
}

export interface MediaAsset {
  id: string;
  title: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  formattedSize: string;
  category: MediaCategory;
  storageKey: string;
  cdnUrl: string;
  altText?: string;
  caption?: string;
  dimensions?: { width: number; height: number };
  variants?: ImageVariants;
  branchId?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Tạo storage key ngẫu nhiên theo cấu trúc năm/tháng/uuid để tối ưu hóa lưu trữ S3/GCS
 */
export function generateStorageKey(filename: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const ext = filename.split('.').pop() || 'bin';
  const uuid = crypto.randomUUID();
  return `media/${year}/${month}/${uuid}.${ext}`;
}

/**
 * Định dạng dung lượng tệp tin sang đơn vị KB, MB, GB dễ đọc
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Tự động phát hiện phân loại tệp tin dựa trên MIME type
 */
export function detectMediaCategory(mimeType: string): MediaCategory {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (
    mimeType.includes('pdf') ||
    mimeType.includes('word') ||
    mimeType.includes('document') ||
    mimeType.includes('sheet') ||
    mimeType.includes('excel') ||
    mimeType.includes('text/')
  ) {
    return 'document';
  }
  return 'other';
}

/**
 * Tự động sinh 4 biến thể ảnh thích ứng (Responsive Image Variants)
 * Theo đặc tả tối ưu hiệu năng Core Web Vitals mục 8.3 docs/08-performance.md
 */
export function generateResponsiveImageVariants(cdnUrl: string, storageKey: string): ImageVariants {
  // Chuẩn hóa CDN URL có param kích thước và định dạng WebP hiện đại
  const separator = cdnUrl.includes('?') ? '&' : '?';
  const baseUrl = cdnUrl.split('?')[0];

  return {
    thumbnail: `${baseUrl}${separator}w=150&q=80&format=webp`,
    card_small: `${baseUrl}${separator}w=480&q=80&format=webp`,
    card_large: `${baseUrl}${separator}w=800&q=85&format=webp`,
    hero_full: `${baseUrl}${separator}w=1920&q=90&format=webp`,
  };
}

/**
 * Kiểm định tệp tin tải lên (kích thước tối đa, MIME types hợp lệ)
 */
export function validateMediaUpload(params: {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  maxSizeBytes?: number; // Mặc định 25MB
  allowedMimeTypes?: string[];
}): { valid: boolean; error?: string } {
  const maxSize = params.maxSizeBytes || 25 * 1024 * 1024; // 25MB

  if (params.sizeBytes > maxSize) {
    return {
      valid: false,
      error: `Dung lượng tệp tin (${formatFileSize(params.sizeBytes)}) vượt quá giới hạn tối đa cho phép (${formatFileSize(maxSize)}).`,
    };
  }

  const defaultAllowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'video/mp4',
    'video/webm',
  ];

  const allowedTypes = params.allowedMimeTypes || defaultAllowedMimeTypes;

  if (!allowedTypes.includes(params.mimeType)) {
    return {
      valid: false,
      error: `Định dạng tệp "${params.mimeType}" không được hỗ trợ. Vui lòng tải lên ảnh (JPEG, PNG, WebP, SVG), tài liệu (PDF, Word, Excel) hoặc video (MP4, WebM).`,
    };
  }

  return { valid: true };
}
