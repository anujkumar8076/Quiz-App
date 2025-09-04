# Quiz App 🎯

A clean, user-friendly quiz application built with **React**, **Vite**, and **React Router**.  
The app fetches questions from [Open Trivia DB](https://opentdb.com/api_config.php) (with a local fallback), supports scoring, progress tracking, result summary, restart option, and bonus features like timer, animations, and persistent high scores.

---

## 🚀 Features
- Clean, responsive UI (works on desktop and mobile)
- 5–10 multiple-choice questions (from API or local JSON fallback)
- One question at a time with four options
- Progress indicator (e.g., “Question 3 of 10”)
- Score tracking and final results
- Results page with correct/incorrect answers and restart option
- Timer per question (30 seconds by default)
- Persistent high scores via `localStorage`
- Animations & accessibility support
- React Router with `/quiz` and `/results` routes
- 

## 🛠️ Installation & Setup

### 1. Clone or download
```bash
git clone https://github.com/your-username/quiz-app.git
cd quiz-app


2. Install dependencies
npm install

3. Start the dev server
npm run dev


⚡ Notes

Make sure you’re using Node.js v18+

If you see an error about @vitejs/plugin-react being ESM-only:

Rename vite.config.js → vite.config.mjs
OR

Add "type": "module" in package.json

No internet? The app will fall back to public/questions.json.

📜 Scripts

npm run dev → Start development server

npm run build → Build for production

npm run preview → Preview production build locally

🌟 Bonus Ideas

Add difficulty level selector (easy/medium/hard)

Add leaderboards with persistent high scores

Add sound effects for correct/incorrect answers

Deploy to Vercel, Netlify, or GitHub Pages
