-- =====================================================================
-- V7__analytics_views.sql
-- Views backing the 3 required dashboard reports. Your Java layer (e.g.
-- JDBC/JPA @Query or a reporting service) just SELECTs from these views
-- and streams the result to CSV/PDF (see pdf/csv export note in README).
-- =====================================================================

-- ---------------------------------------------------------------------
-- REPORT 1: Application volume per opportunity
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_application_volume_per_opportunity AS
SELECT
    o.id                    AS opportunity_id,
    o.title                 AS opportunity_title,
    o.opportunity_type,
    s.name                  AS sector,
    p.organization_name     AS provider_name,
    o.closing_date,
    o.status                AS opportunity_status,
    COUNT(a.id)                                             AS total_applications,
    COUNT(a.id) FILTER (WHERE a.status = 'shortlisted')     AS shortlisted_count,
    COUNT(a.id) FILTER (WHERE a.status = 'offered')         AS offered_count,
    COUNT(a.id) FILTER (WHERE a.status = 'accepted')        AS accepted_count,
    COUNT(a.id) FILTER (WHERE a.status = 'rejected')        AS rejected_count
FROM opportunities o
LEFT JOIN applications a ON a.opportunity_id = o.id
LEFT JOIN sectors s ON s.id = o.sector_id
LEFT JOIN provider_profiles p ON p.user_id = o.provider_id
GROUP BY o.id, o.title, o.opportunity_type, s.name, p.organization_name, o.closing_date, o.status;

-- ---------------------------------------------------------------------
-- REPORT 2: Placement success rate by sector
-- "Placement" = application reached status 'accepted'.
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_placement_success_by_sector AS
SELECT
    s.id                    AS sector_id,
    s.name                  AS sector,
    COUNT(a.id)                                         AS total_applications,
    COUNT(a.id) FILTER (WHERE a.status = 'accepted')    AS total_placements,
    ROUND(
        100.0 * COUNT(a.id) FILTER (WHERE a.status = 'accepted')
        / NULLIF(COUNT(a.id), 0), 2
    )                                                    AS placement_rate_pct
FROM sectors s
LEFT JOIN opportunities o ON o.sector_id = s.id
LEFT JOIN applications a ON a.opportunity_id = o.id
GROUP BY s.id, s.name;

-- ---------------------------------------------------------------------
-- REPORT 3 (custom view): Application status funnel over time
-- Useful as the base for a "custom view" report screen where an admin
-- can filter by date range / sector / opportunity type in the Java layer.
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_application_status_funnel AS
SELECT
    date_trunc('month', a.applied_at)::date AS month,
    o.opportunity_type,
    s.name                                  AS sector,
    a.status,
    COUNT(*)                                AS application_count
FROM applications a
JOIN opportunities o ON o.id = a.opportunity_id
LEFT JOIN sectors s ON s.id = o.sector_id
GROUP BY date_trunc('month', a.applied_at), o.opportunity_type, s.name, a.status;

-- ---------------------------------------------------------------------
-- BONUS: AI-based opportunity matching
-- This view does the "traditional" scoring part (skill + NQF level
-- overlap) that a matching service can use as a baseline signal, or as
-- input features to a smarter model later. It computes, for every
-- (applicant, open opportunity) pair, how many required skills overlap.
-- Filter/order by match_score in your Java recommendation service.
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_applicant_opportunity_match_scores AS
SELECT
    ap.user_id                                  AS applicant_id,
    o.id                                         AS opportunity_id,
    o.title                                      AS opportunity_title,
    COUNT(DISTINCT os.skill_id) FILTER (
        WHERE os.skill_id IN (
            SELECT skill_id FROM applicant_skills WHERE applicant_id = ap.user_id
        )
    )                                             AS matching_skills,
    COUNT(DISTINCT os.skill_id) FILTER (WHERE os.is_required)  AS required_skills_total,
    (o.min_nqf_level_id IS NULL OR o.min_nqf_level_id <= COALESCE((
        SELECT MAX(qt.nqf_level_id)
        FROM applicant_qualifications aq
        JOIN qualification_types qt ON qt.id = aq.qualification_type_id
        WHERE aq.applicant_id = ap.user_id
    ), 0))                                        AS meets_nqf_requirement
FROM applicant_profiles ap
CROSS JOIN opportunities o
LEFT JOIN opportunity_skills os ON os.opportunity_id = o.id
WHERE o.status = 'approved' AND o.closing_date >= CURRENT_DATE
GROUP BY ap.user_id, o.id, o.title, o.min_nqf_level_id;
