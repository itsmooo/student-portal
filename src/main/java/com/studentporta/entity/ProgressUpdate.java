package com.studentporta.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "progress_updates")
public class ProgressUpdate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Min(1)
    @Column(name = "week_number", nullable = false)
    private Integer weekNumber;

    @NotBlank
    @Size(max = 2000)
    @Column(name = "update_description", columnDefinition = "TEXT", nullable = false)
    private String updateDescription;

    @Size(max = 1000)
    @Column(columnDefinition = "TEXT")
    private String feedback;

    @CreationTimestamp
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    // Constructors
    public ProgressUpdate() {}

    public ProgressUpdate(Project project, Integer weekNumber, String updateDescription) {
        this.project = project;
        this.weekNumber = weekNumber;
        this.updateDescription = updateDescription;
        this.timestamp = LocalDateTime.now();
    }

    public ProgressUpdate(Project project, Integer weekNumber, String updateDescription, String feedback) {
        this.project = project;
        this.weekNumber = weekNumber;
        this.updateDescription = updateDescription;
        this.feedback = feedback;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public Integer getWeekNumber() { return weekNumber; }
    public void setWeekNumber(Integer weekNumber) { this.weekNumber = weekNumber; }

    public String getUpdateDescription() { return updateDescription; }
    public void setUpdateDescription(String updateDescription) { this.updateDescription = updateDescription; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
} 