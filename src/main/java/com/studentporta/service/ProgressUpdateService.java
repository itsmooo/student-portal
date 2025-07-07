package com.studentporta.service;

import com.studentporta.dto.ProgressUpdateDTO;
import com.studentporta.entity.ProgressUpdate;
import com.studentporta.entity.Project;
import com.studentporta.entity.ProjectStatus;
import com.studentporta.respository.ProgressUpdateRepository;
import com.studentporta.respository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProgressUpdateService {

    @Autowired
    private ProgressUpdateRepository progressUpdateRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public ProgressUpdateDTO createProgressUpdate(ProgressUpdateDTO dto) {
        Optional<Project> projectOpt = projectRepository.findById(dto.getProjectId());
        if (projectOpt.isEmpty()) {
            throw new RuntimeException("Project not found with id: " + dto.getProjectId());
        }

        Project project = projectOpt.get();
        
        // Validate that the project is in APPROVED or IN_PROGRESS status
        if (project.getStatus() != ProjectStatus.IN_PROGRESS && project.getStatus() != ProjectStatus.APPROVED) {
            throw new RuntimeException("Progress updates can only be submitted for projects with APPROVED or IN_PROGRESS status. Current status: " + project.getStatus());
        }
        
        // Check if a progress update already exists for this project and week
        ProgressUpdate existingUpdate = progressUpdateRepository.findByProjectIdAndWeekNumber(project.getId(), dto.getWeekNumber());
        if (existingUpdate != null) {
            throw new RuntimeException("A progress update for week " + dto.getWeekNumber() + " already exists for this project");
        }
        
        ProgressUpdate progressUpdate = new ProgressUpdate(
            project, 
            dto.getWeekNumber(), 
            dto.getUpdateDescription(), 
            dto.getFeedback()
        );

        ProgressUpdate saved = progressUpdateRepository.save(progressUpdate);
        return convertToDTO(saved);
    }

    public ProgressUpdateDTO updateProgressUpdate(Long id, ProgressUpdateDTO dto) {
        Optional<ProgressUpdate> existingOpt = progressUpdateRepository.findById(id);
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Progress update not found with id: " + id);
        }

        ProgressUpdate existing = existingOpt.get();
        existing.setWeekNumber(dto.getWeekNumber());
        existing.setUpdateDescription(dto.getUpdateDescription());
        existing.setFeedback(dto.getFeedback());

        ProgressUpdate saved = progressUpdateRepository.save(existing);
        return convertToDTO(saved);
    }

    public ProgressUpdateDTO getProgressUpdateById(Long id) {
        Optional<ProgressUpdate> progressUpdate = progressUpdateRepository.findById(id);
        if (progressUpdate.isEmpty()) {
            throw new RuntimeException("Progress update not found with id: " + id);
        }
        return convertToDTO(progressUpdate.get());
    }

    public List<ProgressUpdateDTO> getProgressUpdatesByProjectId(Long projectId) {
        List<ProgressUpdate> progressUpdates = progressUpdateRepository.findByProjectIdOrderByWeekNumberAsc(projectId);
        return progressUpdates.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void deleteProgressUpdate(Long id) {
        if (!progressUpdateRepository.existsById(id)) {
            throw new RuntimeException("Progress update not found with id: " + id);
        }
        progressUpdateRepository.deleteById(id);
    }

    public Long getProgressUpdateCountByProjectId(Long projectId) {
        return progressUpdateRepository.countByProjectId(projectId);
    }

    public ProgressUpdateDTO getProgressUpdateByProjectAndWeek(Long projectId, Integer weekNumber) {
        ProgressUpdate progressUpdate = progressUpdateRepository.findByProjectIdAndWeekNumber(projectId, weekNumber);
        if (progressUpdate == null) {
            throw new RuntimeException("Progress update not found for project: " + projectId + " and week: " + weekNumber);
        }
        return convertToDTO(progressUpdate);
    }

    private ProgressUpdateDTO convertToDTO(ProgressUpdate progressUpdate) {
        ProgressUpdateDTO dto = new ProgressUpdateDTO();
        dto.setId(progressUpdate.getId());
        dto.setProjectId(progressUpdate.getProject().getId());
        dto.setWeekNumber(progressUpdate.getWeekNumber());
        dto.setUpdateDescription(progressUpdate.getUpdateDescription());
        dto.setFeedback(progressUpdate.getFeedback());
        dto.setTimestamp(progressUpdate.getTimestamp());
        return dto;
    }
} 