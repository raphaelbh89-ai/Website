import { BlockDefinition } from '@school-cms/cms';
import { PartnerSliderSchema, PartnerSliderConfig, defaultPartnerSliderConfig } from './schema';
import { PartnerSliderComponent } from './Component';

export * from './schema';
export * from './Component';

export const PartnerSliderBlockDefinition: BlockDefinition<PartnerSliderConfig> = {
  type: 'partner_slider',
  name: 'Thanh trượt Logo Đối tác',
  version: 1,
  category: 'media',
  icon: 'Handshake',
  schema: PartnerSliderSchema,
  defaultConfig: defaultPartnerSliderConfig,
  renderer: PartnerSliderComponent,
};
