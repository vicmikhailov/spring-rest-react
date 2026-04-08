/**
 * [IMPORTS]
 *
 * For Java Developers:
 * - `import` in JavaScript/TypeScript is similar to `import` in Java.
 * - `@/` is a "Path Alias" defined in `tsconfig.json`, mapping to `web/src/`.
 *   It's like importing from your project's root package instead of using
 *   relative paths like `../../components`.
 */
import React, {useEffect, useState} from "react"
import {Avatar, AvatarFallback,} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import {Input} from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {Separator} from "@/components/ui/separator"
/**
 * [LIBRARIES]
 * 
 * Lucide React: A library of SVG icons. Think of these as a modern replacement 
 * for icon fonts. They are lightweight and tree-shakeable (meaning only the icons 
 * you use are included in the final JS bundle).
 */
import {
  Activity,
  Bell,
  CreditCard,
  DollarSign,
  Download,
  Ellipsis,
  Home,
  LineChart,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react"
/**
 * Recharts: A charting library built on top of D3.js. 
 * Unlike low-level D3, Recharts provides high-level components like <BarChart />, 
 * making it feel much more like building UI than drawing pixels.
 */
import {Bar, BarChart as RechartsBarChart, XAxis, YAxis} from "recharts"

// [TYPES VS RUNTIME]
// These TypeScript type aliases disappear at runtime (just like Java generics are erased),
// but they let the compiler catch shape mismatches. Think of them as light-weight Java
// records/interfaces that only exist during compilation for safety.
//
// Q: Why not use 'class'?
// A: Java developers often reach for classes here. However, in React, we prefer
//    Plain Old Data (POJO equivalent but simpler). Classes with internal methods
//    break React's immutability patterns and 'useState' re-renders.
//    Stick to 'type' or 'interface' for data models!
//
// 🚫 Java-ism Trap: Using 'class' for POJOs
//    In Java, you use classes for everything. In React, classes carry 
//    methods and private state that break referential equality checks 
//    and serialization. Always use 'type' or 'interface' for data.
//
// 🚫 Antipattern: Using 'any'
//    Avoid `const [data, setData] = useState<any>()`. It disables type safety,
//    essentially reverting back to plain JavaScript. Always define your shapes!
type TotalRevenueResponse = { totalRevenue: number }
type SubscriptionsResponse = { subscriptions: number }
type SalesResponse = { sales: number }
type ActiveNowResponse = { activeNow: number }
type RecentSalesResponse = { recentSales: RecentSale[] }
type SeriesPoint = { label: string; value: number }
type RecentSale = { name: string; email: string; amount: number; initials: string }
type RevenueSeriesResponse = { revenueSeries: SeriesPoint[] }

/**
 * [ROOT COMPONENT] App
 *
 * In React, components are functions that return JSX (a syntax that looks like
 * HTML but is actually JavaScript).
 *
 * For Java Developers:
 * - This is your main "View-Controller". It manages the state (data) and
 *   orchestrates how the sub-components are displayed.
 *
 * - Pattern: "Lift State Up" or "Container Pattern".
 *   This component is a "Smart" component—it handles data fetching and logic,
 *   then passes that data down as "props" to "Dumb" (Presentation) components
 *   like `StatCard` or `BarChart`.
 *
 * - Structure Note for Java Developers:
 *   We don't have separate 'Controller' and 'View' files. React components
 *   colocate UI (JSX) and Logic (hooks) in the same file to keep them in sync.
 * 
 * - Component Types: We use **Functional Components** here. While React used to
 *   support class-based components (similar to `extends JPanel`), the modern 
 *   standard is to use functions. They are simpler, easier to test, and 
 *   optimized better by the React engine.
 */
export default function App() {
  /**
   * [STATE MANAGEMENT] Application Data
   *
   * Q: Why 'const' and not 'let'?
   * A: In React, we never reassign state variables directly (e.g., totalRevenue = 100).
   *    Instead, we use the provided 'setter' function. 'const' enforces this
   *    immutability at the language level.
   *
   * 🚫 Antipattern: Direct State Mutation
   *    `totalRevenue = 500` (Wrong!)
   *    `revenueSeries.push({ label: 'Mar', value: 100 })` (Wrong!)
   *    These bypass React's tracking. The UI won't update because React
   *    doesn't know a change occurred.
   *
   * ✅ Correct: Functional State Updates
   *    `setTotalRevenue(500)` (Right!)
   *    `setRevenueSeries([...revenueSeries, { label: 'Mar', value: 100 }])` (Right!)
   *    This creates a *new* reference, which React detects and triggers a re-render.
   *
   * Q: Why the generic <number> or <SeriesPoint[]>?
   * A: TypeScript is "Statically Typed". Just like 'List<String>' in Java, this
   *    ensures that we don't accidentally put a string into a numeric state,
   *    preventing runtime 'NaN' or 'undefined' errors.
   */
  const [totalRevenue, setTotalRevenue] = useState<number | undefined>()
  // 🚫 Java-ism Trap: Undefined vs Null
  // In Java, we'd use 'null'. In JS/TS, 'undefined' is the idiomatic default 
  // for "not yet loaded". It works better with optional chaining (?.) 
  // and default parameters.
  const [subscriptions, setSubscriptions] = useState<number | undefined>()
  const [sales, setSales] = useState<number | undefined>()
  const [activeNow, setActiveNow] = useState<number | undefined>()
  const [revenueSeries, setRevenueSeries] = useState<SeriesPoint[]>([])
  const [recentSales, setRecentSales] = useState<RecentSale[]>([])

  /**
   * [DATA FETCHING] useEffect with Auto-Refresh
   *
   * React provides a built-in `fetch` function (similar to `HttpClient` in Java)
   * to make HTTP requests.
   *
   * Why inside useEffect?
   * - Fetching data is a "Side Effect". It shouldn't happen during the "Pure"
   *   render cycle of the component.
   *
   * 🚫 Antipattern: Missing Dependency Array
   *    `useEffect(() => { ... })` (No second argument)
   *    This runs on EVERY render. If the effect updates state, it triggers
   *    a re-render, which runs the effect again... creating an infinite loop.
   *
   * 🚫 Antipattern: Waterfall Fetching (Wait-and-Wait)
   *    `const a = await fetch('/api/a'); const b = await fetch('/api/b');`
   *    This forces the requests to be sequential, slowing down the page load.
   *
   * ✅ Correct: Parallel Fetching
   *    `Promise.all([fetch('/api/a'), fetch('/api/b')])`
   *    Fires all requests at once, maximizing throughput.
   *
   * Why an empty array `[]` as the second argument?
   * - It's the "Dependency Array". It tells React to only run this effect ONCE
   *   when the component mounts. Without it (or with a dependency that changes),
   *   you could end up in an infinite loop:
   *   (Fetch -> Update State -> Re-render -> Fetch again...).
   *
   * Auto-Refresh Pattern:
   * - `fetchDashboard` is extracted as a named inner function so it can be
   *   called both immediately on mount AND on a recurring interval — similar
   *   to a `ScheduledExecutorService` in Java.
   * - `setInterval` schedules the function every REFRESH_INTERVAL_MS.
   * - The cleanup function returned from useEffect calls `clearInterval`,
   *   which is like calling `scheduler.shutdown()` when the component
   *   unmounts, preventing memory leaks and stale updates.
   */
  useEffect(() => {
    /**
     * [DATA FETCHING] Promise.all
     *
     * Q: Why fetch all at once?
     * A: Performance. This is "Parallel Execution". Instead of waiting for
     *    one request to finish before starting the next (Sequential), we
     *    fire them all. The UI only waits for the slowest request, not the
     *    sum of all requests.
     *
     * Java Analogy: `CompletableFuture.allOf(...)`. It's a "Fork-Join" 
     * pattern where we fork multiple requests and join them into a 
     * single result array.
     *
     * Q: Why the 'as Promise<...>' cast?
     * A: 'fetch' returns a generic JSON object. TypeScript doesn't know the
     *    shape of your API response. This cast is like telling the compiler:
     *    "Trust me, I know the Java backend returns this specific Record/DTO."
     *
     * Important Note:
     * - `as` is compile-time only; it does NOT validate runtime JSON.
     * - In production-grade apps, add schema validation for external data.
     */
    const REFRESH_INTERVAL_MS = 5_000 // Refresh every 5 seconds

    const fetchDashboard = () =>
        Promise.all([
          fetch("/api/total-revenue").then((r) => r.json() as Promise<TotalRevenueResponse>),
          fetch("/api/subscriptions").then((r) => r.json() as Promise<SubscriptionsResponse>),
          fetch("/api/sales").then((r) => r.json() as Promise<SalesResponse>),
          fetch("/api/active-now").then((r) => r.json() as Promise<ActiveNowResponse>),
          fetch("/api/revenue-series").then((r) => r.json() as Promise<RevenueSeriesResponse>),
          fetch("/api/recent-sales").then((r) => r.json() as Promise<RecentSalesResponse>),
        ])
            /**
             * Q: What is this ([total, subs, ...]) syntax?
             * A: "Array Destructuring". Promise.all returns an array of results.
             *    Instead of doing 'const total = results[0]', we extract them into
             *    named variables immediately. It's cleaner and more readable.
             */
        .then(([total, subs, salesCount, active, seriesData, recentSalesData]) => {
          /**
           * [STATE BATCHING]
           * In React 18+, multiple state updates within the same event/promise
           * are "batched" together. This means the component only re-renders
           * ONCE after all six `set...` calls are finished, which is a big
           * performance optimization.
           * 
           * 🚫 Java-ism Trap: Thread Blocking
           * This code is asynchronous but NOT multithreaded. While 'await' 
           * or '.then()' is waiting, the browser's single thread is free to 
           * handle clicks and animations.
           */
          setTotalRevenue(total.totalRevenue)
          setSubscriptions(subs.subscriptions)
          setSales(salesCount.sales)
          setActiveNow(active.activeNow)
          setRevenueSeries(seriesData.revenueSeries)
          setRecentSales(recentSalesData.recentSales)
        })
            .catch((e) => {
              // Error handling: similar to a try-catch block in Java.
              console.error("Failed to fetch dashboard data:", e)
            })

    fetchDashboard() // Fetch immediately on mount
    const intervalId = setInterval(fetchDashboard, REFRESH_INTERVAL_MS)

    // Cleanup: cancel the interval when the component unmounts.
    // Like calling scheduler.shutdown() in Java to avoid resource leaks.
    return () => clearInterval(intervalId)
  }, []) // Empty dependency array = "Run on start only"

  /**
   * [JSX] The View Layer (HTML-in-JS)
   *
   * JSX allows us to write UI structure that looks like HTML but is actually
   * JavaScript objects.
   *
   * Key differences for Java Developers:
   * - `className`: In JS, `class` is a reserved keyword (for classes), so React
   *   uses `className` to specify CSS classes.
   *
   * - `{}`: Expression curly braces. These allow you to inject any JavaScript
   *   logic, variables, or function calls directly into your HTML.
   *   Think of it like **JSP EL `${}`** or **Thymeleaf `th:text`**.
   *
   * - Layout Pattern: Tailwind Utility Classes
   *   Instead of `style="display: flex;"`, we use `className="flex"`.
   *   - `flex`: Display Flexbox (for layouts)
   *   - `grid`: CSS Grid (for 2D layouts)
   *   - `gap-4`: Spacing between child elements
   *   - `md:grid-cols-2`: "Medium" screens (and up) should have 2 columns.
   *     This is "Responsive Design".
   *
   *   Naming Strategy for Backend Developers:
   *   Tailwind classes follow a predictable `prefix-value` or `prefix-property-value` pattern:
   *   - [p]-4: **P**adding (all sides)
   *   - [m]l-2: **M**argin **L**eft
   *   - [w]-full: **W**idth 100%
   *   - [h]-screen: **H**eight 100% of viewport
   *   - [text]-red-500: **Text** color
   *   - [bg]-blue-100: **B**ack**g**round color
   *   - [items]-center: Align **items** along the cross-axis (vertical if flex-row)
   *   - [justify]-between: **Justify** content along the main-axis (horizontal if flex-row)
   *
   *   Q: Why use this instead of separate CSS files?
   *   A: It eliminates "dead CSS," speeds up development by avoiding context switching
   *      between files, and ensures your UI stays consistent with the design system.
   */
  // SidebarProvider is a context (like a scoped Spring ApplicationContext) that shares
  // sidebar open/close state with nested components without prop-drilling.
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="font-semibold md:hidden">Acme</div>
          <div className="relative hidden md:block w-full max-w-xl">
            {/* [SVG ICONS] Lucide-react components */}
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/**
             * [EVENT HANDLING] onClick
             *
             * In React, event listeners are passed as props (camelCase: `onClick`).
             * Unlike Java Swing where you'd add an `ActionListener` class, in React
             * you pass a function or a lambda.
             *
             * Example:
             * `<Button onClick={() => console.log('clicked')}>`
             */}
            <Button variant="secondary" size="sm">
              <Plus className="mr-2 h-4 w-4" /> New
            </Button>
            <Button size="sm">
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 space-y-6 p-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
            <p className="text-sm text-muted-foreground">Your business at a glance</p>
          </div>

          {/* [COMPOSITION] Breaking down complex UIs into reusable components (StatCard) */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Revenue"
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              /**
               * [NULLISH COALESCING] ??
               * 
               * Java Analogy: `Optional.ofNullable(totalRevenue).orElse(45231.89)`
               * 
               * Q: Why not use `||`?
               * A: `||` is "Logical OR". It falls back on ANY falsy value (0, "", false).
               *    `??` only falls back on `null` or `undefined`. 
               *    If your revenue is exactly 0, you want to show 0, not the demo value!
               */
              value={formatCurrency(totalRevenue ?? 45231.89)}
              description="+20.1% from last month"
            />
            <StatCard
              title="Subscriptions"
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              value={`+${(subscriptions ?? 2350).toLocaleString()}`}
              description="+180.1% from last month"
            />
            <StatCard
              title="Sales"
              icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
              value={`+${(sales ?? 12234).toLocaleString()}`}
              description="+19% from last month"
            />
            <StatCard
              title="Active Now"
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
              value={`+${(activeNow ?? 573).toLocaleString()}`}
              description="+201 since last hour"
            />
          </div>

            {/* [LAYOUT] grid: 2D layout (rows/cols). md:grid-cols-2: 2 cols on medium screens. lg:grid-cols-7: 7 cols on large screens. */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* [LAYOUT] col-span-X: How many columns this element should occupy in the grid. */}
            <Card className="lg:col-span-4 md:col-span-2">
              <CardHeader>
                <div>
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>Monthly revenue</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <BarChart series={revenueSeries} />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 md:col-span-2">
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>You made 265 sales this month.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" aria-label="More">
                  <Ellipsis className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {/* [LIST RENDERING] array.map()
                    
                    Java Analogy: `list.stream().map(s -> renderItem(s)).toList()`
                    
                    In React, we use `map()` to transform data objects into UI elements.
                    React handles the "Collection" rendering automatically—you just 
                    provide the template for a single item.
                    
                    🚫 Java-ism Trap: Missing 'key'
                    `key` prop is MANDATORY. Think of it like `equals()` and `hashCode()`.
                    It tells React: "This UI element belongs to this specific data item." 
                    If the data moves, React moves the UI instead of re-creating it.
                */}
                <ul className="space-y-4">
                  {/**
                   * [LAYOUT] flex: 1D layout. items-center: vertical alignment. gap-3: spacing.
                   */}
                  {recentSales.map((s) => (
                    <li key={s.email} className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{s.initials}</AvatarFallback>
                      </Avatar>
                      {/* [LAYOUT] flex-1: grow to fill space. min-w-0: allow shrinking for 'truncate' to work. */}
                      <div className="min-w-0 flex-1">
                        {/* [TYPOGRAPHY] truncate: add "..." if text is too long. leading-none: zero line-height. */}
                        <p className="truncate text-sm font-medium leading-none">{s.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{s.email}</p>
                      </div>
                      <div className="text-sm font-medium">{formatCurrency(s.amount)}</div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

/**
 * [SIDEBAR COMPONENT] AppSidebar
 *
 * Demonstrates basic layout components from the UI library.
 * 
 * Pattern: "Compound Components"
 * In Java, you might have `sidebar.setHeader(...)`, `sidebar.setContent(...)`. 
 * In React, we use nested components: `<Sidebar><SidebarHeader /></Sidebar>`. 
 * This is more flexible as you can easily rearrange elements in the JSX 
 * without changing any Java-side configuration.
 */
function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        {/* [LAYOUT] px-4: horizontal padding. h-12: fixed height (3rem/48px). */}
        <div className="flex h-12 items-center px-4">
          {/* [TYPOGRAPHY] tracking-tight: reduced letter spacing. font-semibold: weight 600. */}
          <div className="text-xl font-semibold tracking-tight">Acme Dashboard</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          {/*
              [ACTIVE STATE]
              In React, we pass boolean props like `isActive` to change component appearance.
          */}
          <SidebarMenuItem>
            <SidebarMenuButton isActive>
              <Home className="h-4 w-4" />
              <span>Overview</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LineChart className="h-4 w-4" />
              <span>Analytics</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Users className="h-4 w-4" />
              <span>Customers</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">v0.1.0</div>
      </SidebarFooter>
    </Sidebar>
  )
}

/**
 * [REUSABLE COMPONENT] StatCard
 *
 * This is a "Dumb" or "Presentation" component. It doesn't know about
 * APIs or global state; it just displays what it's told to display.
 *
 * For Java Developers:
 * - The parameter `{ title, icon, value, description }` uses "Object Destructuring".
 *   It's like passing a `DTO` (Data Transfer Object) to a method and
 *   immediately extracting its fields into local variables.
 *
 * - Java Analogy:
 *   `public String StatCard(StatCardDTO props) { ... }`
 *
 * - Props are "Read-Only": In React, you NEVER modify the props passed into
 *   a component. If you need to change something, you pass a new value from
 *   the parent. This is "One-Way Data Flow", a core principle of React.
 *
 * @param props
 *  - title: The label for the card (e.g. "Total Revenue")
 *  - icon: A Lucide-react component passed as a JSX element
 *  - value: The formatted string to display (e.g. "$45,231")
 *  - description: Optional sub-text (e.g. "+20.1% from last month")
 *
 * Q: Why 'React.ReactNode' for the icon?
 * A: This is a flexible type that covers anything React can render:
 *    strings, numbers, other components, or even 'null'.
 */
function StatCard({ title, icon, value, description }: { title: string; icon?: React.ReactNode; value: string; description?: string }) {
  return (
    <Card>
      <CardHeader>
        {/* [LAYOUT] items-center: vertical align. justify-between: space-out children. */}
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {/* [TYPOGRAPHY] text-2xl: large font. font-bold: weight 700. */}
        <div className="text-2xl font-bold">{value}</div>
        {/**
         * [CONDITIONAL RENDERING]
         * In React, we use the `condition ? true : false` (ternary) or
         * `condition && <element>` pattern to show/hide parts of the UI.
         *
         * Java Analogy:
         * if (description != null) { render(description); }
         */}
        {/* [COLORS] text-muted-foreground: use the theme's secondary text color. */}
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </CardContent>
    </Card>
  )
}

/**
 * [CHART COMPONENT] BarChart
 *
 * This component wraps the "Recharts" library logic. It takes a raw
 * data array (`series`) and transforms it into a visual bar chart.
 *
 * Pattern: "Configuration Object"
 * We use a `chartConfig` object to centralize styles and labels for
 * the chart, which keeps the JSX cleaner.
 * 
 * For Java Developers:
 * - Think of `RechartsBarChart` as the 'Engine' and `Bar`, `XAxis`, `YAxis` 
 *   as 'Layers' you add to it. It's very similar to constructing a complex 
 *   Swing/JavaFX component by adding child nodes.
 * 
 * - `dataKey="value"`: This tells Recharts which field in your `SeriesPoint` 
 *   objects (e.g., `{ label: 'Jan', value: 100 }`) should be used for the 
 *   height of the bars.
 *
 * Q: What does 'satisfies ChartConfig' do?
 * A: It's "Type Validation without Widening". It checks that 'chartConfig'
 *    is a valid 'ChartConfig', but it doesn't 'forget' the specific
 *    property names inside. This gives you better autocompletion and
 *    stronger type checking than just ': ChartConfig'.
 */
function BarChart({ series }: { series: SeriesPoint[] }) {
  const chartConfig = {
    value: {
      label: "Revenue",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  // ChartContainer provides consistent theming and responsive sizing; we only supply the data
  // array, similar to passing a `List<Point>` into a charting library in JavaFX/Swing.
  return (
      <ChartContainer config={chartConfig} className="h-75 w-full">
      <RechartsBarChart
        data={series}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis
          dataKey="label"
          tick={{ fill: "#888888", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: "#888888", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="value"
          fill="var(--color-value)"
          radius={[4, 4, 0, 0]}
        />
      </RechartsBarChart>
    </ChartContainer>
  )
}

/**
 * [HELPER FUNCTION] formatCurrency
 *
 * A pure JavaScript utility function for formatting numbers as USD.
 *
 * For Java Developers:
 * - This is exactly like using `java.text.NumberFormat.getCurrencyInstance(Locale.US)`.
 * - `toLocaleString` is a built-in method in JavaScript for internationalization,
 *   similar to `Locale`-based formatting in Java.
 * 
 * 🚫 Antipattern: Formatting in the Render Cycle
 *    Don't do complex string manipulation directly inside your JSX tags.
 *    Extract them into helper functions like this to keep your UI logic 
 *    clean and testable.
 */
function formatCurrency(v: number) {
  return v.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  })
}
