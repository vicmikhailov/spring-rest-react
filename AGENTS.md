# AI Guide for spring-rest-react

- **Architecture snapshot**: Spring Boot backend (`src/main/java/ca/mikhailov/srr`) exposes a single controller (`DashboardController`) with hardcoded dashboard data; React + Vite frontend (`web/src`) fetches those endpoints and renders a shadcn/ui dashboard. Build is unified via Maven with frontend-maven-plugin bundling the Vite output into Spring static assets.
- **Backend endpoints & payloads** (`DashboardController.java`):
  - `GET /api/total-revenue -> number`, `GET /api/subscriptions -> number`, `GET /api/sales -> number`, `GET /api/active-now -> number`.
  - `GET /api/monthly-revenue -> MonthlyRevenueData { totalRevenue:number, subscriptions:int, sales:int, activeNow:int, revenueSeries: SeriesPoint[label:string,value:number][] }`.
  - `GET /api/recent-sales -> RecentSale { name:string, email:string, amount:number, initials:string }[]`.
  - Records defined inline; data is in-memory; Javadoc provides contracts and Java-React analogies.
- **Frontend data flow** (`web/src/App.tsx`):
  - React 19 + Vite 8 stack.
  - On mount (`useEffect`), `Promise.all` fetches all six endpoints; state defaults to 0/[] to avoid undefined renders and uses fetched values when available (UI still shows seeded defaults if requests fail).
  - Component code is heavily documented with **Java Developer Analogies** to explain React concepts (State, Props, Effects, JSX).
  - Layout composed from shadcn/ui components under `web/src/components/ui/*`; charts via Recharts in `BarChart` helper; currency formatted by `formatCurrency` helper.
  - Sidebar/nav lives in `AppSidebar`; recent sales list keyed by email; stat cards expect pre-formatted strings.
- **Shared frontend conventions**:
  - Path alias `@/*` mapped to `web/src/*` (see `tsconfig.json`); import UI pieces using `@/components/...`.
  - Tailwind CSS v4 via `styles.css` with `@import "tailwindcss"`, `@import "tw-animate-css"`, `@import "shadcn/tailwind.css"`, and Geist font import (`@fontsource-variable/geist`), plus custom theme tokens; no separate `tailwind.config.js` or `postcss.config.js`. Prefer utility classes over inline styles; use `cn` helper (`components/lib/utils.ts`) to merge classes.
  - Custom hooks live in `components/hooks` (e.g., `useIsMobile` for responsive checks); hooks follow `use*` naming and manage cleanup in returned functions.
  - **TUTORIAL.md**: `web/TUTORIAL.md` provides a deep dive for Java developers into the React/Tailwind/TS stack.
- **Build & run workflows** (from `README.md`/`pom.xml`):
  - Dev split: `./mvnw spring-boot:run` (backend on :8080) and `pnpm dev` in `web/` (frontend on :5173, proxies `/api` to :8080 via `vite.config.ts`).
  - Production: `./mvnw clean package` installs Node 22.22.1/pnpm 10.32.1, runs `pnpm install`, `pnpm lint`, and `pnpm build` via frontend-maven-plugin, drops built assets into `src/main/resources/static`, then packages the Spring Boot jar.
  - Run packaged app: `java -jar target/spring-rest-react-0.0.1-SNAPSHOT.jar` (serves both API and static frontend on :8080).
- **Testing state**: Only context-load smoke tests (`src/test/java/ca/mikhailov/srr/DashboardControllerTest.java` and `src/test/java/ca/mikhailov/srr/SpringRestReactApplicationTests.java`); no endpoint assertions. Add controller tests when changing payloads to keep contract stable.
- **Integration touchpoints**:
  - Vite build output path (`vite.config.ts -> build.outDir ../src/main/resources/static`) is coupled to Spring static serving—keep in sync if paths move.
  - API base path `/api` hardcoded on both sides; adjusting requires matching updates in `App.tsx` fetch calls and Vite proxy config.
  - Swagger available at `/swagger-ui/index.html` when backend runs (springdoc dependency in `pom.xml`).
- **AI-notes**: No other repo-level agent/copilot rules found beyond `README.md`; follow this file for project-specific guidance.

