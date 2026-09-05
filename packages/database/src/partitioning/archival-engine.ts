import {
  ArchivalPolicy,
  ArchivalJobRecord,
  ExecuteArchivalRequest,
  ArchivedEntityLookup,
} from './types';
import { globalPartitionRouter } from './partition-router';

export const DEFAULT_ARCHIVAL_POLICIES: ArchivalPolicy[] = [
  {
    id: 'pol-attendance-warm',
    name: 'Chuyển Chuyên Cần Cũ Sang Warm Tier',
    targetTable: 'attendance_records',
    retentionDays: 180,
    targetTier: 'WARM',
    compression: 'gzip',
    autoDetach: false,
    description: 'Chuyển dữ liệu điểm danh trên 180 ngày sang phân vùng chỉ đọc và nén chân không (VACUUM FREEZE)',
  },
  {
    id: 'pol-attendance-cold',
    name: 'Lưu Trữ Dài Hạn Chuyên Cần Sang Cold Storage (Bộ GD&ĐT)',
    targetTable: 'attendance_records',
    retentionDays: 365,
    targetTier: 'COLD',
    compression: 'zstd',
    autoDetach: true,
    description: 'Tách phân vùng an toàn (CONCURRENTLY) và xuất khẩu lưu trữ chuẩn 5 năm theo quy định Bộ Giáo dục',
  },
  {
    id: 'pol-audit-logs',
    name: 'Lưu Trữ Nhật Ký Kiểm Toán (Audit Logs)',
    targetTable: 'audit_logs',
    retentionDays: 180,
    targetTier: 'COLD',
    compression: 'zstd',
    autoDetach: true,
    description: 'Lưu trữ nhật ký hệ thống trên 6 tháng nhằm tối ưu dung lượng phân vùng chính',
  },
  {
    id: 'pol-payment-txns',
    name: 'Lưu Trữ Giao Dịch Tài Chính Cũ',
    targetTable: 'payment_transactions',
    retentionDays: 365,
    targetTier: 'WARM',
    compression: 'gzip',
    autoDetach: false,
    description: 'Nén giao dịch năm tài chính trước, phục vụ báo cáo kiểm toán doanh nghiệp độc lập',
  },
];

export const INITIAL_ARCHIVAL_HISTORY: ArchivalJobRecord[] = [
  {
    id: 'job-arch-2026-08',
    policyId: 'pol-attendance-cold',
    sourceTable: 'attendance_records',
    partitionName: 'attendance_records_2023_2024_archive',
    cutoffDate: '2025-08-31',
    recordsMigrated: 485000,
    originalSizeBytes: 42500000,
    compressedSizeBytes: 8925000,
    bytesSaved: 33575000,
    compressionRatio: 79.0,
    sourceTier: 'WARM',
    targetTier: 'COLD',
    executedAt: '2026-08-15T02:30:00Z',
    status: 'SUCCESS',
    checksumSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  },
  {
    id: 'job-arch-2026-07',
    policyId: 'pol-audit-logs',
    sourceTable: 'audit_logs',
    partitionName: 'audit_logs_2025_archive',
    cutoffDate: '2025-12-31',
    recordsMigrated: 380000,
    originalSizeBytes: 114000000,
    compressedSizeBytes: 28500000,
    bytesSaved: 85500000,
    compressionRatio: 75.0,
    sourceTier: 'HOT',
    targetTier: 'COLD',
    executedAt: '2026-07-01T03:00:00Z',
    status: 'SUCCESS',
    checksumSha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
  },
];

export class ArchivalEngine {
  private policies: ArchivalPolicy[];
  private history: ArchivalJobRecord[];

  constructor(
    initialPolicies: ArchivalPolicy[] = DEFAULT_ARCHIVAL_POLICIES,
    initialHistory: ArchivalJobRecord[] = INITIAL_ARCHIVAL_HISTORY
  ) {
    this.policies = [...initialPolicies];
    this.history = [...initialHistory];
  }

  listPolicies(): ArchivalPolicy[] {
    return [...this.policies];
  }

  listHistory(): ArchivalJobRecord[] {
    return [...this.history];
  }

  /**
   * Execute an archival policy or manual archival request
   */
  executeArchival(request: ExecuteArchivalRequest): ArchivalJobRecord {
    const { targetTable, cutoffDays, targetTier } = request;

    // Determine target partitions from router
    const allPartitions = globalPartitionRouter.listPartitions(targetTable);
    const candidate = allPartitions.find((p) => p.tier === (targetTier === 'COLD' ? 'WARM' : 'HOT')) || allPartitions[0];

    const recordsMigrated = Math.round(candidate.rowCount * 0.45) || 54000;
    const originalSizeBytes = Math.round(recordsMigrated * 115); // ~115 bytes per row
    const compressionRatio = targetTier === 'COLD' ? 78.5 : 62.0;
    const compressedSizeBytes = Math.round(originalSizeBytes * (1 - compressionRatio / 100));
    const bytesSaved = originalSizeBytes - compressedSizeBytes;

    // Safe simulated SHA-256 for archival integrity
    const checksumSha256 = Array.from({ length: 64 }, (_, i) =>
      ((i * 13 + Date.now()) % 16).toString(16)
    ).join('');

    const newJob: ArchivalJobRecord = {
      id: `job-arch-${Date.now().toString().slice(-6)}`,
      policyId: request.policyId || 'custom-manual-policy',
      sourceTable: targetTable,
      partitionName: candidate.partitionName,
      cutoffDate: new Date(Date.now() - cutoffDays * 86400000).toISOString().split('T')[0],
      recordsMigrated,
      originalSizeBytes,
      compressedSizeBytes,
      bytesSaved,
      compressionRatio,
      sourceTier: candidate.tier,
      targetTier,
      executedAt: new Date().toISOString(),
      status: 'SUCCESS',
      checksumSha256,
    };

    this.history.unshift(newJob);

    return newJob;
  }

  /**
   * Search cold archived historical records without uncompressing the entire partition
   */
  lookupArchivedRecord(entityId: string): ArchivedEntityLookup | null {
    if (!entityId) return null;

    return {
      entityId,
      entityType: 'ATTENDANCE',
      archivePartition: 'attendance_records_2023_2024_archive',
      academicYear: '2023-2024',
      archivedAt: '2026-08-15T02:30:00Z',
      dataPayload: {
        id: entityId,
        studentId: 'stu-hist-0099',
        studentName: 'Trần Văn Hoàng (Lớp 12A1 Khóa 2023)',
        branchId: 'branch-bh-01',
        date: '2024-03-12',
        status: 'PRESENT',
        archivalTier: 'COLD',
        complianceRetentionYears: 5,
      },
    };
  }

  /**
   * Get total metrics on storage saved through archival
   */
  getArchivalSummary() {
    const totalJobs = this.history.length;
    const totalRecordsArchived = this.history.reduce((acc, h) => acc + h.recordsMigrated, 0);
    const totalBytesSaved = this.history.reduce((acc, h) => acc + h.bytesSaved, 0);
    const avgCompressionRatio = totalJobs > 0
      ? Math.round((this.history.reduce((acc, h) => acc + h.compressionRatio, 0) / totalJobs) * 10) / 10
      : 76.5;

    return {
      totalJobs,
      totalRecordsArchived,
      totalBytesSaved,
      avgCompressionRatio,
      complianceStandard: 'Bộ GD&ĐT Quy chế Lưu trữ Hồ sơ Học thuật 5-10 năm',
    };
  }
}

export const globalArchivalEngine = new ArchivalEngine();
