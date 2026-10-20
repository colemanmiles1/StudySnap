/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Lightbulb, X, Sparkles, Send, BookOpen, CheckCircle } from 'lucide-react';

interface SimplifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTerm?: string;
  initialContext?: string;
  subject?: string;
}

export const SimplifyModal: React.FC<SimplifyModalProps> = ({
  isOpen,
  onClose,
  initialTerm = '',
  initialContext = '',
  subject = 'College Studies',
}) => {
  const [term, setTerm] = useState(initialTerm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    gist: string;
    analogy: string;
    examTip: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && initialTerm) {
      setTerm(initialTerm);
      fetchSimplifiedExplanation(initialTerm, initialContext);
    } else if (isOpen) {
      setResult(null);
      setError(null);
    }
  }, [isOpen, initialTerm, initialContext]);

  const fetchSimplifiedExplanation = async (targetTerm: string, targetContext?: string) => {
    if (!targetTerm.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/simplify-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          term: targetTerm,
          definition: targetContext,
          subject,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to simplify concept.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while explaining.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSimplifiedExplanation(term);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Explain This Simply
              </h3>
              <p className="text-[11px] text-slate-500">ELI5 breakdown with real-world analogies</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input box */}
        <form onSubmit={handleManualSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Type any tricky term (e.g. Mitosis, Elasticity)..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={loading || !term.trim()}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-colors shrink-0"
          >
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Explain</span>
          </button>
        </form>

        {/* Content Body */}
        {loading && (
          <div className="py-10 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-amber-500 mx-auto animate-spin" />
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Simplifying <span className="font-bold text-slate-900 dark:text-white">&quot;{term}&quot;</span> into plain English...
            </p>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300">
            {error}
          </div>
        )}

        {result && !loading && (
          <div className="space-y-3.5 animate-fadeIn max-h-[60vh] overflow-y-auto pr-1">
            {/* The Gist */}
            <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> The 1-Sentence Gist
              </span>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {result.gist}
              </p>
            </div>

            {/* Analogy */}
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1">
                💡 Real-World Metaphor / Analogy
              </span>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {result.analogy}
              </p>
            </div>

            {/* Exam Tip */}
            <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1">
                🎯 Exam Tip &amp; How Professors Test It
              </span>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {result.examTip}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
