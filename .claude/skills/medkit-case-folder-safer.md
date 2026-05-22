---
name: medkit-case-folder-safer
description: Use when adding a new patient case to the simulator. Do NOT edit TypeScript data files. Create a JSON file under `cases/{specialty}/` and the loader picks it up automatically.
---

# medkit — Case folder system

The `cases/` directory is the **single, canonical source of truth** for all patient cases. Each case is one JSON file. Adding a case means creating one file — no TypeScript edits needed.

```
cases/                          # ★ CANONICAL STORAGE — put all new cases here
├── cardiology/
│   └── card-stemi-001.json     Pieter van der Merwe — STEMI
├── endocrinology/
│   └── endo-dka-001.json       Thandiwe Mokoena — DKA
└── infectious-disease/
    └── id-tb-hiv-001.json      Sipho Ndlovu — TB/HIV
```

**How the loader works:**
1. `src/data/cases.ts` uses `import.meta.glob('../../cases/**/*.json', { eager: true })` (Vite-only — not tsc)
2. The file path determines the specialty: `cases/cardiology/foo.json` → ClinicId `cardiology`
3. Each JSON file is parsed at build time and added to the `BY_ID` map
4. Legacy `src/data/patients.ts` entries are loaded second — JSON files take precedence

## When to use this skill

**CREATE a JSON file when:**
- Adding a new hero case with a hand-authored rubric + guideline citations
- Adding any new polyclinic case to an existing or new specialty
- Importing output from the case-generator skill (`medkit-case-generator`)
- Migrating a case from legacy TypeScript into the folder system

**DON'T edit these files (legacy only, do NOT add cases here):**
- `src/data/patients.ts` — has the 3 original hero cases, kept for backwards compat
- `src/data/polyclinicPatients.ts` — ~350 old-format cases, awaiting migration

## How to add a new case (step by step)

### Step 1: Create the JSON file

```bash
mkdir -p cases/{specialty-id}
touch cases/{specialty-id}/{your-case-id}.json
```

Specialty ID must match a value in the `ClinicId` type from `src/game/clinic.ts` — e.g. `cardiology`, `endocrinology`, `infectious-disease`, `internal-medicine`, `pulmonology`, `pediatrics`, etc. The complete list of 25 is in `src/game/clinic.ts`'s `CLINIC_IDS` array.

Case ID convention (MUST be unique across ALL cases):
- `{specialty-abbr}-{condition-abbr}-{number}`
- Examples: `id-tb-hiv-001`, `card-stemi-001`, `endo-dka-001`

### Step 2: Fill in the 9-layer model

The JSON must match the `PatientCase` type. Every case needs these fields:

```jsonc
{
  // ★ REQUIRED — every case
  "id": "unique-string-id",
  "arrivalBlurb": "What staff see when patient walks in — e.g. 'Walk-in, pale, clutching chest.'",
  "chiefComplaint": "Patient's first words when doctor arrives",

  // Layer 1: Identity
  "identity": {
    "name": "Full Name",
    "age": 42,
    "gender": "M" | "F",
    "occupation": "Job",
    "livingSituation": "Home/family context",
    "primaryLanguage": "Language (speaks English?)",
    "healthLiteracy": "very-low" | "low" | "medium" | "high",
    "personality": "stoic" | "anxious" | "verbose" | "guarded" | "angry" | "compliant" | "confused",
    "personalTheory": "What patient thinks is wrong"
  },

  // Layer 2: Clinical state
  "clinicalState": {
    "primaryDiagnosis": "diagnosis-id-string",
    "severity": "critical" | "urgent" | "stable",
    "timeline": "Free text — when symptoms started and progression",
    "baselineVitals": { "hr": 80, "bp": "120/80", "spo2": 98, "temp": 37.0, "rr": 16 },
    "medications": ["list", "of", "current", "meds"],
    "allergies": ["list", "or", "[]"]
  },

  // Layers 3-5: History (onion model — surface/middle/deep)
  "history": {
    "surface": [
      // Volunteered easily — answer if the doctor asks a broad question
      { "id": "q1", "question": "What the doctor should ask", "answer": "Patient answer", "relevant": true }
    ],
    "middle": [
      // Only revealed if doctor asks a specific targeted question
      { "id": "q2", "question": "Specific probe question", "answer": "Answer", "relevant": true }
    ],
    "deep": [
      // ONLY if doctor asks the EXACT right probing question — sensitive info
      { "id": "q3", "question": "Exact question needed", "answer": "Sensitive answer", "relevant": true }
    ]
  },

  // Layer 6: Physical exam
  "physicalExam": {
    "generalAppearance": "One-line description",
    "abnormalFindings": ["Finding 1", "Finding 2"]
  },

  // Layer 7: Test results
  "testResults": [
    { "testId": "test-id-from-tests.ts", "result": "Interpreted result", "abnormal": true }
  ],

  // Diagnosis + treatment
  "correctDiagnosisId": "must-match-a-key-in diagnosisOptions",
  "diagnosisOptions": ["dx-1", "dx-2", "dx-3", "dx-4", "dx-5"],
  "acceptableTreatmentIds": ["treatment-ids-from-treatments.ts"],
  "criticalTreatmentIds": ["must-get-these-right"],

  // Layer 8: Education metadata
  "education": {
    "difficulty": 1 | 2 | 3 | 4 | 5,
    "targetTrainingLevel": "Year 4 medical student",
    "learningObjectives": ["Objective 1", "Objective 2"],
    "commonErrors": ["Common mistake", "Another mistake"],
    "facultyNotes": "Teaching notes"
  },

  // Layer 9: Rubric (optional — but REQUIRED for hero cases)
  "rubric": { ... }
}
```

### Step 3: Copy an existing case as template

```bash
# Fastest way: copy an existing hero case and edit it
cp cases/infectious-disease/id-tb-hiv-001.json cases/pulmonology/pulm-asthma-001.json
```

### Step 4: Verify

```bash
npm run build    # TypeScript will flag structural issues with the PatientCase type
npm run dev      # Start dev server and check the case appears in the library
```

## How the loader works (chain of responsibility)

```
cases/cardiology/foo.json
  ↓ import.meta.glob('../../cases/**/*.json', { eager: true })
src/data/cases.ts
  ↓ iterates loaded modules, extracts clinicId from file path
  ↓ creates Case (cartoon face — skin tone, hair, mood derived from id/age)
  ↓ adds to BY_ID map (id → { PatientCase, ClinicId })
  ↓ also registers legacy PATIENT_CASES_RECORD entries (skipped if JSON has that id)
  ↓
exported functions:
  CASES: Case[]              — all cases with cartoon face metadata
  getCase(id): Case          — look up the cartoon face
  getPatientCase(id): PatientCase  — look up the full medical record
  getCaseClinic(id): ClinicId      — which specialty?
  CONDITION_FILTERS           — 'All', 'Red-flag only', + distinct conditions
  ↓
src/game/store.ts            — pickNextCaseId(), loadPolyclinicPatient(id)
src/components/*              — render Case cards or full PatientCase data
```

## Hard rules (LLMs: read these literally)

1. **One file = one case.** Never put multiple cases in a single JSON file.
2. **Use the 9-layer model.** Every case must have `identity`, `clinicalState`, `history` (with `surface`, `middle`, `deep`), `physicalExam`, `testResults`, `education`. Don't skip layers.
3. **Case IDs must be globally unique.** The loader uses a `Map<string, PatientCase>` keyed by `id`. If you reuse an ID, the second occurrence is skipped with a console warning.
4. **JSON files take precedence** over legacy `src/data/patients.ts`. If a JSON file has the same `id` as a TypeScript case, the JSON version wins.
5. **Don't add cases to `src/data/patients.ts` or `src/data/polyclinicPatients.ts`.** Those files are migration sources only — no new cases go there.
6. **Every `clinical_management` rubric criterion that has a `guideline_ref` MUST resolve** in `src/data/guidelines.ts`. See the `medkit-rubric-author` skill for the citation validation checklist.
7. **The rubric is optional for non-hero cases** — `src/data/autoRubric.ts` generates a fallback. But hero cases (ones with hand-authored rubrics) should always include one.
