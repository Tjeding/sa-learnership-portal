package com.tjeding.portal.storage;

import com.tjeding.portal.common.exception.BadRequestException;
import com.tjeding.portal.config.StorageProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * Stores uploaded files on local disk under app.storage.upload-dir,
 * namespaced by subdirectory (e.g. "cvs", "profile-images") and a
 * random filename so originals never collide or leak the uploader's
 * chosen name. Swap this class for an S3/GCS-backed implementation
 * later; callers only depend on store()/StoredFile.
 */
@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_CV_TYPES = Set.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp"
    );

    private final StorageProperties storageProperties;

    public FileStorageService(StorageProperties storageProperties) {
        this.storageProperties = storageProperties;
    }

    public StoredFile storeCv(MultipartFile file) {
        return store(file, "cvs", ALLOWED_CV_TYPES, storageProperties.maxCvSizeBytes(),
                List.of(".pdf", ".doc", ".docx"));
    }

    public StoredFile storeProfileImage(MultipartFile file) {
        return store(file, "profile-images", ALLOWED_IMAGE_TYPES, storageProperties.maxImageSizeBytes(),
                List.of(".jpg", ".jpeg", ".png", ".webp"));
    }

    private StoredFile store(MultipartFile file, String subdir, Set<String> allowedTypes,
                              long maxSizeBytes, List<String> allowedExtensions) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("No file was provided.");
        }
        if (file.getSize() > maxSizeBytes) {
            throw new BadRequestException("File exceeds the maximum allowed size of "
                    + (maxSizeBytes / (1024 * 1024)) + "MB.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw new BadRequestException("Unsupported file type. Allowed: " + allowedExtensions);
        }

        String extension = allowedExtensions.stream()
                .filter(ext -> originalNameHasExtension(file.getOriginalFilename(), ext))
                .findFirst()
                .orElse(defaultExtensionFor(contentType));

        String storedName = UUID.randomUUID() + extension;

        try {
            Path targetDir = Path.of(storageProperties.uploadDir(), subdir);
            Files.createDirectories(targetDir);

            Path targetPath = targetDir.resolve(storedName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String relativePath = subdir + "/" + storedName;
            return new StoredFile(relativePath, file.getOriginalFilename(), file.getSize());
        } catch (IOException e) {
            throw new BadRequestException("Failed to store the uploaded file. Please try again.");
        }
    }

    private boolean originalNameHasExtension(String originalName, String ext) {
        return originalName != null && originalName.toLowerCase().endsWith(ext);
    }

    private String defaultExtensionFor(String contentType) {
        return switch (contentType) {
            case "application/pdf" -> ".pdf";
            case "application/msword" -> ".doc";
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document" -> ".docx";
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> "";
        };
    }

    public record StoredFile(String relativePath, String originalFilename, long sizeBytes) {
    }
}
