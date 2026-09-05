import React from 'react';
import { BlockRenderProps } from '@school-cms/cms';
import { CtaBannerConfig, defaultCtaBannerConfig } from './schema';

export const CtaBannerComponent: React.FC<BlockRenderProps<CtaBannerConfig>> = ({
  config,
  customClasses = '',
}) => {
  const mergedConfig: CtaBannerConfig = {
    ...defaultCtaBannerConfig,
    ...config,
  };

  const getGradientClasses = () => {
    switch (mergedConfig.bgGradient) {
      case 'navy':
        return {
          wrapper: 'bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
          btnPrimary: 'bg-white text-blue-950 hover:bg-blue-50 hover:shadow-blue-500/20',
          btnSecondary: 'bg-blue-800/40 text-white border-blue-400/30 hover:bg-blue-800/60',
          glow: 'bg-blue-500/10',
        };
      case 'sunset':
        return {
          wrapper: 'bg-gradient-to-r from-amber-600 via-rose-600 to-purple-800',
          badge: 'bg-white/20 text-white border-white/30',
          btnPrimary: 'bg-white text-rose-900 hover:bg-rose-50 hover:shadow-rose-500/20',
          btnSecondary: 'bg-white/10 text-white border-white/30 hover:bg-white/20',
          glow: 'bg-amber-400/20',
        };
      case 'dark':
        return {
          wrapper: 'bg-gradient-to-r from-slate-950 via-slate-900 to-zinc-950 border-y border-slate-800',
          badge: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
          btnPrimary: 'bg-amber-400 text-slate-950 hover:bg-amber-300 hover:shadow-amber-400/20',
          btnSecondary: 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700',
          glow: 'bg-amber-500/5',
        };
      case 'emerald':
      default:
        return {
          wrapper: 'bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
          btnPrimary: 'bg-amber-400 text-slate-950 hover:bg-amber-300 hover:shadow-amber-400/25',
          btnSecondary: 'bg-emerald-700/40 text-white border-emerald-400/30 hover:bg-emerald-700/60',
          glow: 'bg-emerald-400/15',
        };
    }
  };

  const style = getGradientClasses();

  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 ${customClasses}`}>
      <div className="max-w-7xl mx-auto">
        <div className={`relative rounded-3xl overflow-hidden shadow-2xl p-8 sm:p-12 lg:p-16 text-white ${style.wrapper}`}>
          {/* Background Decorative Glow */}
          <div className={`absolute -right-20 -top-20 w-96 h-96 rounded-full blur-3xl pointer-events-none ${style.glow}`} />
          <div className={`absolute -left-20 -bottom-20 w-96 h-96 rounded-full blur-3xl pointer-events-none ${style.glow}`} />

          <div className="relative z-10 max-w-3xl">
            {mergedConfig.badge && (
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border mb-6 shadow-sm ${style.badge}`}>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {mergedConfig.badge}
              </span>
            )}

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6 font-heading">
              {mergedConfig.title}
            </h2>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-8">
              {mergedConfig.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={mergedConfig.primaryButtonUrl}
                className={`px-8 py-4 rounded-xl text-base font-bold shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 ${style.btnPrimary}`}
              >
                <span>{mergedConfig.primaryButtonText}</span>
                <span className="text-lg">➔</span>
              </a>

              {mergedConfig.secondaryButtonText && (
                <a
                  href={mergedConfig.secondaryButtonUrl}
                  className={`px-6 py-4 rounded-xl text-base font-semibold border backdrop-blur-sm transition-all duration-200 ${style.btnSecondary}`}
                >
                  {mergedConfig.secondaryButtonText}
                </a>
              )}
            </div>

            {/* Hotline & Email Bar */}
            {(mergedConfig.hotline || mergedConfig.email) && (
              <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-sm text-slate-300">
                {mergedConfig.hotline && (
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 text-base">📞</span>
                    <span>Hotline Tuyển Sinh:</span>
                    <strong className="text-white font-mono text-base">{mergedConfig.hotline}</strong>
                  </div>
                )}
                {mergedConfig.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 text-base">✉️</span>
                    <span>Email:</span>
                    <strong className="text-white">{mergedConfig.email}</strong>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
