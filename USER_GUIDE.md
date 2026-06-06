# Ikonex Academy — Student Management System
## User Guide & Technical Documentation

---

## Overview

The Ikonex Academy SMS is a full-stack web application built with **Next.js 15**, **TypeScript**, **libSQL (SQLite/Turso)**, and **Tailwind CSS**. It supports full student lifecycle management from registration through results and PDF report generation.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React, TypeScript |
| Backend | Next.js API Routes (Node.js) |
| Database | libSQL (SQLite locally, Turso in production) |
| PDF Generation | jsPDF + jsPDF-AutoTable |
| Styling | Tailwind CSS + custom CSS variables |
| Deployment | Vercel / Railway / Any Node.js host |

---

## Local Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd ikonex-sms

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env — for local dev, default SQLite is fine

# 4. Run development server
npm run dev
# Visit http://localhost:3000
```

The database is auto-initialised on first visit with default grading scales.

---

## Production Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```
Create ampy db in torso
Get DATABASE URL and create token 
Set environment variable `DATABASE_URL` in Vercel dashboard. 

For persistent production data, use **Turso** (libSQL cloud):
```
DATABASE_URL=""
TORSO_AUTH_TOKEN""
```

### Railway / Render
1. Connect your GitHub repo
2. Set `DATABASE_URL` environment variable
3. Build command: `npm run build`
4. Start command: `npm start`

### PostgreSQL Migration
To switch to PostgreSQL, update `lib/db.ts` to use `@vercel/postgres` or `pg` driver and adjust SQL syntax (replace `datetime('now')` with `NOW()`).

---

## System Usage

### 1. Class Streams
- Navigate to **Class Streams** → Create streams (e.g., Form 1A, Form 2B)
- Assign subjects to each stream
- View enrolled students per stream

### 2. Students
- **Register**: Students → Register Student
- Fill admission number, name, gender, guardian info, assign to stream
- **Edit/Delete**: Via the students table actions
- **View**: Click any student to see their profile and scores

### 3. Subjects
- Navigate to **Subjects** → Add subjects with name + code
- Assign subjects to streams from the Stream Detail page

### 4. Assessment Scores
- Navigate to **Assessments**
- Select stream, subject, term, and year
- Enter Exam scores (max 80) and CAT scores (max 20)
- Click **Save All Scores** — system prevents duplicates

### 5. Results & Reports
- Navigate to **Results**
- Select stream, term, year → click **Load Results**
- **Class View**: Full ranking table with all subjects
- **Individual View**: Per-student detailed report card
- **Download Class PDF**: Full class performance report
- **Download Report Card PDF**: Individual student report card

---

## Grading Scale (KCSE)

| Grade | Min | Max | Points |
|---|---|---|---|
| A | 75 | 100 | 12 |
| A- | 70 | 74 | 11 |
| B+ | 65 | 69 | 10 |
| B | 60 | 64 | 9 |
| B- | 55 | 59 | 8 |
| C+ | 50 | 54 | 7 |
| C | 45 | 49 | 6 |
| C- | 40 | 44 | 5 |
| D+ | 35 | 39 | 4 |
| D | 30 | 34 | 3 |
| D- | 25 | 29 | 2 |
| E | 0 | 24 | 1 |

---

## Architecture

```
ikonex-sms/
├── app/
│   ├── api/              # REST API routes
│   │   ├── init/         # DB initialisation
│   │   ├── streams/      # Class stream CRUD
│   │   ├── students/     # Student CRUD
│   │   ├── subjects/     # Subject CRUD
│   │   ├── scores/       # Score entry & retrieval
│   │   ├── results/      # Results processing & ranking
│   │   └── grading/      # Grading scale
│   ├── streams/          # Stream pages
│   ├── students/         # Student pages
│   ├── subjects/         # Subject pages
│   ├── scores/           # Assessment entry
│   └── results/          # Results & reports
├── components/           # Shared UI components
├── lib/
│   ├── db.ts             # Database client & schema init
│   └── utils.ts          # Grade calculation utilities
└── USER_GUIDE.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/streams | List all streams |
| POST | /api/streams | Create stream |
| GET/PUT/DELETE | /api/streams/:id | Stream detail/edit/delete |
| POST/DELETE | /api/streams/:id/subjects | Assign/remove subject |
| GET | /api/students | List students (optional ?streamId=) |
| POST | /api/students | Register student |
| GET/PUT/DELETE | /api/students/:id | Student detail/edit/delete |
| GET | /api/subjects | List subjects |
| POST | /api/subjects | Create subject |
| PUT/DELETE | /api/subjects/:id | Edit/delete subject |
| GET | /api/scores | Get scores (by student/stream+subject) |
| POST | /api/scores | Record score |
| PUT | /api/scores | Update score |
| GET | /api/results | Processed results with ranking |

---

*Built for Ikonex Academy · Ikonex Systems Internship Assessment*
