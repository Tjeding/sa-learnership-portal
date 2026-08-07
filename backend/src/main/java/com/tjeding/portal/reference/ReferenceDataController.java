package com.tjeding.portal.reference;

import com.tjeding.portal.common.ApiResponse;
import com.tjeding.portal.reference.dto.SectorResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Public, read-only reference data (seeded in V8). No auth required -
 * these populate dropdowns before/regardless of login, same spirit as
 * the NQF-aligned qualification dropdown requirement.
 */
@RestController
@RequestMapping("/api/v1/reference")
@Tag(name = "Reference Data", description = "Public reference/lookup data")
public class ReferenceDataController {

    private final SectorRepository sectorRepository;

    public ReferenceDataController(SectorRepository sectorRepository) {
        this.sectorRepository = sectorRepository;
    }

    @GetMapping("/sectors")
    public ApiResponse<List<SectorResponse>> listSectors() {
        List<SectorResponse> sectors = sectorRepository.findAll().stream()
                .map(s -> new SectorResponse(s.getId(), s.getName()))
                .toList();
        return ApiResponse.success(sectors);
    }
}
