package com.tjeding.portal.message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByConversation_IdOrderByCreatedAtAsc(Long conversationId);

    long countByConversation_IdAndReadFalseAndSender_IdNot(
            Long conversationId, Long excludeUserId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.read = false AND m.sender.id <> :excludeUserId")
    long countAllUnreadForUser(@Param("excludeUserId") Long excludeUserId);

    @Modifying
    @Query("""
            UPDATE Message m SET m.read = true, m.readAt = :now
            WHERE m.conversation.id = :conversationId
              AND m.read = false
              AND m.sender.id <> :excludeUserId
            """)
    int markRead(@Param("conversationId") Long conversationId,
                 @Param("excludeUserId") Long excludeUserId,
                 @Param("now") Instant now);
}
