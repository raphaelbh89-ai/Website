import React from 'react';
import { BlockRenderProps } from '@school-cms/cms';
import { BranchListConfig } from './schema';

export const BranchListComponent: React.FC<BlockRenderProps<BranchListConfig>> = ({
  config,
  customClasses = '',
}) => {
  return (
    <div className={`w-full py-16 px-4 max-w-7xl mx-auto ${customClasses}`}>
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">
          {config.title}
        </h2>
        {config.subtitle && (
          <p className="text-lg text-slate-600">{config.subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {config.branches.map((branch) => (
          <div
            key={branch.id}
            className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={branch.imageUrl}
                alt={branch.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                {branch.name}
              </h3>
              <p className="text-slate-600 text-sm mb-2 flex items-start gap-2">
                <span className="text-slate-400">📍</span>
                <span>{branch.address}</span>
              </p>
              <p className="text-slate-600 text-sm mb-6 flex items-center gap-2">
                <span className="text-slate-400">📞</span>
                <span className="font-semibold text-slate-700">{branch.phone}</span>
              </p>
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`/co-so/${branch.slug}`}
                  className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  Khám phá cơ sở &rarr;
                </a>
                <a
                  href={`/tuyen-sinh?branch=${branch.slug}`}
                  className="text-xs px-3 py-1.5 rounded bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100 transition-colors"
                >
                  Đăng ký tham quan
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
