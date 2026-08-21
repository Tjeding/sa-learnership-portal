package com.tjeding.portal.report;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.tjeding.portal.report.dto.ApplicationVolumeRow;
import com.tjeding.portal.report.dto.CustomViewRequest;
import com.tjeding.portal.report.dto.CustomViewRow;
import com.tjeding.portal.report.dto.PlacementSuccessRow;
import com.tjeding.portal.report.dto.StatusFunnelRow;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.OutputStream;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReportService {

    private final JdbcTemplate jdbcTemplate;

    public ReportService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ─── Report 1: Application volume per opportunity ────────────────

    @Transactional(readOnly = true)
    public List<ApplicationVolumeRow> getApplicationVolume() {
        return jdbcTemplate.query("""
                SELECT opportunity_id, opportunity_title, opportunity_type, sector,
                       provider_name, closing_date, opportunity_status,
                       total_applications, shortlisted_count, offered_count,
                       accepted_count, rejected_count
                FROM vw_application_volume_per_opportunity
                ORDER BY total_applications DESC
                """, (rs, rn) -> new ApplicationVolumeRow(
                rs.getLong("opportunity_id"),
                rs.getString("opportunity_title"),
                rs.getString("opportunity_type"),
                rs.getString("sector"),
                rs.getString("provider_name"),
                rs.getObject("closing_date", LocalDate.class),
                rs.getString("opportunity_status"),
                rs.getLong("total_applications"),
                rs.getLong("shortlisted_count"),
                rs.getLong("offered_count"),
                rs.getLong("accepted_count"),
                rs.getLong("rejected_count")));
    }

    @Transactional(readOnly = true)
    public List<ApplicationVolumeRow> getApplicationVolumeForProvider(Long providerUserId) {
        return jdbcTemplate.query("""
                SELECT opportunity_id, opportunity_title, opportunity_type, sector,
                       provider_name, closing_date, opportunity_status,
                       total_applications, shortlisted_count, offered_count,
                       accepted_count, rejected_count
                FROM vw_application_volume_per_opportunity
                WHERE provider_name = (SELECT organization_name FROM provider_profiles WHERE user_id = ?)
                ORDER BY total_applications DESC
                """, (rs, rn) -> new ApplicationVolumeRow(
                rs.getLong("opportunity_id"),
                rs.getString("opportunity_title"),
                rs.getString("opportunity_type"),
                rs.getString("sector"),
                rs.getString("provider_name"),
                rs.getObject("closing_date", LocalDate.class),
                rs.getString("opportunity_status"),
                rs.getLong("total_applications"),
                rs.getLong("shortlisted_count"),
                rs.getLong("offered_count"),
                rs.getLong("accepted_count"),
                rs.getLong("rejected_count")),
                providerUserId);
    }

    // ─── Report 2: Placement success by sector ───────────────────────

    @Transactional(readOnly = true)
    public List<PlacementSuccessRow> getPlacementSuccess() {
        return jdbcTemplate.query("""
                SELECT sector_id, sector, total_applications, total_placements, placement_rate_pct
                FROM vw_placement_success_by_sector
                ORDER BY placement_rate_pct DESC
                """, (rs, rn) -> new PlacementSuccessRow(
                rs.getLong("sector_id"),
                rs.getString("sector"),
                rs.getLong("total_applications"),
                rs.getLong("total_placements"),
                rs.getDouble("placement_rate_pct")));
    }

    @Transactional(readOnly = true)
    public List<PlacementSuccessRow> getPlacementSuccessForProvider(Long providerUserId) {
        return jdbcTemplate.query("""
                SELECT ps.sector_id, ps.sector, ps.total_applications, ps.total_placements, ps.placement_rate_pct
                FROM vw_placement_success_by_sector ps
                WHERE ps.sector_id IN (
                    SELECT DISTINCT o.sector_id FROM opportunities o
                    WHERE o.provider_id = ?
                )
                ORDER BY ps.placement_rate_pct DESC
                """, (rs, rn) -> new PlacementSuccessRow(
                rs.getLong("sector_id"),
                rs.getString("sector"),
                rs.getLong("total_applications"),
                rs.getLong("total_placements"),
                rs.getDouble("placement_rate_pct")),
                providerUserId);
    }

    // ─── Report 3: Application status funnel ─────────────────────────

    @Transactional(readOnly = true)
    public List<StatusFunnelRow> getStatusFunnel() {
        return jdbcTemplate.query("""
                SELECT month, opportunity_type, sector, status, application_count
                FROM vw_application_status_funnel
                ORDER BY month DESC, opportunity_type, sector, status
                """, (rs, rn) -> new StatusFunnelRow(
                rs.getObject("month", LocalDate.class),
                rs.getString("opportunity_type"),
                rs.getString("sector"),
                rs.getString("status"),
                rs.getLong("application_count")));
    }

    @Transactional(readOnly = true)
    public List<StatusFunnelRow> getStatusFunnelForProvider(Long providerUserId) {
        return jdbcTemplate.query("""
                SELECT f.month, f.opportunity_type, f.sector, f.status, f.application_count
                FROM vw_application_status_funnel f
                WHERE f.sector IN (
                    SELECT DISTINCT s.name FROM sectors s
                    JOIN opportunities o ON o.sector_id = s.id
                    WHERE o.provider_id = ?
                )
                ORDER BY f.month DESC, f.opportunity_type, f.sector, f.status
                """, (rs, rn) -> new StatusFunnelRow(
                rs.getObject("month", LocalDate.class),
                rs.getString("opportunity_type"),
                rs.getString("sector"),
                rs.getString("status"),
                rs.getLong("application_count")),
                providerUserId);
    }

    // ─── Custom view (filterable) ────────────────────────────────────

    @Transactional(readOnly = true)
    public List<CustomViewRow> getCustomView(CustomViewRequest request) {
        String groupColumn = switch (request.groupBy() != null ? request.groupBy() : "month") {
            case "sector" -> "sector";
            case "opportunity_type", "opportunityType" -> "opportunity_type";
            default -> "to_char(month, 'YYYY-MM')";
        };

        StringBuilder sql = new StringBuilder("""
                SELECT %s AS grouping, status, SUM(application_count) AS count
                FROM vw_application_status_funnel
                WHERE 1=1
                """.formatted(groupColumn));

        List<Object> params = new ArrayList<>();
        if (request.fromDate() != null) {
            sql.append(" AND month >= ?");
            params.add(request.fromDate());
        }
        if (request.toDate() != null) {
            sql.append(" AND month <= ?");
            params.add(request.toDate());
        }
        if (request.sector() != null && !request.sector().isBlank()) {
            sql.append(" AND sector = ?");
            params.add(request.sector());
        }
        if (request.opportunityType() != null && !request.opportunityType().isBlank()) {
            sql.append(" AND opportunity_type = ?");
            params.add(request.opportunityType());
        }
        sql.append(" GROUP BY grouping, status ORDER BY grouping, status");

        return jdbcTemplate.query(sql.toString(),
                (rs, rn) -> new CustomViewRow(
                        rs.getString("grouping"),
                        rs.getString("status"),
                        rs.getLong("count")),
                params.toArray());
    }

    // ─── CSV export ──────────────────────────────────────────────────

    public void exportCsv(String reportType, OutputStream outputStream) {
        PrintWriter writer = new PrintWriter(outputStream);
        switch (reportType) {
            case "application-volume" -> {
                writer.println("Opportunity ID,Title,Type,Sector,Provider,Closing Date,Status,Total,Shortlisted,Offered,Accepted,Rejected");
                for (var row : getApplicationVolume()) {
                    writer.printf("%d,%s,%s,%s,%s,%s,%s,%d,%d,%d,%d,%d%n",
                            row.opportunityId(), csvEscape(row.opportunityTitle()),
                            csvEscape(row.opportunityType()), csvEscape(row.sector()),
                            csvEscape(row.providerName()), row.closingDate(),
                            csvEscape(row.opportunityStatus()), row.totalApplications(),
                            row.shortlistedCount(), row.offeredCount(),
                            row.acceptedCount(), row.rejectedCount());
                }
            }
            case "placement-success" -> {
                writer.println("Sector ID,Sector,Total Applications,Total Placements,Placement Rate (%)");
                for (var row : getPlacementSuccess()) {
                    writer.printf("%d,%s,%d,%d,%.2f%n",
                            row.sectorId(), csvEscape(row.sector()),
                            row.totalApplications(), row.totalPlacements(),
                            row.placementRatePct());
                }
            }
            case "status-funnel" -> {
                writer.println("Month,Opportunity Type,Sector,Status,Count");
                for (var row : getStatusFunnel()) {
                    writer.printf("%s,%s,%s,%s,%d%n",
                            row.month(), csvEscape(row.opportunityType()),
                            csvEscape(row.sector()), csvEscape(row.status()),
                            row.applicationCount());
                }
            }
            default -> throw new IllegalArgumentException("Unknown report type: " + reportType);
        }
        writer.flush();
    }

    // ─── PDF export ──────────────────────────────────────────────────

    public void exportPdf(String reportType, OutputStream outputStream) {
        Document document = new Document();
        try {
            PdfWriter.getInstance(document, outputStream);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 16, Font.BOLD);
            Font headerFont = new Font(Font.HELVETICA, 9, Font.BOLD);
            Font cellFont = new Font(Font.HELVETICA, 8, Font.NORMAL);

            switch (reportType) {
                case "application-volume" -> {
                    document.add(new Paragraph("Application Volume per Opportunity", titleFont));
                    document.add(new Paragraph(" "));
                    PdfPTable table = new PdfPTable(8);
                    table.setWidthPercentage(100);
                    for (String h : List.of("Title", "Type", "Sector", "Provider", "Closing", "Total", "Accepted", "Rejected")) {
                        PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setBackgroundColor(new java.awt.Color(240, 240, 240));
                        table.addCell(cell);
                    }
                    for (var row : getApplicationVolume()) {
                        addCell(table, cellFont, row.opportunityTitle());
                        addCell(table, cellFont, row.opportunityType());
                        addCell(table, cellFont, row.sector());
                        addCell(table, cellFont, row.providerName());
                        addCell(table, cellFont, row.closingDate() != null ? row.closingDate().toString() : "");
                        addCell(table, cellFont, String.valueOf(row.totalApplications()));
                        addCell(table, cellFont, String.valueOf(row.acceptedCount()));
                        addCell(table, cellFont, String.valueOf(row.rejectedCount()));
                    }
                    document.add(table);
                }
                case "placement-success" -> {
                    document.add(new Paragraph("Placement Success by Sector", titleFont));
                    document.add(new Paragraph(" "));
                    PdfPTable table = new PdfPTable(4);
                    table.setWidthPercentage(100);
                    for (String h : List.of("Sector", "Applications", "Placements", "Rate (%)")) {
                        PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setBackgroundColor(new java.awt.Color(240, 240, 240));
                        table.addCell(cell);
                    }
                    for (var row : getPlacementSuccess()) {
                        addCell(table, cellFont, row.sector());
                        addCell(table, cellFont, String.valueOf(row.totalApplications()));
                        addCell(table, cellFont, String.valueOf(row.totalPlacements()));
                        addCell(table, cellFont, String.format("%.2f", row.placementRatePct()));
                    }
                    document.add(table);
                }
                case "status-funnel" -> {
                    document.add(new Paragraph("Application Status Funnel", titleFont));
                    document.add(new Paragraph(" "));
                    PdfPTable table = new PdfPTable(5);
                    table.setWidthPercentage(100);
                    for (String h : List.of("Month", "Type", "Sector", "Status", "Count")) {
                        PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setBackgroundColor(new java.awt.Color(240, 240, 240));
                        table.addCell(cell);
                    }
                    for (var row : getStatusFunnel()) {
                        addCell(table, cellFont, row.month() != null ? row.month().toString() : "");
                        addCell(table, cellFont, row.opportunityType());
                        addCell(table, cellFont, row.sector());
                        addCell(table, cellFont, row.status());
                        addCell(table, cellFont, String.valueOf(row.applicationCount()));
                    }
                    document.add(table);
                }
                default -> throw new IllegalArgumentException("Unknown report type: " + reportType);
            }
        } catch (DocumentException e) {
            throw new RuntimeException("PDF generation failed", e);
        } finally {
            document.close();
        }
    }

    // ─── Helpers ─────────────────────────────────────────────────────

    private String csvEscape(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    private void addCell(PdfPTable table, Font font, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "", font));
        cell.setPadding(4);
        table.addCell(cell);
    }
}
