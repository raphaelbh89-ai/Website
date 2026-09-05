import { BlockDefinition } from '@school-cms/cms';
import { ImageTextSchema, defaultImageTextConfig, ImageTextConfig } from './schema';
import { ImageTextBlock } from './Component';

export * from './schema';
export * from './Component';

export const ImageTextBlockDefinition: BlockDefinition<ImageTextConfig> = {
  type: 'image_text',
  name: 'Ảnh Kèm Chữ (Split)',
  version: 1,
  category: 'layout',
  icon: 'Columns2',
  schema: ImageTextSchema,
  defaultConfig: defaultImageTextConfig,
  renderer: ImageTextBlock,
};
