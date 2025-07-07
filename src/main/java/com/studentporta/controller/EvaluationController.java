package com.studentporta.controller;

import com.studentporta.dto.EvaluationDTO;
import com.studentporta.service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
@CrossOrigin(origins = "*")
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<EvaluationDTO> createEvaluation(@Valid @RequestBody EvaluationDTO dto) {
        try {
            EvaluationDTO created = evaluationService.createEvaluation(dto);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<EvaluationDTO> updateEvaluation(@PathVariable Long id, 
                                                        @Valid @RequestBody EvaluationDTO dto) {
        try {
            EvaluationDTO updated = evaluationService.updateEvaluation(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<EvaluationDTO> getEvaluationById(@PathVariable Long id) {
        try {
            EvaluationDTO dto = evaluationService.getEvaluationById(id);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<List<EvaluationDTO>> getEvaluationsByProjectId(@PathVariable Long projectId) {
        try {
            System.out.println("=== EVALUATION REQUEST DEBUG ===");
            System.out.println("Fetching evaluations for project: " + projectId);
            System.out.println("Current authentication: " + org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication());
            System.out.println("User authorities: " + org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getAuthorities());
            System.out.println("Is authenticated: " + org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().isAuthenticated());
            List<EvaluationDTO> evaluations = evaluationService.getEvaluationsByProjectId(projectId);
            System.out.println("Found " + evaluations.size() + " evaluations for project: " + projectId);
            System.out.println("=== END DEBUG ===");
            return ResponseEntity.ok(evaluations);
        } catch (Exception e) {
            System.err.println("Error fetching evaluations for project " + projectId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/project/{projectId}/latest")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<EvaluationDTO> getLatestEvaluationByProjectId(@PathVariable Long projectId) {
        try {
            EvaluationDTO dto = evaluationService.getLatestEvaluationByProjectId(projectId);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/project/{projectId}/average-score")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<Double> getAverageScoreByProjectId(@PathVariable Long projectId) {
        try {
            Double average = evaluationService.getAverageScoreByProjectId(projectId);
            return ResponseEntity.ok(average);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/project/{projectId}/exists")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<Boolean> hasEvaluationForProject(@PathVariable Long projectId) {
        try {
            Boolean exists = evaluationService.hasEvaluationForProject(projectId);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/test-auth")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<String> testAuthentication() {
        try {
            var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            return ResponseEntity.ok("Authentication working! User: " + auth.getName() + ", Authorities: " + auth.getAuthorities());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<Void> deleteEvaluation(@PathVariable Long id) {
        try {
            evaluationService.deleteEvaluation(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
} 