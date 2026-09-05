import { BlockRegistry } from '@school-cms/cms';
import { HeroBannerBlockDefinition } from './hero_banner';
import { ProgramListBlockDefinition } from './program_list';
import { PartnerSliderBlockDefinition } from './partner_slider';
import { BranchListBlockDefinition } from './branch_list';
import { NewsListBlockDefinition } from './news_list';

// Tự động đăng ký 5 Block chuẩn vào BlockRegistry theo Open/Closed Principle
BlockRegistry.register(HeroBannerBlockDefinition);
BlockRegistry.register(ProgramListBlockDefinition);
BlockRegistry.register(PartnerSliderBlockDefinition);
BlockRegistry.register(BranchListBlockDefinition);
BlockRegistry.register(NewsListBlockDefinition);

export * from './hero_banner';
export * from './program_list';
export * from './partner_slider';
export * from './branch_list';
export * from './news_list';
