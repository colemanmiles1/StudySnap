/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Check,
} from 'lucide-react';
import { QuizQuestion, StudySummary, StudySession } from '../types/study';
import { DeckSelector } from './DeckSelector';

interface QuizViewProps {
  initialQuiz: QuizQuestion[];
  summary: StudySummary;
  onSaveScore?: (score: number, total: number) => void;
  onRegenerateQuiz: () => Promise<void>;
  isRegenerating: boolean;
  allSessions?: StudySession[];
  currentSessionId?: string;
  onSwitchSession?: (sessionId: string) => void;
  onNewScan?: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  initialQuiz,
  summary,
  onSaveScore,
  onRegenerateQuiz,
  isRegenerating,
  allSessions,
  currentSessionId,
  onSwitchSession,
  onNewScan,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuiz);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Sync if initialQuiz is updated (e.g. after regeneration)
  React.useEffect(() => {
    setQuestions(initialQuiz);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setShowHint(false);
    setIsCompleted(false);
  }, [initialQuiz]);

  const currentQ = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;
  const hasAnsweredCurrent = selectedAnswers[currentIndex] !== undefined;
  const chosenIndex = selectedAnswers[currentIndex];
  const isCorrect = chosenIndex === currentQ?.correctIndex;

  const handleSelectOption = (index: number) => {
    if (hasAnsweredCurrent) return; // Locked once answered
    const nextAnswers = { ...selectedAnswers, [currentIndex]: index };
    setSelectedAnswers(nextAnswers);
    setShowExplanation(true);

    // If last question, complete quiz
    if (currentIndex === totalQuestions - 1) {
      calculateFinalScore(nextAnswers);
    }
  };

  const calculateFinalScore = (answers: Record<number, number>) => {
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) {
        score++;
      }
    });
    setIsCompleted(true);
    onSaveScore?.(score, totalQuestions);
  };

  const handleNext = () => {
    setShowExplanation(false);
    setShowHint(false);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      calculateFinalScore(selectedAnswers);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    setShowHint(false);
    setIsCompleted(false);
  };

  // Calculate live score
  const correctCount = Object.entries(selectedAnswers).filter(
    ([qIdx, ansIdx]) => questions[Number(qIdx)]?.correctIndex === ansIdx
  ).length;

  const scorePercentage = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);

  // Results evaluation
  const getGradeInfo = () => {
    if (scorePercentage >= 90) return { letter: 'A+', text: 'Exam Ready! Outstanding Mastery 🌟', color: 'text-emerald-500' };
    if (scorePercentage >= 80) return { letter: 'A', text: 'Great Job! Solid Understanding 👍', color: 'text-emerald-600' };
    if (scorePercentage >= 70) return { letter: 'B', text: 'Good Effort! Review Missed Concepts 📚', color: 'text-sky-600' };
    if (scorePercentage >= 60) return { letter: 'C', text: 'Fair. Recommend Flashcard Review 🔄', color: 'text-amber-500' };
    return { letter: 'Review Needed', text: 'Review the Summary and Try Again 💪', color: 'text-rose-500' };
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        No quiz questions found. Please scan notes to generate questions.
      </div>
    );
  }

  return (
    <div className="w-full space-y-5 pb-20 animate-fadeIn">
      {/* Pull-down Menu to switch between previously submitted quiz question sets */}
      {allSessions && allSessions.length > 0 && currentSessionId && onSwitchSession && (
        <DeckSelector
          sessions={allSessions}
          currentSessionId={currentSessionId}
          onSelectSession={onSwitchSession}
          type="quiz"
          onNewScan={onNewScan}
        />
      )}

      {/* Header Tracker */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Practice Quiz</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Score: {correctCount}/{Object.keys(selectedAnswers).length}
            </span>
            <button
              onClick={handleRestart}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Reset Quiz"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 transition-all duration-300"
            style={{ width: `${((currentIndex + (hasAnsweredCurrent ? 1 : 0)) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {!isCompleted ? (
        /* Active Question Card */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          {/* Question text & difficulty */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Difficulty: {currentQ.difficulty || 'medium'}
              </span>

              {currentQ.hint && !showHint && !hasAnsweredCurrent && (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <Lightbulb className="w-3.5 h-3.5" /> Need a hint?
                </button>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h3>

            {showHint && currentQ.hint && (
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 font-medium animate-fadeIn">
                💡 <span className="font-bold">Hint:</span> {currentQ.hint}
              </div>
            )}
          </div>

          {/* Options (A, B, C, D) */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              const isSelected = chosenIndex === idx;
              const isOptionCorrect = idx === currentQ.correctIndex;

              let style =
                'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-sky-400 hover:bg-sky-50/50 dark:hover:bg-slate-800';

              if (hasAnsweredCurrent) {
                if (isOptionCorrect) {
                  style =
                    'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-semibold shadow-xs';
                } else if (isSelected && !isOptionCorrect) {
                  style =
                    'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-100 font-semibold shadow-xs';
                } else {
                  style = 'opacity-45 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={hasAnsweredCurrent}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${style}`}
                >
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      hasAnsweredCurrent && isOptionCorrect
                        ? 'bg-emerald-600 text-white'
                        : hasAnsweredCurrent && isSelected && !isOptionCorrect
                        ? 'bg-rose-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {letter}
                  </span>

                  <span className="text-sm leading-relaxed pt-0.5 flex-1">{option}</span>

                  {hasAnsweredCurrent && isOptionCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {hasAnsweredCurrent && isSelected && !isOptionCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Immediate AI Explanation */}
          {hasAnsweredCurrent && (
            <div className="space-y-4 pt-2 animate-fadeIn">
              <div
                className={`p-4 rounded-2xl border ${
                  isCorrect
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm mb-1.5">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Correct! Nice job!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>
                        Incorrect. The correct answer was (
                        {['A', 'B', 'C', 'D'][currentQ.correctIndex]}).
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold">AI Explanation:</span> {currentQ.explanation}
                </p>
              </div>

              {/* Next Question Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-500/20 active:scale-95 transition-all"
                >
                  <span>{currentIndex < totalQuestions - 1 ? 'Next Question' : 'See Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* End of Quiz Results Card */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-center animate-fadeIn">
          {/* Trophy / Score badge */}
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-500 p-1 flex items-center justify-center shadow-xl shadow-indigo-500/20">
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {scorePercentage}%
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Score
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
              Quiz Completed!
            </h3>
            <p className={`text-sm font-bold ${getGradeInfo().color}`}>{getGradeInfo().text}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              You scored {correctCount} out of {totalQuestions} questions correctly.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            {/* Regenerate New Quiz Button (Feature from requirements) */}
            <button
              onClick={onRegenerateQuiz}
              disabled={isRegenerating}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/25 active:scale-95 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>{isRegenerating ? 'Generating New Questions...' : 'Generate Fresh New Quiz'}</span>
            </button>
          </div>

          {/* Detailed Question Review */}
          <div className="text-left pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Question Review</h4>
            <div className="space-y-3">
              {questions.map((q, i) => {
                const userAns = selectedAnswers[i];
                const wasCorrect = userAns === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 dark:text-white leading-snug">
                        {i + 1}. {q.question}
                      </span>
                      {wasCorrect ? (
                        <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                          <Check className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400 shrink-0">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </div>

                    <div className="text-slate-600 dark:text-slate-400 text-[11px] space-y-1">
                      <div>
                        Your answer: <span className={wasCorrect ? 'font-bold text-emerald-600' : 'font-bold text-rose-600'}>{q.options[userAns] || 'None'}</span>
                      </div>
                      {!wasCorrect && (
                        <div>
                          Correct answer: <span className="font-bold text-emerald-600">{q.options[q.correctIndex]}</span>
                        </div>
                      )}
                      <p className="mt-1 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 text-slate-500 dark:text-slate-400">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
