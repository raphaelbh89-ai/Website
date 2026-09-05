import React from 'react';
import { BlockRenderProps } from '@school-cms/cms';
import { PartnerSliderConfig } from './schema';

export const PartnerSliderComponent: React.FC<BlockRenderProps<PartnerSliderConfig>> = ({
  config,
  customClasses = '',
}) => {
  return (
    <div className={`w-full py-12 bg-slate-50 border-y border-slate-200 ${customClasses}`}>
      <div className="max-w-7xl mx-auto px-4">
        {config.title && (
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-slate-800">{config.title}</h3>
            {config.subtitle && (
              <p className="text-sm text-slate-500 mt-1">{config.subtitle}</p>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {config.partners.map((partner) => (
            <a
              key={partner.id}
              href={partner.websiteUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 hover:scale-105"
            >
              <img
                src={partner.logoUrl}
                alt={partner.name}
                className="h-12 w-auto object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
