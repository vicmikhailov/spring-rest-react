# AI Guide for `spring-rest-react`

This file is intended to be a **verified repo guide**, not a generic framework cheat sheet. Prefer facts that are
traceable to the current codebase over assumptions based on older versions or templates.

## Architecture snapshot

- **Backend**: Spring Boot `4.0.3` app (currently pinned in `pom.xml`) in `src/main/java/ca/mikhailov/srr` with a single
  controller, `DashboardController`.
- **Frontend**: React + Vite app in `web/src` rendering a shadcn/ui-style dashboard.
- **Packaging**: Maven drives both sides of the build. The Vite production build is emitted into Spring's static
  resources directory so the packaged JAR serves both API and frontend.
- **Data source today**: Dashboard data is generated in-memory inside `DashboardController`; values are intentionally
  jittered on each request. `spring-boot-starter-data-jpa` and H2 are present in `pom.xml`, but the current dashboard
  flow does not persist or query real entities.

## Backend API contract (`src/main/java/ca/mikhailov/srr/DashboardController.java`)

The current API does **not** return bare primitives or arrays. Each endpoint returns an object wrapper record.

- `GET /api/total-revenue -> { totalRevenue: number }`
- `GET /api/subscriptions -> { subscriptions: number }`
- `GET /api/sales -> { sales: number }`
- `GET /api/active-now -> { activeNow: number }`
- `GET /api/revenue-series -> { revenueSeries: { label: string, value: number }[] }`
- `GET /api/recent-sales -> { recentSales: { name: string, email: string, amount: number, initials: string }[] }`

Additional notes:

- The previously documented `/api/monthly-revenue` endpoint is **not** present in the current codebase.
- Response records are defined inline in `DashboardController`.
- Because the controller randomizes values per request, consumers and tests should validate **shape and reasonable
  ranges**, not exact numeric snapshots.

## Frontend data flow (`web/src/App.tsx`)

- The frontend currently uses **React 19**, **TypeScript**, **Vite 8**, **Tailwind CSS v4**, **Recharts**, and
  shadcn/ui-style components.
- `App.tsx` owns the dashboard state and fetch logic.
- Numeric dashboard state is initialized as `undefined`; collection state starts as `[]`.
- The UI uses seeded demo fallbacks via the nullish coalescing operator (`??`) so the dashboard remains populated while
  data is loading or if refresh requests fail.
- `useEffect` does **not** only fetch once. It:
  - fetches all six endpoints in parallel with `Promise.all`,
  - runs immediately on mount, and
  - refreshes every 5 seconds via `setInterval`, with cleanup on unmount.
- The component is heavily documented with Java analogies; keep that educational style intact when editing unless the
  user explicitly asks for a cleanup.
- `AppSidebar` is defined inside `App.tsx` today; it is not a separate file.
- The recent-sales list is keyed by email.
- `StatCard` expects already formatted strings; `formatCurrency` handles monetary formatting.

## Shared frontend conventions

- Path alias `@/*` maps to `web/src/*` in `web/tsconfig.json`.
- Prefer imports like `@/components/ui/button` over long relative paths.
- Tailwind uses the **CSS-first v4 setup** in `web/src/styles.css` plus the Vite plugin in `web/vite.config.ts`.
- There is currently **no** `tailwind.config.js` or `postcss.config.js` in the repo.
- `web/components.json` still references `tailwind.config.js`; treat that as tool metadata, not as the source of truth
  for the actual build setup.
- Prefer utility classes over inline styles.
- Use the `cn` helper in `web/src/components/lib/utils.ts` when composing conditional class names.
- Custom hooks live under `web/src/components/hooks` and should keep the `use*` naming convention and proper cleanup
  behavior.
- `web/TUTORIAL.md` is the in-repo learning guide for Java developers new to the frontend stack.

## Build and run workflows (`pom.xml`, `README.md`, `web/package.json`, `web/vite.config.ts`)

- Local split-dev workflow:
  - backend: `./mvnw spring-boot:run`
  - frontend: from `web/`, run `pnpm install` then `pnpm dev`
- The Vite dev server proxies `/api` to `http://localhost:8080`.
- Production packaging is driven by `./mvnw clean package`.
- The Maven build currently pins and installs Node.js `v22.22.1` and pnpm `10.32.1` through `frontend-maven-plugin`.
- The Maven build currently runs:
  - `pnpm install`
  - `pnpm build`
  - `pnpm lint`
- Vite outputs production assets to `src/main/resources/static` via `build.outDir`.
- `emptyOutDir: true` is enabled in `web/vite.config.ts`, so do not manually edit generated files under
  `src/main/resources/static`.
- Packaged app entry point remains:
  - `java -jar target/spring-rest-react-0.0.1-SNAPSHOT.jar`

## Testing state and recommended practice

- Current automated tests are still smoke tests only:
  - `src/test/java/ca/mikhailov/srr/DashboardControllerTest.java`
  - `src/test/java/ca/mikhailov/srr/SpringRestReactApplicationTests.java`
- There are no controller contract assertions yet.
- If you change endpoint paths, response field names, wrapper records, or frontend fetch assumptions, add or update
  controller tests in the same change.
- For this repo, `MockMvc` JSON shape assertions are more useful than snapshotting exact values because the controller
  returns randomized numbers.

## Integration touchpoints to keep aligned

- `/api` is hardcoded on both sides:
  - Spring mappings in `DashboardController`
  - fetch calls in `web/src/App.tsx`
  - Vite proxy config in `web/vite.config.ts`
- The Vite build output directory is coupled to Spring static asset serving.
- Frontend response types in `App.tsx` must stay aligned with the Java record fields in `DashboardController`.
- If you add a new dashboard field, update the backend contract, frontend type alias, fetch logic, and tests together.
- Swagger/OpenAPI UI is available at `/swagger-ui/index.html` when the backend is running.

## Maintenance guidance for future updates

- When updating this file, prefer **durable statements** like “currently pinned in `pom.xml`” over broad claims that
  will age quickly.
- Verify versions from `pom.xml` and `web/package.json` before citing them.
- Verify endpoint contracts from code, not from comments or generated assets.
- If repo facts and generator metadata disagree, trust the files that drive the actual build/runtime behavior.
- No additional repo-level agent rules were found beyond `README.md` and this file; follow this file for
  project-specific guidance.

