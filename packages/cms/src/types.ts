import React from 'react';
import { z } from 'zod';
import { BlockInstance } from '@school-cms/shared';

export interface BlockRenderProps<TConfig = any> {
  instanceId: string;
  config: TConfig;
  customClasses?: string;
  branchId?: string | null;
}

export type BlockMigrationFn = (oldConfig: any) => any;

export interface BlockDefinition<TConfig = any> {
  type: string;
  name: string;
  version: number;
  category: 'layout' | 'content' | 'media' | 'school' | 'interaction';
  icon: string;
  schema: z.ZodType<TConfig, any, any>;
  defaultConfig: TConfig;
  renderer: React.ComponentType<BlockRenderProps<TConfig>>;
  migrations?: Record<number, BlockMigrationFn>;
}
