# Verification Flow Design

This document outlines the new post-signup verification experience. The goal is to require every new player to complete a one-line Tetris challenge before they are considered verified.

## High-Level Flow

1. **Signup Success** – `SignUpPage` receives the created player payload from `/api/dev-auth/signup`.
2. **Transition to Verification Intro** – App stores the pending user and switches to the `verification-intro` view.
3. **Verification Instructions Screen** – Presents the purpose of the challenge, the controls (keyboard + touch), and a “Launch Challenge” button.
4. **Tetris Verification Game** – The player must drop pieces into a 10×20 grid. Completing at least one line marks success.
5. **Completion** – On success, the game notifies App, which promotes the pending user to the signed-in user and returns to the dashboard state.

## Components & State

- `App.jsx`
  - new state: `pendingUser`, `view` (adds `verification-intro`, `verification-game`).
  - on signup: `setPendingUser(user); setView('verification-intro')`.
  - on verification success: `setUser(pendingUser); setPendingUser(null); setView('dashboard')`.

- `SignUpPage`
  - new prop `onSuccess(user)`.
  - invokes `onSuccess(data.user)` after a successful signup.

- `VerificationIntro.jsx`
  - shows challenge overview, controls reference, and CTA to start.

- `TetrisVerification.jsx`
  - implements full Tetris gameplay including keyboard handler and touch gamepad overlay.
  - props: `onSuccess()`, `onExit()`.

- `components/tetris/` helpers
  - `constants.js` – piece shapes, rotation states.
  - `useTetrisEngine.js` – hook to manage board state, movement, collision, line clearing, next piece queue.
  - `GamepadControls.jsx` – renders circular touch buttons and translates taps to engine commands.

## Verification Success Criteria

- A single cleared line is sufficient.
- On success, the engine calls `onSuccess()` which App uses to mark the user verified.
- If the player exits early, we return them to the intro screen.

## UX Notes

- Keep the pixel aesthetic consistent with existing styles.
- Instruction screen uses the same color palette and fonts.
- Game view includes next-piece preview and displays remaining requirement ("Clear 1 line to verify").
- Touch controls: four circular buttons positioned bottom-right/left for directional + rotation actions.

## Future Enhancements (optional)

- Track total lines cleared and store verification timestamp.
- Add sound effects for line clears and piece drops.
- Persist verification state to backend.
