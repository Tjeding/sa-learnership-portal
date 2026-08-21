package com.tjeding.portal.opportunity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import lombok.Getter;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;
import org.hibernate.annotations.Synchronize;

@Entity
@Immutable
@Subselect("""
        select applicant_id, opportunity_id, opportunity_title,
               matching_skills, required_skills_total, meets_nqf_requirement
        from vw_applicant_opportunity_match_scores
        """)
@Synchronize({"opportunities", "applicant_skills", "opportunity_skills", "applicant_qualifications", "qualification_types"})
@Getter
public class OpportunityMatchScore {

    @EmbeddedId
    private OpportunityMatchScoreId id;

    @Column(name = "opportunity_title")
    private String opportunityTitle;

    @Column(name = "matching_skills")
    private Integer matchingSkills;

    @Column(name = "required_skills_total")
    private Integer requiredSkillsTotal;

    @Column(name = "meets_nqf_requirement")
    private Boolean meetsNqfRequirement;
}