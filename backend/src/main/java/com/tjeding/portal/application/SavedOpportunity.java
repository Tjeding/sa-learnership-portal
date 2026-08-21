package com.tjeding.portal.application;

import com.tjeding.portal.opportunity.Opportunity;
import com.tjeding.portal.user.ApplicantProfile;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "saved_opportunities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedOpportunity {

    @EmbeddedId
    private SavedOpportunityId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("applicantId")
    @JoinColumn(name = "applicant_id")
    private ApplicantProfile applicant;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("opportunityId")
    @JoinColumn(name = "opportunity_id")
    private Opportunity opportunity;

    @Column(name = "saved_at", nullable = false, updatable = false)
    private Instant savedAt;

    @PrePersist
    protected void onCreate() {
        this.savedAt = Instant.now();
    }
}