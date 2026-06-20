# Student Academic Calculator 🎓

A modern, responsive academic calculator built for engineering students — featuring a beautiful glassmorphism UI, dark mode, and smooth animations.

**Live Tools:**
- 📅 **Attendance Calculator** — Know exactly how many classes you can skip or need to attend
- 🎯 **CGPA Target Calculator** — Find the average SGPA needed to hit your graduation CGPA goal

---

## ✨ Features

- ⚡ Next.js 14 App Router + TypeScript
- 🎨 Glassmorphism design with dark/light mode
- 🔐 Google Authentication (simulated demo + real OAuth ready)
- 📱 Fully responsive mobile-first layout
- 🌊 Smooth animations with Framer Motion + CSS
- 📋 Copy & Share results
- 📊 Animated progress bars & SGPA dial
- 🦄 Built for Digital Heroes

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

> The app works fully in **demo mode** without any environment variables. To enable real Google Sign-In, follow the instructions in `.env.local.example`.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles, CSS variables, glassmorphism utilities
│   ├── layout.tsx           # Root layout with metadata and AuthProvider
│   └── page.tsx             # Main page — hero + both calculators
├── components/
│   ├── Header.tsx           # Sticky header with dark mode toggle & auth
│   ├── HeroSection.tsx      # Landing hero with animated orbs
│   ├── AttendanceCalculator.tsx   # Section 1: Attendance tool
│   ├── CgpaCalculator.tsx   # Section 2: CGPA target tool
│   ├── GoogleAuthModal.tsx  # Simulated Google account picker modal
│   ├── DigitalHeroesButton.tsx    # Animated link button
│   └── Footer.tsx           # Footer with links and credits
├── context/
│   └── AuthContext.tsx      # Auth state, session persistence, simulated accounts
└── hooks/
    └── useClipboard.ts      # Copy to clipboard & share hooks
```

---

## 🌐 Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
npm install -g vercel
vercel
```

Follow the prompts. Your app will be live in ~60 seconds.

### Option B — GitHub + Vercel Dashboard

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Student Academic Calculator"
   git remote add origin https://github.com/pawank1911/student-academic-calculator.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your GitHub repo

3. Click **Deploy** — Vercel auto-detects Next.js, no config needed

4. *(Optional)* Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in Vercel → Project Settings → Environment Variables for real Google Auth

---

## 🔐 Google Authentication

The app ships with a **beautiful simulated Google account picker** that works out of the box — no API keys needed for local dev or demo deployments.

To enable **real Google OAuth** on production:
1. Create a project at [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the **Google Identity** API
3. Create an **OAuth 2.0 Client ID** (Web Application)
4. Add your Vercel domain to Authorized JavaScript Origins
5. Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id` in Vercel Environment Variables

---

## 🧮 Calculator Logic

### Attendance Calculator

```
attended = round(currentPercentage / 100 × totalClasses)

If current ≥ target:
  canSkip = floor(attended × 100 / target − totalClasses)

If current < target:
  needAttend = ceil((target × total − 100 × attended) / (100 − target))
```

### CGPA Target Calculator

```
remainingCredits = totalCredits − creditsCompleted

requiredSGPA = (targetCGPA × totalCredits − currentCGPA × creditsCompleted)
               ÷ remainingCredits

If requiredSGPA > 10 → "Mathematically impossible"
```

---

## 👨‍💻 Author

**Pawan Saw**
- GitHub: [github.com/pawank1911](https://github.com/pawank1911)
- Email: your-email@example.com


 
