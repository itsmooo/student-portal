package com.studentporta.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class ProgressUpdateDTO {
    private Long id;
    
    @NotNull
    private Long projectId;
    
    @NotNull
    @Min(1)
    private Integer weekNumber;
    
    @NotBlank
    @Size(max = 2000)
    private String updateDescription;
    
    @Size(max = 1000)
    private String feedback;
    
    private LocalDateTime timestamp;

    // Constructors
    public ProgressUpdateDTO() {}

    public ProgressUpdateDTO(Long projectId, Integer weekNumber, String updateDescription) {
        this.projectId = projectId;
        this.weekNumber = weekNumber;
        this.updateDescription = updateDescription;
    }

    public ProgressUpdateDTO(Long projectId, Integer weekNumber, String updateDescription, String feedback) {
        this.projectId = projectId;
        this.weekNumber = weekNumber;
        this.updateDescription = updateDescription;
        this.feedback = feedback;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public Integer getWeekNumber() { return weekNumber; }
    public void setWeekNumber(Integer weekNumber) { this.weekNumber = weekNumber; }

    public String getUpdateDescription() { return updateDescription; }
    public void setUpdateDescription(String updateDescription) { this.updateDescription = updateDescription; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
} 