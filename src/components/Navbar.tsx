import React from 'react';
import { Layers, Sparkles, Sun, Moon, History, BookOpen, GraduationCap, Compass, GitCompare } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  onOpenHistory,
  historyCount
}) => {
  const navItems = [
    { id: 'converter', label: 'Lab Visualizer', icon: Layers },
    { id: 'whatif', label: 'What-If Lab', icon: GitCompare },
    { id: 'practice', label: 'Practice Mode', icon: Compass },
    { id: 'quiz', label: 'DSA Quiz', icon: GraduationCap },
    { id: 'learn', label: 'Theory & Pseudocode', icon: BookOpen },
    { id: 'about', label: 'About', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors border-[#27272A] bg-[#09090B]/90 text-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('converter')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded bg-[#18181B] border border-[#27272A] text-[#6366F1] flex items-center justify-center group-hover:border-[#6366F1]/60 group-hover:shadow-[0_0_12px_rgba(99,102,241,0.25)] transition-all">
              <Layers className="w-5 h-5 text-[#C0C1FF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-[#F8FAFC] group-hover:text-white transition-colors">
                  AlgoConvert
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-[#6366F1]/15 text-[#C0C1FF] border border-[#6366F1]/30">
                  DSA LAB
                </span>
              </div>
              <p className="text-[10px] text-[#71717A] font-mono">
                INFIX → PREFIX &bull; LIFO AUTOMATON
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#18181B] text-[#C0C1FF] border border-[#6366F1]/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                      : 'text-[#71717A] hover:text-[#F8FAFC] hover:bg-[#111318] border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#06B6D4]' : ''}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenHistory}
              title="Recent Conversions"
              className="relative p-2 rounded bg-[#111318] border border-[#27272A] text-[#71717A] hover:text-[#F8FAFC] hover:border-[#3F3F46] transition-colors"
            >
              <History className="w-4 h-4" />
              {historyCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#06B6D4] shadow-[0_0_6px_#06B6D4]" />
              )}
            </button>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              className="p-2 rounded bg-[#111318] border border-[#27272A] text-[#71717A] hover:text-[#F8FAFC] hover:border-[#3F3F46] transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#F59E0B]" /> : <Moon className="w-4 h-4 text-[#6366F1]" />}
            </button>

            <a
              href="https://github.com/shreyaskhakal/infix-to-prefix-converter"
              target="_blank"
              rel="noreferrer"
              title="View on GitHub"
              className="p-2 rounded bg-[#111318] border border-[#27272A] text-[#71717A] hover:text-[#F8FAFC] hover:border-[#3F3F46] transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-[#27272A] scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#18181B] text-[#C0C1FF] border border-[#6366F1]/40'
                    : 'text-[#71717A] hover:text-[#F8FAFC]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
