
# SimCRM — Copilot / AI Agent Instructions (concise)

Purpose: give an AI coding agent the essential, codebase-specific facts to be productive quickly. Read the referenced files for examples before editing.

Quick facts
- Frontend simulation (in-memory): `src/simulation/SimulationEngine.js` — event-driven, interval ticks, staged lifecycle (subscriber → mql → sql). Key helper: `createContactWithCompany()`.
- Backend API (stateless Express): `server/` — `hubspotClient.js` (retry/backoff + rate-limit handling), `server/tools/hubspot/*` (tool modules), `orchestrator.js` (multi-object workflows).
- Associations central mapping: `server/tools/hubspot/associations.js` (HubSpot v4 type IDs) — use this when creating associations server-side.

How to run (developer defaults)
- Frontend dev: `npm run dev` (Vite).
- API server: `npm run start-server` (Express, default port 4000).
- Tests: `npm test` (Vitest; tests under `test/`).
- Build: `npm run build`.

Environment
- Optional: set `HUBSPOT_API_TOKEN` in `.env` for real API calls. Server logs a warning if absent but keeps running (simulation-only mode).

Project conventions & patterns (do not change without matching examples)
- ID generation: prefixed sequential IDs (see `src/simulation/SimulationEngine.js` usage like `genId('ct')` → `ct_1`). Keep this prefix pattern when adding simulated objects.
- Tool factory pattern: each file in `server/tools/hubspot/` exports a factory that accepts a `client` and returns methods `create, get, update, delete, batchUpsert`.
- Client responsibilities: `server/hubspotClient.js` centralizes HTTP retries, exponential backoff, and rate-limit handling. Use it rather than raw axios/fetch.
- Association handling: use `associations.js` mapping for correct type IDs and prefer batch association helpers when available.

Testing notes (examples)
- Simulation tests manipulate time-like fields: set `c.createdAt = Date.now() - X` to force state transitions (see `test/simulation.test.js`).
- Tests focus on deterministic simulation behavior and relationships — they avoid external HubSpot calls.

Where to change for common tasks
- Add a new HubSpot object/tool: create `server/tools/hubspot/<object>.js` following existing tool files; accept `client` and return CRUD methods.
- Add simulation behavior: edit `src/simulation/SimulationEngine.js` and update tests in `test/` accordingly.
- Add orchestrated workflows: `server/orchestrator.js` shows patterns for multi-object operations and best-effort association creation.

Gotchas & quick warnings
- Frontend simulation should not call HubSpot tools directly. Production HubSpot calls live in `server/` only.
- Associations must use numeric type IDs from `associations.js` (HubSpot v4). Mistyping these silently fails.

If something is missing
- Ask for the specific file or flow you want to modify. Point to a concrete example (file and function) and the agent will follow the local patterns.

Feedback
Please review these notes and tell me if you'd like more examples (small code snippets) for any pattern, or if you'd prefer a longer form with do/don't lists.