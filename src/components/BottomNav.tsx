/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, FileText, Layers, Award, History } from 'lucide-react';
import { ActiveTab } from '../types/study';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  hasActiveSession: boolean;
  flashcardCount?: number;
  quizCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  hasActiveSession,
  flashcardCount = 0,
  quizCount = 0,
}) => {
  const tabs = [
    {
      id: 'home' as ActiveTab,
      label: 'Home',
      icon: Home,
      disabled: false,
    },
    {
      id: 'summary' as ActiveTab,
      label: 'Summary',
      icon: FileText,
      disabled: !hasActiveSession,
      badge: hasActiveSession ? 'AI' : undefined,
    },
    {
      id: 'flashcards' as ActiveTab,
      label: 'Flashcards',
      icon: Layers,
      disabled: !hasActiveSession,
      count: flashcardCount > 0 ? flashcardCount : undefined,
    },
    {
      id: 'quiz' as ActiveTab,
      label: 'Quiz',
      icon: Award,
      disabled: !hasActiveSession,
      count: quizCount > 0 ? quizCount : undefined,
    },
    {
      id: 'history' as ActiveTab,
      label: 'History',
      icon: History,
      disabled: false,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 transition-colors pb-safe">
      <div className="max-w-md mx-auto px-3 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                tab.disabled
                  ? 'opacity-35 cursor-not-allowed text-slate-400 dark:text-slate-600'
                  : isActive
                  ? 'text-sky-600 dark:text-sky-400 font-bold scale-105'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.count !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center leading-none shadow-xs">
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                )}
              </div>
              <span className="text-[11px] mt-1 font-medium tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-1 rounded-full bg-sky-500 dark:bg-sky-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
