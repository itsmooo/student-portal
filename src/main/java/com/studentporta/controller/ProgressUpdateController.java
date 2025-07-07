package com.studentporta.controller;

import com.studentporta.dto.ProgressUpdateDTO;
import com.studentporta.service.ProgressUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/progress-updates")
@CrossOrigin(origins = "*")
public class ProgressUpdateController {

    @Autowired
    private ProgressUpdateService progressUpdateService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ProgressUpdateDTO> createProgressUpdate(@Valid @RequestBody ProgressUpdateDTO dto) {
        try {
            ProgressUpdateDTO created = progressUpdateService.createProgressUpdate(dto);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ProgressUpdateDTO> updateProgressUpdate(@PathVariable Long id, 
                                                               @Valid @RequestBody ProgressUpdateDTO dto) {
        try {
            ProgressUpdateDTO updated = progressUpdateService.updateProgressUpdate(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<ProgressUpdateDTO> getProgressUpdateById(@PathVariable Long id) {
        try {
            ProgressUpdateDTO dto = progressUpdateService.getProgressUpdateById(id);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<List<ProgressUpdateDTO>> getProgressUpdatesByProjectId(@PathVariable Long projectId) {
        try {
            List<ProgressUpdateDTO> updates = progressUpdateService.getProgressUpdatesByProjectId(projectId);
            return ResponseEntity.ok(updates);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/project/{projectId}/week/{weekNumber}")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<ProgressUpdateDTO> getProgressUpdateByProjectAndWeek(@PathVariable Long projectId, 
                                                                             @PathVariable Integer weekNumber) {
        try {
            ProgressUpdateDTO dto = progressUpdateService.getProgressUpdateByProjectAndWeek(projectId, weekNumber);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/project/{projectId}/count")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<Long> getProgressUpdateCountByProjectId(@PathVariable Long projectId) {
        try {
            Long count = progressUpdateService.getProgressUpdateCountByProjectId(projectId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> deleteProgressUpdate(@PathVariable Long id) {
        try {
            progressUpdateService.deleteProgressUpdate(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
} 