'use client';

import React, { useState } from 'react';
import { BlockRenderProps } from '@school-cms/cms';
import { TestimonialSliderConfig } from './schema';

export const TestimonialSliderComponent: React.FC<BlockRenderProps<TestimonialSliderConfig>> = ({
  config,
  customClasses = '',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = config.items || [];

  if (items.length === 0) return null;

  const currentItem = items[activeIndex] || items[0];

  return (
    <section className={`py-16 bg-slate-900 text-white overflow-hidden relative ${customClasses}`}>
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-emerald-400 font-semibold text-xs uppercase tracking-widest bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-800">
            LỜI CHỨNG THỰC
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight">
            {config.title}
          </h2>
          {config.subtitle && (
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              {config.subtitle}
            </p>
          )}
        </div>

        {/* Featured Testimonial Card */}
        <div className="max-w-4xl mx-auto bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-3xl p-8 md:p-12 shadow-2xl relative">
          <span className="text-6xl text-emerald-500/20 font-serif absolute top-6 left-8">“</span>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            {/* Avatar & Badge */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-3 border-emerald-500 shadow-lg mb-3">
                <img
                  src={currentItem.avatarUrl}
                  alt={currentItem.authorName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex text-amber-400 text-sm">
                {'★'.repeat(currentItem.rating)}
              </div>
            </div>

            {/* Content & Info */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-slate-200 text-base md:text-lg italic leading-relaxed mb-6 font-serif">
                &ldquo;{currentItem.content}&rdquo;
              </p>
              <div>
                <h4 className="text-lg font-bold text-white tracking-tight">
                  {currentItem.authorName}
                </h4>
                <p className="text-xs text-emerald-400 font-medium mt-0.5">
                  {currentItem.studentInfo}
                </p>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {currentItem.role}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-3 mt-8 pt-6 border-t border-slate-700/60">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`transition-all rounded-full ${
                  activeIndex === idx
                    ? 'w-8 h-2.5 bg-emerald-500'
                    : 'w-2.5 h-2.5 bg-slate-600 hover:bg-slate-400'
                }`}
                title={`Xem chia sẻ ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
