# Frontend Interview Prep for Java Developers (TypeScript + React + Tailwind + CSS)

This guide is optimized for interview preparation, not just day-to-day coding. It maps frontend concepts to Java/Spring mental models and points you to concrete examples in this repo.

---

## 1. 15-Minute Interview Warmup

Use this section right before an interview.

### One-liners interviewers love

- **TypeScript**: "TypeScript gives Java-like compile-time safety in the browser, but with structural typing instead of nominal typing."
- **React**: "React treats UI as a pure function of state; when state changes, React re-renders and reconciles minimal DOM updates."
- **Hooks**: "`useState` is component-local state; `useEffect` is side-effect orchestration tied to lifecycle-like dependency changes."
- **Tailwind**: "Tailwind is utility-first CSS: design-system primitives as classes, reducing custom CSS drift and naming overhead."
- **shadcn/ui**: "It is not a black-box package; components are project-owned source code, so customization is straightforward."
- **Vite**: "Fast dev server + production bundler; in this repo it proxies `/api` in dev and outputs assets for Spring static serving in prod."

### Java -> Frontend translation cheat card

- `record User(...)` -> TS `type User = { ... }`
- `CompletableFuture.allOf(...)` -> `Promise.all([...])`
- `@PostConstruct` / lifecycle listeners -> `useEffect(() => { ... }, [...deps])`
- `NumberFormat.getCurrencyInstance(...)` -> `toLocaleString(..., { style: "currency" })`
- Spring DI context -> React Context

---

## 2. Architecture of This Repo (What to say in system design rounds)

- Backend (`src/main/java/ca/mikhailov/srr/DashboardController.java`) exposes read-only dashboard endpoints under `/api`.
- Frontend (`web/src/App.tsx`) fetches six endpoints in parallel and renders a dashboard UI.
- During dev, Vite serves frontend and proxies `/api` to Spring Boot.
- For production, Maven runs frontend build and copies assets into `src/main/resources/static`.

Interview framing:

- "This is a simple BFF-style setup where frontend and backend share one deployment artifact in production."
- "Contracts are implicit via JSON shape, so TypeScript types and Java records must stay aligned."

---

## 3. TypeScript Through a Java Lens

### 3.1 Structural typing vs nominal typing

In Java, types are nominal: class identity matters.
In TypeScript, types are structural: shape matters.

```ts
interface HasEmail { email: string }
const x = { email: "a@b.com", extra: 1 }
const y: HasEmail = x // valid because shape matches
```

Interview answer:

- "TypeScript optimizes for JS interoperability. Structural typing improves flexibility but requires discipline around API boundaries."

### 3.2 `unknown` vs `any`

- `any`: disables type safety (like telling compiler to stop checking).
- `unknown`: safe top type; must narrow before use.

```ts
function parseJson(input: string): unknown {
  return JSON.parse(input)
}
```

Use `unknown` for external input (API, localStorage, query params), then validate.

### 3.3 Union types and discriminated unions

Java often uses class hierarchies; TypeScript often uses tagged unions.

```ts
type LoadState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; data: number }
  | { kind: "error"; message: string }
```

Interview answer:

- "Discriminated unions model finite UI states safely and avoid impossible states."

### 3.4 Generics and utility types

Useful built-ins:

- `Partial<T>` for patch/update DTOs
- `Pick<T, K>` for projection
- `Omit<T, K>` for excluding fields
- `Readonly<T>` for immutability guarantees

Analogy: similar intent to Java generics + DTO mappers, but with compile-time transformations.

### 3.5 `satisfies` keyword (used in this project)

In `web/src/App.tsx`, `chartConfig` uses `satisfies ChartConfig`.

Why this is interview-relevant:

- Validates the object shape
- Preserves specific literal keys for better inference
- Safer than broad assertion casts

---

## 4. React Mental Model for Java Developers

### 4.1 Render, commit, and effects

- **Render phase**: React calculates next UI (pure computation)
- **Commit phase**: React applies minimal DOM changes
- **Effects** (`useEffect`): run after commit for side effects

Java analogy: separate "compute new model/view" from "perform IO/listeners".

### 4.2 State updates are scheduled, not immediate

`setState` enqueues updates. Reading state immediately after setting may show old value.

Java analogy: event queue processing, not direct field mutation.

### 4.3 Batching

React 18+ batches multiple state updates in async handlers/effects.

In this repo, six `set...` calls after `Promise.all` usually trigger one re-render.

### 4.4 Dependency arrays are contracts

`useEffect(() => {...}, [a, b])` means: rerun effect when `a` or `b` identity/value changes.

Interview answer:

- "Dependency arrays prevent stale closures and define deterministic rerun semantics for side effects."

### 4.5 Keys in list rendering

In `web/src/App.tsx`, recent sales use `key={s.email}`.

Why not index keys:

- Reordering can attach wrong DOM/state to wrong row.
- Stable keys are equivalent to entity identity in persistence.

---

## 5. Async and Data Fetching (Interview Tradeoffs)

### 5.1 Why `Promise.all`

`Promise.all` is concurrency for independent requests.

- Total latency ~= slowest request
- Equivalent to `CompletableFuture.allOf`

### 5.2 Error strategy

Current approach logs and keeps seeded UI defaults.

Interview talking point:

- "This favors graceful degradation over fail-fast UX. In production I would add visible error states and retry controls."

### 5.3 Runtime validation (important distinction)

TypeScript assertions (`as Type`) do not validate runtime JSON.

For production-hardening, discuss schema validation (e.g., zod/io-ts) for untrusted payloads.

---

## 6. CSS and Tailwind for Java Engineers

### 6.1 CSS cascade and specificity

Core interview concepts:

- Source order matters
- Specificity decides conflicts
- `!important` is last resort

Tailwind reduces most specificity battles by using single-purpose classes and deterministic merge behavior.

### 6.2 Flexbox vs Grid

- **Flexbox**: one-dimensional alignment (row OR column)
- **Grid**: two-dimensional page sections

In this repo:

- Top-level shell uses flex patterns
- Cards/charts sections use grid patterns

### 6.3 Responsive design with utility prefixes

`md:grid-cols-2` means two columns from medium breakpoint upward.

Interview answer:

- "Responsive behavior is encoded declaratively in class names; no custom media-query file is needed for common layouts."

### 6.4 Design tokens and theming

This project uses CSS variables and shadcn/tailwind conventions.

Analogy: similar to centralized constants/theme objects in Java UI frameworks, but applied via CSS custom properties.

---

## 7. Interview Walkthrough Anchored to Real Files

### `web/src/App.tsx`

- `useState<number>(0)`: default-safe render values; avoids `undefined` rendering branches.
- `useEffect(..., [])`: mount-time fetch behavior, similar to one-time initialization.
- `Promise.all([...])`: parallel endpoint loading for dashboard metrics.
- `recentSales.map(... key={s.email})`: stable identity for list diffing.
- `chartConfig satisfies ChartConfig`: strict config contract without losing inference.
- `formatCurrency(...)`: formatting helper equivalent to Java locale APIs.

### `src/main/java/ca/mikhailov/srr/DashboardController.java`

- Java `record` payloads define JSON contract.
- Field renames are breaking changes for frontend type assumptions.
- Endpoint path `/api/...` is coupled to frontend fetch URLs and Vite proxy config.

Good interview phrase:

- "This frontend-backend pair relies on shared contract discipline; static typing helps but runtime contract tests are still valuable."

---

## 8. Common Interview Questions and Model Answers

### Q1: Why not fetch inside render?

"Render must stay pure/deterministic. Fetch is side-effectful IO, so it belongs in `useEffect` or a data-fetching abstraction."

### Q2: `||` vs `??` for defaults?

"`||` falls back on all falsy values (`0`, `''`, `false`), while `??` only falls back on `null`/`undefined`. For numeric zero as valid business value, `??` is usually safer."

### Q3: How do you prevent unnecessary re-renders?

"Keep state minimal, split components by responsibility, stabilize props where needed, and use memoization (`React.memo`, `useMemo`, `useCallback`) only when profiling shows benefit."

### Q4: Is TypeScript enough for API safety?

"No. TS checks compile-time assumptions; runtime payload validation is still needed for external/untrusted data."

### Q5: Why utility CSS instead of handcrafted stylesheets?

"Utility CSS speeds implementation, enforces consistency, and minimizes naming/cascade complexity."

---

## 9. Anti-Patterns to Mention Proactively

- Mutating state in place (`arr.push`) instead of creating new references
- Missing `useEffect` dependencies causing stale logic or loops
- Using list index as key for dynamic/reordered lists
- Overusing `any` and weakening type contracts
- Turning every component into a stateful god component

Interview framing:

- "I optimize for explicit state transitions, stable identity, and clear boundaries between pure rendering and side effects."

---

## 10. Practical Upgrade Ideas (Great to mention in interviews)

- Add endpoint contract tests in Spring (`MockMvc`) for payload shape stability.
- Add frontend loading/error states with explicit UI messaging.
- Introduce runtime schema validation for API responses.
- Extract data-fetching into custom hooks for reuse and testability.
- Add React Testing Library tests for rendering and interaction paths.

---

## 11. Quick Practice Drills

1. Explain why `Promise.all` is used and what happens if one request fails.
2. Explain why `key={s.email}` is better than `key={index}`.
3. Explain `satisfies` vs `as` with one example.
4. Explain when to use `??` over `||`.
5. Explain how backend record changes can silently break UI if not contract-tested.

If you can answer these cleanly with Java analogies, you are interview-ready for this codebase.
