package com.tjeding.portal.reference;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QualificationTypeRepository extends JpaRepository<QualificationType, Integer> {
    List<QualificationType> findByIsActiveTrueOrderByTitleAsc();
}