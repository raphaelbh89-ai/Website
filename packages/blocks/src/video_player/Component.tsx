'use client';

import React, { useState } from 'react';
import { BlockRenderProps } from '@school-cms/cms';
import { VideoPlayerConfig, defaultVideoPlayerConfig } from './schema';

export const VideoPlayerBlock: React.FC<BlockRenderProps<VideoPlayerConfig>> = ({ config, customClasses = '' }) => {
  const mergedConfig: VideoPlayerConfig = {
    ...defaultVideoPlayerConfig,
    ...config,
    chapters: config?.chapters?.length ? config.chapters : defaultVideoPlayerConfig.chapters,
  };

  const [isPlayingModalOpen, setIsPlayingModalOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState<string | null>(null);

  // Chuyển đổi YouTube link sang Embed link nếu cần
  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('watch?v=')[1]?.split('&')[0];
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      }
      return url;
    } catch {
      return url;
    }
  };

  return (
    <section className={`py-16 md:py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden ${customClasses}`}>
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary-500/20 text-primary-300 border border-primary-500/30 mb-4 backdrop-blur-sm">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>{mergedConfig.badge || 'VIDEO GIỚI THIỆU'}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            {mergedConfig.title}
          </h2>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed">
            {mergedConfig.subtitle}
          </p>
        </div>

        {/* Video Cinema Preview Card */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 group bg-slate-800/80">
          <div className="relative aspect-video w-full overflow-hidden">
            {/* Poster Image with Zoom on Hover */}
            <img
              src={mergedConfig.posterUrl}
              alt={mergedConfig.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

            {/* Duration Tag */}
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium text-slate-200 shadow-md">
              <svg className="w-3.5 h-3.5 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>{mergedConfig.duration || '04:15'}</span>
            </div>

            {/* Play Button Trigger with Ripple */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={() => setIsPlayingModalOpen(true)}
                className="relative group/btn flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary-600 hover:bg-primary-500 text-white shadow-2xl transition-all duration-300 transform group-hover:scale-110 active:scale-95"
                aria-label="Phát video giới thiệu"
              >
                {/* Outer animated ripple pulses */}
                <span className="absolute inset-0 rounded-full bg-primary-500/40 animate-ping opacity-75 pointer-events-none" />
                <span className="absolute -inset-3 rounded-full border border-primary-400/40 pointer-events-none" />
                <svg className="w-8 h-8 md:w-10 md:h-10 fill-white translate-x-0.5" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </button>
              <span className="mt-4 text-sm font-semibold tracking-wide text-white/90 drop-shadow-md bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                Bấm để xem thước phim trường học
              </span>
            </div>
          </div>

          {/* Chapter Bar (Nếu có cấu hình) */}
          {mergedConfig.showChapters && mergedConfig.chapters && mergedConfig.chapters.length > 0 && (
            <div className="p-4 md:p-6 bg-slate-900/95 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  Các Phân Đoạn Nổi Bật (Chapters)
                </span>
                <span className="text-xs text-slate-500">{mergedConfig.chapters.length} chương</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {mergedConfig.chapters.map((ch) => {
                  const isActive = activeChapter === ch.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => {
                        setActiveChapter(ch.id);
                        setIsPlayingModalOpen(true);
                      }}
                      className={`text-left p-2.5 rounded-xl border transition-all text-xs flex items-center gap-2.5 ${
                        isActive
                          ? 'bg-primary-950/60 border-primary-500 text-primary-200 shadow-sm'
                          : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <span className="font-mono text-primary-400 bg-primary-950/80 px-1.5 py-0.5 rounded text-[11px] font-bold">
                        {ch.time}
                      </span>
                      <span className="font-medium truncate flex-1">{ch.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full-Screen Video Lightbox Modal */}
      {isPlayingModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fadeIn"
          onClick={() => setIsPlayingModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center gap-2 truncate">
                <svg className="w-4 h-4 text-primary-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <h4 className="text-sm md:text-base font-semibold text-white truncate">
                  {mergedConfig.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsPlayingModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                aria-label="Đóng video"
              >
                ✕
              </button>
            </div>

            {/* Video Player Frame */}
            <div className="relative aspect-video w-full bg-black">
              {mergedConfig.videoSource === 'youtube' ? (
                <iframe
                  src={getEmbedUrl(mergedConfig.videoUrl)}
                  title={mergedConfig.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  src={mergedConfig.videoUrl}
                  controls
                  autoPlay
                  poster={mergedConfig.posterUrl}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
