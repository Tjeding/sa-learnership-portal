package com.tjeding.portal.opportunity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "opportunity_requirements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpportunityRequirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opportunity_id", nullable = false)
    private Opportunity opportunity;

    @Column(name = "requirement_text", nullable = false, columnDefinition = "text")
    private String requirementText;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Short displayOrder = 0;
}