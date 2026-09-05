import React from 'react';
import { BlockRenderProps } from '@school-cms/cms';
import { ProgramListConfig } from './schema';

export const ProgramListComponent: React.FC<BlockRenderProps<ProgramListConfig>> = ({
  config,
  customClasses = '',
}) => {
  const colClass =
    config.columns === '2'
      ? 'grid-cols-1 md:grid-cols-2'
      : config.columns === '4'
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 md:grid-cols-3';

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

      <div className={`grid gap-8 ${colClass}`}>
        {config.programs.map((prog) => (
          <div
            key={prog.id}
            className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src={prog.imageUrl}
                alt={prog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-slate-800 shadow-sm">
                {prog.gradeLevel}
              </span>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                {prog.title}
              </h3>
              <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-3">
                {prog.description}
              </p>
              <a
                href={prog.detailUrl}
                className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                Xem chi tiết chương trình &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
