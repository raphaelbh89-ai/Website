import { BlockDefinition } from '@school-cms/cms';
import { GalleryConfig, GallerySchema, defaultGalleryConfig } from './schema';
import { GalleryComponent } from './Component';

export * from './schema';
export * from './Component';

export const GalleryBlockDefinition: BlockDefinition<GalleryConfig> = {
  type: 'gallery',
  name: 'Thư Viện Ảnh Tương Tác',
  version: 1,
  category: 'media',
  icon: 'Images',
  schema: GallerySchema,
  defaultConfig: defaultGalleryConfig,
  renderer: GalleryComponent,
};
