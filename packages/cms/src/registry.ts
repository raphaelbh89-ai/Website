import { BlockDefinition } from './types';

class BlockRegistryStore {
  private registry = new Map<string, BlockDefinition<any>>();

  /**
   * Đăng ký một Block mới vào hệ thống (Open/Closed Principle)
   */
  public register<TConfig>(definition: BlockDefinition<TConfig>): void {
    if (this.registry.has(definition.type)) {
      console.warn(`[BlockRegistry] Overwriting existing block type: ${definition.type}`);
    }
    this.registry.set(definition.type, definition);
  }

  /**
   * Lấy định nghĩa của một Block
   */
  public get(type: string): BlockDefinition<any> | undefined {
    return this.registry.get(type);
  }

  /**
   * Lấy toàn bộ danh sách Block có sẵn trong hệ thống
   */
  public getAll(): BlockDefinition<any>[] {
    return Array.from(this.registry.values());
  }

  /**
   * Chuẩn hóa và chạy migration nếu dữ liệu Block thuộc phiên bản cũ
   */
  public resolveConfig(type: string, dataVersion: number, rawConfig: any): any {
    const blockDef = this.get(type);
    if (!blockDef) {
      return rawConfig;
    }

    let config = { ...rawConfig };
    const currentVersion = blockDef.version;

    if (dataVersion < currentVersion && blockDef.migrations) {
      for (let v = dataVersion; v < currentVersion; v++) {
        const migrationFn = blockDef.migrations[v];
        if (migrationFn) {
          config = migrationFn(config);
        }
      }
    }

    return config;
  }
}

export const BlockRegistry = new BlockRegistryStore();
