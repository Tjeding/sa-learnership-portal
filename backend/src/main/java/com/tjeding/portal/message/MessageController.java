package com.tjeding.portal.message;

import com.tjeding.portal.common.ApiResponse;
import com.tjeding.portal.message.dto.ConversationSummaryResponse;
import com.tjeding.portal.message.dto.CreateConversationRequest;
import com.tjeding.portal.message.dto.MessageResponse;
import com.tjeding.portal.message.dto.SendMessageRequest;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
@Tag(name = "Messages", description = "Applicant ↔ Provider messaging (conversations + messages)")
@SecurityRequirement(name = "bearerAuth")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    // ─── Conversations ───────────────────────────────────────────────

    @GetMapping("/conversations")
    public ApiResponse<List<ConversationSummaryResponse>> listConversations(Authentication authentication) {
        return ApiResponse.success(messageService.getConversations(authentication.getName()));
    }

    @PostMapping("/conversations")
    public ApiResponse<ConversationSummaryResponse> createConversation(
            Authentication authentication,
            @RequestBody CreateConversationRequest request) {
        return ApiResponse.success(messageService.createOrFindConversation(authentication.getName(), request));
    }

    // ─── Messages ────────────────────────────────────────────────────

    @GetMapping("/conversations/{conversationId}/messages")
    public ApiResponse<List<MessageResponse>> getMessages(
            Authentication authentication,
            @PathVariable Long conversationId) {
        return ApiResponse.success(messageService.getMessages(authentication.getName(), conversationId));
    }

    @PostMapping("/conversations/{conversationId}/messages")
    public ApiResponse<MessageResponse> sendMessage(
            Authentication authentication,
            @PathVariable Long conversationId,
            @Valid @RequestBody SendMessageRequest request) {
        return ApiResponse.success(messageService.sendMessage(authentication.getName(), conversationId, request));
    }
}
