export interface PresignedUploadRequest {
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  storageKey: string;
  cdnUrl: string;
  expiresInSeconds: number;
}

/**
 * Tạo storage key ngẫu nhiên theo cấu trúc năm/tháng/uuid để tối ưu hóa lưu trữ S3
 */
export function generateStorageKey(filename: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const ext = filename.split('.').pop() || 'bin';
  const uuid = crypto.randomUUID();
  return `media/${year}/${month}/${uuid}.${ext}`;
}
