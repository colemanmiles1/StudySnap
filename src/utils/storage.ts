/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudySession } from '../types/study';

const SESSIONS_STORAGE_KEY = 'studysnap_sessions_v1';
const CURRENT_SESSION_ID_KEY = 'studysnap_current_session_id';
const DARK_MODE_KEY = 'studysnap_dark_mode';

export function getStoredSessions(): StudySession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse stored sessions:', err);
    return [];
  }
}

export function saveSession(session: StudySession): void {
  try {
    const sessions = getStoredSessions();
    const existingIndex = sessions.findIndex((s) => s.id === session.id);
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session);
    }
    // Limit to 20 recent sessions to prevent exceeding localStorage quota
    const trimmed = sessions.slice(0, 20);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(trimmed));
    localStorage.setItem(CURRENT_SESSION_ID_KEY, session.id);
  } catch (err) {
    console.error('Failed to save session to localStorage:', err);
  }
}

export function updateSessionTitle(id: string, newTitle: string): StudySession[] {
  try {
    const sessions = getStoredSessions();
    const target = sessions.find((s) => s.id === id);
    if (target) {
      target.title = newTitle;
      if (target.summary) {
        target.summary.topicTitle = newTitle;
      }
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    }
    return sessions;
  } catch (err) {
    console.error('Failed to update session title:', err);
    return [];
  }
}

export function deleteSession(id: string): StudySession[] {
  try {
    const sessions = getStoredSessions().filter((s) => s.id !== id);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    if (localStorage.getItem(CURRENT_SESSION_ID_KEY) === id) {
      localStorage.removeItem(CURRENT_SESSION_ID_KEY);
    }
    return sessions;
  } catch (err) {
    console.error('Failed to delete session:', err);
    return [];
  }
}

export function getStoredDarkMode(): boolean {
  try {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored !== null) {
      return stored === 'true';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

export function setStoredDarkMode(isDark: boolean): void {
  try {
    localStorage.setItem(DARK_MODE_KEY, String(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (err) {
    console.error('Failed to save dark mode:', err);
  }
}
