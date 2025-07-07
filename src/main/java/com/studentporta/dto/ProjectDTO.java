package com.studentporta.dto;

import com.studentporta.entity.ProjectStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProjectDTO {
    private Long id;
    
    @NotBlank
    @Size(max = 200)
    private String title;
    
    @NotBlank
    @Size(max = 1000)
    private String objective;
    
    @Size(max = 500)
    private String tools;
    
    @NotBlank
    private String description;
    
    @Size(max = 50)
    private String category;
    
    private ProjectStatus status;
    
    private Long studentId;
    private String studentName;
    
    private Long supervisorId;
    private String supervisorName;
    
    @Min(0)
    @Max(100)
    private Integer progress;
    
    private LocalDate startDate;
    private LocalDate endDate;
    
    private String resources;
    private Integer durationMonths;
    
    private String githubLink;
    private String reportFile;
    private String screenshots;

    private Long facultyId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public ProjectDTO() {}

    public ProjectDTO(String title, String objective, String description, String category, Long studentId) {
        this.title = title;
        this.objective = objective;
        this.description = description;
        this.category = category;
        this.studentId = studentId;
    }

    public ProjectDTO(Long id, String title, String objective, String description, ProjectStatus status, 
                     Long studentId, Long facultyId, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.objective = objective;
        this.description = description;
        this.status = status;
        this.studentId = studentId;
        this.facultyId = facultyId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getObjective() { return objective; }
    public void setObjective(String objective) { this.objective = objective; }

    public String getTools() { return tools; }
    public void setTools(String tools) { this.tools = tools; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public Long getSupervisorId() { return supervisorId; }
    public void setSupervisorId(Long supervisorId) { this.supervisorId = supervisorId; }

    public String getSupervisorName() { return supervisorName; }
    public void setSupervisorName(String supervisorName) { this.supervisorName = supervisorName; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getResources() { return resources; }
    public void setResources(String resources) { this.resources = resources; }

    public Integer getDurationMonths() { return durationMonths; }
    public void setDurationMonths(Integer durationMonths) { this.durationMonths = durationMonths; }

    public String getGithubLink() { return githubLink; }
    public void setGithubLink(String githubLink) { this.githubLink = githubLink; }

    public String getReportFile() { return reportFile; }
    public void setReportFile(String reportFile) { this.reportFile = reportFile; }

    public String getScreenshots() { return screenshots; }
    public void setScreenshots(String screenshots) { this.screenshots = screenshots; }

    public Long getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(Long facultyId) {
        this.facultyId = facultyId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
