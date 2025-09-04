const decodeHTML = (str) => {
  const txt = document.createElement('textarea')
  txt.innerHTML = str
  return txt.value
}

const shuffle = (arr) => arr.map(v => [Math.random(), v]).sort((a,b)=>a[0]-b[0]).map(v=>v[1])

export async function loadQuestions({ difficulty = 'easy', amount = 10 } = {}) {
  const amt = Math.max(5, Math.min(10, amount))
  const url = `https://opentdb.com/api.php?amount=${amt}&type=multiple&difficulty=${encodeURIComponent(difficulty)}`

  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) throw new Error('Network error')
    const data = await res.json()
    if (!data || !data.results || data.results.length === 0) throw new Error('Empty API data')

    const normalized = data.results.map((r) => {
      const correct = decodeHTML(r.correct_answer)
      const incorrect = r.incorrect_answers.map(decodeHTML)
      const options = shuffle([correct, ...incorrect]).slice(0,4)
      return {
        category: decodeHTML(r.category || ''),
        difficulty: r.difficulty || difficulty,
        question: decodeHTML(r.question),
        correct,
        options,
      }
    })
    return normalized
  } catch (e) {
    console.warn('API failed, falling back to local questions.json', e)
    const res = await fetch('/questions.json')
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) throw new Error('Local data missing')
    return data.slice(0, amt).map((q) => ({
      category: q.category || 'General',
      difficulty: q.difficulty || difficulty,
      question: q.question,
      correct: q.correct,
      options: shuffle([q.correct, ...q.incorrect]).slice(0,4),
    }))
  }
}
