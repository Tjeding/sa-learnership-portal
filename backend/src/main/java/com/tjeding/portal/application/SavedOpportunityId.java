package com.tjeding.portal.application;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class SavedOpportunityId implements Serializable {
    private Long applicantId;
    private Long opportunityId;
}