import { BlockDefinition } from '@school-cms/cms';
import { FaqAccordionSchema, FaqAccordionConfig, defaultFaqAccordionConfig } from './schema';
import { FaqAccordionComponent } from './Component';

export * from './schema';
export * from './Component';

export const FaqAccordionBlockDefinition: BlockDefinition<FaqAccordionConfig> = {
  type: 'faq_accordion',
  name: 'Hỏi Đáp Thường Gặp (FAQ Accordion)',
  version: 1,
  category: 'interaction',
  icon: 'HelpCircle',
  schema: FaqAccordionSchema,
  defaultConfig: defaultFaqAccordionConfig,
  renderer: FaqAccordionComponent,
};
