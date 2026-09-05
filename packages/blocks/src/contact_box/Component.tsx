import React from 'react';
import { BlockRenderProps } from '@school-cms/cms';
import { ContactBoxConfig, defaultContactBoxConfig } from './schema';

export const ContactBoxComponent: React.FC<BlockRenderProps<ContactBoxConfig>> = ({
  config,
  customClasses = '',
}) => {
  const mergedConfig: ContactBoxConfig = {
    ...defaultContactBoxConfig,
    ...config,
    branches: config?.branches?.length ? config.branches : defaultContactBoxConfig.branches,
  };

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-white ${customClasses}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {mergedConfig.badge && (
            <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-100 text-blue-800 border border-blue-200 mb-4 shadow-sm">
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

        {/* Central Hotline Banner */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl shadow-inner">
              📞
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Tổng Đài Tư Vấn Tuyển Sinh Toàn Quốc</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono">{mergedConfig.centralHotline}</h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${mergedConfig.centralHotline.replace(/\s+/g, '')}`}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-2"
            >
              <span>Gọi tư vấn ngay</span>
              <span>➔</span>
            </a>
            <a
              href={`mailto:${mergedConfig.centralEmail}`}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors"
            >
              Gửi email
            </a>
          </div>
        </div>

        {/* Branch Cards Grid */}
        <div className={`grid gap-8 ${
          mergedConfig.layout === 'split_cards'
            ? 'grid-cols-1 lg:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-3'
        }`}>
          {mergedConfig.branches.map((b) => (
            <div
              key={b.id}
              className={`rounded-3xl p-8 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between ${
                b.isPrimary
                  ? 'bg-slate-50/80 border-blue-500/40 shadow-sm ring-1 ring-blue-500/20'
                  : 'bg-white border-slate-200/90 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                    📍
                  </span>
                  {b.isPrimary && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                      Trụ sở chính
                    </span>
                  )}
                </div>

                <h4 className="text-xl font-bold text-slate-900 mb-3 font-heading">
                  {b.branchName}
                </h4>

                <div className="space-y-3 text-sm text-slate-600 mb-6">
                  <div className="flex items-start gap-2.5">
                    <span className="text-slate-400 mt-0.5">🏢</span>
                    <span className="leading-snug">{b.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-400">🕒</span>
                    <span>{b.workingHours}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-400">📞</span>
                    <a href={`tel:${b.phone}`} className="font-semibold text-blue-600 hover:underline">
                      {b.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-400">✉️</span>
                    <a href={`mailto:${b.email}`} className="text-slate-600 hover:text-blue-600 hover:underline">
                      {b.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`tel:${b.phone}`}
                  className="text-sm font-bold text-slate-900 hover:text-emerald-600 flex items-center gap-1.5 transition-colors"
                >
                  <span>Gọi cơ sở</span>
                  <span>↗</span>
                </a>
                {b.mapEmbedUrl && (
                  <a
                    href={b.mapEmbedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Xem chỉ đường ➔
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
