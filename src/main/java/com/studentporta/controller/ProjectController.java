package com.studentporta.controller;

import com.studentporta.dto.ProjectDTO;
import com.studentporta.entity.ProjectStatus;
import com.studentporta.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;

    @GetMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        List<ProjectDTO> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<List<ProjectDTO>> getProjectsByStudentId(@PathVariable Long studentId) {
        List<ProjectDTO> projects = projectService.getProjectsByStudentId(studentId);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/faculty/{facultyId}")
    @PreAuthorize("hasAnyRole('FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<List<ProjectDTO>> getProjectsByFacultyId(@PathVariable Long facultyId) {
        List<ProjectDTO> projects = projectService.getProjectsByFacultyId(facultyId);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<List<ProjectDTO>> getProjectsByStatus(@PathVariable ProjectStatus status) {
        List<ProjectDTO> projects = projectService.getProjectsByStatus(status);
        return ResponseEntity.ok(projects);
    }

    // Student endpoints
    @PostMapping("/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ProjectDTO> submitProject(@Valid @RequestBody ProjectDTO projectDTO) {
        ProjectDTO createdProject = projectService.createProject(projectDTO);
        return ResponseEntity.ok(createdProject);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ProjectDTO>> getMyProjects(@RequestParam Long studentId) {
        List<ProjectDTO> projects = projectService.getProjectsByStudentId(studentId);
        return ResponseEntity.ok(projects);
    }

    // Faculty/Admin endpoints
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectDTO projectDTO) {
        try {
            ProjectDTO updatedProject = projectService.updateProject(id, projectDTO);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<ProjectDTO> updateProjectStatus(@PathVariable Long id, @RequestBody ProjectStatus status) {
        try {
            ProjectDTO updatedProject = projectService.updateProjectStatus(id, status);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<ProjectDTO> approveProject(@PathVariable Long id) {
        try {
            ProjectDTO updatedProject = projectService.updateProjectStatus(id, ProjectStatus.APPROVED);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<ProjectDTO> rejectProject(@PathVariable Long id) {
        try {
            ProjectDTO updatedProject = projectService.updateProjectStatus(id, ProjectStatus.REJECTED);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<ProjectDTO> completeProject(@PathVariable Long id) {
        try {
            ProjectDTO updatedProject = projectService.updateProjectStatus(id, ProjectStatus.COMPLETED);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/assign-to-supervisors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> assignProjectsToSupervisors() {
        try {
            projectService.assignProjectsToSupervisors();
            return ResponseEntity.ok("Projects assigned to supervisors successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Failed to assign projects: " + e.getMessage());
        }
    }

    @GetMapping("/supervisor/{supervisorId}/students")
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'ADMIN')")
    public ResponseEntity<List<ProjectDTO>> getProjectsBySupervisorStudents(@PathVariable Long supervisorId) {
        List<ProjectDTO> projects = projectService.getProjectsBySupervisorStudents(supervisorId);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/my-students")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<List<ProjectDTO>> getMyStudentsProjects(@RequestHeader("Authorization") String authHeader) {
        // This would need JWT implementation to get current user ID
        // For now, we'll return projects from students assigned to supervisors
        List<ProjectDTO> projects = projectService.getProjectsBySupervisorStudents(1L); // Mock supervisor ID
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/debug/supervisor/{supervisorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> debugSupervisorProjects(@PathVariable Long supervisorId) {
        try {
            List<ProjectDTO> projects = projectService.getProjectsBySupervisorStudents(supervisorId);
            return ResponseEntity.ok("Supervisor " + supervisorId + " has " + projects.size() + " projects from assigned students");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
