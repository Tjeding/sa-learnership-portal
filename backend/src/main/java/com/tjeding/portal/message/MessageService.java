package com.tjeding.portal.message;

import com.tjeding.portal.common.exception.ForbiddenActionException;
import com.tjeding.portal.common.exception.ResourceNotFoundException;
import com.tjeding.portal.message.dto.ConversationSummaryResponse;
import com.tjeding.portal.message.dto.CreateConversationRequest;
import com.tjeding.portal.message.dto.MessageResponse;
import com.tjeding.portal.message.dto.SendMessageRequest;
import com.tjeding.portal.opportunity.Opportunity;
import com.tjeding.portal.opportunity.OpportunityRepository;
import com.tjeding.portal.user.User;
import com.tjeding.portal.user.UserRepository;
import com.tjeding.portal.user.UserRole;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class MessageService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final OpportunityRepository opportunityRepository;
    private final JdbcTemplate jdbcTemplate;

    public MessageService(ConversationRepository conversationRepository,
                          MessageRepository messageRepository,
                          UserRepository userRepository,
                          OpportunityRepository opportunityRepository,
                          JdbcTemplate jdbcTemplate) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.opportunityRepository = opportunityRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    // ─── Helpers ─────────────────────────────────────────────────────

    private User currentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void ensureParticipant(Conversation conversation, Long userId) {
        if (!conversation.getApplicant().getId().equals(userId)
                && !conversation.getProvider().getId().equals(userId)) {
            throw new ForbiddenActionException("You are not a participant in this conversation.");
        }
    }

    // ─── Unread message count ──────────────────────────────────────

    @Transactional(readOnly = true)
    public long getTotalUnreadCount(String email) {
        User user = currentUser(email);
        return messageRepository.countAllUnreadForUser(user.getId());
    }

    // ─── List conversations ──────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ConversationSummaryResponse> getConversations(String email) {
        User user = currentUser(email);
        Long userId = user.getId();

        // Use JdbcTemplate for the thread list — it requires conditional joins
        // to resolve the *other* participant's display name.
        return jdbcTemplate.query("""
                SELECT
                    c.id                                                        AS conversation_id,
                    c.applicant_id,
                    c.provider_id,
                    c.opportunity_id,
                    o.title                                                     AS opportunity_title,
                    CASE WHEN c.applicant_id = ?
                         THEN COALESCE(pp.organization_name, 'Provider')
                         ELSE COALESCE(ap.first_name || ' ' || ap.last_name, 'Applicant')
                    END                                                         AS recipient_name,
                    CASE WHEN c.applicant_id = ?
                         THEN UPPER(SUBSTRING(COALESCE(pp.organization_name, 'P') FROM 1 FOR 1) ||
                              COALESCE(SUBSTRING(pp.organization_name FROM POSITION(' ' IN pp.organization_name) + 1 FOR 1), ''))
                         ELSE UPPER(SUBSTRING(COALESCE(ap.first_name, 'A') FROM 1 FOR 1) ||
                              COALESCE(SUBSTRING(ap.last_name FROM 1 FOR 1), ''))
                    END                                                         AS recipient_initials,
                    last_msg.body                                               AS last_message_preview,
                    last_msg.created_at                                         AS last_message_at,
                    COALESCE(unread.unread_count, 0)                            AS unread_count
                FROM conversations c
                LEFT JOIN opportunities o ON o.id = c.opportunity_id
                LEFT JOIN applicant_profiles ap ON ap.user_id = c.applicant_id
                LEFT JOIN provider_profiles pp ON pp.user_id = c.provider_id
                LEFT JOIN LATERAL (
                    SELECT m.body, m.created_at
                    FROM messages m
                    WHERE m.conversation_id = c.id
                    ORDER BY m.created_at DESC
                    LIMIT 1
                ) last_msg ON true
                LEFT JOIN (
                    SELECT m2.conversation_id, COUNT(*) AS unread_count
                    FROM messages m2
                    WHERE m2.is_read = FALSE AND m2.sender_id <> ?
                    GROUP BY m2.conversation_id
                ) unread ON unread.conversation_id = c.id
                WHERE c.applicant_id = ? OR c.provider_id = ?
                ORDER BY COALESCE(last_msg.created_at, c.updated_at) DESC
                """,
                (rs, rn) -> new ConversationSummaryResponse(
                        rs.getLong("conversation_id"),
                        rs.getLong("applicant_id") == userId
                                ? rs.getLong("provider_id")
                                : rs.getLong("applicant_id"),
                        rs.getString("recipient_name"),
                        rs.getString("recipient_initials"),
                        rs.getObject("opportunity_id") != null ? rs.getLong("opportunity_id") : null,
                        rs.getString("opportunity_title"),
                        rs.getString("last_message_preview"),
                        rs.getObject("last_message_at", Instant.class),
                        rs.getLong("unread_count")
                ),
                userId, userId, userId, userId, userId);
    }

    // ─── Get messages ────────────────────────────────────────────────

    @Transactional
    public List<MessageResponse> getMessages(String email, Long conversationId) {
        User user = currentUser(email);
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> ResourceNotFoundException.of("Conversation", conversationId));
        ensureParticipant(conversation, user.getId());

        // Mark incoming messages as read
        messageRepository.markRead(conversationId, user.getId(), Instant.now());

        return messageRepository.findByConversation_IdOrderByCreatedAtAsc(conversationId)
                .stream()
                .map(m -> toMessageResponse(m, user.getId()))
                .toList();
    }

    // ─── Send a message ──────────────────────────────────────────────

    @Transactional
    public MessageResponse sendMessage(String email, Long conversationId, SendMessageRequest request) {
        User user = currentUser(email);
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> ResourceNotFoundException.of("Conversation", conversationId));
        ensureParticipant(conversation, user.getId());

        Message message = Message.builder()
                .conversation(conversation)
                .sender(user)
                .body(request.body())
                .read(true)   // sender's own message is implicitly read
                .build();
        messageRepository.save(message);

        // Bump conversation.updated_at so the thread list sorts correctly
        conversationRepository.save(conversation);

        return toMessageResponse(message, user.getId());
    }

    // ─── Create / find conversation ──────────────────────────────────

    @Transactional
    public ConversationSummaryResponse createOrFindConversation(String email, CreateConversationRequest request) {
        User user = currentUser(email);

        // Determine who is the applicant and who is the provider
        Long applicantId;
        Long providerId;

        if (user.getRole() == UserRole.applicant) {
            applicantId = user.getId();
            providerId = request.recipientId();
        } else {
            applicantId = request.recipientId();
            providerId = user.getId();
        }

        // Check if conversation already exists
        var existing = request.opportunityId() != null
                ? conversationRepository.findByApplicant_IdAndProvider_IdAndOpportunity_Id(
                        applicantId, providerId, request.opportunityId())
                : conversationRepository.findByApplicant_IdAndProvider_IdAndOpportunityIsNull(
                        applicantId, providerId);

        Conversation conversation = existing.orElseGet(() -> {
            User applicant = userRepository.findById(applicantId)
                    .orElseThrow(() -> ResourceNotFoundException.of("User", applicantId));
            User provider = userRepository.findById(providerId)
                    .orElseThrow(() -> ResourceNotFoundException.of("User", providerId));

            Conversation newConv = Conversation.builder()
                    .applicant(applicant)
                    .provider(provider)
                    .build();

            if (request.opportunityId() != null) {
                Opportunity opp = opportunityRepository.findById(request.opportunityId())
                        .orElseThrow(() -> ResourceNotFoundException.of("Opportunity", request.opportunityId()));
                newConv.setOpportunity(opp);
            }

            return conversationRepository.save(newConv);
        });

        // Return a minimal summary — the frontend will refresh the full list
        Long recipientId = user.getRole() == UserRole.applicant ? providerId : applicantId;
        return new ConversationSummaryResponse(
                conversation.getId(),
                recipientId,
                "",  // caller can refresh via getConversations()
                "",
                conversation.getOpportunity() != null ? conversation.getOpportunity().getId() : null,
                conversation.getOpportunity() != null ? conversation.getOpportunity().getTitle() : null,
                null,
                conversation.getUpdatedAt(),
                0
        );
    }

    // ─── DTO mapping ─────────────────────────────────────────────────

    private MessageResponse toMessageResponse(Message m, Long currentUserId) {
        String senderName = "User";
        // Try to resolve sender display name from applicant or provider profile
        var senderOpt = userRepository.findById(m.getSender().getId());
        if (senderOpt.isPresent()) {
            User sender = senderOpt.get();
            if (sender.getRole() == UserRole.applicant) {
                senderName = jdbcTemplate.queryForObject(
                        "SELECT COALESCE(first_name || ' ' || last_name, 'Applicant') FROM applicant_profiles WHERE user_id = ?",
                        String.class, sender.getId());
            } else if (sender.getRole() == UserRole.provider) {
                senderName = jdbcTemplate.queryForObject(
                        "SELECT COALESCE(organization_name, 'Provider') FROM provider_profiles WHERE user_id = ?",
                        String.class, sender.getId());
            }
        }

        return new MessageResponse(
                m.getId(),
                m.getSender().getId(),
                senderName,
                m.getSender().getId().equals(currentUserId),
                m.getBody(),
                m.isRead(),
                m.getCreatedAt()
        );
    }
}
