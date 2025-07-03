package com.studentporta.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class FeedbackDTO {
    private Long id;
    
    private Long projectId;
    private String projectTitle;
    
    private Long facultyId;
    private String facultyName;
    
    @NotBlank
    private String comment;
    
    @DecimalMin("1")
    @DecimalMax("5")
    private Integer rating;
    
    private LocalDateTime createdAt;

    // Constructors
    public FeedbackDTO() {}

    public FeedbackDTO(Long id, Long projectId, Long facultyId, String comment, Integer rating, LocalDateTime createdAt) {
        this.id = id;
        this.projectId = projectId;
        this.facultyId = facultyId;
        this.comment = comment;
        this.rating = rating;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public Long getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(Long facultyId) {
        this.facultyId = facultyId;
    }

    public String getFacultyName() {
        return facultyName;
    }

    public void setFacultyName(String facultyName) {
        this.facultyName = facultyName;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
