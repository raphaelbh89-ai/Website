import { BlockDefinition } from '@school-cms/cms';
import { NewsListSchema, NewsListConfig, defaultNewsListConfig } from './schema';
import { NewsListComponent } from './Component';

export * from './schema';
export * from './Component';

export const NewsListBlockDefinition: BlockDefinition<NewsListConfig> = {
  type: 'news_list',
  name: 'Danh sách Tin tức & Bài viết',
  version: 1,
  category: 'content',
  icon: 'Newspaper',
  schema: NewsListSchema,
  defaultConfig: defaultNewsListConfig,
  renderer: NewsListComponent,
};
