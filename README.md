# SimCRM - HubSpot Simulation

Lightweight React + Vite app that simulates HubSpot CRM activity by creating contacts, companies, associations, notes, deals and progressing them through marketing and sales stages.

## Onboarding Configuration Flow (Current UI)

After authentication the user is guided through a linear configuration pipeline:

1. SaaS Selection (HubSpot path enables token setup)
2. HubSpot Token Setup & Validation (only when HubSpot chosen)
3. Theme Selection (12-tile grid)
4. Distribution Method Selection (9-tile grid; CUSTOM center)
5. Scenario Selection (B2B vs B2C)

Each step includes back navigation and an 8‑bit pluck sound for interactions. Selections are ephemeral (not persisted yet). Upcoming work: persist these choices and surface a summary before launching simulations.

Scenario & distribution metadata live in:
* `src/components/Distribution/distributionOptions.js`
* `src/components/Scenario/scenarioOptions.js`

Planned semantics (scenarios) include: lead volume multiplier, sales cycle duration, funnel attrition, deal size distribution, contact:company ratio. These will feed the job queue scheduling + record creation layer (see `docs/job-queue-architecture.md`).

Getting started

1. Install dependencies:

```powershell
npm install
```

2. Run the dev server:

```powershell
npm run dev
```

3. Run tests:

```powershell
npm test
```

Notes

- This is a local simulation only and does not call HubSpot APIs. It is structured so real API calls could be swapped into the SimulationEngine.
 - Per-user HubSpot Private App tokens are now supported & encrypted at rest. See `docs/integrations-hubspot-tokens.md`.
 - Upcoming: `docs/scenarios.md` (in progress) will describe B2B/B2C parameterization once persistence + job queue integration lands.
 - Job Queue groundwork added: `simulations` table migration, BullMQ queue (`simulation-jobs`), `server/worker.js` consumer, and simulation API endpoints (`/api/simulations`).

## Tetris Verification Mini-Game Modes

The verification mini-game supports two mechanics profiles selectable via the `mode` prop on `TetrisVerification` (current default = classic for authenticity):

| Mode | Preview | Ghost | Hard Drop | Soft Drop | DAS/ARR | Gravity Scaling | Line Clear Delay | Randomizer |
|------|---------|-------|-----------|-----------|---------|-----------------|------------------|------------|
| enhanced | ✅ | ✅ | ✅ | Hold Down (accelerated) | Disabled by default | Optional off (fixed) | 0 ms | Pure RNG |
| classic (default) | ❌ | ❌ | ❌ | Per-frame descent while held | Enabled (170ms DAS / 50ms ARR) | Enabled (Game Boy style table) | 250 ms | Pure RNG |

Configuration flags are merged from a base config plus classic overrides. Internals are in `src/components/tetris/useTetrisEngine.js`.

Key implementation notes:

- Rotation has no wall/floor kicks; O piece rotation is a no-op – preserves classic behavior.
- Unified requestAnimationFrame loop handles gravity progression and DAS/ARR lateral auto-shift.
- Soft drop behavior: classic performs a downward attempt every frame while Down is held (independent of gravity timer). Enhanced uses gravity only unless hard drop or future accelerations added.
- Line clear delay (classic) freezes gravity and spawns the next piece after 250ms to emulate original pacing.
- Randomizer abstraction supports future 7‑bag (`bag7`) but defaults to `pure` for both modes (1989 GB used pure RNG).
- Ghost and next preview are conditionally stripped from engine output when disabled to avoid rendering conditionals leaking state.

Example usage forcing classic mode:

```jsx
<TetrisVerification mode="classic" onSuccess={...} onExit={...} />
```

Enhanced mode is opt-in: pass `mode="enhanced"`.

Bug fixes / authenticity adjustments:
- Hard drop now locks synchronously (no frame delay) and is disabled entirely in classic mode.
- Soft drop implementation no longer piggybacks on gravity tick; it is frame-based for classic accuracy.

## Authentication & Password Storage

The current auth layer provides development-oriented signup/login with the following characteristics:

- Table: `users` (auto-migrated from legacy `dev_users` if present via runtime logic or Knex migration).
- Password format: `password_hash` column using `scrypt:<salt>:<hash>` (Node.js crypto.scryptSync 64-byte derivation, hex encoded).
- Legacy columns (`cred_salt`, `cred_hash`) are read only if they still exist; new inserts avoid them unless present.
- Runtime guard `ensureUsersTable()` performs minimal, idempotent adjustments; formal schema is managed through Knex migrations.

### Migration / Schema Management

Knex is included for explicit schema management.

Scripts:
```powershell
npm run migrate:latest   # Apply pending migrations
npm run migrate:list     # Show migration status
```

Initial migration: `20250926_initial_users.js` will rename `dev_users` → `users` if needed, create a clean table otherwise, and backfill `password_hash` from legacy columns where appropriate.

### Security Notes & Next Steps

- Replace synchronous scrypt with async scrypt or Argon2id (recommended) before production exposure.
- Add UNIQUE(emailId) and UNIQUE(playerNameId) constraints via a future migration (currently only indexed).
- Add rate limiting & account lockout for brute-force mitigation.
- Implement session or JWT issuance (none yet—responses are stateless success objects only).
- Introduce versioned hash format (e.g., `algo:v1:salt:hash`) to enable future rotations.
- Remove legacy columns after confirming all rows hold non-null `password_hash`.

### Environment Variables (DB Auth)
```powershell
DB_HOST=localhost
DB_USER=your_user
DB_PASS=your_pass
DB_NAME=simcrm
DB_PORT=3306
TOKEN_ENC_SECRET=32-byte-random-secret-value
# HUBSPOT_API_TOKEN (optional legacy global token; not required)
```

Optional override for JSON dev fallback location:
```powershell
DEV_AUTH_DATA_FILE=absolute\path\to\dev-auth.json
```

## Production Data Policy (No Dummy / Placeholder Data)

All new code MUST avoid the use of fake, dummy, sample, example, or placeholder values in any execution path that impacts:
- Authentication / user identity
- HubSpot credential storage or validation
- Database persistence
- External API calls

Rules:
1. Do not auto-fallback to synthetic user IDs (e.g. `demo-user`). A real authenticated `user.id` is required; otherwise the request fails fast (400).
2. No length-based token heuristics; validation must rely on a real HubSpot API response.
3. Test helpers must be clearly isolated (unit tests only) and never leak mock tokens or stubbed identifiers into runtime modules.
4. Encrypted secrets remain encrypted at rest; never log decrypted tokens.
5. Any temporary instrumentation must be removed before commit (no `console.log` of secrets, no sandbox keys).
6. If a required runtime value (env var, user id, token) is absent, abort with an explicit error; do not silently substitute.

Contribution Gate:
Before merging, review changes for: (a) accidental reintroduction of placeholders, (b) broad try/catch swallowing production errors, (c) mock-only flows.

Violation Handling:
A found violation triggers immediate PR block until remediated. Repeat issues require adding automated lint/AST rule.

