import React from 'react';
import { BlockRenderProps } from '@school-cms/cms';
import { NewsListConfig, defaultNewsListConfig } from './schema';

export const NewsListComponent: React.FC<BlockRenderProps<NewsListConfig>> = ({
  config,
  customClasses = '',
}) => {
  const newsItems = config?.news || (config as any)?.articles || defaultNewsListConfig.news || [];
  const displayLimit = config?.limit || 3;

  return (
    <div className={`w-full py-16 px-4 max-w-7xl mx-auto ${customClasses}`}>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2 font-heading">
            {config?.title || defaultNewsListConfig.title}
          </h2>
          {config?.subtitle && (
            <p className="text-slate-600">{config.subtitle}</p>
          )}
        </div>
        <a
          href="/tin-tuc"
          className="mt-4 md:mt-0 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          Xem tất cả bài viết &rarr;
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {newsItems.slice(0, displayLimit).map((item) => (
          <article
            key={item.id}
            className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-emerald-700 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                {item.category}
              </span>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <time className="text-xs text-slate-400 mb-2 block">{item.publishedAt}</time>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1">
                {item.excerpt}
              </p>
              <a
                href={`/tin-tuc/${item.slug}`}
                className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors mt-auto"
              >
                Đọc tiếp &rarr;
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
