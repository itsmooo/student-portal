package com.studentporta.controller;

import com.studentporta.dto.UserDTO;
import com.studentporta.dto.ProjectDTO;
import com.studentporta.entity.Role;
import com.studentporta.service.UserService;
import com.studentporta.service.ProjectService;
import com.studentporta.service.ProgressUpdateService;
import com.studentporta.service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ProgressUpdateService progressUpdateService;

    @Autowired
    private EvaluationService evaluationService;

    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/students")
    public ResponseEntity<List<UserDTO>> getAllStudents() {
        List<UserDTO> students = userService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/users/faculty")
    public ResponseEntity<List<UserDTO>> getAllFaculty() {
        List<UserDTO> faculty = userService.getAllFaculty();
        return ResponseEntity.ok(faculty);
    }

    @PostMapping("/users/faculty")
    public ResponseEntity<UserDTO> createFaculty(@RequestBody CreateFacultyRequest request) {
        try {
            // Create faculty user logic
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/users/{userId}/assign-faculty/{facultyId}")
    public ResponseEntity<UserDTO> assignFacultyToStudent(@PathVariable Long userId, @PathVariable Long facultyId) {
        try {
            UserDTO updatedUser = userService.assignFacultyToStudent(userId, facultyId);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Project Management
    @GetMapping("/projects")
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        List<ProjectDTO> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/projects/pending")
    public ResponseEntity<List<ProjectDTO>> getPendingProjects() {
        List<ProjectDTO> projects = projectService.getProjectsByStatus(com.studentporta.entity.ProjectStatus.PENDING);
        return ResponseEntity.ok(projects);
    }

    @PutMapping("/projects/{projectId}/approve")
    public ResponseEntity<ProjectDTO> approveProject(@PathVariable Long projectId) {
        try {
            ProjectDTO approvedProject = projectService.updateProjectStatus(projectId, com.studentporta.entity.ProjectStatus.APPROVED);
            return ResponseEntity.ok(approvedProject);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/projects/{projectId}/reject")
    public ResponseEntity<ProjectDTO> rejectProject(@PathVariable Long projectId) {
        try {
            ProjectDTO rejectedProject = projectService.updateProjectStatus(projectId, com.studentporta.entity.ProjectStatus.REJECTED);
            return ResponseEntity.ok(rejectedProject);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Progress Monitoring
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // Get various statistics
            List<UserDTO> students = userService.getAllStudents();
            List<UserDTO> faculty = userService.getAllFaculty();
            List<ProjectDTO> allProjects = projectService.getAllProjects();
            List<ProjectDTO> pendingProjects = projectService.getProjectsByStatus(com.studentporta.entity.ProjectStatus.PENDING);
            List<ProjectDTO> completedProjects = projectService.getProjectsByStatus(com.studentporta.entity.ProjectStatus.COMPLETED);

            stats.put("totalStudents", students.size());
            stats.put("totalFaculty", faculty.size());
            stats.put("totalProjects", allProjects.size());
            stats.put("pendingProjects", pendingProjects.size());
            stats.put("completedProjects", completedProjects.size());
            stats.put("completionRate", allProjects.isEmpty() ? 0 : (double) completedProjects.size() / allProjects.size() * 100);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/projects/{projectId}/progress")
    public ResponseEntity<Map<String, Object>> getProjectProgress(@PathVariable Long projectId) {
        Map<String, Object> progress = new HashMap<>();
        
        try {
            Long updateCount = progressUpdateService.getProgressUpdateCountByProjectId(projectId);
            Double averageScore = evaluationService.getAverageScoreByProjectId(projectId);
            
            progress.put("updateCount", updateCount);
            progress.put("averageScore", averageScore);
            
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Deadline Management
    @PutMapping("/projects/{projectId}/deadline")
    public ResponseEntity<ProjectDTO> setProjectDeadline(@PathVariable Long projectId, @RequestBody DeadlineRequest request) {
        try {
            ProjectDTO projectDTO = new ProjectDTO();
            projectDTO.setEndDate(request.getDeadline());
            ProjectDTO updatedProject = projectService.updateProject(projectId, projectDTO);
            return ResponseEntity.ok(updatedProject);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Inner classes for request/response objects
    public static class CreateFacultyRequest {
        private String username;
        private String email;
        private String password;
        private String firstName;
        private String lastName;
        private String faculty;

        // Getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }

        public String getFaculty() { return faculty; }
        public void setFaculty(String faculty) { this.faculty = faculty; }
    }

    public static class DeadlineRequest {
        private java.time.LocalDate deadline;

        public java.time.LocalDate getDeadline() { return deadline; }
        public void setDeadline(java.time.LocalDate deadline) { this.deadline = deadline; }
    }
} 