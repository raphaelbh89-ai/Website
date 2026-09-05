import { BlockDefinition } from '@school-cms/cms';
import { StatisticsSchema, StatisticsConfig, defaultStatisticsConfig } from './schema';
import { StatisticsComponent } from './Component';

export * from './schema';
export * from './Component';

export const StatisticsBlockDefinition: BlockDefinition<StatisticsConfig> = {
  type: 'statistics',
  name: 'Con số ấn tượng (Statistics)',
  version: 1,
  category: 'content',
  icon: 'BarChart2',
  schema: StatisticsSchema,
  defaultConfig: defaultStatisticsConfig,
  renderer: StatisticsComponent,
};
