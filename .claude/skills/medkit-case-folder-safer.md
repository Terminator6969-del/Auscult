---
name: medkit-case-folder-safer
description: Use when adding a new patient case to the simulator. Do NOT manually edit TypeScript data files. Instead, create a JSON file under `cases/{specialty}/` and then update `src/data/cases.ts`'s `loadCaseFromJson()` if the specialty doesn't have a loader yet.
---

# medkit — Case folder system

The `cases/` directory is the **single source of truth** for adding new cases. Each case is a standalone JSON file at:

```
cases/{specialty}/{case-id}.json
```

Examples:
- `cases/infectious-disease/id-tb-hiv-001.json`
- `cases/endocrinology/endo-dka-001.json`
- `cases/cardiology/card-stemi-001.json`

## When to use this

**DO** create a JSON file when:
- Adding a new hero case with a hand-authored rubric
- Adding a new polyclinic case to an existing specialty
- Importing a case from the case-generator skill's output

**DON'T** edit `src/data/patients.ts` or `src/data/polyclinicPatients.ts` to add new cases — those files are legacy data sources.

## How to add a new case

### 1. Create the JSON file

```bash
mkdir -p cases/{specialty-id}
touch cases/{specialty-id}/{your-case-id}.json
```

The file must validate against the `PatientCase` type from `src/game/types.ts`. Required top-level fields:

```jsonc
{
  "id": "your-case-id",           // Unique string, hyphenated
  "arrivalBlurb": "What staff see when patient walks in",
  "chiefComplaint": "Patient's opening line",
  "identity": { /* PatientIdentity */ },
  "clinicalState": { /* ClinicalState */ },
  "history": { /* HistoryLayers with surface/middle/deep */ },
  "physicalExam": { /* PhysicalExamFindings */ },
  "testResults": [ /* TestResult[] */ ],
  "correctDiagnosisId": "string",
  "diagnosisOptions": ["string"],
  "acceptableTreatmentIds": ["string"],
  "criticalTreatmentIds": ["string"],
  "education": { /* EducationalMetadata */ }
}
```

### 2. Validate the file

```bash
# TypeScript types and the JSON schema are checked at build time.
# The case loader imports JSON files and casts them to PatientCase.
# Run the build to verify:
npm run build
```

If the build passes, the case is loaded. Run `npm run verify` to check the verification suite.

### 3. Verify in the dev server

```bash
npm run dev
```

Open the browser, navigate to the case's specialty in the GP Room, and confirm the case appears in the library.

## Guidelines for hero cases

- A hero case without a `rubric` field falls back to `autoRubric.ts`'s generic rubrics
- All `clinical_management` rubric criteria that claim a `guideline_ref` must resolve to an entry in `src/data/guidelines.ts`
- The `id` should be prefixed by specialty: `id-tb-hiv-001` (infectious-disease), `card-stemi-001` (cardiology), `endo-dka-001` (endocrinology)
- Add cases to `cases/{specialty}/{case-id}.json` — the loader in `cases.ts` reads the directory and registers them automatically.

## Hard rules

1. **One file = one case.** Never put multiple cases in a single JSON file.
2. **Use the 9-layer model.** Every case must have `identity`, `clinicalState`, `history` (with `surface`, `middle`, `deep`), `physicalExam`, `testResults`, `education`.
3. **The rubric is optional but encouraged.** Without a hand-authored rubric, the case uses auto-derived rubrics that have no guideline citations.
4. **Case IDs must be unique across all files.** The loader uses a `Map<string, PatientCase>` keyed by `id`.
5. **Don't add cases to `src/data/patients.ts` or `src/data/polyclinicPatients.ts`.** Those files are migration sources only.
