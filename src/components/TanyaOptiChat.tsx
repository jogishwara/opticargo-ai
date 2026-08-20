import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, User, RefreshCw, Database } from 'lucide-react';
import { ChatMessage, DatasetSummary, OperationalAnalysis, Recommendation } from '../types';

interface TanyaOptiChatProps {
  isOpen: boolean;
  onClose: () => void;
  dataset?: DatasetSummary | null;
  analysis?: OperationalAnalysis | null;
  recommendations?: Recommendation[];
}

const boldMarkup = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
};

export const TanyaOptiChat: React.FC<TanyaOptiChatProps> = ({
  isOpen,
  onClose,
  dataset,
  analysis,
  recommendations
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "opti",
      text: "Halo! Saya **Opti**, asisten Intelijen Keputusan AI untuk OptiCargo.ai. Saya siap membantu Anda menganalisis data telemetri logistik, efisiensi rute, dan potensi penghematan operasional armada. Ada yang ingin Anda tanyakan seputar dataset yang diunggah?",
      timestamp: "08:35 WIB"
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    "Mengapa biaya BBM meningkat?",
    "Mengapa AI memilih Rute A?",
    "Dampak rekomendasi besok?",
    "Bagaimana cara kerja konsolidasi muatan?"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          dataset_id: dataset?.dataset_id || null
        })
      });
      const json = await res.json();

      const replyText = json?.data?.reply || "Opti siap membantu analisis operasional logistik Anda.";
      const optiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'opti',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      };
      setMessages((prev) => [...prev, optiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'opti',
          text: "Maaf, koneksi AI sedang sibuk. Silakan coba kembali beberapa saat lagi.",
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const topRec = recommendations?.[0];

  return (
    <div id="drawer-tanya-opti" className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between animate-slide-left">

      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 border border-indigo-200 animate-glow">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">Tanya Opti AI</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Gemini 3.6
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Konsultan Intelijen Keputusan Logistik</p>
          </div>
        </div>

        <button
          id="btn-close-chat"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition press-scale"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Active dataset context banner */}
      {dataset && (
        <div className="px-4 py-2.5 bg-indigo-50/70 border-b border-indigo-100 flex items-center gap-2 text-[11px]">
          <Database className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="font-semibold text-indigo-900 truncate">
            Konteks: {dataset.filename}
          </span>
          <span className="shrink-0 px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold text-[10px] border border-indigo-200">
            {dataset.vehicles_count} armada
          </span>
          {topRec && (
            <span className="shrink-0 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200">
              Hemat Rp{topRec.potential_saving_daily.toLocaleString('id-ID')}/hr
            </span>
          )}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 animate-slide-up ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
            }`}>
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className={`max-w-[82%] rounded-2xl p-3.5 text-xs space-y-1 ${
              msg.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-xs'
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
            }`}>
              <p className="leading-relaxed whitespace-pre-wrap">
                {msg.sender === 'opti' ? boldMarkup(msg.text) : msg.text}
              </p>
              <span className={`text-[10px] block text-right font-medium ${msg.sender === 'user' ? 'text-indigo-100' : 'text-slate-400'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-indigo-600 p-2 bg-white rounded-lg border border-slate-200 w-fit shadow-xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span className="typing-caret">Opti sedang menganalisis telemetri</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips & Input Form */}
      <div className="p-4 border-t border-slate-200 bg-white space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              id={`quick-prompt-${idx}`}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium border border-slate-200 whitespace-nowrap transition shrink-0 press-scale"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="input-chat-message"
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Tanyakan analisis rute, BBM, atau armada..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
          />
          <button
            id="btn-send-chat"
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold transition shadow-xs press-scale"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
