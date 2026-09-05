'use client';

import React, { useState, useEffect } from 'react';

interface SearchResultItem {
  type: 'branch' | 'program' | 'article';
  title: string;
  description: string;
  url: string;
}

export const SearchModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/api/v1/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const json = await res.json();
          setResults(json.data || []);
        } else {
          throw new Error();
        }
      } catch {
        // Fallback local results
        const mock: SearchResultItem[] = [
          { type: 'branch', title: 'Cơ sở Biên Hòa - Đồng Nai', description: 'Số 123 Đường Nguyễn Ái Quốc, TP. Biên Hòa', url: '/co-so/bien-hoa' },
          { type: 'program', title: 'Chương Trình Tiểu Học Quốc Tế Cambridge', description: 'Lớp 1 - Lớp 5 theo chuẩn Cambridge Primary', url: '/chuong-trinh-hoc/tieu-hoc' },
          { type: 'article', title: 'Lễ Khai Giảng Năm Học 2025: Khát Vọng Vươn Tầm Quốc Tế', description: 'Tin tức & sự kiện toàn hệ thống', url: '/tin-tuc/le-khai-giang-nam-hoc-2025' },
        ];
        const filtered = mock.filter(i => i.title.toLowerCase().includes(query.toLowerCase()) || i.description.toLowerCase().includes(query.toLowerCase()));
        setResults(filtered);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      {/* Trigger Button inside Navbar */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-800 hover:border-slate-300 text-xs transition-colors"
      >
        <span>🔍 Tìm kiếm...</span>
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded shadow-2xs">
          Ctrl K
        </kbd>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-20">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in-0 zoom-in-95 duration-150"
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-200 flex items-center gap-3">
              <span className="text-slate-400 text-lg">🔍</span>
              <input
                type="text"
                autoFocus
                placeholder="Tìm cơ sở, chương trình đào tạo, bài viết, học phí..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded"
              >
                ESC
              </button>
            </div>

            {/* Search Results Area */}
            <div className="max-h-96 overflow-y-auto p-4 space-y-2">
              {loading && (
                <div className="py-8 text-center text-xs text-slate-400">
                  <span className="animate-spin inline-block mr-2">🌀</span> Đang tìm kiếm...
                </div>
              )}

              {!loading && query && results.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  Không tìm thấy kết quả nào phù hợp với &quot;{query}&quot;
                </div>
              )}

              {!loading && !query && (
                <div className="py-6 text-center text-xs text-slate-400">
                  Gợi ý tìm kiếm: <span className="text-emerald-700 font-medium">Biên Hòa</span>, <span className="text-emerald-700 font-medium">Cambridge</span>, <span className="text-emerald-700 font-medium">Học bổng</span>, <span className="text-emerald-700 font-medium">Khai giảng</span>
                </div>
              )}

              {results.map((r, idx) => (
                <a
                  key={idx}
                  href={r.url}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          r.type === 'branch'
                            ? 'bg-blue-100 text-blue-800'
                            : r.type === 'program'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {r.type === 'branch' ? 'Cơ sở' : r.type === 'program' ? 'Chương trình' : 'Bài viết'}
                      </span>
                      <h5 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {r.title}
                      </h5>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{r.description}</p>
                  </div>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform text-xs">➔</span>
                </a>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Hệ thống tìm kiếm hợp nhất Alpha Search Engine</span>
              <span>Được hỗ trợ bởi AI Vector Indexing</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
