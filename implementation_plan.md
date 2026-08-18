# MedLoop Frontend Implementation Plan

Build the frontend for the MedLoop medication adherence tracker according to the specified design system and functionality constraints.

## User Review Required

> [!IMPORTANT]
> The prompt mentions using Google Stitch for initial layout generation. Since I do not have access to the exported Stitch code, **I plan to build the UI components from scratch** using standard React/Vite according to your detailed ASCII layouts and design tokens. If you have the Stitch HTML/CSS exports and want me to use those, please provide them or upload them to the workspace before approving this plan!

## Proposed Architecture & Stack
- **Framework:** React with Vite (`npx create-vite`)
- **Language:** TypeScript
- **Styling:** Vanilla CSS (no Tailwind, per requirements) with CSS Variables for the exact color tokens.
- **Routing:** A simple state-based router or `react-router-dom` to switch between Patient View and Caretaker Dashboard (since there are only two views).

## Proposed Changes

### 1. Project Initialization & Setup
- Initialize the Vite React project in the current directory.
- Add Google Fonts for `Fraunces` (variable, italic) and `Inter` (with tabular nums).
- Setup `index.css` with the exact color tokens (`--ink`, `--paper`, etc.).

### 2. Core UI Components
- **PulseRing:** A reusable SVG-based circular progress ring component.
  - Used in Patient View (ambient, quiet, fills as time approaches).
  - Used in Caretaker Dashboard (shows 7-day adherence %, color-coded).
- **Cards & Buttons:** Base components matching the 24px soft corner radius and typography scales.

### 3. Patient View (Screen)
- Single column layout on `--paper` background.
- Display huge current time, medication card, and the "I TOOK IT" button.
- Integrate optimistic update logic with the 300ms motion morph on button tap.
- Ensure large touch targets (48px+) and high contrast.

### 4. Caretaker Dashboard (Screen)
- Dark theme layout on `--surface-dark` background.
- Top Insight Card: Ring with risk pill, summary in Fraunces italic, regenerate button.
- Timeline section: Weekly day chips and medication counts.

### 5. API Client Mocking
- Create `api.ts` exposing the 4 required methods:
  - `markDose`
  - `getTodaysMeds`
  - `getAdherenceHistory`
  - `generateAIInsight`
- Implement these with in-memory state so the app works end-to-end locally before the backend is ready.

## Verification Plan

### Automated Tests
- No automated tests are explicitly required, but I will ensure the TypeScript compiler checks pass.

### Manual Verification
- Run `npm run dev`.
- Verify the Patient View rendering, touch targets, and the checkmark motion.
- Verify the Caretaker Dashboard rendering, adherence calculations, and the ring-draw loading state.
- Test responsive layout on narrow mobile viewports.
