'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  suggestions?: string[];
}

export const AiChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Xin chào Quý Phụ huynh! Tôi là Trợ Lý AI Tuyển Sinh của Hệ thống Alpha School. Tôi có thể giúp Quý vị tìm hiểu về học phí, chương trình Cambridge, học bổng và các cơ sở của trường.',
      time: 'Vừa xong',
      suggestions: ['Học phí năm 2025 - 2026', 'Chính sách học bổng tài năng', 'Địa chỉ các cơ sở', 'Quy trình nhập học 4 bước'],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (userText?: string) => {
    const text = (userText || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (res.ok) {
        const json = await res.json();
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: json.data.answer,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          suggestions: json.data.suggestions,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error('API Error');
      }
    } catch {
      // Fallback local smart response
      let answer = '';
      let suggestions = ['Học phí các khối', 'Xem các cơ sở', 'Đăng ký nhận học bổng'];
      const low = text.toLowerCase();

      if (low.includes('học phí') || low.includes('tiền')) {
        answer = 'Học phí niên khóa 2025 - 2026: Bậc Mầm non từ 12-15 triệu/tháng; Tiểu học Cambridge từ 18-22 triệu/tháng; THCS & THPT Quốc tế từ 25-32 triệu/tháng. Đã bao gồm giáo trình quốc tế, dã ngoại và CLB thứ Bảy.';
      } else if (low.includes('học bổng')) {
        answer = 'Quỹ học bổng Alpha Excellence 2025 trị giá 10 tỷ VNĐ gồm 3 mức: Kim Cương (100%), Tài Năng (50%) và Khởi Đầu (30%) dành cho học sinh có thành tích học tập và năng khiếu xuất sắc.';
      } else if (low.includes('cơ sở') || low.includes('ở đâu')) {
        answer = 'Hệ thống có 3 cơ sở: Cơ sở Biên Hòa (123 Nguyễn Ái Quốc), Cơ sở TP. Thủ Đức (KĐT Sala) và Cơ sở Bình Dương (Đại lộ Bình Dương). Quý Phụ huynh có thể ghé tham quan từ thứ 2 đến thứ 7 hàng tuần.';
      } else {
        answer = `Cảm ơn Quý Phụ huynh đã đặt câu hỏi về "${text}". Ban Tuyển sinh Alpha School luôn sẵn sàng đồng hành cùng gia đình. Quý vị có thể nộp đơn trực tuyến tại trang Tuyển Sinh hoặc gọi hotline 1900 6868 để được giải đáp chi tiết nhất.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: answer,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          suggestions,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 bg-gradient-to-r from-emerald-700 to-teal-800 text-white px-5 py-3.5 rounded-full shadow-2xl hover:shadow-emerald-900/40 hover:scale-105 transition-all duration-200 group border border-emerald-500/30"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
            </span>
            <span className="font-bold text-sm">Trợ lý AI Tuyển sinh</span>
            <span className="bg-white/20 p-1.5 rounded-full text-xs">💬</span>
          </button>
        )}
      </div>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md h-[580px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-800 to-slate-900 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 border-2 border-emerald-400/50 flex items-center justify-center font-bold text-white shadow-inner">
                AI
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                  Alpha Assistant AI
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </h4>
                <p className="text-[11px] text-emerald-200">Tư vấn tuyển sinh & học bổng 24/7</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center font-bold text-slate-300 hover:text-white transition-colors"
            >
              &times;
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-emerald-700 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs sm:text-sm">{m.content}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>

                {/* Chips Suggestions */}
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(s)}
                        className="text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 rounded-full px-3 py-1 transition-all"
                      >
                        {s} ➔
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 w-fit">
                <span className="animate-spin text-emerald-600">🌀</span> Trợ lý AI đang tra cứu dữ liệu trường học...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick CTA banner */}
          <div className="bg-emerald-50 px-4 py-2 border-t border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
            <span>🎁 Học bổng lên tới 50%</span>
            <a href="/tuyen-sinh" className="font-bold underline hover:text-emerald-950">
              Đăng ký ngay
            </a>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex gap-2"
          >
            <input
              type="text"
              placeholder="Đặt câu hỏi về học phí, cơ sở, học bổng..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-slate-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center"
            >
              Gửi
            </button>
          </form>
        </div>
      )}
    </>
  );
};
