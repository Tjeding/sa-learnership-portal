package com.tjeding.portal.user;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifies the shared-primary-key mapping between ApplicantProfile and User against
 * the real PostgreSQL schema (Flyway migrations in db/migration). We use
 * Testcontainers instead of embedded H2 because several entities rely on
 * PostgreSQL-native enum columns (@JdbcTypeCode(NAMED_ENUM)) which H2 cannot
 * map, causing a ClassCastException on insert under H2.
 */
@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@TestPropertySource(properties = {
        "spring.flyway.locations=classpath:db/migration",
        "spring.jpa.hibernate.ddl-auto=none"
})
class ApplicantProfilePersistenceTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApplicantProfileRepository applicantProfileRepository;

    @Test
    void shouldPersistApplicantProfileWithSharedPrimaryKey() {
        User user = User.builder()
                .email("persist-test@example.com")
                .passwordHash("hash")
                .role(UserRole.applicant)
                .active(true)
                .verified(false)
                .build();

        user = userRepository.saveAndFlush(user);

        ApplicantProfile profile = ApplicantProfile.builder()
                .user(user)
                .firstName("Test")
                .lastName("User")
                .build();

        applicantProfileRepository.saveAndFlush(profile);

        ApplicantProfile loaded = entityManager.find(ApplicantProfile.class, user.getId());

        assertThat(loaded).isNotNull();
        assertThat(loaded.getUserId()).isEqualTo(user.getId());
        assertThat(loaded.getUser()).isNotNull();
        assertThat(loaded.getUser().getId()).isEqualTo(user.getId());
    }
}
