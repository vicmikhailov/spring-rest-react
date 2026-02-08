import React, { useEffect, useState } from "react"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
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
import { Separator } from "@/components/ui/separator"
import {
  Home,
  LineChart,
  Users,
  Settings,
  Search,
  Bell,
  Download,
  Plus,
  DollarSign,
  Users2,
  Activity,
  CreditCard,
  MoreHorizontal,
} from "lucide-react"
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis } from "recharts"

type SeriesPoint = { label: string; value: number }
type RecentSale = { name: string; email: string; amount: number; initials: string }
type MonthlyRevenueData = {
  totalRevenue: number
  subscriptions: number
  sales: number
  activeNow: number
  revenueSeries: SeriesPoint[]
}

export default function App() {
  const [totalRevenue, setTotalRevenue] = useState<number>(0)
  const [subscriptions, setSubscriptions] = useState<number>(0)
  const [sales, setSales] = useState<number>(0)
  const [activeNow, setActiveNow] = useState<number>(0)
  const [revenueSeries, setRevenueSeries] = useState<SeriesPoint[]>([])
  const [recentSales, setRecentSales] = useState<RecentSale[]>([])

  useEffect(() => {
    Promise.all([
      fetch("/api/total-revenue").then((r) => r.json() as Promise<number>),
      fetch("/api/subscriptions").then((r) => r.json() as Promise<number>),
      fetch("/api/sales").then((r) => r.json() as Promise<number>),
      fetch("/api/active-now").then((r) => r.json() as Promise<number>),
      fetch("/api/monthly-revenue").then((r) => r.json() as Promise<MonthlyRevenueData>),
      fetch("/api/recent-sales").then((r) => r.json() as Promise<RecentSale[]>),
    ])
      .then(([total, subs, salesCount, active, monthly, sales]) => {
        setTotalRevenue(total)
        setSubscriptions(subs)
        setSales(salesCount)
        setActiveNow(active)
        setRevenueSeries(monthly.revenueSeries)
        setRecentSales(sales)
      })
      .catch((e) => console.error(e))
  }, [])

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
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
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

        {/* Main */}
        <main className="flex-1 space-y-6 p-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
            <p className="text-sm text-muted-foreground">Your business at a glance</p>
          </div>

          {/* Stat cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Revenue"
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              value={formatCurrency(totalRevenue || 45231.89)}
              description="+20.1% from last month"
            />
            <StatCard
              title="Subscriptions"
              icon={<Users2 className="h-4 w-4 text-muted-foreground" />}
              value={`+${(subscriptions || 2350).toLocaleString()}`}
              description="+180.1% from last month"
            />
            <StatCard
              title="Sales"
              icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
              value={`+${(sales || 12234).toLocaleString()}`}
              description="+19% from last month"
            />
            <StatCard
              title="Active Now"
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
              value={`+${(activeNow || 573).toLocaleString()}`}
              description="+201 since last hour"
            />
          </div>

          {/* Charts + Recent */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
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
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {recentSales.map((s) => (
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
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </CardContent>
    </Card>
  )
}

function BarChart({ series }: { series: SeriesPoint[] }) {
  const chartConfig = {
    value: {
      label: "Revenue",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
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

function formatCurrency(v: number) {
  return v.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}
