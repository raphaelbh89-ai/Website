import { BlockDefinition } from '@school-cms/cms';
import { ProgramListSchema, ProgramListConfig, defaultProgramListConfig } from './schema';
import { ProgramListComponent } from './Component';

export * from './schema';
export * from './Component';

export const ProgramListBlockDefinition: BlockDefinition<ProgramListConfig> = {
  type: 'program_list',
  name: 'Danh sách Chương trình đào tạo',
  version: 1,
  category: 'school',
  icon: 'BookOpen',
  schema: ProgramListSchema,
  defaultConfig: defaultProgramListConfig,
  renderer: ProgramListComponent,
};
