package com.tjeding.portal.opportunity;

import com.tjeding.portal.reference.Skill;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "opportunity_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpportunitySkill {

    @EmbeddedId
    private OpportunitySkillId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("opportunityId")
    @JoinColumn(name = "opportunity_id")
    private Opportunity opportunity;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("skillId")
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @Column(name = "is_required", nullable = false)
    @Builder.Default
    private boolean required = true;
}