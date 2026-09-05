import { BlockDefinition } from '@school-cms/cms';
import { VideoPlayerSchema, defaultVideoPlayerConfig, VideoPlayerConfig } from './schema';
import { VideoPlayerBlock } from './Component';

export * from './schema';
export * from './Component';

export const VideoPlayerBlockDefinition: BlockDefinition<VideoPlayerConfig> = {
  type: 'video_player',
  name: 'Trình Chiếu Video',
  version: 1,
  category: 'media',
  icon: 'Film',
  schema: VideoPlayerSchema,
  defaultConfig: defaultVideoPlayerConfig,
  renderer: VideoPlayerBlock,
};
