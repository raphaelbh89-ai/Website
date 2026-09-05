'use client';

import React, { useState } from 'react';
import { BlockRenderProps } from '@school-cms/cms';
import { GalleryConfig, GalleryImageItem, defaultGalleryConfig } from './schema';

export const GalleryComponent: React.FC<BlockRenderProps<GalleryConfig>> = ({
  config,
  customClasses = '',
}) => {
  const mergedConfig: GalleryConfig = {
    ...defaultGalleryConfig,
    ...config,
    categories: config?.categories?.length ? config.categories : defaultGalleryConfig.categories,
    images: config?.images?.length ? config.images : defaultGalleryConfig.images,
  };

  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');
  const [selectedImage, setSelectedImage] = useState<GalleryImageItem | null>(null);

  const filteredImages = activeCategory === 'Tất cả'
    ? mergedConfig.images
    : mergedConfig.images.filter((img) => img.category === activeCategory);

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 ${customClasses}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {mergedConfig.badge && (
            <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 mb-4 shadow-sm">
              {mergedConfig.badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4 font-heading">
            {mergedConfig.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {mergedConfig.subtitle}
          </p>
        </div>

        {/* Category Tabs */}
        {mergedConfig.categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
            {mergedConfig.categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-emerald-700/20 shadow-md scale-105'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Image Grid */}
        <div className={`grid gap-6 ${
          mergedConfig.columns === '3'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}>
          {filteredImages.map((image) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300 bg-slate-900"
            >
              <img
                src={image.imageUrl}
                alt={image.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                  {image.category}
                </span>
                <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
                  {image.title}
                </h3>
                <div className="mt-2 flex items-center text-xs text-slate-300 gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span>🔍 Xem phóng to</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors text-lg"
              >
                ✕
              </button>

              <div className="max-h-[70vh] overflow-hidden bg-slate-950 flex items-center justify-center">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>

              <div className="p-6 sm:p-8 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    {selectedImage.category}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  {selectedImage.title}
                </h3>
                {selectedImage.caption && (
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {selectedImage.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
