# CrestSOC — AI-Powered Alert Triage System

A production-ready frontend for automated SOC alert triage, built for Crest Data Systems. Connects to a FastAPI backend to fetch Jira alerts, enrich with VirusTotal threat intelligence, classify with GPT-4o or other AI models, and post results back to Jira.

---

## Phase 2 Features

### Authentication & Security
- **Login Screen** — Secure credential-based access with persistent session (localStorage)
- **Protected Routes** — All pages require authentication; unauthenticated users redirected to `/login`
- **User Identity** — Header displays analyst name, role, and quick logout button

### Alert Triage Intelligence
- **Triage Pipeline Visualizer** — Animated 4-stage flow graph on alert detail screen showing: Alert Retrieval → VT Enrichment → AI Analysis → Summary Posted
- **Expandable Queue Rows** — Click any alert to expand inline detail panel with full IOC, risk profile breakdown, priority score explanation, and action buttons
- **Status Column** — Queue table shows alert triage status: Open / In-Progress / Closed / Error

### Configuration & Integrations  
- **Integration Hub** (`/configuration`)** — Scalable tile-based UI for configuring:
  - **Jira** — Base URL, account email, API token (with connection test)
  - **VirusTotal** — API endpoint and key (v3 API)
  - **OpenAI GPT-4o** — API endpoint and key with Bearer auth test
- **Flexible tile architecture** — Add future integrations by simply passing new field configs (no component changes)

### Dashboard Analytics
- **Security Posture KPIs** — Three bar charts showing:
  - **Alerts by Verdict** — Malicious / Suspicious / Benign breakdown
  - **Alerts by Severity** — High / Medium / Low confidence distribution
  - **Alerts by Priority** — P0 / P1 / P2 / P3 counts with color-coded bars

### Queue Enhancements
- **P0 Critical Auto-Trigger Badge** — Alerts with `auto_triggered: true` show a red "⬡ Auto" badge next to priority
- **Multi-state Status Badging** — Open (slate) / In-Progress (cyan, pulsing) / Closed (emerald) / Error (red)
- **Rich Detail Panel** — Expandable rows show indicator with copy button, full summary, risk breakdown, and contextual actions

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 + TypeScript (strict) |
| Build | Vite 5 |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Server State | TanStack Query v5 |
| Client State | Zustand v4 (persisted: auth session + triage history) |
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

Open [http://localhost:5173](http://localhost:5173) (or the port Vite displays).

### 5. Login

The app requires authentication. Use demo credentials:
- **Email:** `analyst@crestdata.com`
- **Password:** `CrestSOC2026`

(Also available: `admin@crestdata.com` with same password)

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
├── api/                    # API client and endpoint functions
├── components/
│   ├── configuration/      # IntegrationTile (reusable integration config UI)
│   ├── history/           # HistoryTable
│   ├── layout/            # Layout, Sidebar, Header (with logout)
│   ├── queue/             # QueueTable, QueueRow (expandable), PriorityScore
│   ├── results/           # ResultsView, VerdictHero, TriagePipelineVisualizer, cards
│   ├── triage/            # TriageForm, ProgressPipeline, StageIndicator
│   └── ui/                # Button, Card, Badge, Input, Skeleton
├── hooks/                 # useTriage, useQueue, useHistory, useHealthCheck
├── pages/                 # Dashboard (KPI charts), Results, Queue, History, Settings, TriageRun, Configuration, Login
├── store/                 # Zustand: historyStore (triage log), authStore (user session)
├── types/                 # TypeScript interfaces
└── utils/                 # formatters, constants
```

---

## Queue Row Expansion

Click any alert row to expand an inline detail panel showing:
- **Full indicator** (untruncated IOC) with one-click copy
- **Risk breakdown** — Priority score, age in minutes, and plain-English threat description
- **Status & actions** — Current triage state with contextual buttons (Run Triage / Retry / View Results)
- **Auto-trigger badge** — Shows if alert was queued for automatic triage

The expanded panel closes when you click the row again or expand a different alert (only one row open at a time).

---

## Integration Configuration

Go to **Integrations** (`/configuration`) to set up:

1. **Jira** — Enter your Jira base URL, account email, and API token. Click "Test Connection" to verify.
2. **VirusTotal** — Provide API endpoint and key (defaults to `https://www.virustotal.com/api/v3`).
3. **OpenAI** — Add your OpenAI API key and endpoint (defaults to `https://api.openai.com/v1`). The app tests the connection by fetching `/models`.

All credentials are masked on input and stored in `localStorage` under keys like `soc_openai_key`, `soc_jira_token`, etc.

---

## Dashboard KPIs

The dashboard displays three security posture charts:
- **Alerts by Verdict** — Count of benign, suspicious, and malicious classifications
- **Alerts by Severity** — Distribution by AI confidence (high, medium, low)
- **Alerts by Priority** — Breakdown by Jira priority (P0, P1, P2, P3)

Charts are empty until you run your first triage. Data persists in `localStorage` under the history store.

---

## Troubleshooting

### Authentication
**"I'm redirected to login every page load"**
→ Session is not persisting. Check that `localStorage` is enabled and not cleared by your browser settings.

**"Login fails with 'No account found'"**
→ Use the demo email exactly: `analyst@crestdata.com` (case-insensitive after storage key lookup).

**"Logged out after refresh"**
→ Auth session is stored in `localStorage['soc_auth']`. Clearing browser data will log you out.

### Triage & Backend
**"Cannot reach triage server. Is it running?"**
→ Backend is unreachable. Confirm the URL in Settings. Check CORS and firewall.

**"Jira ticket not found."**
→ The issue key is wrong or the backend can't find the ticket. Use format `PROJECT-1234`.

**"Invalid format. Use format like SOC-1234."**
→ Input must match `[A-Z]+-[0-9]+`. Check for typos or spaces.

### Data Persistence
**Blank history after refresh**
→ History lives in `localStorage` under `soc_triage_history`. Won't persist in incognito mode.

**Results page shows "Result Not Found"**
→ Triage ID is not in local history (cleared, or opened from another browser). Re-run the triage.

**Integration credentials not saved**
→ Check that `localStorage` is enabled. Credentials are saved under keys like `soc_openai_key`, `soc_jira_token`, etc.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | FastAPI backend base URL |
| `VITE_JIRA_BASE_URL` | `https://crestdata.atlassian.net` | Jira instance for deep links |

---

Capstone project for **Crest Data Systems** — AI-powered SOC automation reducing triage time from minutes to under 30 seconds.
