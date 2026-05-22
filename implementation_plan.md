# Phase 1: MedKit Case Standard (MCS v1.0) Implementation

This plan outlines the steps to upgrade our data architecture from the current "flat" patient model to the highly realistic 9-layer "Onion Model" specified in the `Auscult.docx` document, and to localize our first pilot cases for South Africa.

## User Review Required

> [!WARNING]
> **Library Reduction for Pilot:** 
> Currently, the app loads ~80 simple cases from `src/data/polyclinicPatients.ts`. Upgrading all 80 cases to the massive 9-layer standard is not feasible for an initial pilot. 
> **Decision:** I plan to temporarily remove/hide the 80 polyclinic cases and focus entirely on building **3 ultra-high-quality, deep, localized cases** in `src/data/patients.ts` for your initial South African pilot. Is this acceptable?

## Open Questions

> [!IMPORTANT]
> **Pilot Case Selection:** 
> For the 3 South African localized pilot cases, I am thinking of selecting high-yield, common presentations that test the student's clinical reasoning well. For example:
> 1. **Internal Medicine / Infectious Disease:** A young patient presenting with weight loss and cough (Pulmonary TB with underlying HIV).
> 2. **Emergency Medicine:** A patient presenting with DKA (Diabetic Ketoacidosis) due to running out of insulin at a public clinic.
> 3. **Cardiology/IM:** A patient with acute severe hypertension or an atypical STEMI presentation.
> 
> Do these three cases sound good for your pilot, or would you prefer different conditions?

## Proposed Changes

### 1. Data Schema Refactor
#### [MODIFY] [types.ts](file:///Users/kev/Desktop/Auscult/src/game/types.ts)
- Completely redesign the `PatientCase` interface to implement the 9 layers:
  - **Layer 1: Identity:** Demographics, occupation, health literacy level, and personality archetype (e.g., Stoic, Anxious, Guarded).
  - **Layer 2: Clinical State:** Hidden timeline, actual disease staging, and actual vitals.
  - **Layer 3: History (Onion Model):** Replace the flat `AnamnesisQA[]` with a structured `Surface`, `Middle`, and `Deep` history layers.
  - **Layer 4-9:** Add types for Investigations, Diagnosis, Management, and Educational Metadata.

### 2. Prompt Engineering Upgrade
#### [MODIFY] [patientPersona.ts](file:///Users/kev/Desktop/Auscult/src/voice/patientPersona.ts)
- Update the system prompt fed to Claude Haiku to understand the new "Onion Model".
- **Instruction Change:** The AI must only reveal "Surface" symptoms initially. It will only reveal "Middle" or "Deep" history if the medical student asks the exact right, probing questions.
- Inject the "Personality Archetype" and "Health Literacy" into the prompt so the patient speaks realistically (e.g., a "Stoic" patient will downplay pain; a patient with "Low Health Literacy" will not use medical terms).

### 3. Case Library Update & Categorization
#### [MODIFY] [patients.ts](file:///Users/kev/Desktop/Auscult/src/data/patients.ts)
- Wipe the old 6 prototype cases.
- Author the 3 new, deeply detailed South African pilot cases using the new schema.
- **Categorization Plan:** We will export these cases in a dictionary mapped by department (e.g., `emergency`, `internal-medicine`, `cardiology`), mirroring the existing `ClinicId` system. This guarantees that any future cases you add can simply be dropped into the correct department array and they will automatically show up in the correct clinic room in the app.

#### [MODIFY] [cases.ts](file:///Users/kev/Desktop/Auscult/src/data/cases.ts)
- Update the loader to read the new categorized dictionary from `patients.ts` instead of `polyclinicPatients.ts`.
- Ensure the UI correctly filters the 3 high-fidelity pilot cases into their respective departments.

## Verification Plan

### Automated Tests
- Run `npm run check` (TypeScript compiler) to ensure the new `PatientCase` type does not break the `Store` or the `EncounterScreen.tsx` components that read from it.

### Manual Verification
- Start the dev server.
- Enter a consultation with one of the new SA pilot cases.
- Attempt to ask a "Deep" history question directly and verify the AI patient holds back information until probed correctly.
- Verify the "Attending Agent" correctly parses the new data structure during the grading phase.
