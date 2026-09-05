'use client';

import React, { useState } from 'react';
import { BlockRenderProps } from '@school-cms/cms';
import { FaqAccordionConfig } from './schema';

export const FaqAccordionComponent: React.FC<BlockRenderProps<FaqAccordionConfig>> = ({
  config,
  customClasses = '',
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = config.items || [];

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className={`py-16 bg-white border-t border-slate-200 ${customClasses}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-emerald-700 font-semibold text-xs uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            HỎI ĐÁP & TƯ VẤN
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-4 tracking-tight">
            {config.title}
          </h2>
          {config.subtitle && (
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              {config.subtitle}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-emerald-500 bg-emerald-50/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full text-left p-5 md:p-6 flex items-center justify-between gap-4 font-bold text-slate-900 text-base focus:outline-none"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                        isOpen
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    {item.question}
                  </span>
                  <span className="text-slate-400 text-xl shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100/80 animate-in fade-in-0 duration-150 pl-14">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
