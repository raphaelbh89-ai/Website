import { BlockDefinition } from '@school-cms/cms';
import { HeroBannerSchema, HeroBannerConfig, defaultHeroBannerConfig } from './schema';
import { HeroBannerComponent } from './Component';

export * from './schema';
export * from './Component';

export const HeroBannerBlockDefinition: BlockDefinition<HeroBannerConfig> = {
  type: 'hero_banner',
  name: 'Hero Banner Lớn',
  version: 1,
  category: 'layout',
  icon: 'Layers',
  schema: HeroBannerSchema,
  defaultConfig: defaultHeroBannerConfig,
  renderer: HeroBannerComponent,
};
