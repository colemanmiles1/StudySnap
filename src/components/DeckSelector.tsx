/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Layers,
  Award,
  Check,
  FolderOpen,
  Plus,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { StudySession } from '../types/study';

interface DeckSelectorProps {
  sessions: StudySession[];
  currentSessionId: string;
  onSelectSession: (sessionId: string) => void;
  type: 'flashcards' | 'quiz';
  onNewScan?: () => void;
}

export const DeckSelector: React.FC<DeckSelectorProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  type,
  onNewScan,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find((s) => s.id === currentSessionId) || sessions[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  if (!currentSession || sessions.length === 0) {
    return null;
  }

  const formatShortDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const getSubjectColor = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes('bio') || s.includes('medic') || s.includes('health')) {
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
    if (s.includes('chem') || s.includes('physic') || s.includes('science')) {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    }
    if (s.includes('econ') || s.includes('busin') || s.includes('financ')) {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    }
    return 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border-sky-200 dark:border-sky-800';
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Outer Pull-down bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Active set info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-200/60 dark:border-sky-800/60">
              {type === 'flashcards' ? (
                <Layers className="w-5 h-5" />
              ) : (
                <Award className="w-5 h-5" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                  {type === 'flashcards' ? 'Active Flashcard Deck' : 'Active Quiz Set'}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getSubjectColor(
                    currentSession.subject
                  )}`}
                >
                  {currentSession.subject}
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  •{' '}
                  {type === 'flashcards'
                    ? `${currentSession.flashcards?.length || 0} cards`
                    : `${currentSession.quiz?.length || 0} questions`}
                </span>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate mt-0.5">
                {currentSession.title}
              </h3>
            </div>
          </div>

          {/* Pull-down Menu Trigger Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
              aria-expanded={isOpen}
              aria-haspopup="true"
            >
              <div className="flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-sky-500" />
                <span>Switch Set ({sessions.length})</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-sky-500' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Previously Submitted Note Sets ({sessions.length})
              </span>
            </div>
            <span className="text-[11px] text-slate-600 dark:text-slate-400">
              Tap to switch
            </span>
          </div>

          {/* Sessions List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1.5">
            {sessions.map((session) => {
              const isSelected = session.id === currentSession.id;
              const cardCount = session.flashcards?.length || 0;
              const quizCount = session.quiz?.length || 0;
              const masteredCards = session.flashcards?.filter((c) => c.mastered).length || 0;

              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => {
                    onSelectSession(session.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-sky-50/90 dark:bg-sky-950/40 text-slate-900 dark:text-white font-medium border border-sky-200/80 dark:border-sky-800/60'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={`text-[10px] px-2 py-0.2 rounded-full font-semibold border ${getSubjectColor(
                          session.subject
                        )}`}
                      >
                        {session.subject}
                      </span>

                      {session.createdAt && (
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 flex items-center gap-1 font-medium">
                          <Clock className="w-2.5 h-2.5" />
                          {formatShortDate(session.createdAt)}
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-sm truncate ${
                        isSelected
                          ? 'font-bold text-sky-700 dark:text-sky-300'
                          : 'font-semibold text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {session.title}
                    </h4>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                      <span>
                        {type === 'flashcards'
                          ? `${cardCount} flashcards`
                          : `${quizCount} questions`}
                      </span>

                      {type === 'flashcards' && cardCount > 0 && (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          • {masteredCards}/{cardCount} mastered
                        </span>
                      )}

                      {type === 'quiz' && session.quizScores && (
                        <span className="text-indigo-700 dark:text-indigo-400 font-semibold">
                          • Last score: {session.quizScores.lastScore}/
                          {session.quizScores.totalQuestions} (
                          {Math.round(
                            (session.quizScores.lastScore /
                              Math.max(1, session.quizScores.totalQuestions)) *
                              100
                          )}
                          %)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Active Indicator Checkmark */}
                  <div className="shrink-0 flex items-center">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold opacity-0 group-hover:opacity-100">
                        Switch
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer action */}
          {onNewScan && (
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onNewScan();
                }}
                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Scan New Notes / Add Another Subject</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
