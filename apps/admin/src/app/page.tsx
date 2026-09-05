'use client';

import React, { useState } from 'react';
import { BlockRegistry } from '@school-cms/cms';
// Auto-register blocks
import '@school-cms/blocks';

interface BlockItem {
  id: string;
  type: string;
  name: string;
  config: Record<string, any>;
}

export default function AdminPageBuilder() {
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'pages' | 'branches' | 'articles' | 'leads'>('pages');

  // Page state
  const [blocks, setBlocks] = useState<BlockItem[]>([
    {
      id: 'blk-1',
      type: 'hero_banner',
      name: 'Hero Banner Lớn',
      config: {
        title: 'Khát Vọng Vươn Tầm Cùng Alpha School',
        subtitle: 'Môi trường giáo dục liên cấp song ngữ chuẩn quốc tế',
        primaryButtonText: 'Đăng ký nhận học bổng',
      },
    },
    {
      id: 'blk-2',
      type: 'program_list',
      name: 'Danh sách Chương trình đào tạo',
      config: {
        title: 'Chương Trình Đào Tạo Chuẩn Quốc Tế',
        columns: '3',
      },
    },
    {
      id: 'blk-3',
      type: 'branch_list',
      name: 'Danh sách Cơ sở',
      config: {
        title: 'Hệ Thống Các Cơ Sở Toàn Quốc',
      },
    },
  ]);

  const [selectedBlockId, setSelectedBlockId] = useState<string>('blk-1');
  const [isPublished, setIsPublished] = useState<boolean>(false);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
  const availableBlocks = BlockRegistry.getAll();

  const handleAddBlock = (type: string) => {
    const blockDef = BlockRegistry.get(type);
    if (!blockDef) return;

    const newBlock: BlockItem = {
      id: `blk-${Date.now()}`,
      type: blockDef.type,
      name: blockDef.name,
      config: { ...blockDef.defaultConfig },
    };

    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(blocks[0]?.id || '');
    }
  };

  const handleConfigChange = (key: string, value: any) => {
    if (!selectedBlock) return;
    setBlocks(
      blocks.map((b) =>
        b.id === selectedBlock.id
          ? { ...b, config: { ...b.config, [key]: value } }
          : b
      )
    );
  };

  const handlePublish = () => {
    setIsPublished(true);
    setTimeout(() => setIsPublished(false), 3000);
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans">
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 border-r border-slate-800">
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center font-bold text-white">
            A
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight">ALPHA CMS</h1>
            <p className="text-xs text-slate-400">School Framework v1.0</p>
          </div>
        </div>

        <nav className="p-3 space-y-1 flex-1 text-sm font-medium">
          <button
            onClick={() => setActiveTab('pages')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'pages' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📑</span> Page Builder
          </button>
          <button
            onClick={() => setActiveTab('branches')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'branches' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🏫</span> Quản lý Cơ sở (50+)
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'articles' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📰</span> Bài viết & Tin tức
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'leads' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🎯</span> Hồ sơ Tuyển sinh
          </button>
        </nav>

        {/* User Scope Info */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold">
            AD
          </div>
          <div>
            <p className="font-semibold text-slate-200">Super Administrator</p>
            <p>Toàn hệ thống (Global)</p>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-slate-800 text-lg">Trang Chủ (Homepage)</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Live Draft
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Branch Scope Selector */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Phạm vi:</span>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="border border-slate-300 rounded px-2.5 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="all">Toàn hệ thống (All Branches)</option>
                <option value="bien-hoa">Cơ sở Biên Hòa</option>
                <option value="thu-duc">Cơ sở TP. Thủ Đức</option>
                <option value="binh-duong">Cơ sở Bình Dương</option>
              </select>
            </div>

            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              👁️ Xem Web Thật
            </a>

            <button
              onClick={handlePublish}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
            >
              🚀 Xuất Bản (Publish)
            </button>
          </div>
        </header>

        {/* Publish Alert Notification */}
        {isPublished && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-sm font-medium flex items-center justify-between">
            <span>
              ✅ Đã xuất bản trang thành công! Đã kích hoạt xóa cache trên Cloudflare Edge & Next.js ISR.
            </span>
            <button onClick={() => setIsPublished(false)} className="text-white font-bold">&times;</button>
          </div>
        )}

        {/* Workspace Body: Canvas + Inspector */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Visual Canvas (Center) */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                  Cấu trúc Khối giao diện (Page Canvas - Kéo thả)
                </span>
                <span className="text-xs text-slate-400">{blocks.length} blocks đang kích hoạt</span>
              </div>

              {blocks.map((blk, idx) => (
                <div
                  key={blk.id}
                  onClick={() => setSelectedBlockId(blk.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer bg-white flex items-center justify-between ${
                    selectedBlockId === blk.id
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{blk.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">type: {blk.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      v1
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveBlock(blk.id);
                      }}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded transition-colors text-sm"
                      title="Xóa block"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Block Palette */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">
                  Thêm Khối Giao Diện Từ Block Registry (Không cần code)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableBlocks.map((bDef) => (
                    <button
                      key={bDef.type}
                      onClick={() => handleAddBlock(bDef.type)}
                      className="p-3 bg-white border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 rounded-lg text-left transition-all text-sm font-medium text-slate-700 flex flex-col gap-1 shadow-sm"
                    >
                      <span className="font-semibold text-slate-800">{bDef.name}</span>
                      <span className="text-xs text-slate-400 font-mono">+{bDef.type}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Right Inspector: Schema-driven Dynamic Form Engine */}
          <aside className="w-80 bg-white border-l border-slate-200 p-5 overflow-y-auto flex-shrink-0 flex flex-col">
            <h3 className="font-bold text-sm text-slate-800 mb-4 pb-3 border-b border-slate-200">
              Thuộc Tính Khối (Block Inspector)
            </h3>

            {selectedBlock ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Tên Block
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedBlock.name}
                    className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Mã Định Danh (Type Key)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedBlock.type}
                    className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-1.5 text-xs font-mono text-slate-600"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-3">
                    Cấu hình Động (Schema Fields)
                  </span>

                  {/* Dynamic Form generation based on config keys */}
                  {Object.entries(selectedBlock.config).map(([key, val]) => {
                    if (typeof val === 'object' && val !== null) return null;

                    return (
                      <div key={key} className="mb-3">
                        <label className="block text-xs font-medium text-slate-700 mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </label>
                        <input
                          type="text"
                          value={String(val ?? '')}
                          onChange={(e) => handleConfigChange(key, e.target.value)}
                          className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Chọn một khối để chỉnh sửa cấu hình</p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
