package ca.mikhailov.srr;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

/**
 * [BACKEND CONTROLLER] DashboardController
 *
 * This Spring Boot RestController provides the data for the React frontend.
 *
 * Python Analogy:
 * - This is like a FastAPI `APIRouter` or Flask `Blueprint`.
 * - `@RequestMapping("/api")` is the `prefix="/api"`.
 *
 * TypeScript Analogy:
 * - This is like a NestJS `@Controller('/api')` or an Express `Router`.
 *
 * 🚫 Antipattern: Breaking the Contract
 *    Changing a field name here (e.g., `totalRevenue` -> `revenue`) without
 *    updating the frontend `type` definitions will cause the UI to break
 *    silently, showing `undefined` or `NaN`.
 */
@RestController
@RequestMapping("/api")
public class DashboardController {

    /**
     * [ENDPOINT] getRevenueSeries
     *
     * Returns the monthly revenue series data points for the chart.
     *
     * Python Analogy: `@app.get("/revenue-series")` (FastAPI)
     * TypeScript Analogy: `@Get('/revenue-series')` (NestJS) or `router.get('/revenue-series', ...)` (Express)
     */
    @GetMapping("/revenue-series")
    public ResponseEntity<RevenueSeriesResponse> getRevenueSeries() {
        List<SeriesPoint> series = Arrays.asList(
                new SeriesPoint("Jan", 12000),
                new SeriesPoint("Feb", 14500),
                new SeriesPoint("Mar", 13800),
                new SeriesPoint("Apr", 16000),
                new SeriesPoint("May", 17500),
                new SeriesPoint("Jun", 18200),
                new SeriesPoint("Jul", 19000),
                new SeriesPoint("Aug", 20500),
                new SeriesPoint("Sep", 19800),
                new SeriesPoint("Oct", 21000),
                new SeriesPoint("Nov", 20500),
                new SeriesPoint("Dec", 21500)
        );

        return ResponseEntity.ok(new RevenueSeriesResponse(series));
    }

    /**
     * [ENDPOINT] getTotalRevenue
     *
     * Returns the total revenue as a double.
     * Python/TS Analogy: GET /api/total-revenue -> number
     */
    @GetMapping("/total-revenue")
    public ResponseEntity<TotalRevenueResponse> getTotalRevenue() {
        return ResponseEntity.ok(new TotalRevenueResponse(45231.89));
    }

    /**
     * [ENDPOINT] getSubscriptions
     *
     * Returns the total number of subscriptions.
     * Python/TS Analogy: GET /api/subscriptions -> number
     */
    @GetMapping("/subscriptions")
    public ResponseEntity<SubscriptionsResponse> getSubscriptions() {
        return ResponseEntity.ok(new SubscriptionsResponse(2350));
    }

    /**
     * [ENDPOINT] getSalesCount
     *
     * Returns the total number of sales.
     * Python/TS Analogy: GET /api/sales -> number
     */
    @GetMapping("/sales")
    public ResponseEntity<SalesResponse> getSalesCount() {
        return ResponseEntity.ok(new SalesResponse(12234));
    }

    /**
     * [ENDPOINT] getActiveNow
     *
     * Returns the number of currently active users.
     * Python/TS Analogy: GET /api/active-now -> number
     */
    @GetMapping("/active-now")
    public ResponseEntity<ActiveNowResponse> getActiveNow() {
        return ResponseEntity.ok(new ActiveNowResponse(573));
    }

    /**
     * [ENDPOINT] getRecentSales
     *
     * Returns a list of recent sale transactions.
     * Python/TS Analogy: GET /api/recent-sales -> Array<{ name, email, amount, initials }>
     */
    @GetMapping("/recent-sales")
    public ResponseEntity<RecentSalesResponse> getRecentSales() {
        return ResponseEntity.ok(new RecentSalesResponse(Arrays.asList(
                new RecentSale("Olivia Martin", "olivia.martin@example.com", 1500, "OM"),
                new RecentSale("Jackson Lee", "jackson.lee@example.com", 1200, "JL"),
                new RecentSale("Isabella Nguyen", "isabella.nguyen@example.com", 900, "IN"),
                new RecentSale("William Kim", "william.kim@example.com", 750, "WK"),
                new RecentSale("Sofia Davis", "sofia.davis@example.com", 600, "SD")
        )));
    }

    /**
     * [DTO] ApiResponse
     *
     * A generic wrapper for all API responses to ensure a consistent JSON structure.
     *
     * React Analogy:
     * - These match the `type` definitions at the top of `web/src/App.tsx`.
     * - `SeriesPoint` matches `type SeriesPoint = { label: string; value: number }`
     *
     * Individual response records:
     * - Each endpoint has its own dedicated response record instead of a shared
     *   generic wrapper. This makes each contract explicit and independently
     *   evolvable without affecting other endpoints.
     */
    public record TotalRevenueResponse(double totalRevenue) {
    }

    public record SubscriptionsResponse(int subscriptions) {
    }

    public record SalesResponse(int sales) {
    }

    public record ActiveNowResponse(int activeNow) {
    }

    public record RecentSalesResponse(List<RecentSale> recentSales) {
    }

    /**
     * [DTO] SeriesPoint
     *
     * Represents a single data point in a chart (e.g., Month and Value).
     * Python Analogy: `@dataclass class SeriesPoint: label: str; value: float`
     * TypeScript Analogy: `type SeriesPoint = { label: string; value: number }`
     */
    public record SeriesPoint(String label, double value) {}

    /**
     * [DTO] RecentSale
     *
     * Represents a single sale record in the "Recent Sales" list.
     * Python Analogy: `class RecentSale(BaseModel): name: str; email: str; amount: float; initials: str`
     * TypeScript Analogy: `type RecentSale = { name: string; email: string; amount: number; initials: string }`
     */
    public record RecentSale(String name, String email, double amount, String initials) {}

    /**
     * [DTO] RevenueSeriesResponse
     *
     * Response record for the /api/revenue-series endpoint.
     * Python Analogy: `class RevenueSeriesResponse(BaseModel): revenueSeries: list[SeriesPoint]`
     * TypeScript Analogy: `type RevenueSeriesResponse = { revenueSeries: SeriesPoint[] }`
     */
    public record RevenueSeriesResponse(List<SeriesPoint> revenueSeries) {
    }
}
