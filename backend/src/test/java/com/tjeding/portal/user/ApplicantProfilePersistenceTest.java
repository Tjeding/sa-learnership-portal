package com.tjeding.portal.user;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest(properties = {
        "spring.flyway.locations=classpath:db/migration-h2-test",
        "spring.jpa.hibernate.ddl-auto=none"
})
@ActiveProfiles("test")
class ApplicantProfilePersistenceTest {

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
