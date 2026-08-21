package com.tjeding.portal.message.dto;

import java.time.Instant;

public record ConversationSummaryResponse(
        Long conversationId,
        Long recipientId,
        String recipientName,
        String recipientInitials,
        Long opportunityId,
        String opportunityTitle,
        String lastMessagePreview,
        Instant lastMessageAt,
        long unreadCount
) {}
