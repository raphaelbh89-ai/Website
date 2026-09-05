import { BlockDefinition } from '@school-cms/cms';
import { FormEmbedSchema, FormEmbedConfig, defaultFormEmbedConfig } from './schema';
import { FormEmbedComponent } from './Component';

export * from './schema';
export * from './Component';

export const FormEmbedBlockDefinition: BlockDefinition<FormEmbedConfig> = {
  type: 'form_embed',
  name: 'Form Tuyển Sinh & Liên Hệ',
  version: 1,
  category: 'interaction',
  icon: 'FileText',
  schema: FormEmbedSchema,
  defaultConfig: defaultFormEmbedConfig,
  renderer: FormEmbedComponent,
};
