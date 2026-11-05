import React from 'react';
import { useRotation, MainTab } from '../context/RotationContext';
import { Plus, Sun, Moon, Disc3 } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, theme, toggleTheme, setIsQuickLogOpen } = useRotation();

  const navLinks: { id: MainTab; label: string }[] = [
    { id: 'rotation', label: 'On Rotation' },
    { id: 'library', label: 'My Library' },
    { id: 'feed', label: 'Social Feed' },
    { id: 'discover', label: 'Discover' },
    { id: 'stats', label: 'Stats' },
    { id: 'shelves', label: 'Shelves' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('rotation')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 p-[1.5px] transition-transform group-hover:rotate-45">
            <div className="w-full h-full bg-neutral-950 rounded-full flex items-center justify-center">
              <Disc3 className="w-4 h-4 text-amber-400 animate-[spin_8s_linear_infinite]" />
            </div>
          </div>
          <span className="font-display font-bold text-lg text-neutral-900 dark:text-neutral-100 tracking-tight whitespace-nowrap shrink-0">
            On Rotation
          </span>
        </button>

        {/* Zone 2: Single-line Nav Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-3.5 py-1.5 text-xs lg:text-sm font-medium transition-colors rounded-lg whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 shadow-sm font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="w-9 h-9 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-100 dark:bg-neutral-900/80 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsQuickLogOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Log Media</span>
          </button>

          <div
            className="w-8 h-8 rounded-full overflow-hidden border border-neutral-300 dark:border-neutral-700 ring-1 ring-amber-400/40 shrink-0"
            title="Isabelle W. (You)"
          >
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
              alt="Isabelle W."
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-neutral-200/80 dark:border-neutral-800/80 px-2 py-2 overflow-x-auto">
        {navLinks.map(link => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`px-2.5 py-1 text-xs font-medium whitespace-nowrap rounded-md ${
                isActive ? 'text-amber-500 dark:text-amber-400 bg-neutral-100 dark:bg-neutral-900 font-semibold' : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
