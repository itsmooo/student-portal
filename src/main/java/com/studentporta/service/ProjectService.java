package com.studentporta.service;

import com.studentporta.dto.ProjectDTO;
import com.studentporta.entity.Project;
import com.studentporta.entity.ProjectStatus;
import com.studentporta.entity.User;
import com.studentporta.respository.ProjectRepository;
import com.studentporta.respository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<ProjectDTO> getProjectById(Long id) {
        return projectRepository.findById(id)
                .map(this::convertToDTO);
    }

    public List<ProjectDTO> getProjectsByStudentId(Long studentId) {
        return projectRepository.findByStudentId(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProjectDTO> getProjectsByFacultyId(Long facultyId) {
        return projectRepository.findByFacultyId(facultyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProjectDTO> getProjectsByStatus(ProjectStatus status) {
        return projectRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    public ProjectDTO createProject(ProjectDTO projectDTO) {
        User student = userRepository.findById(projectDTO.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        User faculty = null;
        if (projectDTO.getFacultyId() != null) {
            faculty = userRepository.findById(projectDTO.getFacultyId())
                    .orElseThrow(() -> new RuntimeException("Faculty not found"));
        }
        
        Project project = new Project();
        project.setTitle(projectDTO.getTitle());
        project.setDescription(projectDTO.getDescription());
        project.setStudent(student);
        project.setFaculty(faculty);
        project.setStatus(ProjectStatus.PENDING);
        
        Project savedProject = projectRepository.save(project);
        return convertToDTO(savedProject);
    }

    public ProjectDTO updateProject(Long id, ProjectDTO projectDTO) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        project.setTitle(projectDTO.getTitle());
        project.setDescription(projectDTO.getDescription());
        project.setStatus(projectDTO.getStatus());
        
        Project updatedProject = projectRepository.save(project);
        return convertToDTO(updatedProject);
    }

    public ProjectDTO updateProjectStatus(Long id, ProjectStatus status) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setStatus(status);
        Project updatedProject = projectRepository.save(project);
        return convertToDTO(updatedProject);
    }

    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Project not found");
        }
        projectRepository.deleteById(id);
    }

    private ProjectDTO convertToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setStatus(project.getStatus());
        dto.setStudentId(project.getStudent().getId());
        dto.setStudentName(project.getStudent().getFirstName() + " " + project.getStudent().getLastName());
        if (project.getFaculty() != null) {
            dto.setFacultyId(project.getFaculty().getId());
            dto.setSupervisorName(project.getFaculty().getFirstName() + " " + project.getFaculty().getLastName());
        } else {
            dto.setFacultyId(null);
            dto.setSupervisorName(null);
        }
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());
        return dto;
    }
}
