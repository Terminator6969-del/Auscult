# MedKit+ Project Reference Guide

This document serves as the central hub for the MedKit+ project. It maps out our goals, project structure, and the external documents we've generated during our planning phase.

## 1. What We Are Trying To Do
We are bootstrapping a health-tech company in South Africa focused on revolutionizing medical education. We are using the MedKit simulator as our base. 
**Our core goals:**
1. Upgrade the clinical realism by implementing the **MedKit Case Standard (MCS v1.0)** (9-layer deep patient personas).
2. Build an **Institutional Dashboard** to sell to medical schools (B2B curriculum tracking & accreditation).
3. Add **Leagues & Gamification** to drive medical student engagement (B2C).
4. Prove the concept in the South African market and eventually partner with investors for global expansion.

## 2. Where Everything We've Done Is (Artifacts)
During our initial planning, we generated several extensive documents. Because they are reference artifacts, my system automatically stored them in a persistent background directory. Here are the direct links to them:

- **[Architecture Overview](file:///Users/kev/.gemini/antigravity-ide/brain/2604bb26-97c7-4601-9093-7266d7881fc9/architecture_overview.md):** A detailed breakdown of how the existing codebase, FastAPI backend, and LiveKit voice worker currently function.
- **[Product Requirements Document (PRD)](file:///Users/kev/.gemini/antigravity-ide/brain/2604bb26-97c7-4601-9093-7266d7881fc9/PRD.md):** The phased roadmap for our bootstrapping strategy, extracted from the `Auscult.docx` spec.
- **[Auscult Raw Text (Scratch)](file:///Users/kev/.gemini/antigravity-ide/brain/2604bb26-97c7-4601-9093-7266d7881fc9/scratch/auscult.txt):** The raw text extraction of the original `Auscult.docx` specifications.

## 3. Everything In Our Project (Codebase Structure)
The current project is located at `/Users/kev/Desktop/Auscult/`.

### Frontend (`/src`)
- `game/store.ts`: The central state manager for the entire application (no Redux).
- `data/`: Contains patient cases, tests, and treatments. **(Our next target is refactoring `patients.ts` to support the MCS v1.0 standard)**.
- `components/`: React UI components.
- `components/three/`: 3D environment scenes (ER & Polyclinic).
- `voice/`: LiveKit connection and browser microphone logic.
- `agents/`: Claude Managed Agents integration (the attending grader).

### Backend (`/backend`)
- `server.py`: FastAPI server that proxies the Anthropic API (for the attending grader) and mints LiveKit tokens.
- `voice_agent.py`: The Python worker that handles the real-time voice loop: Deepgram (STT) -> Claude Haiku (LLM) -> Cartesia (TTS).

### Other Important Files
- `CLAUDE.md`: Internal guidelines for writing code in this repository.
- `scripts/verify/`: Scripts to test the integrity of the clinical data.
- `Auscult.docx`: The original master specification document containing the MCS v1.0 architecture and dashboard designs.
