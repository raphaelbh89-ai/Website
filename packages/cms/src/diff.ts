export interface BlockDiffItem {
  id: string;
  type: string;
  name: string;
  changeType: 'added' | 'removed' | 'modified' | 'unchanged';
  details?: string;
  configDiff?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

export interface PageRevisionDiffResult {
  hasChanges: boolean;
  totalChanges: number;
  addedCount: number;
  removedCount: number;
  modifiedCount: number;
  unchangedCount: number;
  diffItems: BlockDiffItem[];
}

/**
 * Deep compares two page block lists and returns a structured visual diff summary
 */
export function comparePageRevisions(
  baseBlocks: Array<{ id: string; type: string; name?: string; config?: Record<string, any> }>,
  targetBlocks: Array<{ id: string; type: string; name?: string; config?: Record<string, any> }>
): PageRevisionDiffResult {
  const baseMap = new Map(baseBlocks.map((b, idx) => [b.id, { ...b, index: idx }]));
  const targetMap = new Map(targetBlocks.map((b, idx) => [b.id, { ...b, index: idx }]));

  const diffItems: BlockDiffItem[] = [];

  // 1. Check blocks in target (could be added, modified, or unchanged)
  for (const tBlock of targetBlocks) {
    const baseMatch = baseMap.get(tBlock.id);

    if (!baseMatch) {
      diffItems.push({
        id: tBlock.id,
        type: tBlock.type,
        name: tBlock.name || tBlock.type,
        changeType: 'added',
        details: `Khối mới được thêm vào trang`,
      });
    } else {
      // Compare configs
      const baseConf = baseMatch.config || {};
      const targetConf = tBlock.config || {};
      const configDiff: Array<{ field: string; oldValue: any; newValue: any }> = [];

      const allKeys = Array.from(new Set([...Object.keys(baseConf), ...Object.keys(targetConf)]));
      for (const key of allKeys) {
        const val1 = baseConf[key];
        const val2 = targetConf[key];
        if (JSON.stringify(val1) !== JSON.stringify(val2)) {
          configDiff.push({ field: key, oldValue: val1, newValue: val2 });
        }
      }

      if (configDiff.length > 0 || baseMatch.name !== tBlock.name) {
        diffItems.push({
          id: tBlock.id,
          type: tBlock.type,
          name: tBlock.name || tBlock.type,
          changeType: 'modified',
          details: `Thay đổi ${configDiff.length} thuộc tính cấu hình`,
          configDiff,
        });
      } else {
        diffItems.push({
          id: tBlock.id,
          type: tBlock.type,
          name: tBlock.name || tBlock.type,
          changeType: 'unchanged',
        });
      }
    }
  }

  // 2. Check blocks in base that are absent in target (removed)
  for (const bBlock of baseBlocks) {
    if (!targetMap.has(bBlock.id)) {
      diffItems.push({
        id: bBlock.id,
        type: bBlock.type,
        name: bBlock.name || bBlock.type,
        changeType: 'removed',
        details: `Khối đã bị xóa khỏi trang`,
      });
    }
  }

  const addedCount = diffItems.filter((d) => d.changeType === 'added').length;
  const removedCount = diffItems.filter((d) => d.changeType === 'removed').length;
  const modifiedCount = diffItems.filter((d) => d.changeType === 'modified').length;
  const unchangedCount = diffItems.filter((d) => d.changeType === 'unchanged').length;
  const totalChanges = addedCount + removedCount + modifiedCount;

  return {
    hasChanges: totalChanges > 0,
    totalChanges,
    addedCount,
    removedCount,
    modifiedCount,
    unchangedCount,
    diffItems,
  };
}
