import React, { useEffect, useState } from "react";
import { Bot, Sparkles, X } from "lucide-react";
import { getServerStatus } from "../services/api";

interface Toast {
  id: number;
  message: string;
  variant: "success" | "error" | "info";
}

interface AiToastCenterProps {
  messages: Toast[];
  onDismiss: (id: number) => void;
}

export const AiToastCenter: React.FC<AiToastCenterProps> = ({
  messages,
  onDismiss,
}) => {
  if (messages.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-[90] flex flex-col gap-2.5 w-[min(94vw,380px)]">
      {messages.map((toast) => {
        const tone =
          toast.variant === "success"
            ? "border-emerald-500/40 bg-[#0b1a15]"
            : toast.variant === "error"
              ? "border-rose-500/40 bg-[#1c0d12]"
              : "border-indigo-500/40 bg-[#0c1226]";

        const dot =
          toast.variant === "success"
            ? "bg-emerald-400"
            : toast.variant === "error"
              ? "bg-rose-400"
              : "bg-indigo-400";

        return (
          <div
            key={toast.id}
            className={`relative flex items-start gap-3 rounded-xl border ${tone} px-4 py-3 shadow-2xl animate-toast-in`}
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-indigo-300" />
            </div>
            <p className="flex-1 text-xs text-slate-100 leading-relaxed pt-1">
              {toast.message}
            </p>
            <span
              className={`absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full ${dot} animate-pulse`}
            />
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-md text-slate-500 hover:text-slate-200 hover:bg-white/10 transition shrink-0"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export const useAiToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = (
    message: string,
    variant: Toast["variant"] = "info",
    autoCloseMs = 5000
  ) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-2), { id, message, variant }]);
    if (autoCloseMs > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, autoCloseMs);
    }
  };

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, push, dismiss };
};
