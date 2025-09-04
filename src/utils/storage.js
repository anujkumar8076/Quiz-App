const HS_KEY = 'quiz_high_scores_v1'
const SESSION_KEY = 'quiz_session_v1'

export function getHighScores() {
  const raw = localStorage.getItem(HS_KEY)
  const arr = raw ? JSON.parse(raw) : []
  return arr
    .map((r) => ({ ...r, pct: r.total ? r.score / r.total : 0 }))
    .sort((a, b) => b.pct - a.pct || new Date(b.date) - new Date(a.date))
    .slice(0, 10)
}

export function saveHighScore(entry) {
  const arr = getHighScores()
  arr.push(entry)
  localStorage.setItem(HS_KEY, JSON.stringify(arr))
}

export function saveSession(state) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(state))
}

export function loadSession() {
  const raw = sessionStorage.getItem(SESSION_KEY)
  try { return raw ? JSON.parse(raw) : null } catch { return null }
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY)
}
