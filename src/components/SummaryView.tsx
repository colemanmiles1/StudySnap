/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Share2,
  FileCode,
  Tag,
  ArrowRight,
  Edit3,
  X,
} from 'lucide-react';
import { StudySummary, KeyConcept } from '../types/study';

interface SummaryViewProps {
  summary: StudySummary;
  imageUrls?: string[];
  onExplainConcept: (term: string, definition: string) => void;
  onGoToFlashcards: () => void;
  onGoToQuiz: () => void;
  onUpdateTitle?: (newTitle: string) => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  summary,
  imageUrls,
  onExplainConcept,
  onGoToFlashcards,
  onGoToQuiz,
  onUpdateTitle,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(summary.topicTitle);
  const [isScanningTitle, setIsScanningTitle] = useState(false);

  const handleSaveTitle = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (tempTitle.trim() && onUpdateTitle) {
      onUpdateTitle(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleAIScanTitle = async () => {
    if (!imageUrls || imageUrls.length === 0) return;
    setIsScanningTitle(true);
    try {
      const res = await fetch('/api/suggest-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: imageUrls.map((url) => ({ base64: url })),
          currentSubject: summary.subjectArea,
          currentTitle: summary.topicTitle,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.title && onUpdateTitle) {
          onUpdateTitle(data.title);
          setTempTitle(data.title);
        }
      }
    } catch (err) {
      console.error('Failed to AI scan title:', err);
    } finally {
      setIsScanningTitle(false);
    }
  };

  const copyStudyGuide = () => {
    const text = `
# ${summary.topicTitle}
Subject: ${summary.subjectArea}
Estimated Study Time: ${summary.estimatedStudyTimeMinutes} mins

## Summary
${summary.executiveSummary}

## Key Takeaways
${summary.keyTakeaways.map((t) => `• ${t}`).join('\n')}

## Key Concepts & Definitions
${summary.keyConcepts.map((c) => `• ${c.term} (${c.importance}): ${c.definition}`).join('\n')}

${
  summary.formulasAndEquations.length > 0
    ? `## Formulas & Rules\n${summary.formulasAndEquations.map((f) => `• ${f.label}: ${f.formula} - ${f.explanation}`).join('\n')}`
    : ''
}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utteranceText = `${summary.topicTitle}. ${summary.executiveSummary}. Key Takeaways: ${summary.keyTakeaways.join('. ')}`;
      const utterance = new SpeechSynthesisUtterance(utteranceText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="w-full space-y-6 pb-20 animate-fadeIn">
      {/* Header Topic Banner */}
      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-bold uppercase tracking-wider">
              {summary.subjectArea}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5" /> ~{summary.estimatedStudyTimeMinutes} min study
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Read-aloud button */}
            {'speechSynthesis' in window && (
              <button
                onClick={toggleSpeech}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isSpeaking
                    ? 'bg-sky-500 text-white border-sky-500'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
                title={isSpeaking ? 'Stop audio' : 'Listen to summary'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{isSpeaking ? 'Stop' : 'Listen'}</span>
              </button>
            )}

            {/* Copy study guide */}
            <button
              onClick={copyStudyGuide}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Copy formatted study guide"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Note Title with Edit & AI Scan buttons */}
        {isEditingTitle ? (
          <form onSubmit={handleSaveTitle} className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              autoFocus
              className="flex-1 px-4 py-2 rounded-2xl border-2 border-sky-400 bg-white dark:bg-slate-800 text-lg sm:text-xl font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
              title="Save title"
            >
              <Check className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTempTitle(summary.topicTitle);
                setIsEditingTitle(false);
              }}
              className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex-1">
              {summary.topicTitle}
            </h1>

            <div className="flex items-center gap-2 shrink-0">
              {/* Edit Title Button */}
              <button
                onClick={() => {
                  setTempTitle(summary.topicTitle);
                  setIsEditingTitle(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs"
                title="Edit note title"
              >
                <Edit3 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Edit Title</span>
              </button>

              {/* AI Scan Title Button */}
              {imageUrls && imageUrls.length > 0 && (
                <button
                  onClick={handleAIScanTitle}
                  disabled={isScanningTitle}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-bold transition-all shadow-2xs disabled:opacity-50"
                  title="Have AI re-scan uploaded sheets to generate an accurate title"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-yellow-500 ${isScanningTitle ? 'animate-spin' : ''}`} />
                  <span>{isScanningTitle ? 'Scanning...' : 'AI Scan Title'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quick launch to flashcards or quiz */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <button
            onClick={onGoToFlashcards}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            <span>Practice Flashcards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onGoToQuiz}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            <span>Take Practice Quiz</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Unclear Handwriting Notice (Honest AI flag required by prompt) */}
      {summary.unclearOrCutoffNotes && summary.unclearOrCutoffNotes.length > 0 && (
        <div className="rounded-2xl p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Handwriting & Margin Readability Check:</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            StudySnap detected portions of notes that were slightly cut off or faded. To prevent false information, these parts were not guessed:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300 pl-1 font-mono text-[11px]">
            {summary.unclearOrCutoffNotes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Executive Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Executive Summary</h2>
        </div>

        <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-3 font-normal">
          {summary.executiveSummary}
        </div>
      </div>

      {/* Must-Remember Key Takeaways */}
      {summary.keyTakeaways && summary.keyTakeaways.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-950/40 dark:via-purple-950/20 rounded-3xl p-6 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Must-Remember Exam Highlights
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {summary.keyTakeaways.map((takeaway, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 shadow-xs"
              >
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <span className="leading-snug">{takeaway}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Concepts & Definitions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Key Concepts & Definitions ({summary.keyConcepts.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">Click &quot;Explain Simply&quot; for analogies</span>
        </div>

        <div className="space-y-3">
          {summary.keyConcepts.map((concept, idx) => {
            const importanceBadge =
              concept.importance === 'essential'
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200'
                : concept.importance === 'high'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200';

            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:border-sky-300 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {concept.term}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${importanceBadge}`}
                    >
                      {concept.importance}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {concept.definition}
                  </p>
                  {concept.context && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                      Application: {concept.context}
                    </p>
                  )}
                </div>

                {/* 1-Click "Explain This Simply" */}
                <button
                  onClick={() => onExplainConcept(concept.term, concept.definition)}
                  className="shrink-0 self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/80 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-sky-500" />
                  <span>Explain Simply</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formulas & Equations (if detected) */}
      {summary.formulasAndEquations && summary.formulasAndEquations.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Equations & Formulas
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {summary.formulasAndEquations.map((formula, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2"
              >
                <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  {formula.label}
                </div>
                <div className="font-mono text-xs sm:text-sm font-bold bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-950 dark:text-indigo-200 overflow-x-auto">
                  {formula.formula}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{formula.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simplified Breakdowns (ELI5) */}
      {summary.simplifiedBreakdowns && summary.simplifiedBreakdowns.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Simplified &quot;ELI5&quot; Breakdowns
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {summary.simplifiedBreakdowns.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2"
              >
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {item.simpleExplanation}
                </p>
                {item.analogy && (
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/40 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200 font-medium">
                    💡 <span className="font-bold">Analogy:</span> {item.analogy}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
