# CrestSOC — AI-Powered Alert Triage System

A production-ready frontend for automated SOC alert triage, built for Crest Data Systems. Connects to a FastAPI backend to fetch Jira alerts, enrich with VirusTotal threat intelligence, classify with Claude AI, and post results back to Jira.

---

## Features

- **Analyst Trigger UI** — Enter any Jira issue key and run a 4-stage triage pipeline with live progress tracking
- **Auto-Trigger Queue** — Dedicated queue page where P0/Critical alerts are auto-triaged; P1–P3 require manual trigger
- **Prompt Version Indicator** — Every result shows the AI prompt version used (e.g., `TRIAGE_PROMPT_V2.0`)
- **Priority Ranking** — Alerts sorted by 0–100 priority score with heat-gradient visualization
- **Full Results View** — Verdict hero, VirusTotal breakdown, AI reasoning, action checklist, and Markdown summary
- **History** — Persistent log of all triages with filters and CSV export
- **Settings** — Configurable API URL, connection test, and history management

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 + TypeScript (strict) |
| Build | Vite 5 |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Server State | TanStack Query v5 |
| Client State | Zustand v4 (persisted to localStorage) |
| Icons | Lucide React |
| Dates | date-fns |
| Markdown | react-markdown + remark-gfm |
| Toasts | Sonner |

---

## Setup

### 1. Prerequisites

- Node.js 18+
- npm 9+
- The FastAPI backend running (see backend repo)

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_JIRA_BASE_URL=https://yourorg.atlassian.net
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Development Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 with HMR |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run type-check` | Run TypeScript without emitting files |

---

## Connecting to the Backend

The app expects a FastAPI server with:

| Endpoint | Description |
|---|---|
| `POST /triage` | Main triage endpoint — accepts `{ jira_key }` |
| `GET /health` | Health check (used for connection status indicator) |

The API URL defaults to `http://localhost:8000`. Override it:
- Via `.env`: set `VITE_API_URL`
- At runtime: go to **Settings → API URL**, save, and the app picks it up immediately from `localStorage`

### CORS

Ensure the FastAPI app allows requests from the frontend origin. During development on port 3000:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Project Structure

```
src/
├── api/           # API client and endpoint functions
├── components/
│   ├── history/   # HistoryTable
│   ├── layout/    # Layout, Sidebar, Header
│   ├── queue/     # QueueTable, QueueRow, PriorityScore
│   ├── results/   # ResultsView, VerdictHero, cards
│   ├── triage/    # TriageForm, ProgressPipeline, StageIndicator
│   └── ui/        # Button, Card, Badge, Input, Skeleton
├── hooks/         # useTriage, useQueue, useHistory, useHealthCheck
├── pages/         # Dashboard, Results, Queue, History, Settings, TriageRun
├── store/         # Zustand history store (persisted)
├── types/         # TypeScript types
└── utils/         # formatters, constants
```

---

## Troubleshooting

**"Cannot reach triage server. Is it running?"**
→ Backend is unreachable. Confirm the URL in Settings. Check CORS and firewall.

**"Jira ticket not found."**
→ The issue key is wrong or the backend can't find the ticket. Use format `PROJECT-1234`.

**"Invalid format. Use format like SOC-1234."**
→ Input must match `[A-Z]+-[0-9]+`. Check for typos or spaces.

**Blank history after refresh**
→ History lives in `localStorage` under `soc_triage_history`. Won't persist in incognito mode.

**Results page shows "Result Not Found"**
→ Triage ID is not in local history (cleared, or opened from another browser). Re-run the triage.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | FastAPI backend base URL |
| `VITE_JIRA_BASE_URL` | `https://crestdata.atlassian.net` | Jira instance for deep links |

---

Capstone project for **Crest Data Systems** — AI-powered SOC automation reducing triage time from minutes to under 30 seconds.
