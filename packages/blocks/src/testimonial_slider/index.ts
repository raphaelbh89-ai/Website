import { BlockDefinition } from '@school-cms/cms';
import { TestimonialSliderSchema, TestimonialSliderConfig, defaultTestimonialSliderConfig } from './schema';
import { TestimonialSliderComponent } from './Component';

export * from './schema';
export * from './Component';

export const TestimonialSliderBlockDefinition: BlockDefinition<TestimonialSliderConfig> = {
  type: 'testimonial_slider',
  name: 'Lời Chứng Thực Phụ Huynh & Học Sinh',
  version: 1,
  category: 'content',
  icon: 'MessageSquare',
  schema: TestimonialSliderSchema,
  defaultConfig: defaultTestimonialSliderConfig,
  renderer: TestimonialSliderComponent,
};
