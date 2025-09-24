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

### Backend API (`server/`)
- **Client Pattern**: `hubspotClient.js` provides retry logic with exponential backoff and rate limit handling
- **Tool Pattern**: Each HubSpot object type has a dedicated tool module (`server/tools/hubspot/`) with CRUD operations
- **Orchestrator Pattern**: High-level workflows in `orchestrator.js` handle multi-object operations and associations
- **Association IDs**: Uses HubSpot v4 associations API with hardcoded type IDs (contact→company: 1, deal→contact: 5, deal→company: 3)

## Development Workflows

### Commands
- `npm run dev` - Start Vite development server (React app)
- `npm run start-server` - Start Express API server on port 4000
- `npm test` - Run Vitest tests
- `npm run build` - Build production React app

### Environment Setup
- Requires `HUBSPOT_API_TOKEN` in `.env` for server functionality
- Server warns but continues without token (simulation works independently)

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
server/tools/hubspot/   - HubSpot object CRUD operations
server/                 - API orchestration and client
test/                   - Simulation engine tests
```

## Integration Points

### HubSpot Objects
All tools follow consistent pattern: `create()`, `get()`, `update()`, `delete()`, `batchUpsert()` methods. Tools are factories that accept a client instance.

### Association Management
- Frontend: Simple `contact.companyId` property links
- Backend: Uses HubSpot v4 associations API with PUT requests
- Association failures are silently ignored in orchestrator workflows

### State Synchronization
Frontend and backend operate independently - no shared state. Backend is stateless, frontend maintains simulation state in `SimulationEngine` instance.