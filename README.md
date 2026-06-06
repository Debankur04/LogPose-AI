<div align="center">

# 🧭 LogPose AI

### AI-Powered Travel Planning Platform

*From natural language to a complete, personalized itinerary — in seconds.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-log--pose--ai.vercel.app-blue?style=for-the-badge&logo=vercel)](https://log-pose-ai.vercel.app)
[![Frontend Repo](https://img.shields.io/badge/Frontend-LogPose--AI-black?style=for-the-badge&logo=github)](https://github.com/Debankur04/LogPose-AI)
[![Backend Repo](https://img.shields.io/badge/Backend-Agentic__Planner-black?style=for-the-badge&logo=github)](https://github.com/Debankur04/Agentic_Planner)

</div>

---

## Overview

LogPose AI is a full-stack AI travel planning platform that converts a natural language travel request into a richly detailed, personalized itinerary. The system pairs a polished **Next.js** frontend with a **multi-agent Python backend** that orchestrates real-time research, pricing analysis, and structured output generation through a three-phase LangGraph pipeline.

Users interact through a streaming chat interface — type a destination and travel goal, and the agent validates the request, searches for live flights, hotels, weather, and places, then synthesizes everything into a formatted plan, all while streaming the output token-by-token.

---

## Architecture

The platform is split into two independent repositories that communicate over a REST + SSE API.

```
┌─────────────────────────────────────────────────────┐
│                  Next.js Frontend                   │
│  Streaming chat UI · Auth · Conversation management │
│               Deployed on Vercel                    │
└────────────────────────┬────────────────────────────┘
                         │ REST + Server-Sent Events
                         ▼
┌─────────────────────────────────────────────────────┐
│               FastAPI Backend (Python)              │
│  JWT auth · Rate limiting · SSE streaming           │
│  LangGraph orchestration · Redis · MongoDB          │
└────────────────────────┬────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    ┌──────────┐  ┌────────────┐  ┌──────────┐
    │ Phase 1  │  │  Phase 2   │  │ Phase 3  │
    │  Intake  │→ │  Research  │→ │  Writer  │
    │Validator │  │ & Pricing  │  │  Agent   │
    └──────────┘  └────────────┘  └──────────┘
                         │
              ┌──────────┴──────────┐
              │  Supabase (SQL)     │
              │  MongoDB (NoSQL)    │
              └─────────────────────┘
```

### Multi-Agent Pipeline

Every query runs through a three-phase pipeline:

| Phase | Agent | Responsibility |
|---|---|---|
| 1 | **Intake Validator** | Validates input, extracts trip requirements, identifies missing info, triggers HITL clarification if needed |
| 2 | **Research & Pricing** | Executes live tool calls (flights, hotels, weather, places), cross-references sources, summarizes pricing options |
| 3 | **Writer** | Synthesizes all findings into a structured markdown itinerary, then cleans up the inter-agent state file |

Agents share state through a JSON communication hub (`target.js`) that is auto-created at workflow start and deleted upon completion. A `TraceRecorder` captures 45+ event types per run — tool calls, LLM invocations, decisions, errors, and timing — enabling full observability over every execution.

---

## Key Features

**Streaming Chat Interface**
Real-time token-by-token streaming via Server-Sent Events (SSE). Responses appear as they are generated — no waiting for the full answer.

**Human-in-the-Loop (HITL) Interrupts**
When the agent detects ambiguous or incomplete input, it pauses the LangGraph execution, streams a clarification question, and resumes from the exact checkpoint when the user replies — preserving API budget and avoiding hallucinations.

**Persistent Conversation Memory**
Each user has a rolling memory string (capped at 2,000 characters) and preference JSON stored across sessions. The agent injects both into the system prompt so it recalls dietary restrictions, budget preferences, and travel style across conversations without re-reading full history.

**Multi-Tenant Authentication**
JWT-based authentication via Supabase. Separate `conversations` and `messages` tables let users maintain multiple independent planning threads simultaneously.

**Live Research Tools**
The backend integrates flights, hotels, weather, railway, and place-search APIs. The research agent selects tools dynamically based on the trip requirements extracted in Phase 1.

**User Preference Profiles**
Users can store structured preferences (dietary restrictions, seat preferences, loyalty programs, custom notes). These are serialized and injected into every query for personalized output.

**Observability**
Every workflow execution emits a complete trace with per-phase durations, API call counts, and event logs accessible at `GET /debug/trace/{request_id}`.

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 16 | App framework with App Router |
| React 19 | UI rendering |
| Tailwind CSS v4 | Styling |
| Framer Motion 12 | Animations and transitions |
| Three.js / React Three Fiber | 3D globe visualization |
| Supabase JS | Auth session management |
| React Markdown + remark-gfm | Rendering formatted itineraries |
| Vercel Speed Insights | Performance monitoring |

### Backend

| Technology | Purpose |
|---|---|
| FastAPI | REST API framework |
| LangGraph | Multi-agent workflow orchestration |
| LangChain | Tool calling and LLM abstractions |
| Groq (DeepSeek-R1 70B) | Chain-of-thought routing |
| OpenAI (o4-mini) | Stable tool-calling logic |
| Supabase (PostgreSQL) | Users, conversations, messages |
| MongoDB | Long-form memory blocks and preferences |
| Redis | Caching and trace storage |
| slowapi | Rate limiting |

---

## API Overview

The backend exposes a RESTful API with SSE streaming on the query endpoint. Full documentation is available in [`API_Documentation.md`](./API_Documentation.md).

### Core Endpoints

```
POST   /signup                    Register a new user
POST   /signin                    Authenticate and receive JWT tokens
POST   /refresh                   Refresh access token
POST   /signout                   End session

POST   /query                     Run the agent pipeline (SSE streaming)
POST   /create_conversation       Create a new conversation thread
DELETE /delete_conversation       Remove a conversation
GET    /see_conversation          List all conversations for a user
GET    /see_message               Fetch messages in a conversation

POST   /add_preference            Save user preferences
POST   /edit_preference           Update preferences
POST   /see_preference            Retrieve preferences
DELETE /delete_preference         Clear preferences

GET    /health                    System health + LLM routing stats
GET    /debug/trace/{request_id}  Retrieve full execution trace
```

### Streaming Response Format

```text
data: {"type": "chunk", "content": "The"}
data: {"type": "chunk", "content": " best"}
...
data: {"final_reply": "The best time to visit Kyoto is spring..."}
```

### Rate Limits

| Endpoint Category | Limit |
|---|---|
| Auth (signup/signin) | 5 req/min |
| Token refresh / signout | 10 req/min |
| Query (agent pipeline) | 30 req/min |
| Conversations & messages | 50 req/min |
| Preferences | 50 req/min |
| Health & debug | 100 req/min |

---

## Database Schema

### Supabase (PostgreSQL)

```sql
users               -- Managed by Supabase Auth

conversations (
    id              UUID PRIMARY KEY,
    user_id         UUID,
    title           TEXT,
    created_at      TIMESTAMP
)

messages (
    id              UUID PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id),
    role            TEXT,  -- 'user' | 'assistant'
    content         TEXT,
    created_at      TIMESTAMP
)

preferences (
    id                  UUID PRIMARY KEY,
    user_id             UUID,
    dietary_preference  JSONB,
    preference_id       UUID,  -- Reference to MongoDB
    created_at          TIMESTAMP,
    updated_at          TIMESTAMP
)
```

### MongoDB

```json
{
  "preference_id": "uuid",
  "user_id": "uuid",
  "memory_block": "User prefers vegetarian meals, avoids spicy food...",
  "last_updated": "2026-03-23T10:00:00Z",
  "version": 3
}
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- A running instance of the [Agentic Planner backend](https://github.com/Debankur04/Agentic_Planner)

### Installation

```bash
git clone https://github.com/Debankur04/LogPose-AI.git
cd LogPose-AI
npm install
```

### Environment Variables

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_BASE_URL=your_backend_api_url
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm run start
```

---

## Project Structure

```
LogPose-AI/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── chat/             # Main chat interface
│   │   ├── login/            # Authentication pages
│   │   └── layout.jsx        # Root layout
│   ├── components/           # Reusable UI components
│   │   ├── ChatInput.jsx     # Message input with voice support
│   │   ├── ChatHeader.jsx    # Conversation header
│   │   ├── MessageBubble.jsx # Markdown-rendered message display
│   │   └── Sidebar.jsx       # Conversation list
│   └── lib/                  # Utilities and API client
├── public/                   # Static assets
├── API_Documentation.md      # Full API reference
└── package.json
```

---

## Roadmap

- [ ] **Itinerary export** — Client-side PDF generation via `html2pdf.js` from the streamed markdown output
- [ ] **Direct booking links** — Upgrade flight and hotel tools to return deep-link booking URLs via SerpAPI
- [ ] **AP2 booking integration** — Translate high-level requests into transactional booking flows on partner platforms
- [ ] **Downloadable itineraries** — `GET /download_itinerary/{conversation_id}` endpoint for server-side PDF generation

---

## Related Repository

The backend that powers this frontend is maintained separately:

**[Agentic Planner](https://github.com/Debankur04/Agentic_Planner)** — FastAPI + LangGraph multi-agent backend with full documentation on the workflow architecture, tool ecosystem, and deployment configuration.

---

<div align="center">

Built by [Debankur](https://github.com/Debankur04) · [Live Demo](https://log-pose-ai.vercel.app)

</div>
