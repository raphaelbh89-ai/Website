import { BlockDefinition } from '@school-cms/cms';
import { CtaBannerSchema, CtaBannerConfig, defaultCtaBannerConfig } from './schema';
import { CtaBannerComponent } from './Component';

export * from './schema';
export * from './Component';

export const CtaBannerBlockDefinition: BlockDefinition<CtaBannerConfig> = {
  type: 'cta_banner',
  name: 'Banner Kêu Gọi Hành Động (CTA Banner)',
  version: 1,
  category: 'layout',
  icon: 'Megaphone',
  schema: CtaBannerSchema,
  defaultConfig: defaultCtaBannerConfig,
  renderer: CtaBannerComponent,
};
