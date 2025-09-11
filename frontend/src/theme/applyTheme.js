// src/theme/applyTheme.js
const STORAGE_KEY = 'ai-edu-theme';

export function getStoredTheme() {
  try {
    const t = localStorage.getItem(STORAGE_KEY);
    return t === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function applyTheme(theme) {
  const t = theme === 'dark' ? 'dark' : 'light';
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', t === 'dark');
  }
  try { localStorage.setItem(STORAGE_KEY, t); } catch {}
  return t;
}

// Call as early as possible (before first render)
export function initTheme() {
  const t = getStoredTheme();
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', t === 'dark');
  }
  return t;
}

