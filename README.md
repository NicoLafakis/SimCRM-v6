# SimCRM - HubSpot Simulation

Lightweight React + Vite app that simulates HubSpot CRM activity by creating contacts, companies, associations, notes, deals and progressing them through marketing and sales stages.

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
