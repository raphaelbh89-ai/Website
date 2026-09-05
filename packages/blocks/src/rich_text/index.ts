import { BlockDefinition } from '@school-cms/cms';
import { RichTextSchema, defaultRichTextConfig, RichTextConfig } from './schema';
import { RichTextBlock } from './Component';

export * from './schema';
export * from './Component';

export const RichTextBlockDefinition: BlockDefinition<RichTextConfig> = {
  type: 'rich_text',
  name: 'Văn Bản Định Dạng',
  version: 1,
  category: 'content',
  icon: 'FileText',
  schema: RichTextSchema,
  defaultConfig: defaultRichTextConfig,
  renderer: RichTextBlock,
};
