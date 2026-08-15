package com.tjeding.portal.notification;

import com.tjeding.portal.common.ApiResponse;
import com.tjeding.portal.notification.dto.NotificationResponse;
import com.tjeding.portal.notification.dto.UnreadCountResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notifications", description = "The current user's own in-app notifications")
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ApiResponse<List<NotificationResponse>> getMyNotifications(Authentication authentication) {
        return ApiResponse.success(notificationService.getMyNotifications(authentication.getName()));
    }

    @GetMapping("/unread-count")
    public ApiResponse<UnreadCountResponse> getUnreadCount(Authentication authentication) {
        return ApiResponse.success(notificationService.getUnreadCount(authentication.getName()));
    }

    @PatchMapping("/{id}/read")
    public ApiResponse<NotificationResponse> markRead(Authentication authentication, @PathVariable Long id) {
        return ApiResponse.success(notificationService.markRead(authentication.getName(), id));
    }

    @PatchMapping("/mark-all-read")
    public ApiResponse<Void> markAllRead(Authentication authentication) {
        notificationService.markAllRead(authentication.getName());
        return ApiResponse.ok();
    }
}