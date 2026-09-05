import React from 'react';
import { BlockRenderProps } from '@school-cms/cms';
import { HeroBannerConfig } from './schema';

export const HeroBannerComponent: React.FC<BlockRenderProps<HeroBannerConfig>> = ({
  config,
  customClasses = '',
}) => {
  const alignClass =
    config.textAlignment === 'left'
      ? 'text-left items-start'
      : config.textAlignment === 'right'
      ? 'text-right items-end'
      : 'text-center items-center';

  return (
    <div
      className={`relative w-full min-h-[550px] md:min-h-[650px] flex items-center justify-center overflow-hidden bg-slate-900 text-white ${customClasses}`}
    >
      {/* Background Image */}
      {config.backgroundImageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url(${config.backgroundImageUrl})` }}
        />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: config.overlayOpacity }}
      />

      {/* Content */}
      <div className={`relative z-10 max-w-5xl mx-auto px-4 py-16 flex flex-col ${alignClass}`}>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 drop-shadow-md">
          {config.title}
        </h1>
        {config.subtitle && (
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mb-8 drop-shadow">
            {config.subtitle}
          </p>
        )}
        <div className="flex flex-wrap gap-4 items-center">
          {config.primaryButtonText && (
            <a
              href={config.primaryButtonUrl}
              className="px-8 py-3.5 rounded-md font-semibold text-white transition-all shadow-lg hover:shadow-xl hover:opacity-95"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {config.primaryButtonText}
            </a>
          )}
          {config.secondaryButtonText && (
            <a
              href={config.secondaryButtonUrl}
              className="px-8 py-3.5 rounded-md font-semibold text-white bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all shadow"
            >
              {config.secondaryButtonText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
