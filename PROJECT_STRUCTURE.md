# CrestUI Project Structure & File Guide

Complete navigation map of all files and their purposes.

---

## Root Level Files

```
CrestUI/
├── README.md                 # Main project documentation (features, setup, troubleshooting)
├── PROJECT_STRUCTURE.md      # THIS FILE - detailed file navigation guide
├── package.json              # Node dependencies (React, Vite, Tailwind, Zustand, etc.)
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build configuration
├── tailwind.config.js        # Tailwind CSS theme configuration
├── postcss.config.js         # PostCSS + autoprefixer config
├── index.html                # HTML entry point (loads src/main.tsx)
└── .gitignore                # Git ignore rules
```

---

## Source Directory (`src/`)

### Entry Points

```
src/
├── main.tsx                  # Vite entry point - renders React app to DOM
├── App.tsx                   # Root component with BrowserRouter + QueryClient setup
│                             # ⚙️ Defines all routes, ProtectedRoute wrapper, login redirect
└── vite-env.d.ts             # TypeScript definitions for Vite environment variables
```

---

## Pages (`src/pages/`)

Each page is a full-screen route component.

```
pages/
├── Dashboard.tsx             # / route - homepage
│                             # Shows: Hero form, stats cards, KPI bar charts, recent triages
│                             # Uses: TriageForm, ProgressPipeline, MiniBarChart
│
├── Queue.tsx                 # /queue route - alert queue page
│                             # Shows: P0/P1/P2/P3 filter buttons, QueueTable with all alerts
│                             # Uses: useQueue hook, QueueTable component
│
├── Results.tsx               # /results/:id route - triage result detail view
│                             # Shows: Verdict hero, alert cards, enrichment, AI analysis
│                             # Uses: ResultsView, getEntry from historyStore
│
├── TriageRun.tsx             # /triage/:jiraKey route - full-screen triage progress
│                             # Shows: Large ProgressPipeline with real-time stage updates
│                             # Uses: useTriage hook, ProgressPipeline component
│
├── History.tsx               # /history route - all triages log with filters
│                             # Shows: HistoryTable, filterable by verdict/trigger/date
│                             # Uses: useHistory hook, HistoryTable component
│
├── Settings.tsx              # /settings route - app configuration & data management
│                             # Shows: API URL config, Jira URL, connection test, clear history
│                             # Uses: useHealthCheck, Input component
│
├── Configuration.tsx         # /configuration route - integration setup hub
│                             # Shows: Jira, VirusTotal, OpenAI integration tiles
│                             # Each tile has: endpoint, API key fields, test button
│                             # Uses: IntegrationTile component
│
└── Login.tsx                 # /login route - authentication screen
                              # Shows: Crest Data branding, email + password form
                              # Uses: useAuthStore hook, Input component
```

---

## Components (`src/components/`)

### Layout Components (`layout/`)

```
layout/
├── Layout.tsx                # Main app wrapper with Sidebar + Header + Toaster
│                             # ⚙️ Renders <Outlet /> for page content
│                             # Manages sidebar collapsed state in localStorage
│
├── Sidebar.tsx               # Left navigation panel
│                             # Nav items: Dashboard, Queue, History, Integrations, Settings
│                             # Collapsible toggle saves state to localStorage
│
└── Header.tsx                # Top fixed header bar
                              # Left: Page title + Shield icon
                              # Right: Connection status, Notifications, Settings, User avatar, Logout
                              # Uses: ConnectionStatus component, useAuthStore
```

### Queue Components (`queue/`)

```
queue/
├── QueueTable.tsx            # Main alert table with filtering
│                             # Manages: expandedId state, priority filters (All/P0/P1/P2/P3)
│                             # Renders: QueueRow for each alert, SkeletonRow during loading
│                             # Columns: Score, Issue Key, Summary, Priority, Status, Age, Indicator, Actions
│
├── QueueRow.tsx              # Single alert row (expandable)
│                             # Main row: compact view of alert data
│                             # Expanded: ExpandedPanel with full IOC, risk profile, actions
│                             # StatusBadge component: Open/In-Progress/Closed/Error styling
│
└── PriorityScore.tsx         # Reusable score visualization (0-100 gradient bar)
                              # Used in: Queue rows, expanded panels
```

### Results Components (`results/`)

```
results/
├── ResultsView.tsx           # Main results layout (3-column grid)
│                             # Left: AlertInfoCard + TriagePipelineVisualizer + ActionsCard
│                             # Middle: EnrichmentCard
│                             # Right: AIAnalysisCard + Full Summary markdown
│
├── VerdictHero.tsx           # Large verdict display at top of results
│                             # Shows: Verdict badge, issue key, confidence, priority, model
│
├── AlertInfoCard.tsx         # Alert metadata card (issue key, user, IP, indicator, timestamp)
│
├── EnrichmentCard.tsx        # VirusTotal enrichment breakdown
│                             # Shows: Detection ratio, vendors table, threat categories
│
├── AIAnalysisCard.tsx        # AI verdict reasoning card
│                             # Shows: Model used, prompt version, reasoning, key factors
│
├── ActionsCard.tsx           # Recommended actions checklist (suppress alert? priority change?)
│
├── VerdictBadge.tsx          # Reusable verdict badge (Malicious/Suspicious/Benign)
│
└── TriagePipelineVisualizer.tsx  # NEW - Animated 4-stage flow graph
                                   # Shows: Alert Retrieval → VT Enrichment → AI Analysis → Summary Posted
                                   # Animates stages in sequentially with progress bar
```

### Configuration Components (`configuration/`)

```
configuration/
└── IntegrationTile.tsx       # NEW - Reusable integration config component
                              # Props: name, description, icon, fields[], onTestConnection
                              # Features: Masked password fields, show/hide toggle, save, test button
                              # Used by: Configuration page for Jira, VirusTotal, OpenAI tiles
```

### History Components (`history/`)

```
history/
└── HistoryTable.tsx          # Filterable triage history table
                              # Filters: verdict (benign/suspicious/malicious), trigger (auto/manual), date range
                              # Shows: Verdict badge, issue key, indicator, duration, timestamp
                              # Actions: CSV export, click row to view result
```

### Triage Components (`triage/`)

```
triage/
├── TriageForm.tsx            # Jira key input form
│                             # Shows: Input field with validation, Submit button
│                             # Validation: Matches [A-Z]+-[0-9]+ format
│
├── ProgressPipeline.tsx      # 4-stage progress tracker
│                             # Shows: Retrieval → Enrichment → Analysis → Summary
│                             # Each stage has icon, label, status, loading indicator
│
├── StageIndicator.tsx        # Individual stage display (icon + label + status)
│
└── ConnectionStatus.tsx      # Server health indicator in header
                              # Shows: Connected (green) / Disconnected (red) / Checking (amber)
                              # Displays: Latency in ms when connected
```

### UI Components (`ui/`)

Reusable design system components.

```
ui/
├── Button.tsx                # Versatile button component
│                             # Variants: primary, secondary, danger
│                             # Sizes: sm, md, lg
│                             # Features: loading state, left/right icons, disabled state
│
├── Card.tsx                  # Card container with optional glow effect
│                             # Exports: Card, CardHeader, CardBody
│                             # Props: glow color, hover effect, onClick
│
├── Input.tsx                 # Text input with label, icons, error state
│                             # Features: leftIcon, rightIcon, error message
│                             # Used in: Login, Settings, Configuration
│
├── Badge.tsx                 # Small label/tag component
│                             # Variants: malicious, suspicious, benign, auto, manual, cyan, slate, violet
│                             # Sizes: sm, md
│                             # Features: optional pulse animation
│
├── Skeleton.tsx              # Loading placeholder (SkeletonRow)
│                             # Shows: Animated gray bars while loading data
│
└── CrestDataLogo.tsx         # Crest Data logo component
                              # Sizes: sm, md, lg
                              # Variants: icon-only or full (icon + text)
```

---

## Hooks (`src/hooks/`)

Custom React hooks for state & data management.

```
hooks/
├── useTriage.ts              # Orchestrates triage workflow
│                             # Manages: stages state, elapsed time, error handling
│                             # Methods: startTriage(), cancel(), reset()
│                             # Calls: POST /triage, adds result to history store
│
├── useQueue.ts               # Fetches alert queue
│                             # Uses: TanStack Query (useQuery)
│                             # Refetches: Every 30 seconds (QUEUE_REFRESH_INTERVAL)
│                             # Returns: alerts[], isLoading, error
│
├── useHistory.ts             # Retrieves filtered history entries + stats
│                             # Accepts: filters (verdict, trigger, dateFrom, dateTo)
│                             # Returns: filtered entries, stats (triaged_today, malicious_count, avg_duration_ms, verdict_counts, confidence_counts, priority_counts)
│
└── useHealthCheck.ts         # Polls server health endpoint (/health)
                              # Returns: connection status (connected/disconnected/checking), latency_ms
                              # Interval: configurable (default 30s)
```

---

## API & Networking (`src/api/`)

Backend communication layer.

```
api/
├── client.ts                 # Fetch wrapper with error handling
│                             # Features: Timeout (60s), humanized error messages
│                             # CORS-friendly, respects VITE_API_URL env var
│                             # Used by: triage.ts, queue.ts
│
├── triage.ts                 # Triage endpoint
│                             # POST /triage { jira_key: string }
│                             # Returns: TriageResult (verdict, enrichment, alert data, etc.)
│
└── queue.ts                  # Alert queue endpoint
                              # GET /queue or mock data
                              # Returns: QueueAlert[] (sorted by priority_score descending)
                              # Mock: 6 hardcoded alerts with varied triage_status states
```

---

## State Management (`src/store/`)

Zustand stores (persisted to localStorage).

```
store/
├── historyStore.ts           # Triage history persistence
│                             # State: entries (max 50), methods: addEntry(), getEntry(), clearHistory()
│                             # Persisted to: localStorage['soc_triage_history']
│                             # Used by: useHistory hook, Results page, Dashboard
│
└── authStore.ts              # User authentication state
                              # State: user (name, email, role, initials)
                              # Methods: login(email, password), logout()
                              # Demo credentials: analyst@crestdata.com / CrestSOC2026
                              # Persisted to: localStorage['soc_auth']
```

---

## Types (`src/types/`)

TypeScript interfaces & types (single file).

```
types/
└── index.ts                  # All TypeScript definitions
                              # Includes:
                              # - VerdictClassification, ConfidenceLevel, AlertPriority
                              # - AlertData, EnrichmentData, VerdictData
                              # - TriageResult, TriageRequest, TriageError
                              # - QueueAlert, HistoryEntry, StatsData
                              # - ConnectionStatus, PipelineStage
```

---

## Utils (`src/utils/`)

Helper functions and constants.

```
utils/
├── constants.ts              # App-wide configuration
│                             # Exports:
│                             # - PIPELINE_STAGES (4 triage stages config)
│                             # - STAGE_TIMINGS (time percentages per stage)
│                             # - VERDICT_COLORS, PRIORITY_COLORS, CONFIDENCE_COLORS (Tailwind class maps)
│                             # - Storage keys, intervals (QUEUE_REFRESH_INTERVAL, TRIAGE_TIMEOUT_MS)
│                             # - MAX_HISTORY_ENTRIES (50)
│
└── formatters.ts             # Data formatting utilities
                              # Functions:
                              # - formatDuration(ms) → "2min 34s"
                              # - formatRelativeTime(isoString) → "2 hours ago"
                              # - getPriorityScore(priority) → 0-100
                              # - exportToCSV(entries) → download CSV file
```

---

## Data Flow Diagrams

### Authentication Flow
```
User visits app
    ↓
ProtectedRoute checks useAuthStore.user
    ↓
If null → Redirect to /login
    ↓
Login.tsx form → useAuthStore.login(email, password)
    ↓
Credentials validated → user saved to localStorage['soc_auth']
    ↓
Redirect to / (Dashboard) or original requested page
```

### Triage Flow
```
User enters Jira key on Dashboard
    ↓
TriageForm.onSubmit() → useTriage.startTriage(jiraKey)
    ↓
ProgressPipeline animates 4 stages
    ↓
useTriage hook calls POST /triage
    ↓
Backend returns TriageResult (alert, enrichment, verdict, summary)
    ↓
Result added to historyStore (localStorage)
    ↓
Navigate to /results/:id
    ↓
ResultsView fetches from store + displays VerdictHero, cards, TriagePipelineVisualizer
```

### Queue Expansion Flow
```
User clicks alert row in QueueTable
    ↓
toggleExpand(alertId) sets expandedId state
    ↓
QueueRow renders second <tr> with ExpandedPanel
    ↓
Panel shows: full IOC, risk breakdown, status, action buttons
    ↓
User clicks again (or different row) → panel closes
```

### Integration Test Flow
```
User enters API key in IntegrationTile
    ↓
Clicks "Test Connection"
    ↓
onTestConnection(values) called
    ↓
Fetch to integration endpoint with auth headers
    ↓
Return: { success, latency, message }
    ↓
UI updates: shows checkmark + latency, or error message
```

---

## Key File Relationships

### Pages that use multiple components:
- **Dashboard.tsx** → TriageForm, ProgressPipeline, MiniBarChart, VerdictBadge, Card, Badge
- **Results.tsx** → ResultsView, which internally uses VerdictHero, AlertInfoCard, EnrichmentCard, AIAnalysisCard, ActionsCard, TriagePipelineVisualizer
- **Queue.tsx** → QueueTable, which renders QueueRow for each alert, with StatusBadge, Badge, Button
- **Configuration.tsx** → IntegrationTile (×3 for Jira, VirusTotal, OpenAI)

### Components that use hooks:
- **Dashboard.tsx** → useHistory(), useQueue(), useTriage()
- **QueueTable.tsx** → useQueue()
- **HistoryTable.tsx** → useHistory()
- **Header.tsx** → useHealthCheck(), useAuthStore()
- **Login.tsx** → useAuthStore()

### Stores accessed by:
- **historyStore** ← Dashboard, Results, HistoryTable, useTriage, useHistory
- **authStore** ← App (ProtectedRoute), Login, Header

---

## File Size Reference

Larger files (100+ lines):
- **QueueRow.tsx** (230 lines) — Includes StatusBadge, ExpandedPanel
- **ResultsView.tsx** (114 lines) — Layout for all result cards
- **Dashboard.tsx** (260 lines) — Hero, stats, KPI charts, recent triages
- **TriagePipelineVisualizer.tsx** (200 lines) — Animated pipeline graph
- **Configuration.tsx** (153 lines) — Three integration tiles

Smaller files (< 50 lines):
- **utils/constants.ts**, **utils/formatters.ts**
- All card components (VerdictHero, AlertInfoCard, etc.)
- UI components (Button, Badge, etc.)

---

## Quick Navigation Tips

1. **To add a new page** → Create in `src/pages/`, add route in `App.tsx`, add nav item in `Sidebar.tsx`
2. **To add a new component** → Create in appropriate subfolder in `src/components/`, import in page that uses it
3. **To add a new API endpoint** → Create function in `src/api/`, create hook if needed in `src/hooks/`
4. **To change colors/constants** → Edit `src/utils/constants.ts` (VERDICT_COLORS, PRIORITY_COLORS, etc.)
5. **To add new form field** → Use `Input.tsx` component, or extend with new variant
6. **To persist new data** → Add to appropriate Zustand store in `src/store/`

