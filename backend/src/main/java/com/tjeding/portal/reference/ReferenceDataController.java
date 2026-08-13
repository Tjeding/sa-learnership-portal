package com.tjeding.portal.reference;

import com.tjeding.portal.common.ApiResponse;
import com.tjeding.portal.reference.dto.NqfLevelResponse;
import com.tjeding.portal.reference.dto.QualificationTypeResponse;
import com.tjeding.portal.reference.dto.SectorResponse;
import com.tjeding.portal.reference.dto.SkillResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
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
    private final NqfLevelRepository nqfLevelRepository;
    private final QualificationTypeRepository qualificationTypeRepository;
    private final SkillRepository skillRepository;

    public ReferenceDataController(SectorRepository sectorRepository,
                                    NqfLevelRepository nqfLevelRepository,
                                    QualificationTypeRepository qualificationTypeRepository,
                                    SkillRepository skillRepository) {
        this.sectorRepository = sectorRepository;
        this.nqfLevelRepository = nqfLevelRepository;
        this.qualificationTypeRepository = qualificationTypeRepository;
        this.skillRepository = skillRepository;
    }

    @GetMapping("/sectors")
    public ApiResponse<List<SectorResponse>> listSectors() {
        List<SectorResponse> sectors = sectorRepository.findAll().stream()
                .map(s -> new SectorResponse(s.getId(), s.getName()))
                .toList();
        return ApiResponse.success(sectors);
    }

    @GetMapping("/nqf-levels")
    public ApiResponse<List<NqfLevelResponse>> listNqfLevels() {
        List<NqfLevelResponse> levels = nqfLevelRepository.findAll().stream()
                .sorted(Comparator.comparing(NqfLevel::getId))
                .map(n -> new NqfLevelResponse(n.getId(), n.getLevelName(), n.getSubFramework(), n.getTypicalExample()))
                .toList();
        return ApiResponse.success(levels);
    }

    @GetMapping("/qualifications")
    public ApiResponse<List<QualificationTypeResponse>> listQualifications() {
        List<QualificationTypeResponse> qualifications = qualificationTypeRepository.findByIsActiveTrueOrderByTitleAsc().stream()
                .map(q -> new QualificationTypeResponse(
                        q.getId(),
                        q.getTitle(),
                        q.getNqfLevel().getId(),
                        q.getNqfLevel().getLevelName(),
                        q.getQualificationCategory()))
                .toList();
        return ApiResponse.success(qualifications);
    }

    @GetMapping("/skills")
    public ApiResponse<List<SkillResponse>> listSkills() {
        List<SkillResponse> skills = skillRepository.findAll().stream()
                .sorted(Comparator.comparing(Skill::getName))
                .map(s -> new SkillResponse(s.getId(), s.getName(), s.getCategory()))
                .toList();
        return ApiResponse.success(skills);
    }
}