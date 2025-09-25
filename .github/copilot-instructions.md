# SimCRM AI Agent Instructions

## Overview
SimCRM is a HubSpot CRM simulation tool with dual architecture: a React frontend simulation and an Express backend with real HubSpot API integration. The simulation engine mimics CRM workflows without API calls, while the server provides production-ready HubSpot integration.

## Architecture

### Frontend Simulation (`src/simulation/SimulationEngine.js`)
- **Core Pattern**: Event-driven simulation with interval-based state progression
- **Data Model**: In-memory records with lifecycle stages (`subscriber` → `marketing_qualified_lead` → `sales_qualified_lead`)
- **Marketing Funnel**: Time-based progression through stages (`new` → `engaged` → `mql` → `sql`/`nurture`)
- **Deal Flow**: Automatic deal creation for SQLs with probabilistic outcomes (60% win rate)
- **Key Method**: `createContactWithCompany()` creates associated contact-company pairs with initial notes

### Frontend UI (Landing Page)
- **Component**: `src/components/LandingPage.jsx`
- **Logo**: Uses the provided image `assets/simcrm_no_background.png` rendered as a single `<img>` centered on the page (`.logo-img`).
	- Sizing is controlled via CSS in `src/styles.css` (currently `width: 100%` with `max-width: 900px`) for an elegant, responsive scale.
- **CTA**: "Click anywhere to continue..." with a stop-motion fade at 12fps using `steps()` animation (`.cta { animation: cta-fade 1s steps(12, end) infinite alternate; }`).
- **Removed Widgets**: The top-right menu pill and the bottom-right audio/volume widget were intentionally removed for a simpler landing.
- **Footer**: Fixed footer bar (`.site-footer`) with navy background and text `©️2025 Black Maige. Game the simulation.`
- **Typography**: Global font is Press Start 2P loaded in `index.html` via Google Fonts.

### Backend API (`server/`)
- **Client Pattern**: `hubspotClient.js` provides retry logic with exponential backoff and rate limit handling
- **Tool Pattern**: Each HubSpot object type has a dedicated tool module (`server/tools/hubspot/`) with CRUD operations
- **Orchestrator Pattern**: High-level workflows in `orchestrator.js` handle multi-object operations and associations
- **Association Management**: Centralized `associations.js` module with correct HubSpot v4 API type IDs and comprehensive association support
	- Additional endpoints exposed in `server/index.js`: `POST /api/create-note`, `POST /api/create-call`, `POST /api/create-task` (best-effort associations applied; failures are logged and do not halt the workflow)

## Development Workflows

### Commands
- `npm run dev` - Start Vite development server (React app)
- `npm run start-server` - Start Express API server on port 4000
- `npm test` - Run Vitest tests
- `npm run build` - Build production React app

### Environment Setup
- Requires `HUBSPOT_API_TOKEN` in `.env` for server functionality
- Server warns but continues without token (simulation works independently)

### PWA & Meta
- **Manifest**: `assets/site.webmanifest` includes non-empty `name`/`short_name` (`SimCRM`), `start_url` and `scope` set to `/`, and colors aligned to the UI grid background (`#f4f5f7`).
- **Icons**: Manifest icons reference existing assets: `/assets/favicon-32x32.png`, `/assets/favicon-16x16.png`.
- **Index wiring**: `index.html` links the manifest and favicons in the `<head>`, and includes an Apple touch icon link.
- **Apple Touch Icon**: Linked in `index.html` via `<link rel="apple-touch-icon" href="/assets/simcrm_no_background.png">`. Replace with a dedicated 180x180 PNG if desired.

## Key Patterns

### ID Generation
Uses prefixed sequential IDs: `genId('ct')` → `ct_1`, `ct_2`, etc. Pattern ensures unique identifiers across object types.

### Error Handling in Tools
- API client handles retries and rate limiting automatically
- Tools return raw HubSpot API responses (`res.data`)
- Orchestrator operations use best-effort association creation (ignores association errors)

### Testing Strategy
- Focus on `SimulationEngine` logic with time manipulation (`c.createdAt = Date.now() - 15000`)
- Tests verify state transitions and data relationships, not API calls
- Uses Vitest with React Testing Library setup

### File Organization
```
src/simulation/         - Frontend simulation logic
src/components/         - Frontend UI components (landing page)
server/tools/hubspot/   - HubSpot object CRUD operations
server/                 - API orchestration and client
test/                   - Simulation engine tests
assets/                 - Images, icons, audio, manifest
```

## Frontend UI Rules (Always Apply)

These rules are mandatory for all new UI elements, pages, and frontend code. If a tradeoff is required, prioritize these over convenience. Deviations must be called out explicitly in reviews.

### Color Palette (Hex)
- Light Gray Background: `#e8e8e8`
- Slate Gray Frame: `#6c7b7f`
- Charcoal Gray Shell: `#8a8a8a`
- Olive Green Screen: `#8fbc8f`
- Sage Input Fields: `#9fb89f`
- Dark Red Button: `#8b0000`
- Dark Green Text: `#2d3e2d`
- Navy Blue Title: `#1e3a5f`

### Color Usage Guidelines
- Light Gray (`#e8e8e8`): Main background, neutral areas
- Slate Gray (`#6c7b7f`): Container borders, structural elements
- Charcoal Gray (`#8a8a8a`): Shell/background elements for pixel look
- Olive Green (`#8fbc8f`): Primary interface panels, hero sections
- Sage (`#9fb89f`): Input fields, secondary panels
- Dark Red (`#8b0000`): Primary action buttons, important CTAs
- Dark Green (`#2d3e2d`): Text, labels, secondary actions
- Navy Blue (`#1e3a5f`): Logo text, brand elements, headers

### Typography
- Primary font: Press Start 2P (global). Avoid mixing with other fonts unless required for accessibility.

### Effects
- Gradients: Avoid. If used, must be visibly pixel-stepped (no smooth interpolations).
- Shadows: Allowed (hard drop shadows), avoid gaussian blurs for structural elements.
- Corners: Prefer low radii; use asymmetric bevels only when specified by the design.

### Components
- Buttons: Use palette colors; thick borders (3–4px), slight drop shadow, no smooth gradients; text in white where specified.
- Inputs: Sage background, dark green text, thick borders (3px), squared/pixel corners.
- Screens/Panels: Slate frames with clear borders; if green “screen,” use Olive with crisp frame.

See `.github/ui-rules.md` for extended guidance and examples.

## Integration Points

### HubSpot Objects
All tools follow consistent pattern: `create()`, `get()`, `update()`, `delete()`, `batchUpsert()` methods. Tools are factories that accept a client instance.

### Association Management
- **Centralized Module**: `server/tools/hubspot/associations.js` handles all association types with correct type IDs
- **Supported Associations**: Contact↔Company, Deal↔Contact/Company, Note↔Contact/Company/Deal, Call↔Contact, Task↔Contact (ownership)
- **API Methods**: Both individual and batch operations, with proper error handling and best-effort association creation
- Frontend: Simple `contact.companyId` property links for simulation

### State Synchronization
Frontend and backend operate independently - no shared state. Backend is stateless, frontend maintains simulation state in `SimulationEngine` instance.