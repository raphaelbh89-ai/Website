import { PartitionStrategy } from './types';

/**
 * PostgreSQL 16 Declarative Partitioning DDL Generator
 * Generates standards-compliant SQL statements for Enterprise Multi-Campus partitioning.
 */
export class PartitionDdlGenerator {
  /**
   * Generate DDL to create a parent partitioned table
   */
  static generateCreateParentTable(options: {
    tableName: string;
    strategy: PartitionStrategy;
    keyColumn: string;
    columnsDdl: string[];
    indexesDdl?: string[];
  }): string {
    const { tableName, strategy, keyColumn, columnsDdl, indexesDdl = [] } = options;
    const columnsSql = columnsDdl.map((c) => `  ${c}`).join(',\n');
    const partitionBy = strategy === 'LIST'
      ? `PARTITION BY LIST (${keyColumn})`
      : strategy === 'RANGE'
      ? `PARTITION BY RANGE (${keyColumn})`
      : `PARTITION BY HASH (${keyColumn})`;

    let sql = `-- Parent Partitioned Table: ${tableName} (${strategy} by ${keyColumn})\n`;
    sql += `CREATE TABLE IF NOT EXISTS ${tableName} (\n${columnsSql}\n) ${partitionBy};\n`;

    if (indexesDdl.length > 0) {
      sql += '\n-- Partition parent indexes:\n';
      sql += indexesDdl.map((idx) => `${idx};`).join('\n') + '\n';
    }

    return sql;
  }

  /**
   * Generate DDL for a LIST partition (e.g. for a specific branch_id)
   */
  static generateCreateListPartition(options: {
    parentTable: string;
    partitionName: string;
    branchValues: string[]; // e.g. ['branch-bh-01']
    tablespace?: string;
  }): string {
    const { parentTable, partitionName, branchValues, tablespace } = options;
    const formattedValues = branchValues.map((v) => `'${v.replace(/'/g, "''")}'`).join(', ');
    let sql = `-- LIST Partition for Campus: ${formattedValues}\n`;
    sql += `CREATE TABLE IF NOT EXISTS ${partitionName} PARTITION OF ${parentTable}\n`;
    sql += `  FOR VALUES IN (${formattedValues})`;
    if (tablespace) {
      sql += `\n  TABLESPACE ${tablespace}`;
    }
    sql += `;\n`;
    return sql;
  }

  /**
   * Generate DDL for a RANGE partition (e.g. for a date range / academic quarter)
   */
  static generateCreateRangePartition(options: {
    parentTable: string;
    partitionName: string;
    startDate: string; // '2026-01-01'
    endDate: string; // '2026-04-01'
    tablespace?: string;
  }): string {
    const { parentTable, partitionName, startDate, endDate, tablespace } = options;
    let sql = `-- RANGE Partition from ${startDate} to ${endDate}\n`;
    sql += `CREATE TABLE IF NOT EXISTS ${partitionName} PARTITION OF ${parentTable}\n`;
    sql += `  FOR VALUES FROM ('${startDate}') TO ('${endDate}')`;
    if (tablespace) {
      sql += `\n  TABLESPACE ${tablespace}`;
    }
    sql += `;\n`;
    return sql;
  }

  /**
   * Generate DDL for a DEFAULT partition (catches all unmapped branches or overflow dates)
   */
  static generateCreateDefaultPartition(options: {
    parentTable: string;
    partitionName: string;
  }): string {
    const { parentTable, partitionName } = options;
    let sql = `-- DEFAULT Partition (Catch-all unrouted rows)\n`;
    sql += `CREATE TABLE IF NOT EXISTS ${partitionName} PARTITION OF ${parentTable} DEFAULT;\n`;
    return sql;
  }

  /**
   * Generate zero-downtime partition detachment DDL (PostgreSQL 16 CONCURRENTLY)
   */
  static generateDetachPartition(options: {
    parentTable: string;
    partitionName: string;
    concurrently?: boolean;
  }): string {
    const { parentTable, partitionName, concurrently = true } = options;
    const concurrentClause = concurrently ? ' CONCURRENTLY' : '';
    let sql = `-- Zero-Downtime Detach Partition for Archival Tiering\n`;
    sql += `ALTER TABLE ${parentTable} DETACH PARTITION ${partitionName}${concurrentClause};\n`;
    return sql;
  }

  /**
   * Generate maintenance VACUUM and ANALYZE command for a specific partition
   */
  static generateMaintainPartition(options: {
    partitionName: string;
    fullVacuum?: boolean;
    freeze?: boolean;
  }): string {
    const { partitionName, fullVacuum = false, freeze = false } = options;
    const flags: string[] = ['ANALYZE'];
    if (fullVacuum) flags.push('FULL');
    if (freeze) flags.push('FREEZE');
    return `VACUUM (${flags.join(', ')}) ${partitionName};\n`;
  }
}
