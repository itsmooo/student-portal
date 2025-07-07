package com.studentporta.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class EvaluationDTO {
    private Long id;
    
    @NotNull
    private Long projectId;
    
    @NotNull
    @Min(0)
    @Max(100)
    private Integer finalScore;
    
    @NotBlank
    @Size(max = 2000)
    private String finalComment;
    
    private LocalDateTime timestamp;

    // Constructors
    public EvaluationDTO() {}

    public EvaluationDTO(Long projectId, Integer finalScore, String finalComment) {
        this.projectId = projectId;
        this.finalScore = finalScore;
        this.finalComment = finalComment;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public Integer getFinalScore() { return finalScore; }
    public void setFinalScore(Integer finalScore) { this.finalScore = finalScore; }

    public String getFinalComment() { return finalComment; }
    public void setFinalComment(String finalComment) { this.finalComment = finalComment; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
} 