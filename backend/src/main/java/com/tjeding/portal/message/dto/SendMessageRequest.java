package com.tjeding.portal.message.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SendMessageRequest(
        @NotBlank(message = "Message body must not be blank")
        @Size(max = 5000, message = "Messages must be at most 5000 characters")
        String body
) {}
