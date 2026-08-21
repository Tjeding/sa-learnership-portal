package com.tjeding.portal.message.dto;

import jakarta.validation.constraints.NotBlank;

public record SendMessageRequest(
        @NotBlank(message = "Message body must not be blank")
        String body
) {}
