package com.tjeding.portal.opportunity;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class OpportunitySkillId implements Serializable {
    private Long opportunityId;
    private Integer skillId;
}