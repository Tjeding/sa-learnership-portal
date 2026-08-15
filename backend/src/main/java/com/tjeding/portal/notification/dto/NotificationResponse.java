package com.tjeding.portal.notification.dto;

import com.tjeding.portal.notification.NotificationType;

import java.time.Instant;

public record NotificationResponse(
        Long id,
        NotificationType type,
        String title,
        String message,
        Long relatedApplicationId,
        Long relatedOpportunityId,
        boolean read,
        Instant readAt,
        Instant createdAt
) {
}