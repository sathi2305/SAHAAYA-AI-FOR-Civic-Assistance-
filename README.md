# SAHAAYA AI — Every Problem. A Clearer Next Step.
### Advanced AI-Powered Civic Assistance Platform
*Tamil Nadu & Pan-India Municipal Infrastructure Assistance • Full-Stack Civic Tech*

---

## 1. What SAHAAYA AI Does

**SAHAAYA AI** is an AI-powered civic grievance assistance platform that empowers citizens to understand, document, categorize, and track reports for common municipal problems—including:
- **Road Damage** (dangerous potholes, broken asphalt, craters)
- **Water Leakage** (broken water mains, continuous potable water loss)
- **Sanitation** (overflowing public dumpsters, unhygienic accumulation)
- **Streetlights** (dark corridors, non-functional luminaire fixtures)
- **Drainage** (blocked stormwater inlets, sewage overflow, silt backflow)
- **Other Civic Issues** (encroachments, fallen branches, damaged signage)

Citizens can describe problems in plain conversational English or Tamil, upload optional photo evidence, pin exact coordinates on an interactive map, and receive instant AI analysis. SAHAAYA AI automatically flags missing details (e.g., landmark, pole number, pipe diameter), maps the problem to the exact designated municipal department (e.g., GCC Roads Wing, CMWSSB, TANGEDCO), generates an editable formal grievance petition letter, and tracks resolution progress in real time.

---

## 2. Key Features

- **Futuristic Civic Dark UI:** Built strictly with midnight navy (`#020817`), deep blue panels (`#071B38`), cyan (`#00C8FF`), electric blue (`#246BFD`), and violet glows (`#7028FF`), matching modern civic command centers.
- **5-Step Grievance Wizard:**
  1. *Category Selection* (6 municipal domains with visual cues)
  2. *Issue Details & Description* (with AI auto-assist text suggestions)
  3. *Location Pinpoint* (Leaflet interactive pin-drop + GPS browser geolocation)
  4. *Evidence Upload* (drag-and-drop photo previews, file size/type validation)
  5. *Review & AI Triage* (automated severity assessment, missing detail alerts, and formal petition generation)
- **AI Civic Assistant & Copilot:** Live conversational guide powered by Google Gemini (`gemini-3.8-flash`) with one-click conversion of chat advice into formal grievance tickets.
- **Interactive Geospatial Radar (Leaflet & OSM):** Full-screen dark-mode city map with category-coded glowing pins, pulsating status indicators, search bounds, and quick inspection cards.
- **Editable Formal Complaint Letters:** Produces polite, structured, highly actionable letters ready to email or submit to local municipal commissioners or ward engineers.
- **Resolution Workflow Simulator:** Test and demonstrate how grievance status transitions from *Submitted → In Review → Assigned → In Progress → Resolved* with logged timestamps.
- **Native Tamil & English Localization:** Complete dual-language interface covering navigation, wizard steps, form validations, status badges, and AI advice.
- **Data Export & Privacy First:** Transparent AI disclaimer, zero data resale, and instant JSON backup exports.

---

## 3. Technology Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite 8**
- **Tailwind CSS 4** with custom luminous glow tokens and Leaflet dark tiles
- **Lucide React** (icons for all 6 civic domains)
- **Motion / Framer Motion** (subtle micro-animations)
- **Leaflet 1.9** & OpenStreetMap (interactive geolocation mapping)

### Backend & AI
- **Node.js** with **Express** & **TSX** runtime
- **@google/genai** (Google Gemini `gemini-3.8-flash` model for live civic triage)
- **Intelligent Civic Rule Engine** (graceful zero-dependency fallback when offline or without API key)
- **In-Memory & JSON-Backed Civic Records Store** with realistic metro grievance seeds

---

## 4. Project Structure

```
├── server.ts                   # Express full-stack entry point & Gemini API endpoints
├── index.html                  # HTML entry point with meta tags & typography
├── package.json                # Dependencies, devDependencies & npm scripts
├── metadata.json               # Applet capabilities & permissions
├── vite.config.ts              # Vite + Tailwind + alias configuration
├── tsconfig.json               # TypeScript compiler rules
├── tests/
│   └── verify-system.ts        # Automated verification test suite (8 test cases)
└── src/
    ├── main.tsx                # React DOM root
    ├── App.tsx                 # Root component & view router
    ├── index.css               # Design system tokens, leaflet dark filters & glow styles
    ├── types/
    │   └── index.ts            # Shared TypeScript data models
    ├── context/
    │   └── AppContext.tsx      # Global app state, reports store, toasts & language
    ├── data/
    │   └── translations.ts     # Complete English & Tamil language dictionaries
    └── components/
        ├── layout/
        │   └── AppShell.tsx    # 3-column desktop & responsive mobile drawer layout
        ├── common/
        │   ├── Badges.tsx      # CategoryBadge, StatusBadge, UrgencyBadge
        │   ├── CivicMap.tsx    # Leaflet interactive map with custom category markers
        │   └── ToastContainer.tsx # Non-intrusive alert toast manager
        └── views/
            ├── LandingView.tsx        # Public landing hero & ethics statement
            ├── DashboardView.tsx      # Main civic dashboard matching reference layout
            ├── NewIssueView.tsx       # 5-step reporting wizard with map pin-drop
            ├── MyReportsView.tsx      # Report tracking, search & category filters
            ├── AiAssistantView.tsx    # AI chatbot & complaint draft generator
            ├── MapView.tsx            # Full interactive city incident radar
            ├── ReportDetailsView.tsx  # Grievance inspector & status simulator
            └── SettingsView.tsx       # Language, notifications, export & privacy
```

---

## 5. Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* **Google Gemini API Key**: For live LLM responses (the app includes an intelligent built-in fallback if no key is configured).

---

## 6. Local Installation (Windows PowerShell / macOS / Linux)

### In Windows PowerShell:

```powershell
# 1. Clone or open repository
cd sahaaya-ai

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional)
Copy-Item .env.example .env
```

---

## 7. Environment Configuration

In `.env`:

```env
# Optional: GEMINI_API_KEY for live Gemini 3.8 Flash calls
GEMINI_API_KEY="your-gemini-api-key-here"

# Server Port (default 3000)
PORT=3000
```

*Note: If no API key is provided, the application automatically runs in **Intelligent Civic Fallback Mode** with 100% of features demonstrable.*

---

## 8. Running the Application

### Development Mode (Full-stack Server + Vite HMR):
```powershell
npm run dev
```
Open your browser at `http://localhost:3000`.

### Production Build:
```powershell
npm run build
npm run start
```

---

## 9. Running Tests

We provide an automated verification script that executes 8 comprehensive test cases across translations, health endpoints, report CRUD, status updates, AI analysis, and map feeds:

```powershell
npx tsx tests/verify-system.ts
```

All 8 tests run and assert responses directly against the local server.

---

## 10. External API Credentials & Demo Mode Disclosure

| Feature | Live Mode | Fallback / Demo Mode |
| :--- | :--- | :--- |
| **Issue Triage** | Google Gemini `gemini-3.8-flash` | SAHAAYA Intelligent Civic Rule Engine |
| **Grievance Letters** | Live AI Generated | Structured Official Municipal Templates |
| **Civic Chatbot** | Real-time GenAI Stream | Contextual Civic Copilot with quick prompts |
| **Interactive Map** | OpenStreetMap / CartoDB | Pre-seeded with 5 realistic Chennai metro reports |
| **Status Simulator** | Instant local state update | Allows judges to test full resolution lifecycle |

---

## 11. Deployment

### Vercel / Render / Cloud Run:
- Build command: `npm run build`
- Start command: `node server.js` or `tsx server.ts`
- Environment variables: `GEMINI_API_KEY` (optional)
