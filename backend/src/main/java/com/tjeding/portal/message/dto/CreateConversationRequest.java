package com.tjeding.portal.message.dto;

public record CreateConversationRequest(
        Long recipientId,
        Long opportunityId
) {}
