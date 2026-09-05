'use client';

import React, { useState } from 'react';
import { BlockRegistry } from '@school-cms/cms';
import '@school-cms/blocks';

interface BlockItem {
  id: string;
  type: string;
  name: string;
  config: Record<string, any>;
}

export default function AdminDashboard() {
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

  // Entities state
  const [branches, setBranches] = useState([
    { id: 'b-001', name: 'Alpha School - Cơ sở Biên Hòa', code: 'BIEN_HOA', address: 'Số 123 Đường Nguyễn Ái Quốc, TP. Biên Hòa, Đồng Nai', phone: '0251 123 4567', email: 'bienhoa@school.edu.vn', status: 'Hoạt động' },
    { id: 'b-002', name: 'Alpha School - Cơ sở TP. Thủ Đức', code: 'THU_DUC', address: 'Khu đô thị Sala, TP. Thủ Đức, TP. HCM', phone: '028 987 6543', email: 'thuduc@school.edu.vn', status: 'Hoạt động' },
    { id: 'b-003', name: 'Alpha School - Cơ sở Bình Dương', code: 'BINH_DUONG', address: 'Đại lộ Bình Dương, TP. Thủ Dầu Một, Bình Dương', phone: '0274 333 8888', email: 'binhduong@school.edu.vn', status: 'Hoạt động' },
  ]);

  const [articles, setArticles] = useState([
    { id: 'art-001', title: 'Lễ Khai Giảng Năm Học 2025: Khát Vọng Vươn Tầm Quốc Tế', category: 'Tin tức & Sự kiện', branch: 'Toàn hệ thống', author: 'Ban Truyền Thông', date: '05/09/2026', status: 'PUBLISHED' },
    { id: 'art-002', title: 'Học Sinh Cơ Sở Biên Hòa Đạt Giải Nhất Robotics Quốc Tế', category: 'Thành tích học thuật', branch: 'Cơ sở Biên Hòa', author: 'CLB Robotics', date: '02/09/2026', status: 'PUBLISHED' },
    { id: 'art-003', title: 'Hội Thảo Hướng Nghiệp & Săn Học Bổng Đại Học Top 100 Thế Giới', category: 'Tuyển sinh', branch: 'Toàn hệ thống', author: 'Phòng Tuyển Sinh', date: '28/08/2026', status: 'PUBLISHED' },
  ]);

  const [leads, setLeads] = useState([
    { id: 'lead-001', parentName: 'Nguyễn Văn An', phone: '0912 345 678', email: 'an.nguyen@example.com', studentName: 'Nguyễn Gia Hân', grade: 'Lớp 1', branch: 'Cơ sở Biên Hòa', date: '05/09/2026 14:30', status: 'Mới' },
    { id: 'lead-002', parentName: 'Trần Thị Mai', phone: '0988 765 432', email: 'mai.tran@example.com', studentName: 'Trần Minh Khang', grade: 'Mầm non 4 tuổi', branch: 'Cơ sở TP. Thủ Đức', date: '05/09/2026 11:15', status: 'Đang tư vấn' },
    { id: 'lead-003', parentName: 'Lê Hoàng Long', phone: '0903 112 233', email: 'long.le@example.com', studentName: 'Lê Bảo Anh', grade: 'Lớp 6 (Cambridge)', branch: 'Cơ sở Biên Hòa', date: '04/09/2026 16:45', status: 'Đã hẹn tham quan' },
  ]);

  // Modals
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');

  const [showAddArticleModal, setShowAddArticleModal] = useState(false);
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleCategory, setNewArticleCategory] = useState('Tin tức & Sự kiện');
  const [newArticleBranch, setNewArticleBranch] = useState('Toàn hệ thống');

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

  const handleSaveBranch = () => {
    if (!newBranchName) return;
    const newB = {
      id: `b-${Date.now()}`,
      name: newBranchName,
      code: newBranchName.toUpperCase().replace(/[^A-Z0-9]/g, '_'),
      address: newBranchAddress,
      phone: newBranchPhone,
      email: 'contact@school.edu.vn',
      status: 'Hoạt động',
    };
    setBranches([...branches, newB]);
    setNewBranchName('');
    setNewBranchAddress('');
    setNewBranchPhone('');
    setShowAddBranchModal(false);
  };

  const handleSaveArticle = () => {
    if (!newArticleTitle) return;
    const newArt = {
      id: `art-${Date.now()}`,
      title: newArticleTitle,
      category: newArticleCategory,
      branch: newArticleBranch,
      author: 'Super Admin',
      date: new Date().toLocaleDateString('vi-VN'),
      status: 'PUBLISHED',
    };
    setArticles([newArt, ...articles]);
    setNewArticleTitle('');
    setShowAddArticleModal(false);
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
            <span>📑</span> Page Builder (Dựng Trang)
          </button>
          <button
            onClick={() => setActiveTab('branches')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'branches' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🏫</span> Quản lý Cơ sở ({branches.length})
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'articles' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📰</span> Quản lý Tin tức ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'leads' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🎯</span> Hồ sơ Tuyển sinh ({leads.length})
          </button>
        </nav>

        {/* User Scope Info */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold">
            AD
          </div>
          <div>
            <p className="font-semibold text-slate-200">Super Administrator</p>
            <p>Toàn hệ thống (Global Scope)</p>
          </div>
        </div>
      </aside>

      {/* 2. Main Work Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-slate-800 text-lg">
              {activeTab === 'pages' && 'Trình Dựng Trang Trực Quan (Page Builder)'}
              {activeTab === 'branches' && 'Quản Lý Hệ Thống Cơ Sở & Chi Nhánh'}
              {activeTab === 'articles' && 'Quản Lý Bài Viết & Tin Tức Học Đường'}
              {activeTab === 'leads' && 'Quản Lý Hồ Sơ Đăng Ký Tuyển Sinh'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Cơ sở lọc:</span>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="border border-slate-300 rounded px-2.5 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="all">Toàn hệ thống (All)</option>
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

            {activeTab === 'pages' && (
              <button
                onClick={handlePublish}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
              >
                🚀 Xuất Bản (Publish)
              </button>
            )}
          </div>
        </header>

        {isPublished && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-sm font-medium flex items-center justify-between">
            <span>✅ Đã xuất bản trang thành công! Cache Edge đã được làm mới.</span>
            <button onClick={() => setIsPublished(false)} className="text-white font-bold">&times;</button>
          </div>
        )}

        {/* TAB 1: PAGE BUILDER */}
        {activeTab === 'pages' && (
          <div className="flex-1 flex min-h-0 overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                    Các Khối Giao Diện Đang Hiển Thị
                  </span>
                  <span className="text-xs text-slate-400">{blocks.length} blocks</span>
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
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">v1</span>
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

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">
                    Thêm Khối Mới Từ Block Registry (Open/Closed - Không Sửa Code)
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

            {/* Right Inspector */}
            <aside className="w-80 bg-white border-l border-slate-200 p-5 overflow-y-auto flex-shrink-0 flex flex-col">
              <h3 className="font-bold text-sm text-slate-800 mb-4 pb-3 border-b border-slate-200">
                Thuộc Tính Khối (Dynamic Inspector)
              </h3>
              {selectedBlock ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tên Block</label>
                    <input type="text" disabled value={selectedBlock.name} className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Mã Định Danh (Type)</label>
                    <input type="text" disabled value={selectedBlock.type} className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-1.5 text-xs font-mono text-slate-600" />
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-3">
                      Cấu hình Tự sinh từ Schema
                    </span>
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
                            className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Chọn một khối để chỉnh sửa</p>
              )}
            </aside>
          </div>
        )}

        {/* TAB 2: BRANCHES MANAGEMENT */}
        {activeTab === 'branches' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Danh Sách Cơ Sở Trường Học</h3>
                  <p className="text-sm text-slate-500">Quản lý mạng lưới cơ sở trên toàn quốc</p>
                </div>
                <button
                  onClick={() => setShowAddBranchModal(true)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                  + Thêm Cơ Sở Mới
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                    <tr>
                      <th className="p-4">Tên Cơ Sở</th>
                      <th className="p-4">Mã</th>
                      <th className="p-4">Địa Chỉ</th>
                      <th className="p-4">Hotline</th>
                      <th className="p-4">Trạng Thái</th>
                      <th className="p-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {branches.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="p-4 font-semibold text-slate-900">{b.name}</td>
                        <td className="p-4 font-mono text-xs text-slate-500">{b.code}</td>
                        <td className="p-4 text-slate-600 text-xs max-w-xs truncate">{b.address}</td>
                        <td className="p-4 text-xs font-semibold text-slate-700">{b.phone}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <a
                            href={`http://localhost:3000/co-so/${b.code.toLowerCase().replace('_', '-')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-emerald-700 font-semibold hover:underline"
                          >
                            Xem Trang
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ARTICLES MANAGEMENT */}
        {activeTab === 'articles' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Danh Sách Bài Viết & Tin Tức</h3>
                  <p className="text-sm text-slate-500">Biên tập và xuất bản tin tức học đường</p>
                </div>
                <button
                  onClick={() => setShowAddArticleModal(true)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                  + Viết Bài Mới
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                    <tr>
                      <th className="p-4">Tiêu Đề</th>
                      <th className="p-4">Chuyên Mục</th>
                      <th className="p-4">Phạm Vi Cơ Sở</th>
                      <th className="p-4">Tác Giả</th>
                      <th className="p-4">Ngày Đăng</th>
                      <th className="p-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {articles.map((art) => (
                      <tr key={art.id} className="hover:bg-slate-50">
                        <td className="p-4 font-semibold text-slate-900 max-w-sm">{art.title}</td>
                        <td className="p-4 text-xs">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                            {art.category}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-medium text-slate-600">{art.branch}</td>
                        <td className="p-4 text-xs text-slate-500">{art.author}</td>
                        <td className="p-4 text-xs text-slate-400">{art.date}</td>
                        <td className="p-4 text-right">
                          <a
                            href="http://localhost:3000/tin-tuc"
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-emerald-700 font-semibold hover:underline"
                          >
                            Xem Bài
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LEADS / FORM SUBMISSIONS */}
        {activeTab === 'leads' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Danh Sách Hồ Sơ Đăng Ký Tuyển Sinh</h3>
                  <p className="text-sm text-slate-500">Tiếp nhận thông tin phụ huynh đăng ký tư vấn và tham quan</p>
                </div>
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-semibold transition-all shadow-sm">
                  📥 Xuất File Excel
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                    <tr>
                      <th className="p-4">Phụ Huynh</th>
                      <th className="p-4">Số Điện Thoại</th>
                      <th className="p-4">Học Sinh</th>
                      <th className="p-4">Khối Lớp</th>
                      <th className="p-4">Cơ Sở Mong Muốn</th>
                      <th className="p-4">Thời Gian</th>
                      <th className="p-4">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50">
                        <td className="p-4 font-semibold text-slate-900">{l.parentName}</td>
                        <td className="p-4 font-mono text-xs font-semibold text-emerald-700">{l.phone}</td>
                        <td className="p-4 text-xs font-medium text-slate-800">{l.studentName}</td>
                        <td className="p-4 text-xs text-slate-600">{l.grade}</td>
                        <td className="p-4 text-xs font-medium text-slate-700">{l.branch}</td>
                        <td className="p-4 text-xs text-slate-400">{l.date}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              l.status === 'Mới'
                                ? 'bg-blue-100 text-blue-800'
                                : l.status === 'Đang tư vấn'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Thêm Cơ Sở Mới */}
      {showAddBranchModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Thêm Cơ Sở Mới</h3>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Tên Cơ Sở</label>
                <input
                  type="text"
                  placeholder="Alpha School - Cơ sở Đà Nẵng"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Địa Chỉ</label>
                <input
                  type="text"
                  placeholder="Đường Nguyễn Văn Linh, Q. Hải Châu, Đà Nẵng"
                  value={newBranchAddress}
                  onChange={(e) => setNewBranchAddress(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Hotline</label>
                <input
                  type="text"
                  placeholder="0236 789 9999"
                  value={newBranchPhone}
                  onChange={(e) => setNewBranchPhone(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddBranchModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveBranch}
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800 shadow-sm"
              >
                Lưu Cơ Sở
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Viết Bài Mới */}
      {showAddArticleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Soạn Thảo Bài Viết Mới</h3>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Tiêu Đề Bài Viết</label>
                <input
                  type="text"
                  placeholder="Nhập tiêu đề tin tức, thông báo..."
                  value={newArticleTitle}
                  onChange={(e) => setNewArticleTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Chuyên Mục</label>
                <select
                  value={newArticleCategory}
                  onChange={(e) => setNewArticleCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="Tin tức & Sự kiện">Tin tức & Sự kiện</option>
                  <option value="Thành tích học thuật">Thành tích học thuật</option>
                  <option value="Thông báo Tuyển sinh">Thông báo Tuyển sinh</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Phạm Vi Hiển Thị</label>
                <select
                  value={newArticleBranch}
                  onChange={(e) => setNewArticleBranch(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="Toàn hệ thống">Toàn hệ thống (All Branches)</option>
                  <option value="Cơ sở Biên Hòa">Chỉ Cơ sở Biên Hòa</option>
                  <option value="Cơ sở TP. Thủ Đức">Chỉ Cơ sở TP. Thủ Đức</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddArticleModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveArticle}
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800 shadow-sm"
              >
                Xuất Bản Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
