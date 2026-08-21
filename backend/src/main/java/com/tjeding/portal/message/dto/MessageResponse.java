package com.tjeding.portal.message.dto;

import java.time.Instant;

public record MessageResponse(
        Long id,
        Long senderId,
        String senderName,
        boolean fromMe,
        String body,
        boolean read,
        Instant createdAt
) {}
