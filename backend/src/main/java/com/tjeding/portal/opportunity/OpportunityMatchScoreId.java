package com.tjeding.portal.opportunity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class OpportunityMatchScoreId implements Serializable {

    @Column(name = "applicant_id")
    private Long applicantId;

    @Column(name = "opportunity_id")
    private Long opportunityId;
}