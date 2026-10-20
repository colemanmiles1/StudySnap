/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCw,
  CheckCircle2,
  Sparkles,
  Lightbulb,
  Volume2,
  List,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Flashcard } from '../types/study';

interface FlashcardsViewProps {
  initialFlashcards: Flashcard[];
  onExplainConcept: (term: string, context?: string) => void;
  onUpdateFlashcards?: (updated: Flashcard[]) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  initialFlashcards,
  onExplainConcept,
  onUpdateFlashcards,
}) => {
  const [cards, setCards] = useState<Flashcard[]>(initialFlashcards);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'flip' | 'list'>('flip');
  const [showHint, setShowHint] = useState<boolean>(false);

  // Sync if initialFlashcards changes
  useEffect(() => {
    setCards(initialFlashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  }, [initialFlashcards]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'flip') return;
      if (e.key === 'ArrowRight') {
        nextCard();
      } else if (e.key === 'ArrowLeft') {
        prevCard();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleFlip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length, isFlipped, viewMode]);

  const currentCard = cards[currentIndex] || cards[0];

  const toggleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const nextCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const shuffleCards = () => {
    setIsFlipped(false);
    setShowHint(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    onUpdateFlashcards?.(shuffled);
  };

  const toggleMastered = (cardId: string) => {
    const updated = cards.map((c) => (c.id === cardId ? { ...c, mastered: !c.mastered } : c));
    setCards(updated);
    onUpdateFlashcards?.(updated);
  };

  const masteredCount = cards.filter((c) => c.mastered).length;
  const progressPercent = Math.round((masteredCount / Math.max(1, cards.length)) * 100);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0;
    window.speechSynthesis.speak(u);
  };

  if (!cards || cards.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        No flashcards generated yet. Please scan your notes first.
      </div>
    );
  }

  return (
    <div className="w-full space-y-5 pb-20 animate-fadeIn">
      {/* Top Controls & Mastery Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">AI Flashcards</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold">
              {currentIndex + 1} / {cards.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={shuffleCards}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Shuffle cards"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Shuffle</span>
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'flip' ? 'list' : 'flip')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Toggle list view"
            >
              {viewMode === 'flip' ? <List className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{viewMode === 'flip' ? 'All Cards' : 'Flip Mode'}</span>
            </button>
          </div>
        </div>

        {/* Mastery Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-400">
              Mastery: {masteredCount} of {cards.length} mastered
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {viewMode === 'flip' ? (
        /* 3D Flip Card Interactive View */
        <div className="flex flex-col items-center space-y-4">
          {/* Card Frame with 3D perspective */}
          <div
            onClick={toggleFlip}
            className="perspective-1000 w-full max-w-lg h-[340px] sm:h-[380px] cursor-pointer select-none"
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT OF CARD */}
              <div className="absolute inset-0 backface-hidden w-full h-full rounded-3xl bg-gradient-to-br from-white to-sky-50/40 dark:from-slate-900 dark:to-slate-800/90 border-2 border-slate-200/90 dark:border-slate-700/80 p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-sky-400 transition-all">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    {currentCard.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(currentCard.front);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Listen"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    {currentCard.mastered && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> Mastered
                      </span>
                    )}
                  </div>
                </div>

                {/* Center Content */}
                <div className="my-auto text-center px-2 py-4">
                  <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                    {currentCard.front}
                  </p>

                  {/* Optional Hint */}
                  {showHint && currentCard.hint && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-4 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 font-medium animate-fadeIn"
                    >
                      💡 <span className="font-bold">Hint:</span> {currentCard.hint}
                    </div>
                  )}
                </div>

                {/* Footer instructions */}
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {currentCard.hint && !showHint ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHint(true);
                      }}
                      className="text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Lightbulb className="w-3.5 h-3.5" /> Show Hint
                    </button>
                  ) : (
                    <span className="text-[11px]">Card #{currentIndex + 1}</span>
                  )}
                  <span className="flex items-center gap-1 text-[11px] font-medium text-sky-600 dark:text-sky-400">
                    <RotateCw className="w-3.5 h-3.5" /> Tap card to flip
                  </span>
                </div>
              </div>

              {/* BACK OF CARD */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-2 border-indigo-500/50 text-white p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    Answer & Explanation
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(currentCard.back);
                    }}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                    title="Listen"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Back content */}
                <div className="my-auto py-2">
                  <p className="text-base sm:text-lg text-slate-100 leading-relaxed font-medium">
                    {currentCard.back}
                  </p>
                </div>

                {/* Footer action */}
                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onExplainConcept(currentCard.front, currentCard.back);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-sky-300 text-xs font-semibold transition-colors"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Explain Simply</span>
                  </button>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <RotateCw className="w-3 h-3" /> Tap to flip back
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="w-full max-w-lg flex items-center justify-between gap-3 pt-2">
            <button
              onClick={prevCard}
              className="flex items-center gap-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs active:scale-95 transition-all shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Mastered toggle button */}
            <button
              onClick={() => toggleMastered(currentCard.id)}
              className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all active:scale-95 shadow-xs ${
                currentCard.mastered
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{currentCard.mastered ? 'Mastered' : 'Mark Mastered'}</span>
            </button>

            <button
              onClick={nextCard}
              className="flex items-center gap-1 px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs active:scale-95 transition-all shadow-sm shadow-sky-500/20"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Helper hotkeys hint */}
          <p className="text-[11px] text-slate-400 text-center hidden sm:block">
            Keyboard shortcuts: <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Space</kbd> to flip, <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">←</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">→</kbd> to navigate.
          </p>
        </div>
      ) : (
        /* All-in-One Flashcard List View */
        <div className="space-y-3">
          {cards.map((c, i) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {c.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleMastered(c.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors ${
                      c.mastered
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{c.mastered ? 'Mastered' : 'Mark'}</span>
                  </button>

                  <button
                    onClick={() => onExplainConcept(c.front, c.back)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Explain simply"
                  >
                    <Lightbulb className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">{c.front}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {c.back}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
