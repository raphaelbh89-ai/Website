import { BlockDefinition } from '@school-cms/cms';
import { BranchListSchema, BranchListConfig, defaultBranchListConfig } from './schema';
import { BranchListComponent } from './Component';

export * from './schema';
export * from './Component';

export const BranchListBlockDefinition: BlockDefinition<BranchListConfig> = {
  type: 'branch_list',
  name: 'Danh sách Cơ sở / Chi nhánh',
  version: 1,
  category: 'school',
  icon: 'MapPin',
  schema: BranchListSchema,
  defaultConfig: defaultBranchListConfig,
  renderer: BranchListComponent,
};
