# DataForge AI Coding Instructions

## Project Overview
DataForge is a CRM data generation tool built with React + TypeScript + Vite. The application allows users to select predefined data scenarios (B2B Tech Company, E-commerce Store, etc.) to populate CRM systems with realistic sample data.

## Architecture & Tech Stack

### Core Technologies
- **Frontend**: React 19.1.1 + TypeScript 5.8.3
- **Build Tool**: Vite 7.1.6 with HMR and Fast Refresh
- **Styling**: Tailwind CSS 4.1.13 with custom design system
- **Icons**: Material Symbols (Google Icons)
- **Linting**: ESLint with TypeScript and React plugins

### Project Structure
```
src/
├── pages/           # Full-page components (Login, Register, ScenarioSelection, etc.)
│   └── admin/       # Admin-specific pages (AdminDashboard)
├── components/      # Reusable UI components (currently empty - opportunity for refactoring)
├── layouts/         # Layout components (currently empty)
├── lib/            # Utility functions and shared logic (currently empty)
└── assets/         # Static assets (React logo)
```

## Design System & Styling Patterns

### Custom CSS Classes (Now defined in Tailwind config)
The app uses a semantic design token system defined in `tailwind.config.js`:

```javascript
// Design tokens now properly configured:
bg-background-light, bg-background-dark    // Main page backgrounds
bg-content-light, bg-content-dark          // Card/panel backgrounds  
text-text-primary-light, text-text-primary-dark
text-text-secondary-light, text-text-secondary-dark
border-border-light, border-border-dark
text-primary, bg-primary                   // Brand color (#3B82F6)
font-display                               // Inter font family
form-input                                 // Custom input styling class
```

### Component Patterns
- **Full-page layouts**: Consistent header with DataForge branding + navigation + main content
- **Form styling**: `form-input` class used for consistent input styling
- **Dark mode**: Full dark mode support with `dark:` variants throughout
- **Material Icons**: Use `<span className="material-symbols-outlined">icon_name</span>`

## Development Workflow

### Local Development Setup
- Run `npm run dev` to start Vite development server (typically on http://localhost:5173 or 5174)
- The app includes a temporary dev navigation overlay (top-right corner) to switch between pages
- HMR (Hot Module Replacement) works for instant updates during development
- Material Symbols icons are loaded from Google Fonts CDN

### Commands
- `npm run dev` - Start development server with HMR
- `npm run build` - TypeScript compilation + Vite build  
- `npm run lint` - ESLint with React/TypeScript rules
- `npm run preview` - Preview production build

### Key Files
- `vite.config.ts` - Basic Vite config with React plugin
- `eslint.config.js` - Modern ESLint flat config with TypeScript support
- `tsconfig.json` - Project references to app and node configs
- `postcss.config.js` - Tailwind CSS processing
- `tailwind.config.js` - Custom design tokens and theme configuration

## Code Conventions

### Component Structure
- Use functional components with TypeScript interfaces
- Page components follow naming: `*Page.tsx` (e.g., `LoginPage.tsx`)
- Export as default with explicit typing: `const LoginPage: React.FC = () => {}`

### State Management
- Currently uses local React state (`useState`)
- No global state management (Redux/Zustand) - consider for user auth/preferences

### Event Handlers
- Inline event handlers for simple interactions (password visibility toggle)
- Type event parameters: `(e: React.MouseEvent<HTMLButtonElement>)`

## Business Domain

### Data Scenarios
The app revolves around 11 predefined CRM data scenarios:
- B2B Tech Company, E-commerce Store, Marketing Campaign Launch
- Each scenario defines: customers count, companies count, deals count, description
- Located in `ScenarioSelectionPage.tsx` as static data

### User Roles
- **Regular Users**: Access scenario selection, account management
- **Administrators**: Additional access to admin dashboard with user management, system settings, activity monitoring

## Integration Points

### External Dependencies
- Google user avatars (hardcoded URLs in multiple components)
- Material Symbols web font (loaded externally)
- No backend API calls currently implemented

### Missing Infrastructure
- No routing system (React Router) - currently using basic state-based navigation with dev overlay
- No state management for user authentication
- No API integration layer (all data is currently static)
- No error boundary implementation

## Development Priorities

1. **Routing**: Implement React Router to replace temporary dev navigation
2. **Component Library**: Extract reusable components from pages
3. **API Layer**: Create services for data fetching/posting
4. **Authentication**: Implement user session management

## Common Patterns

### Password Visibility Toggle
```typescript
const togglePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
  const input = (e.currentTarget.previousElementSibling as HTMLInputElement | null);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
  const span = e.currentTarget.querySelector('span');
  if (span) span.textContent = input.type === 'password' ? 'visibility' : 'visibility_off';
};
```

### DataForge Logo SVG
Consistent brand logo used across all pages - complex path-based SVG in brand color.

When adding new features, maintain consistency with existing patterns and consider the missing infrastructure components listed above.