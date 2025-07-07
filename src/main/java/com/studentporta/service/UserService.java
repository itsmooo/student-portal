package com.studentporta.service;

import com.studentporta.dto.UserDTO;
import com.studentporta.entity.Role;
import com.studentporta.entity.User;
import com.studentporta.respository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())))
                .build();
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<UserDTO> getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDTO);
    }

    public Optional<UserDTO> getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(this::convertToDTO);
    }
    
    public Optional<User> getUserEntityByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<UserDTO> getUsersByRole(Role role) {
        return userRepository.findByRole(role).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getAllFaculty() {
        return getUsersByRole(Role.SUPERVISOR);
    }

    public List<UserDTO> getAllStudents() {
        return getUsersByRole(Role.STUDENT);
    }

    public UserDTO createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setRole(userDTO.getRole());
        user.setFaculty(userDTO.getFaculty());
        user.setSupervisorName(userDTO.getSupervisorName());

        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public Optional<User> getUserEntityById(Long id) {
        return userRepository.findById(id);
    }

    public UserDTO assignFacultyToStudent(Long studentId, Long facultyId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        User faculty = userRepository.findById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found with id: " + facultyId));
        
        if (faculty.getRole() != Role.SUPERVISOR) {
            throw new RuntimeException("User with id " + facultyId + " is not a faculty member");
        }
        
        student.setSupervisor(faculty);
        student.setSupervisorName(faculty.getFirstName() + " " + faculty.getLastName());
        User updatedStudent = userRepository.save(student);
        return convertToDTO(updatedStudent);
    }

    public List<UserDTO> getStudentsBySupervisor(Long supervisorId) {
        return userRepository.findBySupervisorId(supervisorId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO removeSupervisorFromStudent(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        // Check if the student has a supervisor
        if (student.getSupervisor() == null) {
            throw new RuntimeException("Student is not assigned to any supervisor");
        }
        
        student.setSupervisor(null);
        student.setSupervisorName(null);
        User updatedStudent = userRepository.save(student);
        return convertToDTO(updatedStudent);
    }

    public boolean canSupervisorRemoveStudent(Long supervisorId, Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        return student.getSupervisor() != null && student.getSupervisor().getId().equals(supervisorId);
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRole(user.getRole());
        dto.setFaculty(user.getFaculty());
        
        // Set supervisorName from the supervisor relationship if available
        if (user.getSupervisor() != null) {
            dto.setSupervisorName(user.getSupervisor().getFirstName() + " " + user.getSupervisor().getLastName());
        } else {
            dto.setSupervisorName(user.getSupervisorName());
        }
        
        return dto;
    }
}
