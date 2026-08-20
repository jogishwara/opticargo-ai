import React from 'react';
import { LayoutDashboard, Cpu, Sliders, PlayCircle, FileText, Bot, UploadCloud } from 'lucide-react';

interface SideNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenUpload: () => void;
  onOpenChat: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  onOpenChat
}) => {
  const navItems = [
    { id: 'brief', label: 'Brief Hari Ini', icon: LayoutDashboard, badge: 'Baru' },
    { id: 'analysis', label: 'Analisis AI', icon: Cpu, badge: '2 Kebocoran' },
    { id: 'simulation', label: 'Simulasi Skenario', icon: Sliders, badge: 'Interaktif' },
    { id: 'implementation', label: 'Rencana Eksekusi', icon: PlayCircle, badge: 'Siap' },
    { id: 'report', label: 'Laporan Eksekutif', icon: FileText, badge: 'PDF' }
  ];

  return (
    <aside id="side-nav-bar" className="w-64 bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-4 flex flex-col justify-between gap-6 shadow-2xl shadow-slate-950/50 hidden md:flex shrink-0 sticky top-20 transition-all duration-300">
      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between px-2 mb-3">
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Pipeline Keputusan AI
            </p>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
          </div>
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`side-nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold translate-x-1'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80 hover:translate-x-0.5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white border border-white/20'
                        : 'bg-slate-800/90 text-slate-400 border border-slate-700/60'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Tools Box */}
        <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2.5 shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-200 font-bold">
            <span>Aksi Cepat Data</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Unggah log GPS atau file manifest baru untuk memicu ulang AI Decision Pipeline.
          </p>
          <button
            id="btn-sidebar-upload"
            onClick={onOpenUpload}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Unggah Dataset Logistik</span>
          </button>
        </div>
      </div>

      {/* Floating Chat Assistant Promotion */}
      <div className="bg-gradient-to-br from-indigo-950/60 via-slate-850/50 to-slate-900/80 p-3.5 rounded-xl border border-indigo-500/30 text-slate-200 space-y-2.5 shadow-lg shadow-indigo-950/20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Tanya Opti AI</p>
            <p className="text-[10px] text-indigo-300">Penalaran Generatif</p>
          </div>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Konsultasikan pertanyaan seputar rute, efisiensi BBM, dan rekomendasi langsung ke AI.
        </p>
        <button
          id="btn-sidebar-chat"
          onClick={onOpenChat}
          className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
        >
          <span>Mulai Diskusi AI</span>
        </button>
      </div>
    </aside>
  );
};
