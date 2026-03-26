package ca.mikhailov.srr;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * [BACKEND CONTROLLER] DashboardController
 * <p>
 * This Spring Boot RestController provides the data for the React frontend.
 * <p>
 * Python Analogy:
 * - This is like a FastAPI `APIRouter` or Flask `Blueprint`.
 * - `@RequestMapping("/api")` is the `prefix="/api"`.
 * <p>
 * TypeScript Analogy:
 * - This is like a NestJS `@Controller('/api')` or an Express `Router`.
 * <p>
 * 🚫 Antipattern: Breaking the Contract
 * Changing a field name here (e.g., `totalRevenue` -> `revenue`) without
 * updating the frontend `type` definitions will cause the UI to break
 * silently, showing `undefined` or `NaN`.
 */
@RestController
@RequestMapping("/api")
public class DashboardController {

    private static final Logger log = LoggerFactory.getLogger(DashboardController.class);
    private final Random random = new Random();

    /**
     * Returns a value jittered by up to ±{@code pct}% of the base.
     */
    private double jitter(double base, double pct) {
        return base + base * pct * (random.nextDouble() * 2 - 1);
    }

    /**
     * Integer variant - rounds the jittered result.
     */
    private int jitterInt(int base, double pct) {
        return (int) Math.round(jitter(base, pct));
    }

    /**
     * [ENDPOINT] getRevenueSeries
     * <p>
     * Returns the monthly revenue series data points for the chart.
     * <p>
     * Python Analogy: `@app.get("/revenue-series")` (FastAPI)
     * TypeScript Analogy: `@Get('/revenue-series')` (NestJS) or `router.get('/revenue-series', ...)` (Express)
     */
    @GetMapping("/revenue-series")
    public ResponseEntity<RevenueSeriesResponse> getRevenueSeries() {
        List<SeriesPoint> series = Arrays.asList(
                new SeriesPoint("Jan", jitter(11340, 0.05)),
                new SeriesPoint("Feb", jitter(13870, 0.05)),
                new SeriesPoint("Mar", jitter(12950, 0.05)),
                new SeriesPoint("Apr", jitter(15420, 0.05)),
                new SeriesPoint("May", jitter(16780, 0.05)),
                new SeriesPoint("Jun", jitter(19310, 0.05)),
                new SeriesPoint("Jul", jitter(18640, 0.05)),
                new SeriesPoint("Aug", jitter(21070, 0.05)),
                new SeriesPoint("Sep", jitter(20130, 0.05)),
                new SeriesPoint("Oct", jitter(22480, 0.05)),
                new SeriesPoint("Nov", jitter(21690, 0.05)),
                new SeriesPoint("Dec", jitter(23150, 0.05))
        );

        return ResponseEntity.ok(new RevenueSeriesResponse(series));
    }

    /**
     * [ENDPOINT] getTotalRevenue
     * <p>
     * Returns the total revenue as a double.
     * Python/TS Analogy: GET /api/total-revenue -> number
     */
    @GetMapping("/total-revenue")
    public ResponseEntity<TotalRevenueResponse> getTotalRevenue() {
        return ResponseEntity.ok(new TotalRevenueResponse(Math.round(jitter(47392.15, 0.05) * 100.0) / 100.0));
    }

    /**
     * [ENDPOINT] getSubscriptions
     * <p>
     * Returns the total number of subscriptions.
     * Python/TS Analogy: GET /api/subscriptions -> number
     */
    @GetMapping("/subscriptions")
    public ResponseEntity<SubscriptionsResponse> getSubscriptions() {
        return ResponseEntity.ok(new SubscriptionsResponse(jitterInt(2418, 0.05)));
    }

    /**
     * [ENDPOINT] getSalesCount
     * <p>
     * Returns the total number of sales.
     * Python/TS Analogy: GET /api/sales -> number
     */
    @GetMapping("/sales")
    public ResponseEntity<SalesResponse> getSalesCount() {
        return ResponseEntity.ok(new SalesResponse(jitterInt(11876, 0.05)));
    }

    /**
     * [ENDPOINT] getActiveNow
     * <p>
     * Returns the number of currently active users.
     * Python/TS Analogy: GET /api/active-now -> number
     */
    @GetMapping("/active-now")
    public ResponseEntity<ActiveNowResponse> getActiveNow() {
        return ResponseEntity.ok(new ActiveNowResponse(jitterInt(641, 0.08)));
    }

    /**
     * [ENDPOINT] getRecentSales
     * <p>
     * Returns a list of recent sale transactions.
     * Python/TS Analogy: GET /api/recent-sales -> Array<{ name, email, amount, initials }>
     */
    @GetMapping("/recent-sales")
    public ResponseEntity<RecentSalesResponse> getRecentSales() {
        return ResponseEntity.ok(new RecentSalesResponse(Arrays.asList(
                new RecentSale("Olivia Martin", "olivia.martin@example.com", Math.round(jitter(1382.50, 0.05) * 100) / 100.0, "OM"),
                new RecentSale("Jackson Lee", "jackson.lee@example.com", Math.round(jitter(1175.00, 0.05) * 100) / 100.0, "JL"),
                new RecentSale("Isabella Nguyen", "isabella.nguyen@example.com", Math.round(jitter(947.80, 0.05) * 100) / 100.0, "IN"),
                new RecentSale("William Kim", "william.kim@example.com", Math.round(jitter(713.25, 0.05) * 100) / 100.0, "WK"),
                new RecentSale("Sofia Davis", "sofia.davis@example.com", Math.round(jitter(628.40, 0.05) * 100) / 100.0, "SD")
        )));
    }

    /**
     * [DTO] ApiResponse
     * <p>
     * A generic wrapper for all API responses to ensure a consistent JSON structure.
     * <p>
     * React Analogy:
     * - These match the `type` definitions at the top of `web/src/App.tsx`.
     * - `SeriesPoint` matches `type SeriesPoint = { label: string; value: number }`
     * <p>
     * Individual response records:
     * - Each endpoint has its own dedicated response record instead of a shared
     * generic wrapper. This makes each contract explicit and independently
     * evolvable without affecting other endpoints.
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
     * <p>
     * Represents a single data point in a chart (e.g., Month and Value).
     * Python Analogy: `@dataclass class SeriesPoint: label: str; value: float`
     * TypeScript Analogy: `type SeriesPoint = { label: string; value: number }`
     */
    public record SeriesPoint(String label, double value) {
    }

    /**
     * [DTO] RecentSale
     * <p>
     * Represents a single sale record in the "Recent Sales" list.
     * Python Analogy: `class RecentSale(BaseModel): name: str; email: str; amount: float; initials: str`
     * TypeScript Analogy: `type RecentSale = { name: string; email: string; amount: number; initials: string }`
     */
    public record RecentSale(String name, String email, double amount, String initials) {
    }

    /**
     * [DTO] RevenueSeriesResponse
     * <p>
     * Response record for the /api/revenue-series endpoint.
     * Python Analogy: `class RevenueSeriesResponse(BaseModel): revenueSeries: list[SeriesPoint]`
     * TypeScript Analogy: `type RevenueSeriesResponse = { revenueSeries: SeriesPoint[] }`
     */
    public record RevenueSeriesResponse(List<SeriesPoint> revenueSeries) {
    }
}
