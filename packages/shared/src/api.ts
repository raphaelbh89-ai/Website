export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponseMeta {
  timestamp: string;
  requestId: string;
  pagination?: PaginationMeta;
}

export interface ApiFieldError {
  field: string;
  issue: string;
  message: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: ApiFieldError[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  meta: ApiResponseMeta;
  error: ApiErrorPayload | null;
}
