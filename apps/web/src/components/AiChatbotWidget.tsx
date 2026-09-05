'use client';

import React, { useState, useRef, useEffect } from 'react';
import { generateChatbotResponse, BotMessage, BotCitation } from '@school-cms/ai-chatbot';

interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  citations?: BotCitation[];
  suggestions?: string[];
}

export const AiChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Dạ kính chào Quý Phụ huynh! Em là Trợ Lý Tuyển Sinh AI của Hệ thống Alpha School. Em có thể giải đáp chi tiết về biểu phí 2026 - 2027, chương trình quốc tế Cambridge, học bổng Alpha Spark và tiện ích 3 cơ sở trường học.',
      time: 'Vừa xong',
      suggestions: [
        'Học phí năm học 2026 - 2027?',
        'Chương trình Cambridge có gì nổi bật?',
        'Địa chỉ và cơ sở vật chất Biên Hòa?',
        'Hồ sơ đăng ký tuyển sinh gồm những gì?',
      ],
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

    const userMsg: ChatMessageItem = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/v1/chatbot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      });

      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        const botMsg: ChatMessageItem = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.message.content,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          citations: data.citations,
          suggestions: data.suggestedFollowUps,
        };
        setMessages((prev) => [...prev, botMsg]);
        return;
      }
      throw new Error('API unreachable');
    } catch {
      // High-fidelity client-side RAG engine fallback from @school-cms/ai-chatbot
      const historyForRAG: BotMessage[] = messages.map((m) => ({
        id: m.id,
        conversationId: 'client-conv',
        role: m.role,
        content: m.content,
        createdAt: new Date().toISOString(),
      }));

      const generated = generateChatbotResponse(text, historyForRAG);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: generated.message.content,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          citations: generated.citations,
          suggestions: generated.suggestedFollowUps,
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
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white px-5 py-3.5 rounded-full shadow-2xl hover:shadow-emerald-900/50 hover:scale-105 transition-all duration-200 group border border-emerald-400/40"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300" />
            </span>
            <span className="font-bold text-sm tracking-wide">Tư Vấn Tuyển Sinh AI</span>
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-mono">24/7</span>
          </button>
        )}
      </div>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 font-sans">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-800 to-slate-900 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 border-2 border-emerald-400/50 flex items-center justify-center font-bold text-white text-lg shadow-inner">
                🤖
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                  Alpha Admissions Advisor
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <p className="text-[11px] text-emerald-200">Trợ lý AI tra cứu sổ tay & học bổng 2026</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center font-bold text-slate-300 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 text-xs sm:text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 shadow-xs leading-relaxed space-y-2 ${
                    m.role === 'user'
                      ? 'bg-slate-900 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs leading-relaxed">{m.content}</p>

                  {/* Citations Snippets */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-700 block uppercase tracking-wider">
                        📌 Sổ tay trích dẫn:
                      </span>
                      {m.citations.map((cite, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-1.5 rounded-lg bg-emerald-50 text-[10px] text-emerald-900 border border-emerald-200/60"
                        >
                          <strong>{cite.title}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>

                {/* Suggestions Chips */}
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(s)}
                        className="text-[11px] font-medium bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400 rounded-full px-3 py-1 transition-all shadow-2xs text-left"
                      >
                        {s} ➔
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 w-fit shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                <span>Trợ lý AI đang tra cứu dữ liệu trường học...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick CTA Banner */}
          <div className="bg-emerald-50 px-4 py-2 border-t border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
            <span>🎓 Quỹ học bổng Alpha Spark 2026</span>
            <a
              href="#sec-form-contact"
              onClick={() => setIsOpen(false)}
              className="font-bold underline hover:text-emerald-950 text-emerald-800"
            >
              Nộp hồ sơ ngay ➔
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
              placeholder="Hỏi về học phí, Cambridge, cơ sở Biên Hòa..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50"
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
