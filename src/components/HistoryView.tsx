/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  History,
  BookOpen,
  Layers,
  Award,
  Trash2,
  ArrowRight,
  Clock,
  Plus,
  Folder,
  FolderOpen,
  Sparkles,
  Search,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  ExternalLink,
  Filter,
  CheckCircle2,
  X,
  Edit3,
  Check,
  Maximize2,
  FileText,
} from 'lucide-react';
import { StudySession } from '../types/study';

interface HistoryViewProps {
  sessions: StudySession[];
  onSelectSession: (session: StudySession, targetTab?: 'summary' | 'flashcards' | 'quiz') => void;
  onDeleteSession: (id: string) => void;
  onUpdateTitle?: (id: string, newTitle: string) => void;
  onNewScan: () => void;
}

// Helper to pick an appropriate icon/emoji for a subject
function getSubjectBadge(subject: string) {
  const s = subject.toLowerCase();
  if (s.includes('bio') || s.includes('cell') || s.includes('genet') || s.includes('anat')) {
    return {
      emoji: '🧬',
      color: 'from-emerald-500 to-teal-600',
      textCol: 'text-emerald-700 dark:text-emerald-300',
      bgCol: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    };
  }
  if (s.includes('chem') || s.includes('organ') || s.includes('molecul')) {
    return {
      emoji: '⚗️',
      color: 'from-amber-500 to-orange-600',
      textCol: 'text-amber-700 dark:text-amber-300',
      bgCol: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    };
  }
  if (s.includes('physic') || s.includes('math') || s.includes('calc') || s.includes('algeb')) {
    return {
      emoji: '📐',
      color: 'from-sky-500 to-blue-600',
      textCol: 'text-sky-700 dark:text-sky-300',
      bgCol: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
    };
  }
  if (s.includes('econ') || s.includes('financ') || s.includes('market') || s.includes('busin')) {
    return {
      emoji: '📈',
      color: 'from-indigo-500 to-purple-600',
      textCol: 'text-indigo-700 dark:text-indigo-300',
      bgCol: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
    };
  }
  if (s.includes('hist') || s.includes('polit') || s.includes('phil') || s.includes('law')) {
    return {
      emoji: '🏛️',
      color: 'from-rose-500 to-pink-600',
      textCol: 'text-rose-700 dark:text-rose-300',
      bgCol: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
    };
  }
  if (s.includes('comp') || s.includes('code') || s.includes('data') || s.includes('tech')) {
    return {
      emoji: '💻',
      color: 'from-cyan-500 to-blue-600',
      textCol: 'text-cyan-700 dark:text-cyan-300',
      bgCol: 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800',
    };
  }
  return {
    emoji: '📚',
    color: 'from-indigo-600 to-sky-600',
    textCol: 'text-sky-700 dark:text-sky-300',
    bgCol: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
  };
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  sessions,
  onSelectSession,
  onDeleteSession,
  onUpdateTitle,
  onNewScan,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Editing title state
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState<string>('');

  // Active photo index per session card (enables cycling through all photos directly on each card)
  const [cardPhotoIndices, setCardPhotoIndices] = useState<Record<string, number>>({});

  // Loading indicator when AI is scanning uploaded images to generate a title
  const [scanningTitleIds, setScanningTitleIds] = useState<Record<string, boolean>>({});

  // Multi-Photo Viewer Modal state
  const [photoViewer, setPhotoViewer] = useState<{
    sessionTitle: string;
    photos: string[];
    activeIndex: number;
  } | null>(null);

  // Keyboard navigation for multi-photo modal
  useEffect(() => {
    if (!photoViewer) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPhotoViewer(null);
      } else if (e.key === 'ArrowLeft') {
        setPhotoViewer((prev) =>
          prev
            ? {
                ...prev,
                activeIndex: (prev.activeIndex - 1 + prev.photos.length) % prev.photos.length,
              }
            : null
        );
      } else if (e.key === 'ArrowRight') {
        setPhotoViewer((prev) =>
          prev
            ? {
                ...prev,
                activeIndex: (prev.activeIndex + 1) % prev.photos.length,
              }
            : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photoViewer]);

  // Group sessions by Subject Area
  const groupedBySubject = useMemo(() => {
    const map: Record<string, StudySession[]> = {};
    sessions.forEach((s) => {
      const subj = s.subject || 'General Studies';
      if (!map[subj]) map[subj] = [];
      map[subj].push(s);
    });
    return map;
  }, [sessions]);

  const uniqueSubjects = useMemo(() => Object.keys(groupedBySubject), [groupedBySubject]);

  // Filtered sessions based on search & selected subject
  const filteredSessions = useMemo(() => {
    let result = sessions;
    if (selectedSubject) {
      result = result.filter((s) => s.subject === selectedSubject);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.subject.toLowerCase().includes(q) ||
          s.summary.executiveSummary.toLowerCase().includes(q)
      );
    }
    return result;
  }, [sessions, selectedSubject, searchQuery]);

  // Handler to start editing a note title
  const startEditingTitle = (session: StudySession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setTempTitle(session.title);
  };

  // Handler to save the edited title
  const saveTitleEdit = (sessionId: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (tempTitle.trim() && onUpdateTitle) {
      onUpdateTitle(sessionId, tempTitle.trim());
    }
    setEditingSessionId(null);
  };

  // Handler to cancel editing
  const cancelTitleEdit = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingSessionId(null);
  };

  // Handler for AI scanning the material on uploaded note images to create an accurate title
  const handleAIScanTitle = async (session: StudySession, e: React.MouseEvent) => {
    e.stopPropagation();
    const photos = session.imageUrls || [];
    if (photos.length === 0) return;

    setScanningTitleIds((prev) => ({ ...prev, [session.id]: true }));
    try {
      const response = await fetch('/api/suggest-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: photos.map((url) => ({ base64: url })),
          currentSubject: session.subject,
          currentTitle: session.title,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.title && onUpdateTitle) {
          onUpdateTitle(session.id, data.title);
        }
      }
    } catch (err) {
      console.error('Failed to AI scan title:', err);
    } finally {
      setScanningTitleIds((prev) => ({ ...prev, [session.id]: false }));
    }
  };

  // Handler to combine all flashcards in a subject for unified review
  const handleReviewAllSubjectFlashcards = (subjectName: string) => {
    const subjectSessions = groupedBySubject[subjectName] || [];
    if (subjectSessions.length === 0) return;

    // Concat flashcards and quizzes
    const allFlashcards = subjectSessions.flatMap((s) => s.flashcards);
    const allQuiz = subjectSessions.flatMap((s) => s.quiz);

    const combinedSession: StudySession = {
      ...subjectSessions[0],
      id: `combined-${Date.now()}`,
      title: `All ${subjectName} Coursework (${allFlashcards.length} cards)`,
      subject: subjectName,
      flashcards: allFlashcards,
      quiz: allQuiz,
    };

    onSelectSession(combinedSession, 'flashcards');
  };

  if (sessions.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto">
          <History className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          No Saved Coursework Yet
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Once you submit or scan a photo of your notes, StudySnap automatically organizes it into this History category under its subject, with direct links back to your flashcards and practice quizzes.
        </p>
        <button
          onClick={onNewScan}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Scan Your First Note</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5 pb-20 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Coursework History
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Organized by subject — browse all submitted note photos or jump straight to Flashcards & Quizzes.
            </p>
          </div>

          <button
            onClick={onNewScan}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Scan New Work</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search submitted topics, concepts, or subjects..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-all"
          />
        </div>

        {/* Subject Category Filter Tabs */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <Filter className="w-3 h-3" />
            <span>Filter by Subject:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {/* "All Subjects" pill */}
            <button
              onClick={() => setSelectedSubject(null)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSubject === null
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>All Subjects ({sessions.length})</span>
            </button>

            {/* Individual subject pills */}
            {uniqueSubjects.map((subj) => {
              const badge = getSubjectBadge(subj);
              const count = groupedBySubject[subj]?.length || 0;
              const isSelected = selectedSubject === subj;

              return (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(isSelected ? null : subj)}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : `${badge.bgCol} ${badge.textCol} hover:opacity-90`
                  }`}
                >
                  <span>{badge.emoji}</span>
                  <span>{subj}</span>
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SUBJECT CATEGORY FOLDERS OVERVIEW (Shown when "All Subjects" is active without search) */}
      {!selectedSubject && !searchQuery.trim() && uniqueSubjects.length > 1 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Folder className="w-4 h-4 text-sky-500" />
            <span>Subject Categories ({uniqueSubjects.length})</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {uniqueSubjects.map((subj) => {
              const subjSessions = groupedBySubject[subj] || [];
              const badge = getSubjectBadge(subj);
              const totalCards = subjSessions.reduce((acc, s) => acc + s.flashcards.length, 0);
              const totalQuiz = subjSessions.reduce((acc, s) => acc + s.quiz.length, 0);

              return (
                <div
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className="cursor-pointer group p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 transition-all shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{badge.emoji}</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {subjSessions.length} {subjSessions.length === 1 ? 'submission' : 'submissions'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {subj}
                    </h3>

                    {/* Stats pills */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3 text-sky-500" /> {totalCards} cards
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3 text-indigo-500" /> {totalQuiz} questions
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail gallery preview across all submitted pages */}
                  {(() => {
                    const allSubjPhotos = subjSessions.flatMap((s) => s.imageUrls || []);
                    return (
                      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {allSubjPhotos.slice(0, 4).map((pUrl, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-10 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
                          >
                            <img
                              src={pUrl}
                              alt="Note thumb"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {allSubjPhotos.length > 4 && (
                          <span className="text-[10px] font-bold text-slate-400">
                            +{allSubjPhotos.length - 4}
                          </span>
                        )}
                        <div className="ml-auto text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-0.5">
                          <span>View</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SELECTED SUBJECT HEADER & BREADCRUMB */}
      {selectedSubject && (
        <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-400/30 dark:bg-sky-950/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedSubject(null)}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>← All Subjects</span>
            </button>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <span>{getSubjectBadge(selectedSubject).emoji}</span>
              <span>{selectedSubject}</span>
            </span>
          </div>

          {/* Quick combined review button */}
          <button
            onClick={() => handleReviewAllSubjectFlashcards(selectedSubject)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Review All {selectedSubject} Flashcards</span>
          </button>
        </div>
      )}

      {/* COURSEWORK SUBMISSIONS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {selectedSubject ? `${selectedSubject} Coursework Notes` : 'Submitted Coursework'} (
            {filteredSessions.length})
          </h2>
          <span className="text-xs text-slate-400">
            Click photos to view all pages • Click title or pencil to edit
          </span>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            No coursework matching &quot;{searchQuery}&quot;. Try a different search term.
          </div>
        ) : (
          filteredSessions.map((session) => {
            const badge = getSubjectBadge(session.subject);
            const dateStr = new Date(session.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            const photos = session.imageUrls || [];
            const currentPhotoIdx = cardPhotoIndices[session.id] ?? 0;
            const safeIdx = photos.length > 0 ? (currentPhotoIdx % photos.length) : 0;
            const activePhoto = photos[safeIdx] || photos[0];
            const isEditingTitle = editingSessionId === session.id;
            const isScanningTitle = Boolean(scanningTitleIds[session.id]);

            return (
              <div
                key={session.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-sky-300 dark:hover:border-sky-600 transition-all space-y-4"
              >
                {/* Header row: Photos + Subject badge + Title + Edit Title Button */}
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Photo Container with direct on-card carousel navigation for ALL submitted photos */}
                  <div className="flex flex-col gap-2 shrink-0 w-full sm:w-44">
                    <div
                      onClick={() => {
                        if (photos.length > 0) {
                          setPhotoViewer({
                            sessionTitle: session.title,
                            photos,
                            activeIndex: safeIdx,
                          });
                        }
                      }}
                      className="relative cursor-pointer w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-700 group shadow-xs flex items-center justify-center select-none"
                      title="Click to view full screen"
                    >
                      {activePhoto ? (
                        <img
                          src={activePhoto}
                          alt={`${session.title} - Page ${safeIdx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                          <ImageIcon className="w-6 h-6 mb-1" />
                          <span>Note Photo</span>
                        </div>
                      )}

                      {/* On-card Previous photo button */}
                      {photos.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCardPhotoIndices((prev) => ({
                              ...prev,
                              [session.id]: (safeIdx - 1 + photos.length) % photos.length,
                            }));
                          }}
                          className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/75 hover:bg-black text-white border border-white/20 shadow-md transition-all active:scale-90"
                          title="Previous photo page"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      )}

                      {/* On-card Next photo button */}
                      {photos.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCardPhotoIndices((prev) => ({
                              ...prev,
                              [session.id]: (safeIdx + 1) % photos.length,
                            }));
                          }}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/75 hover:bg-black text-white border border-white/20 shadow-md transition-all active:scale-90"
                          title="Next photo page"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}

                      {/* Page indicator pill at bottom-left */}
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                        <ImageIcon className="w-3 h-3 text-sky-400" />
                        <span>{photos.length > 1 ? `Page ${safeIdx + 1} of ${photos.length}` : '1 page'}</span>
                      </span>

                      {/* Expand icon at top-right */}
                      <span
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 hover:bg-black/90 text-white/90 hover:text-white transition-colors"
                        title="View all photos full size"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    {/* All photos thumbnail gallery strip right below the main photo */}
                    {photos.length > 1 && (
                      <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-0.5 no-scrollbar">
                        {photos.map((pUrl, pIdx) => {
                          const isSelected = pIdx === safeIdx;
                          return (
                            <button
                              key={pIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardPhotoIndices((prev) => ({ ...prev, [session.id]: pIdx }));
                              }}
                              className={`relative w-9 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                                isSelected
                                  ? 'border-sky-500 ring-2 ring-sky-400/50 scale-105 opacity-100'
                                  : 'border-slate-300 dark:border-slate-700 opacity-60 hover:opacity-100'
                              }`}
                              title={`Switch to page ${pIdx + 1}`}
                            >
                              <img src={pUrl} alt={`p${pIdx + 1}`} className="w-full h-full object-cover" />
                              <span className="absolute bottom-0 right-0 px-1 text-[8px] font-black bg-black/80 text-white rounded-tl">
                                {pIdx + 1}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Direct button to open multi-photo modal */}
                    {photos.length > 1 && (
                      <button
                        onClick={() =>
                          setPhotoViewer({
                            sessionTitle: session.title,
                            photos,
                            activeIndex: safeIdx,
                          })
                        }
                        className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center justify-center gap-1 self-center"
                      >
                        <span>Browse all {photos.length} photos</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Info & Title */}
                  <div className="flex-1 space-y-2.5 min-w-0 w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedSubject(session.subject)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.bgCol} ${badge.textCol} hover:opacity-80 transition-opacity`}
                      >
                        {badge.emoji} {session.subject}
                      </button>

                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {dateStr}
                      </span>

                      {/* Photo count indicator */}
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                        • <ImageIcon className="w-3 h-3 text-sky-500" />
                        <span>{photos.length} {photos.length === 1 ? 'scanned photo' : 'scanned photos'}</span>
                      </span>
                    </div>

                    {/* Title with Edit Button & AI Scan Title Button */}
                    {isEditingTitle ? (
                      <form
                        onSubmit={(e) => saveTitleEdit(session.id, e)}
                        className="flex flex-wrap items-center gap-2 pt-1"
                      >
                        <input
                          type="text"
                          value={tempTitle}
                          onChange={(e) => setTempTitle(e.target.value)}
                          autoFocus
                          className="flex-1 min-w-[200px] px-3 py-1.5 rounded-xl border-2 border-sky-400 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                        />
                        <button
                          type="submit"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
                          title="Save title"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                        <button
                          type="button"
                          onClick={cancelTitleEdit}
                          className="p-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-colors"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </form>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h3
                          onClick={() => onSelectSession(session, 'summary')}
                          className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer transition-colors leading-snug flex-1"
                        >
                          {session.title}
                        </h3>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Prominent Edit Title Button */}
                          <button
                            onClick={(e) => startEditingTitle(session, e)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs hover:border-sky-400"
                            title="Edit the title of these scanned notes"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                            <span>Edit Title</span>
                          </button>

                          {/* AI Scan Title Button */}
                          {photos.length > 0 && (
                            <button
                              onClick={(e) => handleAIScanTitle(session, e)}
                              disabled={isScanningTitle}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-bold transition-all shadow-2xs disabled:opacity-50"
                              title="Have AI scan the material on the uploaded images and create a title"
                            >
                              <Sparkles className={`w-3.5 h-3.5 text-amber-500 ${isScanningTitle ? 'animate-spin' : ''}`} />
                              <span>{isScanningTitle ? 'Scanning...' : 'AI Scan Title'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {session.summary.executiveSummary}
                    </p>

                    {/* Key concept chips */}
                    {session.summary.keyConcepts && session.summary.keyConcepts.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        {session.summary.keyConcepts.slice(0, 3).map((c, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                          >
                            #{c.term}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct Action Links required by prompt: Go to Flashcards or Quiz for this subject! */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* DIRECT LINK: FLASHCARDS */}
                    <button
                      onClick={() => onSelectSession(session, 'flashcards')}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/80 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-bold transition-all active:scale-95"
                      title="Open interactive flashcards for this coursework"
                    >
                      <Layers className="w-3.5 h-3.5 text-sky-500" />
                      <span>Flashcards ({session.flashcards.length})</span>
                    </button>

                    {/* DIRECT LINK: PRACTICE QUIZ */}
                    <button
                      onClick={() => onSelectSession(session, 'quiz')}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all active:scale-95"
                      title="Take practice quiz for this coursework"
                    >
                      <Award className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Take Quiz ({session.quiz.length})</span>
                    </button>

                    {/* DIRECT LINK: SUMMARY */}
                    <button
                      onClick={() => onSelectSession(session, 'summary')}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                      title="View full summary and takeaways"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Summary</span>
                    </button>

                    {/* BROWSE ALL PHOTOS BUTTON */}
                    {photos.length > 0 && (
                      <button
                        onClick={() =>
                          setPhotoViewer({
                            sessionTitle: session.title,
                            photos,
                            activeIndex: safeIdx,
                          })
                        }
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                        title="Browse all photos submitted for these notes"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-sky-500" />
                        <span>Photos ({photos.length})</span>
                      </button>
                    )}
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteSession(session.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-auto"
                    title="Delete this submission"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FULL MULTI-PHOTO GALLERY VIEWER MODAL */}
      {photoViewer && (
        <div
          onClick={() => setPhotoViewer(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[92vh] bg-slate-950 rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between"
          >
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between text-white p-3 sm:p-4 bg-slate-900/80 border-b border-white/10">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <ImageIcon className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold truncate">
                  {photoViewer.sessionTitle}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 shrink-0">
                  Page {photoViewer.activeIndex + 1} of {photoViewer.photos.length}
                </span>
              </div>

              <button
                onClick={() => setPhotoViewer(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Close viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Active Photo Viewport with Left/Right Arrows */}
            <div className="relative flex-1 min-h-[50vh] max-h-[68vh] flex items-center justify-center p-2 bg-black">
              {/* Previous Photo Arrow */}
              {photoViewer.photos.length > 1 && (
                <button
                  onClick={() =>
                    setPhotoViewer((prev) =>
                      prev
                        ? {
                            ...prev,
                            activeIndex:
                              (prev.activeIndex - 1 + prev.photos.length) % prev.photos.length,
                          }
                        : null
                    )
                  }
                  className="absolute left-3 z-10 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-lg"
                  title="Previous photo (Left arrow)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* The Active Photo */}
              <img
                src={photoViewer.photos[photoViewer.activeIndex]}
                alt={`Photo page ${photoViewer.activeIndex + 1}`}
                className="max-h-[64vh] max-w-full object-contain rounded-xl select-none"
              />

              {/* Next Photo Arrow */}
              {photoViewer.photos.length > 1 && (
                <button
                  onClick={() =>
                    setPhotoViewer((prev) =>
                      prev
                        ? {
                            ...prev,
                            activeIndex: (prev.activeIndex + 1) % prev.photos.length,
                          }
                        : null
                    )
                  }
                  className="absolute right-3 z-10 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-lg"
                  title="Next photo (Right arrow)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom Gallery Thumbnail Navigation Strip */}
            {photoViewer.photos.length > 1 && (
              <div className="p-3 bg-slate-900/90 border-t border-white/10 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar">
                {photoViewer.photos.map((url, idx) => {
                  const isActive = idx === photoViewer.activeIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() =>
                        setPhotoViewer((prev) => (prev ? { ...prev, activeIndex: idx } : null))
                      }
                      className={`relative w-14 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        isActive
                          ? 'border-sky-400 ring-2 ring-sky-400/40 scale-105'
                          : 'border-white/20 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Thumb ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 px-1 text-[9px] font-bold bg-black/80 text-white rounded-tl">
                        {idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
