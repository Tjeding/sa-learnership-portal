package com.tjeding.portal.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Reads "Authorization: Bearer <accessToken>", validates it, and if
 * valid populates the SecurityContext with an authenticated principal
 * (the user's email) and a single ROLE_* authority taken from the
 * token's "role" claim.
 *
 * Deliberately stateless: it never hits the database. Trusting the
 * signed token's role claim is fine for authorization checks; if a
 * user's role can change while tokens are still live, shorten
 * app.jwt.expiration-ms rather than adding a DB lookup here.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7).trim();

            if (jwtTokenProvider.isTokenValid(token)) {
                try {
                    String email = jwtTokenProvider.extractSubject(token);
                    String role = jwtTokenProvider.extractRole(token);

                    List<GrantedAuthority> authorities = (role != null)
                            ? List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                            : List.of();

                    var authentication = new UsernamePasswordAuthenticationToken(email, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } catch (Exception ex) {
                    // Malformed token content past signature/expiry checks: fail closed.
                    SecurityContextHolder.clearContext();
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
