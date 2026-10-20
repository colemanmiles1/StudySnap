/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface KeyConcept {
  term: string;
  definition: string;
  importance: 'essential' | 'high' | 'medium';
  context?: string;
}

export interface FormulaOrEquation {
  label: string;
  formula: string;
  explanation: string;
}

export interface SimplifiedBreakdown {
  title: string;
  simpleExplanation: string;
  analogy?: string;
}

export interface StudySummary {
  subjectArea: string;
  topicTitle: string;
  executiveSummary: string;
  estimatedStudyTimeMinutes: number;
  keyTakeaways: string[];
  keyConcepts: KeyConcept[];
  formulasAndEquations: FormulaOrEquation[];
  simplifiedBreakdowns: SimplifiedBreakdown[];
  unclearOrCutoffNotes: string[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  hint?: string;
  mastered?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string]; // exactly 4 options
  correctIndex: number; // 0, 1, 2, or 3
  explanation: string;
  hint?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface StudySession {
  id: string;
  createdAt: string;
  title: string;
  subject: string;
  imageUrls: string[]; // previews
  summary: StudySummary;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  quizScores?: {
    lastScore: number;
    totalQuestions: number;
    completedAt: string;
  };
}

export type ActiveTab = 'home' | 'summary' | 'flashcards' | 'quiz' | 'history';
