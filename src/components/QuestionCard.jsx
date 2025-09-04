import React from 'react'

export default function QuestionCard({
  q, index, total, locked, selected, onSelect,
}) {
  return (
    <section className="card" aria-labelledby={`q-${index}`}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <div className="label">Category: {q.category || 'General'} • Difficulty: {q.difficulty}</div>
          <h2 id={`q-${index}`} style={{ margin: '.25rem 0 .5rem' }}>
            Question {index + 1} of {total}
          </h2>
        </div>
        <div className="score" aria-live="polite"/>
      </div>
      <p style={{ fontSize: '1.05rem', lineHeight: 1.45 }}>{q.question}</p>

      <ul className="options" role="radiogroup" aria-label={`Options for question ${index + 1}`}>
        {q.options.map((opt, i) => {
          const isSel = selected === opt
          const cls = [
            'option',
            locked && isSel && (opt === q.correct ? 'correct' : 'incorrect'),
            locked ? 'locked' : '',
          ].filter(Boolean).join(' ')
          return (
            <li key={i} className={cls}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '.6rem', width: '100%' }}>
                <input
                  type="radio"
                  name={`q-${index}`}
                  value={opt}
                  checked={isSel}
                  onChange={() => onSelect(opt)}
                  disabled={locked}
                  aria-checked={isSel}
                />
                <span>{opt}</span>
              </label>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
