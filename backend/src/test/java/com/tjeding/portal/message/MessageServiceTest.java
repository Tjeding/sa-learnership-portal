package com.tjeding.portal.message;

import com.tjeding.portal.common.exception.ForbiddenActionException;
import com.tjeding.portal.common.exception.BadRequestException;
import com.tjeding.portal.message.dto.CreateConversationRequest;
import com.tjeding.portal.message.dto.SendMessageRequest;
import com.tjeding.portal.opportunity.OpportunityRepository;
import com.tjeding.portal.user.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.Optional;
import java.util.List;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class MessageServiceTest {
    ConversationRepository conversations = mock(ConversationRepository.class);
    MessageRepository messages = mock(MessageRepository.class);
    UserRepository users = mock(UserRepository.class);
    OpportunityRepository opportunities = mock(OpportunityRepository.class);
    JdbcTemplate jdbc = mock(JdbcTemplate.class);
    MessageService service = new MessageService(conversations, messages, users, opportunities, jdbc);
    User applicant = User.builder().id(1L).email("applicant@test.co.za").role(UserRole.applicant).build();
    User provider = User.builder().id(2L).email("provider@test.co.za").role(UserRole.provider).build();
    Conversation conversation = Conversation.builder().id(10L).applicant(applicant).provider(provider).build();
    @BeforeEach void setup() {
        when(users.findByEmail(applicant.getEmail())).thenReturn(Optional.of(applicant));
        when(users.findByEmail(provider.getEmail())).thenReturn(Optional.of(provider));
        when(users.findById(1L)).thenReturn(Optional.of(applicant));
        when(users.findById(2L)).thenReturn(Optional.of(provider));
        when(conversations.findById(10L)).thenReturn(Optional.of(conversation));
    }
    @Test void sentMessageRemainsUnreadForRecipient() {
        service.sendMessage(applicant.getEmail(), 10L, new SendMessageRequest("  Hello  "));
        ArgumentCaptor<Message> captured = ArgumentCaptor.forClass(Message.class);
        verify(messages).save(captured.capture());
        assertThat(captured.getValue().isRead()).isFalse();
        assertThat(captured.getValue().getBody()).isEqualTo("Hello");
        assertThat(conversation.getUpdatedAt()).isNotNull();
    }
    @Test void outsiderCannotReadOrSend() {
        User outsider = User.builder().id(3L).email("outside@test.co.za").role(UserRole.admin).build();
        when(users.findByEmail(outsider.getEmail())).thenReturn(Optional.of(outsider));
        assertThatThrownBy(() -> service.getMessages(outsider.getEmail(), 10L)).isInstanceOf(ForbiddenActionException.class);
        assertThatThrownBy(() -> service.sendMessage(outsider.getEmail(), 10L, new SendMessageRequest("Hi"))).isInstanceOf(ForbiddenActionException.class);
        verifyNoInteractions(messages);
    }
    @Test void readingMarksOnlyIncomingMessages() {
        when(messages.findByConversation_IdOrderByCreatedAtAsc(10L)).thenReturn(List.of());
        service.getMessages(provider.getEmail(), 10L);
        verify(messages).markRead(eq(10L), eq(2L), any());
    }
    @Test void cannotMessageYourself() {
        assertThatThrownBy(() -> service.createOrFindConversation(applicant.getEmail(), new CreateConversationRequest(1L, null))).isInstanceOf(BadRequestException.class);
    }
    @Test void cannotCreateConversationWithSameRole() {
        User other = User.builder().id(3L).role(UserRole.applicant).build();
        when(users.findById(3L)).thenReturn(Optional.of(other));
        assertThatThrownBy(() -> service.createOrFindConversation(applicant.getEmail(), new CreateConversationRequest(3L, null))).isInstanceOf(ForbiddenActionException.class);
    }
    @Test void supportCanStartConversationWithProvider() {
        User admin = User.builder().id(3L).email("support@test.co.za").role(UserRole.admin).build();
        when(users.findByEmail(admin.getEmail())).thenReturn(Optional.of(admin));
        when(users.findById(3L)).thenReturn(Optional.of(admin));
        when(conversations.findByApplicant_IdAndProvider_IdAndOpportunityIsNull(3L, 2L)).thenReturn(Optional.empty());
        when(conversations.save(any())).thenAnswer(call -> { Conversation c = call.getArgument(0); c.setId(20L); return c; });
        assertThat(service.createOrFindConversation(admin.getEmail(), new CreateConversationRequest(2L, null)).recipientId()).isEqualTo(2L);
    }
}
