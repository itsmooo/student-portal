package com.studentporta.controller;

import com.studentporta.dto.UserDTO;
import com.studentporta.entity.Role;
import com.studentporta.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'SUPERVISOR')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'SUPERVISOR')")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'SUPERVISOR')")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getUsersByRole(@PathVariable Role role) {
        List<UserDTO> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/faculty")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'SUPERVISOR')")
    public ResponseEntity<List<UserDTO>> getAllFaculty() {
        List<UserDTO> faculty = userService.getAllFaculty();
        return ResponseEntity.ok(faculty);
    }

    @GetMapping("/students")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'SUPERVISOR')")
    public ResponseEntity<List<UserDTO>> getAllStudents() {
        List<UserDTO> students = userService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/supervisor/{supervisorId}/students")
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'ADMIN')")
    public ResponseEntity<List<UserDTO>> getStudentsBySupervisor(@PathVariable Long supervisorId) {
        List<UserDTO> students = userService.getStudentsBySupervisor(supervisorId);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/my-students")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<List<UserDTO>> getMyStudents(@RequestHeader("Authorization") String authHeader) {
        // This would need JWT implementation to get current user ID
        // For now, we'll return all students assigned to supervisors
        List<UserDTO> students = userService.getAllStudents().stream()
                .filter(student -> student.getSupervisorName() != null)
                .collect(Collectors.toList());
        return ResponseEntity.ok(students);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract token from Authorization header
            String token = authHeader.replace("Bearer ", "");
            
            // For now, we'll return a mock user since we don't have JWT implementation
            // In a real application, you would decode the JWT token and get user info
            UserDTO mockUser = new UserDTO();
            mockUser.setId(1L);
            mockUser.setUsername("testuser");
            mockUser.setEmail("test@example.com");
            mockUser.setFirstName("Test");
            mockUser.setLastName("User");
            mockUser.setRole(Role.STUDENT);
            
            return ResponseEntity.ok(mockUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'SUPERVISOR', 'ADMIN')")
    public ResponseEntity<?> updateProfile(@RequestBody UserDTO userDTO) {
        try {
            // In a real application, you would update the user profile
            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UserDTO userDTO) {
        try {
            UserDTO updatedUser = userService.updateUser(id, userDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{studentId}/assign-supervisor/{supervisorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> assignStudentToSupervisor(@PathVariable Long studentId, @PathVariable Long supervisorId) {
        try {
            UserDTO updatedStudent = userService.assignFacultyToStudent(studentId, supervisorId);
            return ResponseEntity.ok(updatedStudent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{studentId}/remove-supervisor")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<UserDTO> removeStudentFromSupervisor(@PathVariable Long studentId) {
        try {
            UserDTO updatedStudent = userService.removeSupervisorFromStudent(studentId);
            return ResponseEntity.ok(updatedStudent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/supervisor/{supervisorId}/remove-student/{studentId}")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<UserDTO> supervisorRemoveStudent(@PathVariable Long supervisorId, @PathVariable Long studentId) {
        try {
            // Check if the supervisor can remove this student
            if (!userService.canSupervisorRemoveStudent(supervisorId, studentId)) {
                return ResponseEntity.status(403).build();
            }
            
            UserDTO updatedStudent = userService.removeSupervisorFromStudent(studentId);
            return ResponseEntity.ok(updatedStudent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/debug/assignments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> debugAssignments() {
        try {
            List<UserDTO> allUsers = userService.getAllUsers();
            List<UserDTO> students = allUsers.stream().filter(u -> u.getRole() == Role.STUDENT).collect(Collectors.toList());
            List<UserDTO> supervisors = allUsers.stream().filter(u -> u.getRole() == Role.SUPERVISOR).collect(Collectors.toList());
            
            StringBuilder result = new StringBuilder();
            result.append("Total users: ").append(allUsers.size()).append("\n");
            result.append("Students: ").append(students.size()).append("\n");
            result.append("Supervisors: ").append(supervisors.size()).append("\n\n");
            
            result.append("Student assignments:\n");
            for (UserDTO student : students) {
                result.append("- ").append(student.getFirstName()).append(" ").append(student.getLastName())
                      .append(" -> Supervisor: ").append(student.getSupervisorName() != null ? student.getSupervisorName() : "None")
                      .append("\n");
            }
            
            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
