import {
  PartitionMetadata,
  DataTier,
  QueryPlanSimulation,
  PrunePlanRequest,
  ProvisionPartitionRequest,
} from './types';
import { PartitionDdlGenerator } from './ddl-generator';

export const INITIAL_PARTITIONS: PartitionMetadata[] = [
  // 1. attendance_records (LIST partitioned by branch_id)
  {
    id: 'part-att-bh',
    tableName: 'attendance_records',
    partitionName: 'attendance_records_bien_hoa',
    strategy: 'LIST',
    keyExpression: 'branch_id',
    valuesClause: "FOR VALUES IN ('branch-bh-01')",
    branchId: 'branch-bh-01',
    branchName: 'Cơ sở Alpha Biên Hòa',
    academicYear: '2026-2027',
    rowCount: 145200,
    sizeBytes: 18400000,
    tier: 'HOT',
    status: 'ACTIVE',
    isDefault: false,
    createdAt: '2026-01-01T00:00:00Z',
    lastVacuumAt: '2026-09-01T04:00:00Z',
  },
  {
    id: 'part-att-td',
    tableName: 'attendance_records',
    partitionName: 'attendance_records_thu_duc',
    strategy: 'LIST',
    keyExpression: 'branch_id',
    valuesClause: "FOR VALUES IN ('branch-td-02')",
    branchId: 'branch-td-02',
    branchName: 'Cơ sở Alpha TP. Thủ Đức',
    academicYear: '2026-2027',
    rowCount: 122800,
    sizeBytes: 15600000,
    tier: 'HOT',
    status: 'ACTIVE',
    isDefault: false,
    createdAt: '2026-01-01T00:00:00Z',
    lastVacuumAt: '2026-09-01T04:15:00Z',
  },
  {
    id: 'part-att-cg',
    tableName: 'attendance_records',
    partitionName: 'attendance_records_cau_giay',
    strategy: 'LIST',
    keyExpression: 'branch_id',
    valuesClause: "FOR VALUES IN ('branch-cg-03')",
    branchId: 'branch-cg-03',
    branchName: 'Cơ sở Alpha Cầu Giấy (Hà Nội)',
    academicYear: '2026-2027',
    rowCount: 168500,
    sizeBytes: 21300000,
    tier: 'HOT',
    status: 'ACTIVE',
    isDefault: false,
    createdAt: '2026-01-01T00:00:00Z',
    lastVacuumAt: '2026-09-01T04:30:00Z',
  },
  {
    id: 'part-att-dn',
    tableName: 'attendance_records',
    partitionName: 'attendance_records_da_nang',
    strategy: 'LIST',
    keyExpression: 'branch_id',
    valuesClause: "FOR VALUES IN ('branch-dn-04')",
    branchId: 'branch-dn-04',
    branchName: 'Cơ sở Alpha Đà Nẵng',
    academicYear: '2026-2027',
    rowCount: 94100,
    sizeBytes: 11900000,
    tier: 'HOT',
    status: 'ACTIVE',
    isDefault: false,
    createdAt: '2026-02-15T00:00:00Z',
    lastVacuumAt: '2026-09-01T04:45:00Z',
  },
  {
    id: 'part-att-hp',
    tableName: 'attendance_records',
    partitionName: 'attendance_records_hai_phong',
    strategy: 'LIST',
    keyExpression: 'branch_id',
    valuesClause: "FOR VALUES IN ('branch-hp-05')",
    branchId: 'branch-hp-05',
    branchName: 'Cơ sở Alpha Hải Phòng',
    academicYear: '2026-2027',
    rowCount: 88300,
    sizeBytes: 11200000,
    tier: 'HOT',
    status: 'ACTIVE',
    isDefault: false,
    createdAt: '2026-03-01T00:00:00Z',
    lastVacuumAt: '2026-09-01T05:00:00Z',
  },
  {
    id: 'part-att-ct',
    tableName: 'attendance_records',
    partitionName: 'attendance_records_can_tho',
    strategy: 'LIST',
    keyExpression: 'branch_id',
    valuesClause: "FOR VALUES IN ('branch-ct-06')",
    branchId: 'branch-ct-06',
    branchName: 'Cơ sở Alpha Cần Thơ',
    academicYear: '2026-2027',
    rowCount: 65400,
    sizeBytes: 8300000,
    tier: 'HOT',
    status: 'ACTIVE',
    isDefault: false,
    createdAt: '2026-04-10T00:00:00Z',
    lastVacuumAt: '2026-09-01T05:15:00Z',
  },
  {
    id: 'part-att-prev-warm',
    tableName: 'attendance_records',
    partitionName: 'attendance_records_2024_2025_warm',
    strategy: 'LIST',
    keyExpression: 'academic_year',
    valuesClause: "FOR VALUES IN ('2024-2025')",
    academicYear: '2024-2025',
    rowCount: 520000,
    sizeBytes: 39000000,
    tier: 'WARM',
    status: 'ACTIVE',
    isDefault: false,
    createdAt: '2024-09-01T00:00:00Z',
    lastVacuumAt: '2026-08-15T02:00:00Z',
  },
  {
    id: 'part-att-def',
    tableName: 'attendance_records',
    partitionName: 'attendance_records_default',
    strategy: 'LIST',
    keyExpression: 'branch_id',
    valuesClause: 'DEFAULT',
    rowCount: 12500,
    sizeBytes: 1600000,
    tier: 'HOT',
    status: 'ACTIVE',
    isDefault: true,
    createdAt: '2026-01-01T00:00:00Z',
  },

  // 2. audit_logs (RANGE partitioned by created_at)
  {
    id: 'part-audit-2026-q3',
    tableName: 'audit_logs',
    partitionName: 'audit_logs_2026_q3',
    strategy: 'RANGE',
    keyExpression: 'created_at',
    valuesClause: "FOR VALUES FROM ('2026-07-01') TO ('2026-10-01')",
    academicYear: '2026-2027',
    rowCount: 82000,
    sizeBytes: 24600000,
    tier: 'HOT',
    status: 'ACTIVE',
    isDefault: false,
    createdAt: '2026-07-01T00:00:00Z',
    lastVacuumAt: '2026-09-01T03:00:00Z',
  },
  {
    id: 'part-audit-2026-q2',
    tableName: 'audit_logs',
    partitionName: 'audit_logs_2026_q2',
    strategy: 'RANGE',
    keyExpression: 'created_at',
    valuesClause: "FOR VALUES FROM ('2026-04-01') TO ('2026-07-01')",
    academicYear: '2025-2026',
    rowCount: 96400,
    sizeBytes: 28900000,
    tier: 'HOT',
    status: 'ACTIVE',
    isDefault: false,
    createdAt: '2026-04-01T00:00:00Z',
    lastVacuumAt: '2026-08-01T03:00:00Z',
  },
  {
    id: 'part-audit-2026-q1',
    tableName: 'audit_logs',
    partitionName: 'audit_logs_2026_q1',
    strategy: 'RANGE',
    keyExpression: 'created_at',
    valuesClause: "FOR VALUES FROM ('2026-01-01') TO ('2026-04-01')",
    academicYear: '2025-2026',
    rowCount: 112000,
    sizeBytes: 19000000,
    tier: 'WARM',
    status: 'ACTIVE',
    isDefault: false,
    createdAt: '2026-01-01T00:00:00Z',
    lastVacuumAt: '2026-07-01T03:00:00Z',
  },
  {
    id: 'part-audit-2025-cold',
    tableName: 'audit_logs',
    partitionName: 'audit_logs_2025_archive',
    strategy: 'RANGE',
    keyExpression: 'created_at',
    valuesClause: "FOR VALUES FROM ('2025-01-01') TO ('2026-01-01')",
    academicYear: '2024-2025',
    rowCount: 380000,
    sizeBytes: 28500000,
    tier: 'COLD',
    status: 'DETACHED',
    isDefault: false,
    createdAt: '2025-01-01T00:00:00Z',
  },

  // 3. payment_transactions (RANGE partitioned by created_at)
  {
    id: 'part-pay-2026',
    tableName: 'payment_transactions',
    partitionName: 'payment_transactions_2026',
    strategy: 'RANGE',
    keyExpression: 'created_at',
    valuesClause: "FOR VALUES FROM ('2026-01-01') TO ('2027-01-01')",
    academicYear: '2026-2027',
    rowCount: 45200,
    sizeBytes: 14800000,
    tier: 'HOT',
    status: 'ACTIVE',
    isDefault: false,
    createdAt: '2026-01-01T00:00:00Z',
    lastVacuumAt: '2026-09-01T02:00:00Z',
  },
  {
    id: 'part-pay-2025-warm',
    tableName: 'payment_transactions',
    partitionName: 'payment_transactions_2025_warm',
    strategy: 'RANGE',
    keyExpression: 'created_at',
    valuesClause: "FOR VALUES FROM ('2025-01-01') TO ('2026-01-01')",
    academicYear: '2025-2026',
    rowCount: 38100,
    sizeBytes: 8200000,
    tier: 'WARM',
    status: 'ACTIVE',
    isDefault: false,
    createdAt: '2025-01-01T00:00:00Z',
  },
];

export class PartitionRouter {
  private partitions: PartitionMetadata[];

  constructor(initialPartitions: PartitionMetadata[] = INITIAL_PARTITIONS) {
    this.partitions = [...initialPartitions];
  }

  /**
   * List all known partitions, optionally filtered by table or storage tier
   */
  listPartitions(tableName?: string, tier?: DataTier): PartitionMetadata[] {
    let result = [...this.partitions];
    if (tableName) {
      result = result.filter((p) => p.tableName.toLowerCase() === tableName.toLowerCase());
    }
    if (tier) {
      result = result.filter((p) => p.tier === tier);
    }
    return result;
  }

  /**
   * Get a partition by ID
   */
  getPartitionById(id: string): PartitionMetadata | undefined {
    return this.partitions.find((p) => p.id === id);
  }

  /**
   * Resolve which partition handles a specific query or write payload
   */
  resolvePartitionTarget(
    tableName: string,
    criteria: { branchId?: string; timestamp?: string | Date; academicYear?: string }
  ): { targetPartition: string; isDefaultFallback: boolean; tier: DataTier } {
    const tablePartitions = this.partitions.filter(
      (p) => p.tableName.toLowerCase() === tableName.toLowerCase() && p.status !== 'DETACHED'
    );

    if (tablePartitions.length === 0) {
      return { targetPartition: tableName, isDefaultFallback: false, tier: 'HOT' };
    }

    // 1. If branchId is provided (LIST Partitioning)
    if (criteria.branchId) {
      const match = tablePartitions.find(
        (p) => p.branchId === criteria.branchId && p.strategy === 'LIST'
      );
      if (match) {
        return { targetPartition: match.partitionName, isDefaultFallback: false, tier: match.tier };
      }
    }

    // 2. If timestamp is provided (RANGE Partitioning)
    if (criteria.timestamp) {
      const dateStr = criteria.timestamp instanceof Date
        ? criteria.timestamp.toISOString().split('T')[0]
        : String(criteria.timestamp).split('T')[0];

      const rangePartitions = tablePartitions.filter((p) => p.strategy === 'RANGE');
      for (const p of rangePartitions) {
        // Parse "FOR VALUES FROM ('2026-07-01') TO ('2026-10-01')"
        const match = p.valuesClause.match(/FROM \('([^']+)'\) TO \('([^']+)'\)/);
        if (match) {
          const [, start, end] = match;
          if (dateStr >= start && dateStr < end) {
            return { targetPartition: p.partitionName, isDefaultFallback: false, tier: p.tier };
          }
        }
      }
    }

    // 3. Fallback to DEFAULT partition if available
    const defaultPart = tablePartitions.find((p) => p.isDefault);
    if (defaultPart) {
      return { targetPartition: defaultPart.partitionName, isDefaultFallback: true, tier: defaultPart.tier };
    }

    // 4. Ultimate fallback to the primary active hot partition
    const firstActive = tablePartitions.find((p) => p.tier === 'HOT') || tablePartitions[0];
    return { targetPartition: firstActive.partitionName, isDefaultFallback: true, tier: firstActive.tier };
  }

  /**
   * Simulate PostgreSQL EXPLAIN ANALYZE query planner execution with Partition Pruning
   */
  simulatePartitionPruning(request: PrunePlanRequest): QueryPlanSimulation {
    const { targetTable, branchId, startDate, endDate } = request;
    const allTablePartitions = this.partitions.filter(
      (p) => p.tableName.toLowerCase() === targetTable.toLowerCase()
    );

    const totalRowsInTable = allTablePartitions.reduce((acc, p) => acc + p.rowCount, 0);

    // Determine target partitions based on pruning rules
    let targetedPartitions: PartitionMetadata[] = [];
    if (branchId) {
      const branchMatch = allTablePartitions.find((p) => p.branchId === branchId);
      if (branchMatch) {
        targetedPartitions = [branchMatch];
      } else {
        const defaultPart = allTablePartitions.find((p) => p.isDefault);
        targetedPartitions = defaultPart ? [defaultPart] : [allTablePartitions[0]];
      }
    } else if (startDate && endDate) {
      targetedPartitions = allTablePartitions.filter((p) => {
        const match = p.valuesClause.match(/FROM \('([^']+)'\) TO \('([^']+)'\)/);
        if (!match) return false;
        const [, start, end] = match;
        return (startDate >= start && startDate < end) || (endDate > start && endDate <= end);
      });
      if (targetedPartitions.length === 0 && allTablePartitions.length > 0) {
        targetedPartitions = [allTablePartitions[0]];
      }
    } else {
      // No filter: scans all active partitions
      targetedPartitions = allTablePartitions.filter((p) => p.status === 'ACTIVE');
    }

    const prunedPartitionsCount = allTablePartitions.length - targetedPartitions.length;
    const targetedRows = targetedPartitions.reduce((acc, p) => acc + p.rowCount, 0);

    // Unpartitioned calculations (sequential full table scan)
    const unpartitionedExecutionTime = Math.max(120, Math.round(totalRowsInTable * 0.00035)); // ~380ms
    const unpartitionedCost = Math.round(totalRowsInTable * 0.024 + 100);
    const unpartitionedBuffers = Math.round(totalRowsInTable / 60);

    // Pruned partition calculations (targeted index scan)
    const prunedExecutionTime = Math.max(4, Math.round(targetedRows * 0.00006 + 3)); // ~8ms
    const prunedCost = Math.max(45, Math.round(targetedRows * 0.008 + 15));
    const prunedBuffers = Math.max(8, Math.round(targetedRows / 120));

    const scanReductionPercentage = Math.round(
      ((totalRowsInTable - targetedRows) / Math.max(totalRowsInTable, 1)) * 1000
    ) / 10;
    const speedupFactor = Math.round((unpartitionedExecutionTime / prunedExecutionTime) * 10) / 10;

    const querySql = branchId
      ? `SELECT * FROM ${targetTable} WHERE branch_id = '${branchId}' AND deleted_at IS NULL;`
      : `SELECT * FROM ${targetTable} WHERE created_at >= '${startDate}' AND created_at <= '${endDate}';`;

    return {
      query: querySql,
      targetTable,
      criteria: { branchId, startDate, endDate },
      unpartitionedExecution: {
        planType: 'Seq Scan (Full Table Scan)',
        scannedPartitionsCount: 1,
        totalRowsScanned: totalRowsInTable,
        estimatedCost: unpartitionedCost,
        executionTimeMs: unpartitionedExecutionTime,
        bufferHits: unpartitionedBuffers,
      },
      prunedPartitionExecution: {
        planType: 'Index Scan on Partition (Partition Pruning)',
        targetedPartitions: targetedPartitions.map((p) => p.partitionName),
        prunedPartitionsCount,
        totalRowsScanned: targetedRows,
        estimatedCost: prunedCost,
        executionTimeMs: prunedExecutionTime,
        bufferHits: prunedBuffers,
        scanReductionPercentage: Math.max(0, scanReductionPercentage),
        speedupFactor: Math.max(1, speedupFactor),
      },
      explanation: `PostgreSQL 16 Query Planner automatically eliminated ${prunedPartitionsCount} partitions through compile-time & run-time Partition Pruning, scanning only ${targetedRows.toLocaleString()} of ${totalRowsInTable.toLocaleString()} rows (${scanReductionPercentage}% scan reduction, ${speedupFactor}x faster).`,
    };
  }

  /**
   * Provision a new partition for an expanding campus or next quarter
   */
  provisionCampusPartitions(params: ProvisionPartitionRequest): {
    createdPartition: PartitionMetadata;
    ddlSql: string;
  } {
    const { tableName, branchId, branchName, branchCode, academicYear, strategy = 'LIST' } = params;

    const cleanCode = (branchCode || branchId || 'campus').toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const partitionName = `${tableName}_${cleanCode}`;

    let valuesClause = `FOR VALUES IN ('${branchId || cleanCode}')`;
    let ddlSql = '';

    if (strategy === 'LIST') {
      ddlSql = PartitionDdlGenerator.generateCreateListPartition({
        parentTable: tableName,
        partitionName,
        branchValues: [branchId || cleanCode],
      });
    } else {
      valuesClause = "FOR VALUES FROM ('2026-10-01') TO ('2027-01-01')";
      ddlSql = PartitionDdlGenerator.generateCreateRangePartition({
        parentTable: tableName,
        partitionName,
        startDate: '2026-10-01',
        endDate: '2027-01-01',
      });
    }

    const newPartition: PartitionMetadata = {
      id: `part-${cleanCode}-${Date.now().toString().slice(-4)}`,
      tableName,
      partitionName,
      strategy,
      keyExpression: strategy === 'LIST' ? 'branch_id' : 'created_at',
      valuesClause,
      branchId,
      branchName: branchName || `Cơ sở ${branchCode || cleanCode}`,
      academicYear: academicYear || '2026-2027',
      rowCount: 0,
      sizeBytes: 1048576, // 1MB initial empty partition allocation
      tier: 'HOT',
      status: 'ACTIVE',
      isDefault: false,
      createdAt: new Date().toISOString(),
      lastVacuumAt: new Date().toISOString(),
    };

    this.partitions.push(newPartition);

    return { createdPartition: newPartition, ddlSql };
  }

  /**
   * Calculate aggregated health and storage metrics
   */
  getPartitionStats() {
    const totalPartitions = this.partitions.length;
    const activePartitions = this.partitions.filter((p) => p.status === 'ACTIVE').length;
    const totalRows = this.partitions.reduce((acc, p) => acc + p.rowCount, 0);

    const hotPartitions = this.partitions.filter((p) => p.tier === 'HOT');
    const warmPartitions = this.partitions.filter((p) => p.tier === 'WARM');
    const coldPartitions = this.partitions.filter((p) => p.tier === 'COLD');

    const hotBytes = hotPartitions.reduce((acc, p) => acc + p.sizeBytes, 0);
    const warmBytes = warmPartitions.reduce((acc, p) => acc + p.sizeBytes, 0);
    const coldBytes = coldPartitions.reduce((acc, p) => acc + p.sizeBytes, 0);

    return {
      totalPartitions,
      activePartitions,
      totalRows,
      hotStorageBytes: hotBytes,
      warmStorageBytes: warmBytes,
      coldStorageBytes: coldBytes,
      totalStorageBytes: hotBytes + warmBytes + coldBytes,
      averagePruningEfficiencyPercentage: 96.8,
      campusesSupportedCount: 50,
    };
  }
}

export const globalPartitionRouter = new PartitionRouter();
