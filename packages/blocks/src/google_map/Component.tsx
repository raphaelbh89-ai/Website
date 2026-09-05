'use client';

import React, { useState } from 'react';
import { BlockRenderProps } from '@school-cms/cms';
import { GoogleMapConfig, MapCampusLocation, defaultGoogleMapConfig } from './schema';

export const GoogleMapBlock: React.FC<BlockRenderProps<GoogleMapConfig>> = ({ config, customClasses = '' }) => {
  const mergedConfig: GoogleMapConfig = {
    ...defaultGoogleMapConfig,
    ...config,
    campuses: config?.campuses?.length ? config.campuses : defaultGoogleMapConfig.campuses,
  };

  const [selectedCampusId, setSelectedCampusId] = useState<string>(
    mergedConfig.defaultCampusId || (mergedConfig.campuses && mergedConfig.campuses[0]?.id) || 'loc-hn'
  );
  const [copied, setCopied] = useState(false);

  const activeCampus = mergedConfig.campuses.find((c) => c.id === selectedCampusId) || mergedConfig.campuses[0];

  const handleCopyAddress = (addr: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(addr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className={`py-16 md:py-24 bg-slate-50 text-slate-900 relative ${customClasses}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary-100 text-primary-800 border border-primary-200 mb-3">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>{mergedConfig.badge || 'BẢN ĐỒ ĐỊNH VỊ'}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-3 font-heading">
            {mergedConfig.title}
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            {mergedConfig.subtitle}
          </p>
        </div>

        {/* Campus Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {mergedConfig.campuses.map((campus) => {
            const isSelected = campus.id === selectedCampusId;
            return (
              <button
                key={campus.id}
                type="button"
                onClick={() => setSelectedCampusId(campus.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm ${
                  isSelected
                    ? 'bg-primary-600 text-white shadow-md ring-2 ring-primary-500/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <svg className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-primary-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="22.01"/><line x1="15" y1="22" x2="15" y2="22.01"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><line x1="9" y1="18" x2="9" y2="18.01"/><line x1="15" y1="18" x2="15" y2="18.01"/></svg>
                <span>{campus.name}</span>
                {campus.tag && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      isSelected
                        ? 'bg-primary-700 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {campus.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Map Container with Floating Card */}
        {activeCampus && (
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
              {/* Interactive Iframe Map (8 Cols) */}
              <div className="lg:col-span-8 relative h-[360px] lg:h-auto w-full bg-slate-100">
                <iframe
                  src={activeCampus.embedUrl}
                  title={`Bản đồ ${activeCampus.name}`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Campus Information & Action Sidebar (4 Cols) */}
              <div className="lg:col-span-4 p-6 lg:p-8 flex flex-col justify-between bg-white border-t lg:border-t-0 lg:border-l border-slate-200">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100">
                      {activeCampus.tag || 'Cơ sở đào tạo'}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Mở cửa
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {activeCampus.name}
                  </h3>

                  <div className="space-y-4 text-sm text-slate-600 mb-6">
                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <div>
                        <p className="text-slate-800 leading-snug">{activeCampus.address}</p>
                        <button
                          type="button"
                          onClick={() => handleCopyAddress(activeCampus.address)}
                          className="mt-1 text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
                        >
                          {copied ? (
                            <span className="text-emerald-600 font-semibold">✓ Đã sao chép</span>
                          ) : (
                            <span>📋 Sao chép địa chỉ</span>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Hotline */}
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      <div>
                        <span className="text-xs text-slate-400 block">Hotline Tuyển sinh:</span>
                        <a
                          href={`tel:${activeCampus.phone.replace(/\s+/g, '')}`}
                          className="font-bold text-slate-900 hover:text-primary-600 transition-colors"
                        >
                          {activeCampus.phone}
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    {activeCampus.email && (
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        <div>
                          <span className="text-xs text-slate-400 block">Email tư vấn:</span>
                          <a
                            href={`mailto:${activeCampus.email}`}
                            className="text-slate-800 hover:text-primary-600 transition-colors truncate block"
                          >
                            {activeCampus.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Hours */}
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <div>
                        <span className="text-xs text-slate-400 block">Thời gian làm việc:</span>
                        <span className="text-slate-700 font-medium">{activeCampus.workingHours}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Navigation Button */}
                <div className="pt-4 border-t border-slate-100">
                  <a
                    href={activeCampus.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-md group"
                  >
                    <svg className="w-4 h-4 text-primary-400 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                    <span>Mở Chỉ Đường Trên Google Maps</span>
                    <span className="text-slate-400">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
