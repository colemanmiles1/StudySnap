/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, CheckCircle2, BookOpen, Layers, Lightbulb } from 'lucide-react';

const STUDY_TIPS = [
  'Tip: Spaced repetition beats cramming. Review these flashcards again tomorrow morning!',
  'Tip: Testing yourself with practice questions yields 50% higher exam retention than re-reading.',
  'Tip: Try explaining a concept to someone else — if you can explain it simply, you master it.',
  'Tip: Take 5-minute Pomodoro breaks between intensive quiz sessions to consolidate memories.',
];

const STAGES = [
  { label: 'Scanning note handwriting & diagrams...', icon: BookOpen },
  { label: 'Extracting key terms, formulas & concepts...', icon: Brain },
  { label: 'Drafting 3D active-recall flashcards...', icon: Layers },
  { label: 'Formulating multiple-choice practice quiz...', icon: Sparkles },
];

export const AnalyzingOverlay: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 2800);

    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % STUDY_TIPS.length);
    }, 4500);

    return () => {
      clearInterval(stageInterval);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
        {/* Glow behind */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Pulsing AI Scanner Icon */}
        <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-sky-500/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 opacity-90 animate-pulse" />
          <div className="relative z-10 text-white">
            <Sparkles className="w-9 h-9 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">
          StudySnap is analyzing your notes...
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Powered by Google Gemini AI Vision
        </p>

        {/* Progress Pipeline */}
        <div className="space-y-2.5 text-left bg-slate-50 dark:bg-slate-800/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 mb-6">
          {STAGES.map((stg, i) => {
            const Icon = stg.icon;
            const isDone = i < currentStage;
            const isCurrent = i === currentStage;

            return (
              <div
                key={i}
                className={`flex items-center gap-3 text-xs transition-colors ${
                  isDone
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : isCurrent
                    ? 'text-sky-600 dark:text-sky-400 font-bold'
                    : 'text-slate-400 dark:text-slate-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-sky-500 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                )}
                <span className="truncate">{stg.label}</span>
              </div>
            );
          })}
        </div>

        {/* Rotating study tip */}
        <div className="flex items-start gap-2.5 text-left p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs">
          <Lightbulb className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
          <span className="leading-relaxed">{STUDY_TIPS[tipIndex]}</span>
        </div>
      </div>
    </div>
  );
};
