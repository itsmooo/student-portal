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

    public List<ProjectDTO> getProjectsBySupervisorStudents(Long supervisorId) {
        // Get all students assigned to this supervisor
        List<User> assignedStudents = userRepository.findBySupervisorId(supervisorId);
        System.out.println("Supervisor ID: " + supervisorId);
        System.out.println("Assigned students count: " + assignedStudents.size());
        
        // Get all projects from these students
        List<ProjectDTO> projects = assignedStudents.stream()
                .flatMap(student -> {
                    List<Project> studentProjects = projectRepository.findByStudentId(student.getId());
                    System.out.println("Student " + student.getFirstName() + " " + student.getLastName() + " has " + studentProjects.size() + " projects");
                    return studentProjects.stream();
                })
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        System.out.println("Total projects found: " + projects.size());
        return projects;
    }

    public ProjectDTO createProject(ProjectDTO projectDTO) {
        User student = userRepository.findById(projectDTO.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        User faculty = null;
        if (projectDTO.getFacultyId() != null) {
            faculty = userRepository.findById(projectDTO.getFacultyId())
                    .orElseThrow(() -> new RuntimeException("Faculty not found"));
        } else {
            // Automatically assign to student's supervisor if no faculty is specified
            if (student.getSupervisor() != null) {
                faculty = student.getSupervisor();
            }
        }
        
        Project project = new Project();
        project.setTitle(projectDTO.getTitle());
        project.setObjective(projectDTO.getObjective());
        project.setTools(projectDTO.getTools());
        project.setDescription(projectDTO.getDescription());
        project.setCategory(projectDTO.getCategory());
        project.setStudent(student);
        project.setFaculty(faculty);
        project.setStatus(ProjectStatus.PENDING);
        project.setProgress(projectDTO.getProgress() != null ? projectDTO.getProgress() : 0);
        project.setStartDate(projectDTO.getStartDate());
        project.setEndDate(projectDTO.getEndDate());
        project.setResources(projectDTO.getResources());
        project.setDurationMonths(projectDTO.getDurationMonths());
        project.setGithubLink(projectDTO.getGithubLink());
        project.setReportFile(projectDTO.getReportFile());
        project.setScreenshots(projectDTO.getScreenshots());
        
        Project savedProject = projectRepository.save(project);
        return convertToDTO(savedProject);
    }

    public ProjectDTO updateProject(Long id, ProjectDTO projectDTO) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        project.setTitle(projectDTO.getTitle());
        project.setObjective(projectDTO.getObjective());
        project.setTools(projectDTO.getTools());
        project.setDescription(projectDTO.getDescription());
        project.setCategory(projectDTO.getCategory());
        project.setStatus(projectDTO.getStatus());
        project.setProgress(projectDTO.getProgress());
        project.setStartDate(projectDTO.getStartDate());
        project.setEndDate(projectDTO.getEndDate());
        project.setResources(projectDTO.getResources());
        project.setDurationMonths(projectDTO.getDurationMonths());
        project.setGithubLink(projectDTO.getGithubLink());
        project.setReportFile(projectDTO.getReportFile());
        project.setScreenshots(projectDTO.getScreenshots());
        
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

    public void assignProjectsToSupervisors() {
        List<Project> projectsWithoutFaculty = projectRepository.findByFacultyIsNull();
        
        for (Project project : projectsWithoutFaculty) {
            User student = project.getStudent();
            if (student.getSupervisor() != null) {
                project.setFaculty(student.getSupervisor());
                projectRepository.save(project);
            }
        }
    }

    private ProjectDTO convertToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setObjective(project.getObjective());
        dto.setTools(project.getTools());
        dto.setDescription(project.getDescription());
        dto.setCategory(project.getCategory());
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
        dto.setProgress(project.getProgress());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        dto.setResources(project.getResources());
        dto.setDurationMonths(project.getDurationMonths());
        dto.setGithubLink(project.getGithubLink());
        dto.setReportFile(project.getReportFile());
        dto.setScreenshots(project.getScreenshots());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());
        return dto;
    }
}
