/**
 * Multi-Tier Performance & On-Demand Tag-Based Cache Invalidation Engine
 * Conforms to docs/08-performance.md Section 8.1 (On-demand ISR) & 8.2 (Multi-tier Caching)
 */

export interface CacheItem<T = any> {
  key: string;
  value: T;
  tags: string[];
  ttlSeconds: number;
  createdAt: number;
  expiresAt: number;
}

export interface RevalidationLog {
  id: string;
  target: string;
  type: 'TAG' | 'PATH' | 'ALL';
  purgedCount: number;
  timestamp: string;
  triggeredBy: string;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRatio: number; // percentage, e.g. 85.5%
  totalKeys: number;
  activeKeys: number;
  expiredKeys: number;
  memoryEstimateBytes: number;
  revalidationCount: number;
  recentLogs: RevalidationLog[];
}

export class CacheManager {
  private store: Map<string, CacheItem> = new Map();
  private hits = 0;
  private misses = 0;
  private logs: RevalidationLog[] = [];

  constructor() {
    this.seedInitialCache();
  }

  private seedInitialCache() {
    // Seed initial cached objects matching Next.js Data Cache / Redis Tier 3
    this.set('page:data:home', { title: 'Trang Chủ Alpha School', status: 'cached' }, {
      ttlSeconds: 3600,
      tags: ['page:home', 'global-layout', 'branch:all'],
    });

    this.set('page:data:tuyen-sinh', { title: 'Tuyển Sinh 2025-2026', status: 'cached' }, {
      ttlSeconds: 3600,
      tags: ['page:tuyen-sinh', 'branch:all'],
    });

    this.set('branch:data:bien-hoa', { name: 'Cơ sở Biên Hòa', status: 'cached' }, {
      ttlSeconds: 7200,
      tags: ['branch:bien-hoa', 'page:branches'],
    });

    this.set('branch:data:thu-duc', { name: 'Cơ sở Thủ Đức', status: 'cached' }, {
      ttlSeconds: 7200,
      tags: ['branch:thu-duc', 'page:branches'],
    });

    this.set('theme:active:tokens', { colorPrimary: '#047857', radius: '12px' }, {
      ttlSeconds: 86400,
      tags: ['theme:tokens', 'global-layout'],
    });

    // Simulate baseline traffic stats for realistic monitoring
    this.hits = 142;
    this.misses = 18;
  }

  public get<T = any>(key: string): T | null {
    const item = this.store.get(key);
    if (!item) {
      this.misses++;
      return null;
    }

    const now = Date.now();
    if (now > item.expiresAt) {
      this.store.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return item.value as T;
  }

  public set<T = any>(
    key: string,
    value: T,
    options?: { ttlSeconds?: number; tags?: string[] }
  ): CacheItem<T> {
    const ttl = options?.ttlSeconds ?? 3600;
    const now = Date.now();
    const item: CacheItem<T> = {
      key,
      value,
      tags: options?.tags || [],
      ttlSeconds: ttl,
      createdAt: now,
      expiresAt: now + ttl * 1000,
    };

    this.store.set(key, item);
    return item;
  }

  public has(key: string): boolean {
    const item = this.store.get(key);
    if (!item) return false;
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  public delete(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Revalidates all cache items associated with a given tag
   * Example: revalidateTag('branch:bien-hoa') or revalidateTag('page:home')
   */
  public revalidateTag(tag: string, triggeredBy = 'Admin Console'): number {
    let purged = 0;
    for (const [key, item] of this.store.entries()) {
      if (item.tags.includes(tag)) {
        this.store.delete(key);
        purged++;
      }
    }

    this.recordLog({
      target: tag,
      type: 'TAG',
      purgedCount: purged,
      triggeredBy,
    });

    return purged;
  }

  /**
   * Revalidates a specific path or URL pattern
   */
  public revalidatePath(path: string, triggeredBy = 'Admin Console'): number {
    const normalized = path.startsWith('/') ? path.slice(1) : path;
    let purged = 0;

    for (const [key] of this.store.entries()) {
      if (key.includes(normalized) || key.includes(`page:${normalized}`)) {
        this.store.delete(key);
        purged++;
      }
    }

    this.recordLog({
      target: path,
      type: 'PATH',
      purgedCount: purged,
      triggeredBy,
    });

    return purged;
  }

  /**
   * Purges all cache keys
   */
  public purgeAll(triggeredBy = 'Admin Console'): number {
    const count = this.store.size;
    this.store.clear();

    this.recordLog({
      target: '*',
      type: 'ALL',
      purgedCount: count,
      triggeredBy,
    });

    return count;
  }

  public getStats(): CacheStats {
    const now = Date.now();
    let active = 0;
    let expired = 0;
    let memoryEst = 0;

    for (const item of this.store.values()) {
      if (now > item.expiresAt) {
        expired++;
      } else {
        active++;
      }
      // rough memory estimate
      memoryEst += JSON.stringify(item.value).length * 2 + item.key.length + 64;
    }

    const totalRequests = this.hits + this.misses;
    const hitRatio = totalRequests > 0 ? Number(((this.hits / totalRequests) * 100).toFixed(1)) : 0;

    return {
      hits: this.hits,
      misses: this.misses,
      hitRatio,
      totalKeys: this.store.size,
      activeKeys: active,
      expiredKeys: expired,
      memoryEstimateBytes: memoryEst,
      revalidationCount: this.logs.length,
      recentLogs: this.logs.slice(0, 10),
    };
  }

  public getAllKeys(): string[] {
    return Array.from(this.store.keys());
  }

  private recordLog(log: Omit<RevalidationLog, 'id' | 'timestamp'>) {
    const entry: RevalidationLog = {
      ...log,
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    this.logs.unshift(entry);
    if (this.logs.length > 50) {
      this.logs.pop();
    }
  }
}

export const globalCacheManager = new CacheManager();
