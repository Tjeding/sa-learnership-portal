package com.tjeding.portal.report;

import com.tjeding.portal.common.ApiResponse;
import com.tjeding.portal.report.dto.ApplicationVolumeRow;
import com.tjeding.portal.report.dto.CustomViewRequest;
import com.tjeding.portal.report.dto.CustomViewRow;
import com.tjeding.portal.report.dto.PlacementSuccessRow;
import com.tjeding.portal.report.dto.StatusFunnelRow;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/reports")
@Tag(name = "Admin Reports", description = "Analytics reports backed by database views, with CSV/PDF export.")
@SecurityRequirement(name = "bearerAuth")
public class AdminReportController {

    private final ReportService reportService;

    public AdminReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // ─── Data endpoints ──────────────────────────────────────────────

    @GetMapping("/application-volume")
    public ApiResponse<List<ApplicationVolumeRow>> applicationVolume() {
        return ApiResponse.success(reportService.getApplicationVolume());
    }

    @GetMapping("/placement-success")
    public ApiResponse<List<PlacementSuccessRow>> placementSuccess() {
        return ApiResponse.success(reportService.getPlacementSuccess());
    }

    @GetMapping("/status-funnel")
    public ApiResponse<List<StatusFunnelRow>> statusFunnel() {
        return ApiResponse.success(reportService.getStatusFunnel());
    }

    @GetMapping("/custom-view")
    public ApiResponse<List<CustomViewRow>> customView(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) String sector,
            @RequestParam(required = false) String opportunityType,
            @RequestParam(required = false, defaultValue = "month") String groupBy) {
        return ApiResponse.success(reportService.getCustomView(
                new CustomViewRequest(fromDate, toDate, sector, opportunityType, groupBy)));
    }

    // ─── Export endpoints ────────────────────────────────────────────

    @GetMapping("/export/{reportType}")
    public void export(
            @PathVariable String reportType,
            @RequestParam(defaultValue = "csv") String format,
            HttpServletResponse response) throws IOException {

        if (!List.of("application-volume", "placement-success", "status-funnel").contains(reportType)) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid report type: " + reportType);
            return;
        }

        switch (format.toLowerCase()) {
            case "csv" -> {
                response.setContentType("text/csv");
                response.setHeader("Content-Disposition",
                        "attachment; filename=\"" + reportType + "-report.csv\"");
                reportService.exportCsv(reportType, response.getOutputStream());
            }
            case "pdf" -> {
                response.setContentType("application/pdf");
                response.setHeader("Content-Disposition",
                        "attachment; filename=\"" + reportType + "-report.pdf\"");
                reportService.exportPdf(reportType, response.getOutputStream());
            }
            default -> response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                    "Invalid format: " + format + ". Use 'csv' or 'pdf'.");
        }
    }
}
