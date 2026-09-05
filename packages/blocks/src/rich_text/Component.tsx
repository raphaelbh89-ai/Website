'use client';

import React from 'react';
import { BlockRenderProps } from '@school-cms/cms';
import { RichTextConfig, defaultRichTextConfig } from './schema';

export const RichTextBlock: React.FC<BlockRenderProps<RichTextConfig>> = ({ config, customClasses = '' }) => {
  const mergedConfig: RichTextConfig = {
    ...defaultRichTextConfig,
    ...config,
  };

  const getMaxWidthClass = () => {
    switch (mergedConfig.maxWidth) {
      case 'narrow':
        return 'max-w-2xl';
      case 'wide':
        return 'max-w-5xl';
      case 'standard':
      default:
        return 'max-w-4xl';
    }
  };

  const getCalloutIcon = (type?: string) => {
    switch (type) {
      case 'warning':
        return (
          <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        );
      case 'tip':
        return (
          <svg className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        );
    }
  };

  const getCalloutStyles = (type?: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-900';
      case 'tip':
        return 'bg-indigo-50 border-indigo-200 text-indigo-900';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };

  return (
    <section className={`py-16 md:py-24 bg-white text-slate-800 ${customClasses}`}>
      <div className={`container mx-auto px-4 ${getMaxWidthClass()}`}>
        {/* Header */}
        <div className={`mb-10 ${mergedConfig.alignment === 'center' ? 'text-center' : 'text-left'}`}>
          {mergedConfig.badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary-100 text-primary-800 border border-primary-200 mb-3">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <span>{mergedConfig.badge}</span>
            </div>
          )}
          {mergedConfig.title && (
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 font-heading">
              {mergedConfig.title}
            </h2>
          )}
          {mergedConfig.lead && (
            <p className="text-lg md:text-xl font-medium text-slate-700 leading-relaxed border-l-4 border-primary-500 pl-4 py-1 italic bg-slate-50/60 rounded-r-lg">
              {mergedConfig.lead}
            </p>
          )}
        </div>

        {/* Rich HTML Content Body */}
        {mergedConfig.contentHtml && (
          <div
            className="prose prose-slate md:prose-lg max-w-none text-slate-700 leading-relaxed mb-8 space-y-4"
            dangerouslySetInnerHTML={{ __html: mergedConfig.contentHtml }}
          />
        )}

        {/* Featured Quote / Blockquote */}
        {mergedConfig.quote && (
          <div className="my-8 p-6 md:p-8 bg-slate-50 rounded-2xl border-l-4 border-primary-600 shadow-sm relative overflow-hidden">
            <span className="absolute right-4 bottom-2 text-6xl text-slate-200 font-serif select-none pointer-events-none">”</span>
            <blockquote className="relative z-10 text-base md:text-lg font-semibold text-slate-800 italic mb-4 leading-relaxed">
              "{mergedConfig.quote.text}"
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-8 h-0.5 bg-primary-500" />
              <div>
                <cite className="font-bold text-slate-900 not-italic block text-sm">
                  {mergedConfig.quote.author}
                </cite>
                {mergedConfig.quote.role && (
                  <span className="text-xs text-slate-500">{mergedConfig.quote.role}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Callout Box */}
        {mergedConfig.callout && (
          <div className={`my-8 p-5 md:p-6 rounded-2xl border flex items-start gap-4 ${getCalloutStyles(mergedConfig.callout.type)}`}>
            {getCalloutIcon(mergedConfig.callout.type)}
            <div>
              <h4 className="font-bold text-sm md:text-base mb-1">
                {mergedConfig.callout.title}
              </h4>
              <p className="text-sm opacity-90 leading-relaxed">
                {mergedConfig.callout.text}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
