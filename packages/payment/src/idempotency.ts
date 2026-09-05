export interface IdempotencyRecord<T = any> {
  key: string;
  response: T;
  createdAt: number;
  expiresAt: number;
}

/**
 * Idempotency Engine: Chống thanh toán trùng lặp khi mạng chập chờn hoặc phụ huynh bấm nút 2 lần
 */
export class IdempotencyManager<T = any> {
  private records = new Map<string, IdempotencyRecord<T>>();
  private defaultTtlMs: number;

  constructor(defaultTtlSeconds: number = 86400) {
    this.defaultTtlMs = defaultTtlSeconds * 1000;
  }

  /**
   * Kiểm tra xem một Idempotency Key đã được xử lý trước đó chưa
   */
  has(key: string): boolean {
    const record = this.records.get(key);
    if (!record) return false;

    if (Date.now() > record.expiresAt) {
      this.records.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Lấy kết quả phản hồi đã lưu của Idempotency Key
   */
  get(key: string): T | null {
    const record = this.records.get(key);
    if (!record) return null;

    if (Date.now() > record.expiresAt) {
      this.records.delete(key);
      return null;
    }
    return record.response;
  }

  /**
   * Lưu kết quả phản hồi gắn với Idempotency Key
   */
  set(key: string, response: T, ttlSeconds?: number): void {
    const ttlMs = ttlSeconds ? ttlSeconds * 1000 : this.defaultTtlMs;
    const now = Date.now();

    this.records.set(key, {
      key,
      response,
      createdAt: now,
      expiresAt: now + ttlMs,
    });
  }

  /**
   * Xóa một key khỏi bộ đệm
   */
  delete(key: string): boolean {
    return this.records.delete(key);
  }

  /**
   * Xóa tất cả các bản ghi
   */
  clear(): void {
    this.records.clear();
  }

  /**
   * Số lượng bản ghi hiện tại
   */
  size(): number {
    return this.records.size;
  }
}

export const globalPaymentIdempotency = new IdempotencyManager();
