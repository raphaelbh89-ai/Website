import { BlockDefinition } from '@school-cms/cms';
import { ContactBoxConfig, ContactBoxSchema, defaultContactBoxConfig } from './schema';
import { ContactBoxComponent } from './Component';

export * from './schema';
export * from './Component';

export const ContactBoxBlockDefinition: BlockDefinition<ContactBoxConfig> = {
  type: 'contact_box',
  name: 'Khối Thông Tin Liên Hệ',
  version: 1,
  category: 'layout',
  icon: 'MapPin',
  schema: ContactBoxSchema,
  defaultConfig: defaultContactBoxConfig,
  renderer: ContactBoxComponent,
};
