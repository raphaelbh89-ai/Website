import { z } from 'zod';

// ---------------------------------------------------------------------------
// 1. Partition Strategies & Tiers
// ---------------------------------------------------------------------------

export type PartitionStrategy = 'LIST' | 'RANGE' | 'HASH';

export type DataTier = 'HOT' | 'WARM' | 'COLD';

export type PartitionStatus = 'ACTIVE' | 'DETACHED' | 'ARCHIVED' | 'MAINTENANCE';

export const DATA_TIER_LABELS: Record<DataTier, { label: string; color: string; badge: string; description: string }> = {
  HOT: {
    label: 'Nóng (Hot)',
    color: '#ef4444',
    badge: 'bg-red-500/10 text-red-500 border-red-500/20',
    description: 'Năm học hiện tại, SSD tốc độ cao, hỗ trợ đọc & ghi tức thì',
  },
  WARM: {
    label: 'Ấm (Warm)',
    color: '#f59e0b',
    badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    description: '1-2 năm trước, chỉ đọc (Read-only), nén bảng định kỳ',
  },
  COLD: {
    label: 'Lạnh (Cold)',
    color: '#3b82f6',
    badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    description: 'Lưu trữ >2 năm, tách phân vùng, nén nén định dạng lưu trữ dài hạn Bộ GD&ĐT',
  },
};

// ---------------------------------------------------------------------------
// 2. Partition Metadata
// ---------------------------------------------------------------------------

export interface PartitionMetadata {
  id: string;
  tableName: string;
  partitionName: string;
  strategy: PartitionStrategy;
  keyExpression: string; // e.g. 'branch_id' or 'created_at'
  valuesClause: string; // e.g. "FOR VALUES IN ('branch-bh-01')" or "FOR VALUES FROM ('2026-01-01') TO ('2026-04-01')"
  branchId?: string;
  branchName?: string;
  academicYear?: string;
  rowCount: number;
  sizeBytes: number;
  tier: DataTier;
  status: PartitionStatus;
  isDefault: boolean;
  createdAt: string;
  lastVacuumAt?: string;
}

// ---------------------------------------------------------------------------
// 3. Query Simulation & Partition Pruning Plan
// ---------------------------------------------------------------------------

export interface QueryPlanSimulation {
  query: string;
  targetTable: string;
  criteria: {
    branchId?: string;
    startDate?: string;
    endDate?: string;
  };
  unpartitionedExecution: {
    planType: 'Seq Scan (Full Table Scan)';
    scannedPartitionsCount: 1;
    totalRowsScanned: number;
    estimatedCost: number; // in arbitrary PostgreSQL cost units
    executionTimeMs: number;
    bufferHits: number;
  };
  prunedPartitionExecution: {
    planType: 'Index Scan on Partition (Partition Pruning)';
    targetedPartitions: string[];
    prunedPartitionsCount: number;
    totalRowsScanned: number;
    estimatedCost: number;
    executionTimeMs: number;
    bufferHits: number;
    scanReductionPercentage: number;
    speedupFactor: number;
  };
  explanation: string;
}

// ---------------------------------------------------------------------------
// 4. Data Lifecycle & Archival
// ---------------------------------------------------------------------------

export interface ArchivalPolicy {
  id: string;
  name: string;
  targetTable: string;
  retentionDays: number;
  targetTier: DataTier;
  compression: 'gzip' | 'zstd' | 'none';
  autoDetach: boolean;
  description: string;
}

export interface ArchivalJobRecord {
  id: string;
  policyId: string;
  sourceTable: string;
  partitionName: string;
  cutoffDate: string;
  recordsMigrated: number;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  bytesSaved: number;
  compressionRatio: number; // e.g. 78.5 (%)
  sourceTier: DataTier;
  targetTier: DataTier;
  executedAt: string;
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  checksumSha256: string;
}

export interface ArchivedEntityLookup {
  entityId: string;
  entityType: 'ATTENDANCE' | 'AUDIT_LOG' | 'TRANSACTION' | 'LEAD';
  archivePartition: string;
  academicYear: string;
  archivedAt: string;
  dataPayload: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// 5. Zod Schemas for API Requests
// ---------------------------------------------------------------------------

export const ProvisionPartitionRequestSchema = z.object({
  tableName: z.string().min(1),
  branchId: z.string().optional(),
  branchName: z.string().optional(),
  branchCode: z.string().optional(),
  academicYear: z.string().optional(), // e.g. "2026-2027"
  quarter: z.string().optional(), // e.g. "2026_Q1"
  strategy: z.enum(['LIST', 'RANGE']).default('LIST'),
});

export type ProvisionPartitionRequest = z.infer<typeof ProvisionPartitionRequestSchema>;

export const PrunePlanRequestSchema = z.object({
  targetTable: z.string().default('attendance_records'),
  branchId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type PrunePlanRequest = z.infer<typeof PrunePlanRequestSchema>;

export const ExecuteArchivalRequestSchema = z.object({
  policyId: z.string().optional(),
  targetTable: z.string().default('attendance_records'),
  cutoffDays: z.number().int().min(30).default(180),
  targetTier: z.enum(['WARM', 'COLD']).default('WARM'),
});

export type ExecuteArchivalRequest = z.infer<typeof ExecuteArchivalRequestSchema>;
