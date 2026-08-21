package com.tjeding.portal.application;

import com.tjeding.portal.application.dto.AdminDashboardResponse;
import com.tjeding.portal.opportunity.OpportunityRepository;
import com.tjeding.portal.opportunity.OpportunityStatus;
import com.tjeding.portal.user.UserRepository;
import com.tjeding.portal.user.UserRole;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final OpportunityRepository opportunityRepository;
    private final ApplicationRepository applicationRepository;
    private final JdbcTemplate jdbcTemplate;

    public AdminDashboardService(UserRepository userRepository,
                                  OpportunityRepository opportunityRepository,
                                  ApplicationRepository applicationRepository,
                                  JdbcTemplate jdbcTemplate) {
        this.userRepository = userRepository;
        this.opportunityRepository = opportunityRepository;
        this.applicationRepository = applicationRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        long totalUsers = userRepository.count();
        long totalProviders = userRepository.countByRole(UserRole.provider);
        long activeOpportunities = opportunityRepository.countByStatus(OpportunityStatus.approved);
        long totalApplications = applicationRepository.count();
        long placementsMade = applicationRepository.countByStatus(ApplicationStatus.accepted);

        List<AdminDashboardResponse.MonthlyVolumeResponse> volume = jdbcTemplate.query("""
                select to_char(date_trunc('month', applied_at), 'Mon') as month, count(*) as value
                from applications
                where applied_at >= (current_date - interval '6 months')
                group by date_trunc('month', applied_at)
                order by date_trunc('month', applied_at)
                """, (rs, rowNum) -> new AdminDashboardResponse.MonthlyVolumeResponse(
                rs.getString("month"), rs.getLong("value")));

        List<AdminDashboardResponse.SectorPlacementRateResponse> placementBySector = jdbcTemplate.query("""
                select sector, placement_rate_pct
                from vw_placement_success_by_sector
                where total_applications > 0
                order by placement_rate_pct desc
                """, (rs, rowNum) -> new AdminDashboardResponse.SectorPlacementRateResponse(
                rs.getString("sector"), rs.getDouble("placement_rate_pct")));

        return new AdminDashboardResponse(totalUsers, totalProviders, activeOpportunities,
                totalApplications, placementsMade, volume, placementBySector);
    }
}