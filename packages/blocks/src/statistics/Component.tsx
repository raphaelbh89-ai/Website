import React from 'react';
import { BlockRenderProps } from '@school-cms/cms';
import { StatisticsConfig, defaultStatisticsConfig } from './schema';

export const StatisticsComponent: React.FC<BlockRenderProps<StatisticsConfig>> = ({
  config,
  customClasses = '',
}) => {
  const mergedConfig: StatisticsConfig = {
    ...defaultStatisticsConfig,
    ...config,
    items: config?.items && config.items.length > 0 ? config.items : defaultStatisticsConfig.items,
  };

  const getThemeClasses = () => {
    switch (mergedConfig.theme) {
      case 'navy':
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white',
          card: 'bg-white/10 border-white/10 hover:border-blue-400/50 text-white',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          number: 'text-blue-400',
          desc: 'text-slate-300',
        };
      case 'dark':
        return {
          bg: 'bg-slate-950 text-white',
          card: 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-white',
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
          number: 'text-amber-400',
          desc: 'text-slate-400',
        };
      case 'emerald':
      default:
        return {
          bg: 'bg-gradient-to-b from-slate-50 via-emerald-50/30 to-white text-slate-900',
          card: 'bg-white border-slate-200/80 hover:border-emerald-500/40 hover:shadow-xl text-slate-900',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          number: 'text-emerald-700',
          desc: 'text-slate-600',
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${theme.bg} transition-colors duration-300 ${customClasses}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {mergedConfig.badge && (
            <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border mb-4 shadow-sm ${theme.badge}`}>
              {mergedConfig.badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 font-heading">
            {mergedConfig.title}
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${theme.desc}`}>
            {mergedConfig.subtitle}
          </p>
        </div>

        <div className={`grid gap-8 ${
          mergedConfig.layout === 'grid_3_cols'
            ? 'grid-cols-1 md:grid-cols-3'
            : mergedConfig.layout === 'horizontal_cards'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}>
          {mergedConfig.items.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`rounded-2xl p-8 border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 shadow-sm flex flex-col justify-between ${theme.card}`}
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-3xl mb-6 shadow-inner">
                  {item.icon}
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl sm:text-5xl font-black tracking-tight font-heading ${theme.number}`}>
                    {item.value}
                  </span>
                  <span className={`text-2xl sm:text-3xl font-bold ${theme.number}`}>
                    {item.suffix}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">
                  {item.label}
                </h3>
              </div>
              <p className={`text-sm leading-relaxed mt-2 ${theme.desc}`}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
