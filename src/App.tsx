/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { CameraScanner } from './components/CameraScanner';
import { SummaryView } from './components/SummaryView';
import { FlashcardsView } from './components/FlashcardsView';
import { QuizView } from './components/QuizView';
import { HistoryView } from './components/HistoryView';
import { AnalyzingOverlay } from './components/AnalyzingOverlay';
import { SimplifyModal } from './components/SimplifyModal';
import { ActiveTab, StudySession, Flashcard } from './types/study';
import {
  getStoredSessions,
  saveSession,
  deleteSession as removeStoredSession,
  updateSessionTitle,
  getStoredDarkMode,
  setStoredDarkMode,
} from './utils/storage';
import { AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRegeneratingQuiz, setIsRegeneratingQuiz] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<{ message: string; subject: string } | null>(null);

  // Dark mode
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Simplify Concept Modal
  const [simplifyModal, setSimplifyModal] = useState<{
    isOpen: boolean;
    term: string;
    context?: string;
  }>({
    isOpen: false,
    term: '',
    context: '',
  });

  // Initialize stored state
  useEffect(() => {
    const isDark = getStoredDarkMode();
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const saved = getStoredSessions();
    setSessions(saved);
    if (saved.length > 0) {
      setCurrentSession(saved[0]);
    }
  }, []);

  const handleToggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    setStoredDarkMode(next);
  };

  // Main AI Analysis
  const handleAnalyzeNotes = async (
    images: Array<{ base64: string; mimeType: string; sampleId?: string }>,
    sampleId?: string
  ) => {
    setIsAnalyzing(true);
    setErrorBanner(null);

    try {
      const response = await fetch('/api/analyze-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images, sampleId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Server responded with status ${response.status}. Please check image quality.`
        );
      }

      const data = await response.json();

      const newSession: StudySession = {
        id: `session-${Date.now()}`,
        createdAt: new Date().toISOString(),
        title: data.title || 'Study Session',
        subject: data.subject || 'General Studies',
        imageUrls: images.map((img) => img.base64),
        summary: data.summary,
        flashcards: data.flashcards || [],
        quiz: data.quiz || [],
      };

      saveSession(newSession);
      setCurrentSession(newSession);
      setSessions(getStoredSessions());
      setSuccessToast({
        message: `Photo submitted and saved to History under "${newSession.subject}"!`,
        subject: newSession.subject,
      });
      setActiveTab('summary');
    } catch (err: any) {
      console.error('Analysis failed:', err);
      let errMsg = err.message || '';
      if (
        errMsg.toLowerCase().includes('load failed') ||
        errMsg.toLowerCase().includes('failed to fetch') ||
        errMsg.toLowerCase().includes('networkerror')
      ) {
        errMsg = 'Network interrupted or photo upload timed out. Please check your connection and tap Generate again.';
      }
      setErrorBanner(errMsg || 'Failed to analyze note images. Please verify your connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Regenerate Quiz
  const handleRegenerateQuiz = async () => {
    if (!currentSession) return;
    setIsRegeneratingQuiz(true);
    setErrorBanner(null);

    try {
      const response = await fetch('/api/regenerate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle: currentSession.title,
          subjectArea: currentSession.subject,
          executiveSummary: currentSession.summary.executiveSummary,
          keyConcepts: currentSession.summary.keyConcepts,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate new quiz questions.');
      }

      const data = await response.json();
      if (!data.quiz || data.quiz.length === 0) {
        throw new Error('No new quiz questions returned.');
      }

      const updatedSession: StudySession = {
        ...currentSession,
        quiz: data.quiz,
      };

      saveSession(updatedSession);
      setCurrentSession(updatedSession);
      setSessions(getStoredSessions());
    } catch (err: any) {
      console.error('Quiz regen failed:', err);
      setErrorBanner(err.message || 'Failed to regenerate quiz.');
    } finally {
      setIsRegeneratingQuiz(false);
    }
  };

  const handleUpdateFlashcards = (updated: Flashcard[]) => {
    if (!currentSession) return;
    const updatedSession = { ...currentSession, flashcards: updated };
    saveSession(updatedSession);
    setCurrentSession(updatedSession);
  };

  const handleSaveQuizScore = (score: number, total: number) => {
    if (!currentSession) return;
    const updatedSession: StudySession = {
      ...currentSession,
      quizScores: {
        lastScore: score,
        totalQuestions: total,
        completedAt: new Date().toISOString(),
      },
    };
    saveSession(updatedSession);
    setCurrentSession(updatedSession);
    setSessions(getStoredSessions());
  };

  const handleDeleteSession = (id: string) => {
    const updated = removeStoredSession(id);
    setSessions(updated);
    if (currentSession?.id === id) {
      setCurrentSession(updated[0] || null);
      if (updated.length === 0) {
        setActiveTab('home');
      }
    }
  };

  const handleUpdateSessionTitle = (id: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    const updated = updateSessionTitle(id, trimmed);
    setSessions(updated);
    if (currentSession?.id === id) {
      setCurrentSession({
        ...currentSession,
        title: trimmed,
        summary: {
          ...currentSession.summary,
          topicTitle: trimmed,
        },
      });
    }
    setSuccessToast({
      message: `Note title updated to "${trimmed}"!`,
      subject: currentSession?.subject || 'Coursework',
    });
  };

  const handleSelectSession = (
    session: StudySession,
    targetTab: 'summary' | 'flashcards' | 'quiz' = 'summary'
  ) => {
    setCurrentSession(session);
    setActiveTab(targetTab);
  };

  const handleOpenExplainModal = (term: string, context?: string) => {
    setSimplifyModal({
      isOpen: true,
      term,
      context,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        activeSessionTitle={currentSession?.title}
        onNewScanClick={() => setActiveTab('home')}
      />

      {/* Success Toast Banner */}
      {successToast && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between gap-3 shadow-md animate-fadeIn">
          <div className="max-w-4xl mx-auto flex items-center justify-between w-full">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>{successToast.message}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSuccessToast(null);
                  setActiveTab('history');
                }}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold transition-colors"
              >
                View in History
              </button>
              <button
                onClick={() => setSuccessToast(null)}
                className="p-1 rounded-md hover:bg-white/15 text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert Banner */}
      {errorBanner && (
        <div className="bg-rose-500 text-white px-4 py-3 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-md animate-fadeIn">
          <div className="max-w-4xl mx-auto flex items-center gap-2 flex-1">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorBanner}</span>
          </div>
          <button
            onClick={() => setErrorBanner(null)}
            className="px-2 py-1 rounded-md bg-white/20 hover:bg-white/30 text-xs font-bold transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        {/* TAB 1: HOME (Scanner & Photo Upload) */}
        {activeTab === 'home' && (
          <CameraScanner onAnalyze={handleAnalyzeNotes} isAnalyzing={isAnalyzing} />
        )}

        {/* TAB 2: SUMMARY (Notes & Takeaways) */}
        {activeTab === 'summary' && currentSession && (
          <SummaryView
            summary={currentSession.summary}
            imageUrls={currentSession.imageUrls}
            onExplainConcept={handleOpenExplainModal}
            onGoToFlashcards={() => setActiveTab('flashcards')}
            onGoToQuiz={() => setActiveTab('quiz')}
            onUpdateTitle={(newTitle) => handleUpdateSessionTitle(currentSession.id, newTitle)}
          />
        )}

        {/* TAB 3: FLASHCARDS (3D Flip Deck) */}
        {activeTab === 'flashcards' && currentSession && (
          <FlashcardsView
            initialFlashcards={currentSession.flashcards}
            onExplainConcept={handleOpenExplainModal}
            onUpdateFlashcards={handleUpdateFlashcards}
            onGoToQuiz={() => setActiveTab('quiz')}
          />
        )}

        {/* TAB 4: PRACTICE QUIZ (Interactive multiple choice) */}
        {activeTab === 'quiz' && currentSession && (
          <QuizView
            initialQuiz={currentSession.quiz}
            summary={currentSession.summary}
            onSaveScore={handleSaveQuizScore}
            onRegenerateQuiz={handleRegenerateQuiz}
            isRegenerating={isRegeneratingQuiz}
          />
        )}

        {/* TAB 5: HISTORY (Saved Sessions) */}
        {activeTab === 'history' && (
          <HistoryView
            sessions={sessions}
            onSelectSession={handleSelectSession}
            onDeleteSession={handleDeleteSession}
            onUpdateTitle={handleUpdateSessionTitle}
            onNewScan={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* AI Analyzing Loading Screen */}
      {isAnalyzing && <AnalyzingOverlay />}

      {/* "Explain This Simply" ELI5 Modal */}
      <SimplifyModal
        isOpen={simplifyModal.isOpen}
        onClose={() => setSimplifyModal((prev) => ({ ...prev, isOpen: false }))}
        initialTerm={simplifyModal.term}
        initialContext={simplifyModal.context}
        subject={currentSession?.subject}
      />

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setErrorBanner(null);
          setActiveTab(tab);
        }}
        hasActiveSession={Boolean(currentSession)}
        flashcardCount={currentSession?.flashcards.length || 0}
        quizCount={currentSession?.quiz.length || 0}
      />
    </div>
  );
}
