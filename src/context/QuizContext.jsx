import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadQuestions } from '../utils/api'
import { getHighScores, saveHighScore, loadSession, saveSession, clearSession } from '../utils/storage'

const QuizContext = createContext(null)
export const useQuiz = () => useContext(QuizContext)

export function QuizProvider({ children }) {
  const [status, setStatus] = useState('idle') // idle|loading|ready|error|finished
  const [error, setError] = useState('')
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([]) // {selected, correct, isCorrect}
  const [score, setScore] = useState(0)
  const [difficulty, setDifficulty] = useState('easy')
  const [amount, setAmount] = useState(10)
  const [timer, setTimer] = useState(30)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    const s = loadSession()
    if (s) {
      setStatus(s.status)
      setQuestions(s.questions || [])
      setCurrent(s.current || 0)
      setAnswers(s.answers || [])
      setScore(s.score || 0)
      setDifficulty(s.difficulty || 'easy')
      setAmount(s.amount || 10)
      setTimer(s.timer ?? 30)
      setLocked(s.locked || false)
    }
  }, [])

  useEffect(() => {
    saveSession({ status, error, questions, current, answers, score, difficulty, amount, timer, locked })
  }, [status, error, questions, current, answers, score, difficulty, amount, timer, locked])

  const start = async (opts = {}) => {
    try {
      setStatus('loading')
      setError('')
      const dif = opts.difficulty || difficulty
      const amt = opts.amount || amount
      const qs = await loadQuestions({ difficulty: dif, amount: amt })
      if (!qs || qs.length === 0) throw new Error('No questions received')
      setQuestions(qs)
      setCurrent(0)
      setAnswers(Array(qs.length).fill(null))
      setScore(0)
      setDifficulty(dif)
      setAmount(amt)
      setTimer(30)
      setLocked(false)
      setStatus('ready')
    } catch (e) {
      setError(e.message || 'Failed to load questions')
      setStatus('error')
    }
  }

  const select = (option) => {
    if (locked || status !== 'ready') return
    const q = questions[current]
    const isCorrect = option === q.correct
    const updated = { selected: option, correct: q.correct, isCorrect }

    const nextAnswers = [...answers]
    nextAnswers[current] = updated
    setAnswers(nextAnswers)
    setLocked(true)
    setScore((s) => s + (isCorrect ? 1 : 0))
  }

  const next = () => {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1)
      setTimer(30)
      setLocked(false)
    } else {
      finish()
    }
  }

  const skip = () => {
    if (locked) return next()
    const q = questions[current]
    const nextAnswers = [...answers]
    nextAnswers[current] = { selected: null, correct: q.correct, isCorrect: false }
    setAnswers(nextAnswers)
    setLocked(true)
    next()
  }

  const finish = () => {
    setStatus('finished')
    saveHighScore({
      date: new Date().toISOString(),
      score,
      total: questions.length,
      difficulty,
    })
    clearSession()
  }

  const restart = () => {
    setStatus('idle')
    setError('')
    setQuestions([])
    setCurrent(0)
    setAnswers([])
    setScore(0)
    setTimer(30)
    setLocked(false)
  }

  useEffect(() => {
    if (status !== 'ready') return
    if (locked) return
    if (timer <= 0) {
      const q = questions[current]
      const nextAnswers = [...answers]
      nextAnswers[current] = { selected: null, correct: q.correct, isCorrect: false }
      setAnswers(nextAnswers)
      setLocked(true)
      const t = setTimeout(next, 600)
      return () => clearTimeout(t)
    }
    const id = setTimeout(() => setTimer((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timer, status, locked, current, questions, answers])

  const value = useMemo(() => ({
    status, error, questions, current, answers, score, difficulty, amount, timer, locked,
    start, select, next, skip, finish, restart,
    highs: getHighScores(),
  }), [status, error, questions, current, answers, score, difficulty, amount, timer, locked])

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}
