# MedKit (Auscult) — Project Index

## What This Is
Browser-based clinical training simulator. Student plays doctor:
- **ER mode**: Multi-bed, real-time, voice conversations with AI patients
- **Polyclinic mode**: Single patient at a time, text-based, tests resolve instantly
- South African pilot with 3 localized cases (TB/HIV, DKA, STEMI)

---

## Quick Start

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite dev server (frontend only) |
| `python backend/server.py` | Start FastAPI backend (needed for voice + AI) |
| `python backend/voice_agent.py dev` | Start LiveKit voice worker (needed for voice) |

---

## File Structure

```
Auscult/
├── src/                          ★ FRONTEND (React + Vite + TypeScript)
│   ├── main.tsx                  App entry
│   │
│   ├── game/
│   │   ├── types.ts              ★ PatientCase schema (9-layer onion model)
│   │   ├── store.ts              Single state store (no Redux/Zustand)
│   │   ├── clinic.ts             ClinicId enum & definitions
│   │   └── ...
│   │
│   ├── data/                     ★ CASE DATA & REGISTRIES
│   │   ├── patients.ts           3 SA pilot cases (Sipho/Thandiwe/Pieter)
│   │   ├── treatments.ts         All orderable treatments (27 items)
│   │   ├── tests.ts              All orderable tests (80+ items)
│   │   ├── guidelines.ts         Guideline registry (6 entries)
│   │   ├── autoRubric.ts         Fallback rubric generator
│   │   └── defaultTestResults.ts Default normal results per test
│   │
│   ├── voice/                    ★ VOICE & AI INTEGRATION
│   │   ├── conversation.ts       LiveKit voice session class
│   │   ├── conversationStore.ts  Per-bed conversation cache
│   │   ├── patientPersona.ts     ★ System prompt builder (onion-model)
│   │   └── claude.ts             Anthropic SDK wrapper (text chat only)
│   │
│   ├── agents/                   ★ MANAGED AGENTS (Attending Physician)
│   │   ├── managedAgent.ts       Grading agent integration
│   │   ├── customTools.ts        Custom tools for the agent
│   │   └── eventStreamRenderer.tsx UI for agent streaming responses
│   │
│   ├── components/               React UI components
│   │   └── three/                Three.js 3D scenes (ER, Polyclinic)
│   │
│   └── prompts/                  Prompt templates
│
├── backend/                      ★ PYTHON BACKEND (FastAPI)
│   ├── server.py                 Main API server (proxy + LiveKit tokens)
│   ├── voice_agent.py            LiveKit voice worker (Deepgram/Anthropic/Cartesia)
│   ├── requirements.txt          Python deps
│   └── .env.example              Environment template (API keys)
│
├── agent/
│   └── skills/                   Managed Agent skill definitions
│       ├── attending-debrief/    Grading logic
│       ├── case-generator/       Case generation from guidelines
│       ├── guideline-curator/    Guideline curation
│       ├── patient-roleplay/     Patient persona instructions
│       └── simulation-tick/      Simulation step logic
│
├── vercel.json                   Vercel deploy config (proxies to Render)
├── vite.config.ts                Vite bundler config
├── tsconfig.json                 TypeScript config
├── package.json                  Frontend dependencies
├── CLAUDE.md                     Agent instructions (for Cursor/Claude Code)
├── INDEX.md                      ★ THIS FILE
├── spec.md                       Original hackathon spec / scope doc
└── implementation_plan.md        Implementation plan tracking
```

---

## Core Data Model (9-Layer "Onion")

Each patient case (`PatientCase` in `src/game/types.ts`) has 9 layers:

| Layer | Field | Purpose | Example |
|---|---|---|---|
| 1 | `identity` | Demographics, health literacy, personality | `stoic`, `low health literacy` |
| 2 | `clinicalState` | Diagnosis, vitals, meds | `pulmonary-tuberculosis`, HR 110 |
| 3 | `history.surface` | Obvious symptoms (patient volunteers) | Cough, weight loss |
| 4 | `history.middle` | Probing questions (student must ask) | Night sweats, hemoptysis |
| 5 | `history.deep` | Sensitive / hidden information | HIV+, stopped ARVs |
| 6 | `physicalExam` | Exam findings | Crepitations RUL, oral thrush |
| 7 | `testResults` | Lab/imaging results | CXR: cavitary lesion |
| 8 | `education` | Pedagogical metadata | Difficulty, learning objectives |
| 9 | `rubric` (optional) | ★ Custom grading rubric with guideline citations | WHO TB guidelines |

**Prompt rule**: The LLM reveals layers based on how deeply the student probes — surface first, middle on prompting, deep only if explicitly asked.

---

## South African Pilot Cases (in `src/data/patients.ts`)

| ID | Patient | Department | Scenario | Custom Rubric? |
|---|---|---|---|---|
| `id-tb-hiv-001` | Sipho Ndlovu (32M, mineworker) | Infectious Disease | TB/HIV co-infection, stopped ARVs | ✅ WHO TB guidelines |
| `endo-dka-001` | Thandiwe Mokoena (22F, student) | Endocrinology | DKA from insulin stockout | ✅ ADA DKA guidelines |
| `card-stemi-001` | Pieter van der Merwe (58M, mechanic) | Cardiology | Anterior STEMI, thinks it's heartburn | ✅ ESC STEMI guidelines |

---

## Model Routing

| Feature | Model | Where |
|---|---|---|
| Patient voice persona | **Claude Haiku 4.5** | `backend/voice_agent.py` |
| Attending grading | **Claude Opus 4.7** (Managed Agent) | `backend/server.py` proxy |
| Text chat fallback | Haiku 4.5 (via `anthropic` SDK) | `src/voice/claude.ts` |

---

## Guideline Registry (in `src/data/guidelines.ts`)

| ID | Body | Topic | Used By |
|---|---|---|---|
| `nice-ng136-htn-2019` | NICE | Hypertension | (existing) |
| `nice-ng28-t2dm-2022` | NICE | Type 2 Diabetes | (existing) |
| `nice-ng250-pneumonia-2025` | NICE | Pneumonia | (existing) |
| `who-tb-2023` | WHO | TB/HIV co-infection | Sipho case rubric |
| `ada-dka-2024` | ADA | DKA management | Thandiwe case rubric |
| `esc-stemi-2023` | ESC | STEMI management | Pieter case rubric |

---

## Quick Reference: Acronyms & Terms

| Term | Meaning |
|---|---|
| **Onion model** | Layered history disclosure (surface → middle → deep) |
| **Managed Agent** | Anthropic's orchestrated agent with skills/tools |
| **LiveKit** | WebRTC platform for real-time voice |
| **Deepgram** | Speech-to-text (voice worker) |
| **Cartesia** | Text-to-speech (voice worker) |
| **RHZE** | Rifampicin/Isoniazid/Pyrazinamide/Ethambutol (TB therapy) |
| **DKA** | Diabetic Ketoacidosis |
| **STEMI** | ST-Elevation Myocardial Infarction |
| **PCI** | Percutaneous Coronary Intervention (stent) |

---

## Common Tasks

- **Add a new case** → edit `src/data/patients.ts`, add to the right `ClinicId` array
- **Add a custom rubric** → add a `rubric` field to the case object (see existing ones for format)
- **Add a new guideline** → edit `src/data/guidelines.ts` (follow existing pattern)
- **Verify data integrity** → `npm run verify`
- **Deploy** → `npm run build`, then deploy `dist/` to Vercel

---

## Key Rules

1. **No new state libraries** — the `Store` class in `src/game/store.ts` handles everything
2. **Data files are data** — add new cases/tests/meds to the data file, don't create new plumbing
3. **No VITE_* API keys** — all secrets go through the Python backend
4. **Don't create sub-agents** — use skills in `agent/skills/` instead
5. **Prompt caching** — always set `cache_control: { type: 'ephemeral' }` on system prompts