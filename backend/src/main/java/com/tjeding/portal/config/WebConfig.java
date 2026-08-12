package com.tjeding.portal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

/**
 * Maps /uploads/** to the local storage directory so a stored file's
 * relative path (e.g. "cvs/<uuid>.pdf") is reachable as
 * "/uploads/cvs/<uuid>.pdf".
 *
 * NOTE: this serves files publicly to anyone with the URL - fine for
 * profile images, but a CV is more sensitive. Revisit with
 * signed/expiring URLs or an authenticated download endpoint once the
 * applicant-visibility rules for providers/admins are defined.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final StorageProperties storageProperties;

    public WebConfig(StorageProperties storageProperties) {
        this.storageProperties = storageProperties;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = Path.of(storageProperties.uploadDir()).toUri().toString();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}
