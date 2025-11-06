# Architecture & Tech Stack

## Tech Stack

### Frontend Core

- **React**: UI library
- **TypeScript**: Static typing
- **Vite**: Build tool
- **React Router DOM**: Routing

### UI & Styling

- **Material-UI (MUI)**: Material Design UI components
- **Emotion**: CSS-in-JS

### Data Management

- **TanStack Query**: Server state management and caching
- **Axios**: HTTP client
- **Zod**: Schema validation

### Mapping

- **Leaflet**: Interactive maps
- **React Leaflet**: React wrapper for Leaflet

### Internationalization

- **i18next**: i18n framework
- **react-i18next**: React integration

### Utilities

- **Lodash**: Utility functions
- **Moment Timezone**: Timezone management

### Testing & Quality

- **Vitest**: Testing framework
- **Testing Library**: React testing
- **ESLint**: Linting
- **Prettier**: Automatic formatting

### Package Manager

- **pnpm**

## `src/` Folder Structure

### `pages/`

Main application pages:

- **AlertsPage**: Active alerts management
- **DashboardPage**: Cameras overview
- **HistoryPage**: Events history
- **LoginPage**: Authentication

### `components/`

React components organized by feature:

- **Alerts/**: Alert system (container, details, labels, list)
- **Dashboard/**: Dashboard (container, camera cards, interactive map)
- **History/**: History (container, list)
- **Live/**: Live video feeds (container, modal, context, hooks)
- **Common/**: Reusable components (Camera, Map, Loader, etc.)
- **Topbar/**: Navigation (desktop, mobile, language switcher)
- **Login/**: Authentication (form, logout, protected routes)

### `services/`

Abstraction layer for API calls:

- Axios configuration and services for alerts, auth, camera, live, occlusionMasks

### `utils/`

Utility functions and custom hooks:

- Helpers for alerts, camera, dates, live
- Authentication token management
- Hooks: `useIsMobile`, `useTranslationPrefix`

### `context/`

Global state management:

- **AuthContext/AuthProvider**: Authentication context
- **useAuth**: Context access hook

### `locales/`

Internationalized translation files (en, es, fr)
