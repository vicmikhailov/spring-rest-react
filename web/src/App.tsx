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
              // `??` is used to keep the seeded demo value visible while real data loads.
              // Unlike `||`, it preserves '0' as a valid value if the real data is zero.
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

          {/* Charts Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Tailwind classes compose layout (grid/flex/gap) inline; think of them as
                pre-baked utility methods instead of writing a separate CSS file. */}
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
                    Similar to a for-each loop in Java, but it must return a UI element.
                    `key` prop is MANDATORY for React to track item changes in lists.
                */}
                <ul className="space-y-4">
                  {/**
                   * Q: Why .map() and not a for-loop?
                   * A: React is functional. .map() transforms data directly into
                   *    UI elements. It's more declarative than a manual loop.
                   *
                   * 🚫 Antipattern: Using Array Index as Key
                   *    `recentSales.map((s, index) => <li key={index}>...</li>)`
                   *    This is "dangerous". If the order of the items changes,
                   *    React gets confused and might map the wrong state/focus
                   *    to the wrong DOM element.
                   *
                   * ✅ Correct: Using a Unique Stable ID
                   *    `key={s.email}` or `key={s.id}`
                   *    This ensures React can track the same entity across
                   *    different renders, even if it moves in the array.
                   */
                  recentSales.map((s) => (
                    <li key={s.email} className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{s.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
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
 * [SIDEBAR COMPONENT]
 *
 * Demonstrates basic layout components from the UI library.
 */
function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-12 items-center px-4">
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {/**
         * [CONDITIONAL RENDERING]
         * In React, we use the `condition ? true : false` (ternary) or
         * `condition && <element>` pattern to show/hide parts of the UI.
         *
         * Java Analogy:
         * if (description != null) { render(description); }
         */}
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
 */
function formatCurrency(v: number) {
  return v.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  })
}
