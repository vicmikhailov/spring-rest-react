package ca.mikhailov.srr;

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
 * For Frontend Developers:
 * - Each `@GetMapping` maps to a `fetch("/api/...")` call in `web/src/App.tsx`.
 * - The return types (Java Records) are automatically serialized to JSON by Spring (Jackson).
 * 
 * 🚫 Antipattern: Breaking the Contract
 *    Changing a field name here (e.g., `totalRevenue` -> `revenue`) without 
 *    updating the frontend `type` definitions will cause the UI to break 
 *    silently, showing `undefined` or `NaN`.
 * 
 * For Java Developers:
 * - This is a standard REST controller using modern Java Features like `record`.
 * - In this project, data is hardcoded for demonstration purposes, but it 
 *   would typically come from a Database via JPA or JDBC.
 *
 * Interview note:
 * - API evolution should be contract-first. If you rename/remove fields here,
 *   add/update endpoint tests (MockMvc) so frontend regressions are caught early.
 */
@RestController
@RequestMapping("/api")
public class DashboardController {

    @GetMapping("/monthly-revenue")
    public MonthlyRevenueData getMonthlyRevenue() {
        // Creates hardcoded monthly revenue series
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

        return new MonthlyRevenueData(45231.89, 2350, 12234, 573, series);
    }

    @GetMapping("/total-revenue")
    public double getTotalRevenue() {
        return 45231.89;
    }

    @GetMapping("/subscriptions")
    public int getSubscriptions() {
        return 2350;
    }

    @GetMapping("/sales")
    public int getSalesCount() {
        return 12234;
    }

    @GetMapping("/active-now")
    public int getActiveNow() {
        return 573;
    }

    @GetMapping("/recent-sales")
    public List<RecentSale> getRecentSales() {
        return Arrays.asList(
                new RecentSale("Olivia Martin", "olivia.martin@example.com", 1500, "OM"),
                new RecentSale("Jackson Lee", "jackson.lee@example.com", 1200, "JL"),
                new RecentSale("Isabella Nguyen", "isabella.nguyen@example.com", 900, "IN"),
                new RecentSale("William Kim", "william.kim@example.com", 750, "WK"),
                new RecentSale("Sofia Davis", "sofia.davis@example.com", 600, "SD")
        );
    }

    /**
     * [DTO] Data Transfer Objects
     * 
     * These Java records define the "Contract" between the Backend and Frontend.
     * 
     * React Analogy:
     * - These match the `type` definitions at the top of `web/src/App.tsx`.
     * - `SeriesPoint` matches `type SeriesPoint = { label: string; value: number }`
     */
    public record SeriesPoint(String label, double value) {}
    public record RecentSale(String name, String email, double amount, String initials) {}
    public record MonthlyRevenueData(
            double totalRevenue,
            int subscriptions,
            int sales,
            int activeNow,
            List<SeriesPoint> revenueSeries
    ) {}
}
