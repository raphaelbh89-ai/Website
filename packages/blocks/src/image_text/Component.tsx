'use client';

import React from 'react';
import { BlockRenderProps } from '@school-cms/cms';
import { ImageTextConfig, defaultImageTextConfig } from './schema';

export const ImageTextBlock: React.FC<BlockRenderProps<ImageTextConfig>> = ({ config, customClasses = '' }) => {
  const mergedConfig: ImageTextConfig = {
    ...defaultImageTextConfig,
    ...config,
    features: config?.features?.length ? config.features : defaultImageTextConfig.features,
  };

  const isImageRight = mergedConfig.imagePosition === 'right';

  return (
    <section className={`py-16 md:py-24 bg-white text-slate-900 overflow-hidden ${customClasses}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Image Column */}
          <div
            className={`lg:col-span-6 relative ${
              isImageRight ? 'lg:order-last' : 'lg:order-first'
            }`}
          >
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Decorative background blur and ring */}
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-primary-100/60 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-amber-100/60 rounded-full blur-2xl pointer-events-none" />

              {/* Main Image Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 group">
                <img
                  src={mergedConfig.imageUrl}
                  alt={mergedConfig.title}
                  className="w-full h-[380px] md:h-[460px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
              </div>

              {/* Floating Stats Badge */}
              {mergedConfig.statsBadge && (
                <div className="absolute -bottom-6 -right-2 md:bottom-6 md:-right-6 bg-white/95 backdrop-blur-md p-4 md:p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3.5 max-w-xs">
                  <div className="w-12 h-12 rounded-xl bg-primary-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md shrink-0">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
                      {mergedConfig.statsBadge.number}
                    </div>
                    <div className="text-xs text-slate-600 font-medium leading-snug">
                      {mergedConfig.statsBadge.label}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Text & Content Column */}
          <div
            className={`lg:col-span-6 ${
              isImageRight ? 'lg:order-first' : 'lg:order-last'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary-100 text-primary-800 border border-primary-200 mb-4">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
              <span>{mergedConfig.badge || 'VỀ ALPHA SCHOOL'}</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-5 leading-tight font-heading">
              {mergedConfig.title}
            </h2>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-6">
              {mergedConfig.description}
            </p>

            {/* Feature Highlights List */}
            {mergedConfig.features && mergedConfig.features.length > 0 && (
              <div className="space-y-4 mb-8">
                {mergedConfig.features.map((feat) => (
                  <div key={feat.id} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div>
                      <h4 className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                        {feat.title}
                      </h4>
                      <p className="text-xs md:text-sm text-slate-600 mt-0.5 leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href={mergedConfig.primaryButtonUrl || '#'}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <span>{mergedConfig.primaryButtonText}</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>

              {mergedConfig.secondaryButtonText && (
                <a
                  href={mergedConfig.secondaryButtonUrl || '#'}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors border border-slate-200"
                >
                  <span>{mergedConfig.secondaryButtonText}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
