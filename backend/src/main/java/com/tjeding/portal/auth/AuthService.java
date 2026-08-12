package com.tjeding.portal.auth;

import com.tjeding.portal.auth.dto.*;
import com.tjeding.portal.common.exception.BadRequestException;
import com.tjeding.portal.common.exception.ForbiddenActionException;
import com.tjeding.portal.common.exception.ResourceNotFoundException;
import com.tjeding.portal.config.JwtProperties;
import com.tjeding.portal.security.JwtTokenProvider;
import com.tjeding.portal.user.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final ApplicantProfileRepository applicantProfileRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtProperties jwtProperties;

    public AuthService(UserRepository userRepository,
                        ApplicantProfileRepository applicantProfileRepository,
                        ProviderProfileRepository providerProfileRepository,
                        RefreshTokenRepository refreshTokenRepository,
                        PasswordEncoder passwordEncoder,
                        JwtTokenProvider jwtTokenProvider,
                        JwtProperties jwtProperties) {
        this.userRepository = userRepository;
        this.applicantProfileRepository = applicantProfileRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.jwtProperties = jwtProperties;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (req.role() == UserRole.admin) {
            throw new BadRequestException("Admin accounts cannot be self-registered.");
        }
        if (userRepository.existsByEmail(req.email())) {
            throw new BadRequestException("An account with this email already exists.");
        }

        String displayName;

        User user = User.builder()
                .email(req.email())
                .passwordHash(passwordEncoder.encode(req.password()))
                .role(req.role())
                .active(true)
                .verified(false)
                .verificationToken(UUID.randomUUID().toString())
                .verificationExpiresAt(Instant.now().plusSeconds(24 * 3600))
                .build();
        user = userRepository.save(user);

        if (req.role() == UserRole.applicant) {
            if (isBlank(req.firstName()) || isBlank(req.lastName())) {
                throw new BadRequestException("firstName and lastName are required for applicant accounts.");
            }
            ApplicantProfile profile = ApplicantProfile.builder()
                    .firstName(req.firstName().trim())
                    .lastName(req.lastName().trim())
                    .profileCompleted(false)
                    .build();
            profile.setUser(user);
            applicantProfileRepository.save(profile);
            displayName = profile.getFirstName() + " " + profile.getLastName();
        } else {
            if (isBlank(req.organizationName()) || req.providerType() == null) {
                throw new BadRequestException("organizationName and providerType are required for provider accounts.");
            }
            ProviderProfile profile = ProviderProfile.builder()
                    .organizationName(req.organizationName().trim())
                    .providerType(req.providerType())
                    .contactPerson(isBlank(req.contactPerson()) ? null : req.contactPerson().trim())
                    .phone(isBlank(req.phone()) ? null : req.phone().trim())
                    .verified(false)
                    .build();
            profile.setUser(user);
            providerProfileRepository.save(profile);
            displayName = profile.getOrganizationName();
        }

        // Email verification is optional/stubbed for now: log it instead of sending mail.
        // Phase: wire this to a real mail provider (JavaMail/SES/SendGrid) later.
        log.info("Email verification token for {} (not emailed yet): {}", user.getEmail(), user.getVerificationToken());

        return issueTokens(user, displayName);
    }

    @Transactional
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }
        if (!user.isActive()) {
            throw new ForbiddenActionException("This account has been deactivated.");
        }

        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        return issueTokens(user, resolveDisplayName(user));
    }

    @Transactional
    public AuthResponse refresh(RefreshTokenRequest req) {
        String rawToken = req.refreshToken();

        if (!jwtTokenProvider.isTokenValid(rawToken)) {
            throw new BadRequestException("Refresh token is invalid or expired.");
        }

        String tokenHash = hash(rawToken);
        RefreshToken stored = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new BadRequestException("Refresh token is invalid or expired."));

        if (!stored.isActive()) {
            throw new BadRequestException("Refresh token is invalid or expired.");
        }

        User user = userRepository.findById(stored.getUserId())
                .orElseThrow(() -> ResourceNotFoundException.of("user", stored.getUserId()));

        // Rotate: revoke the used refresh token and issue a brand new pair.
        stored.setRevokedAt(Instant.now());
        refreshTokenRepository.save(stored);

        return issueTokens(user, resolveDisplayName(user));
    }

    @Transactional
    public void logout(RefreshTokenRequest req) {
        try {
            String tokenHash = hash(req.refreshToken());
            refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(stored -> {
                if (stored.getRevokedAt() == null) {
                    stored.setRevokedAt(Instant.now());
                    refreshTokenRepository.save(stored);
                }
            });
        } catch (Exception ex) {
            // Logout is idempotent by design: an already-invalid/unknown token is not an error.
            log.debug("Logout called with an unrecognised refresh token: {}", ex.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public UserMeResponse me(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new UserMeResponse(user.getId(), user.getEmail(), user.getRole(),
                user.isVerified(), resolveDisplayName(user));
    }

    // ---- helpers ----

    private AuthResponse issueTokens(User user, String displayName) {
        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        RefreshToken record = RefreshToken.builder()
                .userId(user.getId())
                .tokenHash(hash(refreshToken))
                .expiresAt(Instant.now().plusMillis(jwtProperties.refreshExpirationMs()))
                .build();
        refreshTokenRepository.save(record);

        UserMeResponse userResponse = new UserMeResponse(
                user.getId(), user.getEmail(), user.getRole(), user.isVerified(), displayName);

        long expiresInSeconds = jwtProperties.expirationMs() / 1000;
        return AuthResponse.of(accessToken, refreshToken, expiresInSeconds, userResponse);
    }

    private String resolveDisplayName(User user) {
        if (user.getRole() == UserRole.applicant) {
            return applicantProfileRepository.findById(user.getId())
                    .map(p -> p.getFirstName() + " " + p.getLastName())
                    .orElse(user.getEmail());
        }
        if (user.getRole() == UserRole.provider) {
            return providerProfileRepository.findById(user.getId())
                    .map(ProviderProfile::getOrganizationName)
                    .orElse(user.getEmail());
        }
        return user.getEmail();
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    private static String hash(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(bytes);
        } catch (NoSuchAlgorithmException e) {
            // SHA-256 is always available on the JVM; this is unreachable in practice.
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
