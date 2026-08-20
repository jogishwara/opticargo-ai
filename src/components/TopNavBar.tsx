import React, { useState, useEffect } from 'react';
import { Truck, Sparkles, Upload, Moon, Sun } from 'lucide-react';

interface TopNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenUpload: () => void;
  onOpenChat: () => void;
  hasDataset?: boolean;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  onOpenChat,
  hasDataset = false
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header id="top-nav-header" className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => setActiveTab('brief')}>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/60 shadow-xs flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                OptiCargo<span className="text-indigo-600 dark:text-indigo-400">.ai</span>
              </span>
              {hasDataset ? (
                <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/70 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Pipeline Aktif
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800/70 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Belum Ada Data
                </span>
              )}
            </div>
            <p className="text-[10.5px] leading-none text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Platform Intelijen Keputusan Logistik</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-lg border border-slate-200 dark:border-slate-700/60 shadow-inner">
          {[
            { id: 'brief', label: 'Brief Hari Ini' },
            { id: 'analysis', label: 'Analisis AI' },
            { id: 'simulation', label: 'Simulasi' },
            { id: 'implementation', label: 'Rencana Eksekusi' },
            { id: 'report', label: 'Laporan Eksekutif' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-700/70'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle Button in Navbar */}
          <button
            id="btn-nav-theme-toggle"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
            title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
          </button>

          <button
            id="btn-top-upload"
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Unggah Data</span>
          </button>

          <button
            id="btn-top-ask-opti"
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>Tanya Opti</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-0.5 hidden sm:block"></div>

          {/* User badge */}
          <div className="flex items-center gap-2 pl-0.5">
            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-[11px] text-indigo-600 dark:text-indigo-400 shrink-0">
              OP
            </div>
            <div className="hidden lg:block text-left text-xs">
              <p className="font-semibold text-xs text-slate-800 dark:text-slate-200 leading-tight">Dashboard Customer</p>
              <p className="text-[9.5px] text-slate-500 dark:text-slate-400 leading-tight">Portal Analisis Logistik Eksternal</p>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
