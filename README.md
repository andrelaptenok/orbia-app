### Orbia – Interactive World Explorer

Orbia is a React + TypeScript app for exploring countries of the world via an interactive 3D globe and a data‑driven table.

---

## Overview

- **3D globe** built with Three.js and `three-kvy-core`
- **Interactive markers** for each country (click to select, hover to highlight)
- **Country details** (flag, capital, region, population, languages, codes)
- **Table view** with search, filters, sorting and virtualization
- **URL sync** – selected country is reflected in `?country=XX`
- **Responsive UI** – works on desktop and mobile

---

## Tech Stack

- **Core**: React 19, TypeScript, Vite
- **3D**: `three`, `@vladkrutenyuk/three-kvy-core`, `camera-controls`
- **Data**: REST Countries API + `@tanstack/react-query`
- **Table**: `@tanstack/react-table`, `@tanstack/react-virtual`
- **Styling**: Tailwind CSS v4, CSS modules, `clsx` + `tailwind-merge`
- **Tooling**: ESLint (flat config), Prettier

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
# App will be available at http://localhost:5173

# 3. Lint & format (optional)
npm run lint
npm run format
npm run format:fix

# 4. Production build & preview
npm run build
npm run preview
```

Requirements: Node ≥ 20.11.0, npm ≥ 10.2.4.

---

## Project Structure

```text
src/
  app/                    # App shell, router
  pages/                  # Route-level pages (Home)
  widgets/
    country-explorer/     # Main UI: globe + table + details
      model/              # useCountryExplorer, URL & layout logic
      ui/                 # CountryExplorer, header, tabs, skeletons
  features/
    country-globe/        # GlobeViewer (3D viewer)
    country-table/        # CountryTable, table logic
    country-list/         # Optional list UI
  entities/
    country/              # Country types, API, useCountries, detail panel
  shared/
    api/                  # API client wrapper
    three/                # Globe scene, mesh, markers, camera, resize
    ui/                   # Button, ErrorBoundary, ErrorFallback
    lib/                  # cn(), useDebouncedValue()
    assets/               # earth.webp and other shared assets
  index.css               # Global theme and background
  main.tsx                # App entry
```

---

## How It Works

- On startup, `CountryExplorer`:
  - Loads country data via `useCountries` (React Query).
  - Renders a table with search/filters and a 3D globe side by side.
- `GlobeViewer`:
  - Lazily loads the 3D chunk.
  - Mounts a Three.js scene (`globeScene`) into a container.
  - Synchronizes selection/hover from the table with globe markers.
- Selecting a country (from the table or globe):
  - Updates the URL (`?country=XX`),
  - Rotates the globe to the country,
  - Shows a detail panel with country information.


