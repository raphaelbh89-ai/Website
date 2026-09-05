'use client';

import React from 'react';
import { Page, SectionLayoutWidth } from '@school-cms/shared';
import { BlockRegistry } from '@school-cms/cms';
// Import blocks để tự động kích hoạt registry
import '@school-cms/blocks';

interface DynamicPageRendererProps {
  page: Page;
}

export const DynamicPageRenderer: React.FC<DynamicPageRendererProps> = ({ page }) => {
  return (
    <main className="w-full min-h-screen bg-slate-50 flex flex-col">
      {page.sections
        .filter((sec) => sec.isVisible)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((section) => {
          const isFullWidth = section.settings?.layout?.width === SectionLayoutWidth.FULL_WIDTH;

          return (
            <section
              key={section.id}
              className={`w-full ${
                section.settings?.background?.colorValue
                  ? ''
                  : 'bg-transparent'
              }`}
              style={{
                backgroundColor: section.settings?.background?.colorValue,
                paddingTop: section.settings?.spacing?.paddingTop,
                paddingBottom: section.settings?.spacing?.paddingBottom,
              }}
            >
              <div className={isFullWidth ? 'w-full' : 'max-w-7xl mx-auto px-4'}>
                {section.blocks
                  .filter((blk) => blk.isActive)
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((block) => {
                    const blockDef = BlockRegistry.get(block.type);

                    if (!blockDef) {
                      console.warn(`[DynamicRenderer] Unknown block type: ${block.type}`);
                      return null;
                    }

                    // Tự động chuyển đổi và migration dữ liệu nếu block thuộc version cũ
                    const resolvedConfig = BlockRegistry.resolveConfig(
                      block.type,
                      block.version,
                      block.config
                    );

                    const RendererComponent = blockDef.renderer;

                    return (
                      <div key={block.id} className="w-full">
                        <RendererComponent
                          instanceId={block.id}
                          config={resolvedConfig}
                          customClasses={block.customClasses}
                          branchId={page.branchId}
                        />
                      </div>
                    );
                  })}
              </div>
            </section>
          );
        })}
    </main>
  );
};
