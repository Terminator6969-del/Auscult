---
name: medkit-structured-debugging
description: Use when something is broken and you don't immediately know why — voice pipeline glitches, Managed Agent event stream failures, type errors cascading from the 9-layer model, or 3D scene regressions. NOT for obvious one-liner fixes.
---

# medkit — structured debugging

4-phase root-cause debugging tailored to Auscult's failure modes. The rule: reproduce → isolate → fix → verify. No shotgun debugging, no "let me just restart and see."

## When to Use

- Voice pipeline: patient can't be heard, STT isn't transcribing, TTS cuts mid-sentence, audio never arrives.
- Managed Agent event stream: `render_case_evaluation` never fires, stream disconnects silently, agent responds with wrong model.
- Type errors: `PatientCase` schema change breaks the store, `Case` → `PatientCase` stub falls back incorrectly.
- 3D scene: character clips through furniture, mesh doesn't render, interaction stops working.
- `npm run build` fails after a data edit.

Do NOT use for trivial errors with obvious fixes (typos, missing imports, wrong variable names).

## Phase 1: Reproduce

Before touching any code, confirm the failure is real and consistent.

- **Voice:** Start both backend processes (`backend/server.py` + `backend/voice_agent.py dev`), open the browser, accept a patient, verify the mic permission, check the browser console for LiveKit connection logs. Does it fail every time or intermittently?
- **Agent events:** Open the Network tab, filter for `/agent/sessions/`, watch the SSE stream. Does it connect? Does it receive `agent.custom_tool_use` events? Does it idle with `requires_action`?
- **Type errors:** Run `npm run build` (not just `npm run dev` — Vite's dev mode is forgiving). Run `npm run verify`. Same error every time?
- **3D scene:** Load the encounter screen, rotate the camera fully around the room, test all interactables, toggle voice on/off. Does the regression happen on first load or only after a patient change?

Write down the EXACT symptom. "Voice doesn't work" is useless. "RemoteAudioTrack attaches but analyser returns silence" is actionable.

## Phase 2: Isolate

Narrow to the smallest possible reproduction.

### Voice pipeline isolation

The chain is: Browser mic → LiveKit room → Deepgram STT → Haiku LLM → Cartesia TTS → Browser speaker.

To isolate which hop failed:

1. **Is the mic reaching LiveKit?** Check the browser's `Room` object: `room.localParticipant.isSpeaking` should flicker true. If not, the mic isn't publishing — check browser permissions, AudioContext state, or the LiveKit token.
2. **Is STT producing text?** Watch the Python worker logs (`backend/voice_agent.py`). Deepgram should log transcription segments. If you see "NO SPEECH" repeatedly, the audio track isn't carrying voice. If you see `TranscriptionSegment` events but no LLM response, Haiku is the problem.
3. **Is Haiku responding?** The worker logs every LLM call. If it's stuck, check the Anthropic API key, rate limits, or the system prompt length.
4. **Is Cartesia speaking?** The worker logs TTS calls. If TTS fires but the browser hears nothing, the remote audio track isn't being subscribed — check `room.remoteParticipants` and track subscriptions.
5. **Is the browser receiving?** `conversation.ts` hooks `Track.Subscribed` events. Check `remoteAudioTrack.attachedElements.length > 0`.

### Agent event stream isolation

1. **Is the backend up?** `curl http://127.0.0.1:8787/health` — should return agent bootstrapped status.
2. **Is the SSE connecting?** Network tab → filter "/stream". Should show a 200 with `text/event-stream`. If 401, the shared secret or origin check is failing. If CORS error, the allowed origins list is wrong.
3. **Is the session alive?** `GET /agent/sessions/{sid}/events` should return the event array. If empty, the `user.message` never arrived.
4. **Is the agent responding?** If the stream is connected but no events arrive, the agent may be stuck on `requires_action` waiting for a `custom_tool_result` that was never sent. Check `CUSTOM_TOOL_PERMISSIONS` — is the tool `auto` or `confirm`?

### Type error isolation

`npm run build` errors on the 9-layer model usually trace to one of:

- `PatientCase` field added/renamed but a stub in `toPatientCase()` or `toActivePatient()` still uses old names.
- `polyclinicPatients.ts` entries missing new required fields (the old flat format has `name`, `age`, `gender`, `vitals`, `anamnesis` — not `identity`, `clinicalState`, `history`).
- A component destructures a field that moved from top-level into a sub-object (e.g., `c.vitals` → `c.clinicalState.baselineVitals`).

Isolate by running `npx tsc --noEmit 2>&1 | head -20` and tracing the first error to its source.

### 3D scene isolation

- Comment out the `StylizedCharacter` — does the scene render? If yes, the problem is in character mesh construction.
- Comment out furniture one piece at a time — which mesh causes the regression?
- Check `POLYCLINIC_COLLIDERS` — does a new collider overlap an existing one? Run `scripts/verify/three-scene.ts`.

## Phase 3: Fix

Fix ONLY the isolated cause. No adjacent refactors.

- **Voice fix:** If the token mint is failing, check `backend/server.py`'s `/voice/token` endpoint — are the LiveKit env vars set? If the worker isn't picking up the room, check that `agent_name="medkit-voice"` matches on both sides.
- **Agent fix:** If `render_case_evaluation` never fires, the agent's system prompt may have drifted. Read `.claude/skills/medkit-attending-debrief/SKILL.md` for the expected payload shape. If the agent emits `stop_reason: "requires_action"` on a `flag_critical_finding`, the frontend permission is `confirm` but no human clicked approve — the stream is blocked on you.
- **Type fix:** If you added a field to `PatientCase`, update `toPatientCase()` in `store.ts` AND every stub in `polyclinicPatients.ts`. If you changed the shape of `anamnesis` → `history.surface/middle/deep`, update `debriefRequest.ts`'s `buildDebriefRequest()` AND `autoRubric.ts`.
- **3D fix:** If a mesh overlaps, adjust the collider in `POLYCLINIC_COLLIDERS` AND the visual mesh position. They must match. Run `scripts/verify/three-scene.ts`.

## Phase 4: Verify

- `npm run build` must pass.
- `npm run verify` must pass.
- For voice: start both backends, accept a patient, confirm you hear the greeting, speak a question, confirm transcription appears, confirm patient responds audibly.
- For agent: run a full encounter end-to-end, confirm `render_case_evaluation` fires on the debrief screen, confirm all cited guideline_refs resolve.
- For 3D: rotate the camera 360°, walk to every interactable, toggle voice, change patients, confirm no regressions.

If verification fails, go back to Phase 2 — your fix was incomplete or caused a new problem.

## Anti-patterns

- "Let me restart everything and see if it works now" — without isolating the cause, you'll hit the same bug again.
- Adding `console.log` everywhere instead of reading the structured logs the system already emits (LiveKit events, Python worker logs, SSE event stream).
- Changing the code to suppress the error rather than fixing the root cause.
- Refactoring adjacent code "while you're there" — CLAUDE.md says don't do this.
