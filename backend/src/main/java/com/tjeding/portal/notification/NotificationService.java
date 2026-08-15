package com.tjeding.portal.notification;

import com.tjeding.portal.common.exception.ForbiddenActionException;
import com.tjeding.portal.common.exception.ResourceNotFoundException;
import com.tjeding.portal.notification.dto.NotificationResponse;
import com.tjeding.portal.notification.dto.UnreadCountResponse;
import com.tjeding.portal.user.User;
import com.tjeding.portal.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    private User currentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(String email) {
        User user = currentUser(email);
        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public UnreadCountResponse getUnreadCount(String email) {
        User user = currentUser(email);
        return new UnreadCountResponse(notificationRepository.countByUser_IdAndReadFalse(user.getId()));
    }

    @Transactional
    public NotificationResponse markRead(String email, Long notificationId) {
        User user = currentUser(email);
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> ResourceNotFoundException.of("Notification", notificationId));
        if (!n.getUser().getId().equals(user.getId())) {
            throw new ForbiddenActionException("You do not have permission to modify this notification.");
        }
        if (!n.isRead()) {
            n.setRead(true);
            n.setReadAt(Instant.now());
            notificationRepository.save(n);
        }
        return toResponse(n);
    }

    @Transactional
    public void markAllRead(String email) {
        User user = currentUser(email);
        Instant now = Instant.now();
        List<Notification> unread = notificationRepository.findByUser_IdAndReadFalse(user.getId());
        unread.forEach(n -> {
            n.setRead(true);
            n.setReadAt(now);
        });
        notificationRepository.saveAll(unread);
    }

    private NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(
                n.getId(), n.getType(), n.getTitle(), n.getMessage(),
                n.getRelatedApplication() != null ? n.getRelatedApplication().getId() : null,
                n.getRelatedOpportunity() != null ? n.getRelatedOpportunity().getId() : null,
                n.isRead(), n.getReadAt(), n.getCreatedAt()
        );
    }
}