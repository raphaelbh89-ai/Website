import { BlockDefinition } from '@school-cms/cms';
import { GoogleMapSchema, defaultGoogleMapConfig, GoogleMapConfig } from './schema';
import { GoogleMapBlock } from './Component';

export * from './schema';
export * from './Component';

export const GoogleMapBlockDefinition: BlockDefinition<GoogleMapConfig> = {
  type: 'google_map',
  name: 'Bản Đồ Google Map',
  version: 1,
  category: 'layout',
  icon: 'MapPin',
  schema: GoogleMapSchema,
  defaultConfig: defaultGoogleMapConfig,
  renderer: GoogleMapBlock,
};
