package com.tjeding.portal.report;

import com.tjeding.portal.common.ApiResponse;
import com.tjeding.portal.common.exception.ResourceNotFoundException;
import com.tjeding.portal.report.dto.ApplicationVolumeRow;
import com.tjeding.portal.report.dto.PlacementSuccessRow;
import com.tjeding.portal.report.dto.StatusFunnelRow;
import com.tjeding.portal.user.ProviderProfile;
import com.tjeding.portal.user.ProviderProfileRepository;
import com.tjeding.portal.user.User;
import com.tjeding.portal.user.UserRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/provider/reports")
@Tag(name = "Provider Reports", description = "Provider-scoped analytics reports with CSV/PDF export.")
@SecurityRequirement(name = "bearerAuth")
public class ProviderReportController {

    private final ReportService reportService;
    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;

    public ProviderReportController(ReportService reportService,
                                     UserRepository userRepository,
                                     ProviderProfileRepository providerProfileRepository) {
        this.reportService = reportService;
        this.userRepository = userRepository;
        this.providerProfileRepository = providerProfileRepository;
    }

    // ─── Data endpoints ──────────────────────────────────────────────

    @GetMapping("/application-volume")
    public ApiResponse<List<ApplicationVolumeRow>> applicationVolume(Authentication authentication) {
        return ApiResponse.success(reportService.getApplicationVolumeForProvider(resolveProviderId(authentication)));
    }

    @GetMapping("/placement-success")
    public ApiResponse<List<PlacementSuccessRow>> placementSuccess(Authentication authentication) {
        return ApiResponse.success(reportService.getPlacementSuccessForProvider(resolveProviderId(authentication)));
    }

    @GetMapping("/status-funnel")
    public ApiResponse<List<StatusFunnelRow>> statusFunnel(Authentication authentication) {
        return ApiResponse.success(reportService.getStatusFunnelForProvider(resolveProviderId(authentication)));
    }

    // ─── Export endpoint ─────────────────────────────────────────────

    @GetMapping("/export/{reportType}")
    public void export(
            @PathVariable String reportType,
            @RequestParam(defaultValue = "csv") String format,
            Authentication authentication,
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

    // ─── Helpers ─────────────────────────────────────────────────────

    private Long resolveProviderId(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        ProviderProfile provider = providerProfileRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found"));
        return provider.getUserId();
    }
}
