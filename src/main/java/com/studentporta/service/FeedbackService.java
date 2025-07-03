package com.studentporta.service;

import com.studentporta.dto.FeedbackDTO;
import com.studentporta.entity.Feedback;
import com.studentporta.entity.Project;
import com.studentporta.entity.User;
import com.studentporta.respository.FeedbackRepository;
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
public class FeedbackService {
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<FeedbackDTO> getAllFeedback() {
        return feedbackRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<FeedbackDTO> getFeedbackById(Long id) {
        return feedbackRepository.findById(id)
                .map(this::convertToDTO);
    }

    public List<FeedbackDTO> getFeedbackByProjectId(Long projectId) {
        return feedbackRepository.findByProjectId(projectId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FeedbackDTO> getFeedbackByFacultyId(Long facultyId) {
        return feedbackRepository.findByFacultyId(facultyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FeedbackDTO> getFeedbackByStudent(Long studentId) {
        return feedbackRepository.findByStudentId(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public FeedbackDTO createFeedback(FeedbackDTO feedbackDTO) {
        Project project = projectRepository.findById(feedbackDTO.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        User faculty = userRepository.findById(feedbackDTO.getFacultyId())
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        Feedback feedback = new Feedback();
        feedback.setProject(project);
        feedback.setFaculty(faculty);
        feedback.setComment(feedbackDTO.getComment());
        feedback.setRating(feedbackDTO.getRating());
        
        Feedback savedFeedback = feedbackRepository.save(feedback);
        return convertToDTO(savedFeedback);
    }

    public FeedbackDTO updateFeedback(Long id, FeedbackDTO feedbackDTO) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
        
        feedback.setComment(feedbackDTO.getComment());
        feedback.setRating(feedbackDTO.getRating());
        
        Feedback updatedFeedback = feedbackRepository.save(feedback);
        return convertToDTO(updatedFeedback);
    }

    public void deleteFeedback(Long id) {
        if (!feedbackRepository.existsById(id)) {
            throw new RuntimeException("Feedback not found");
        }
        feedbackRepository.deleteById(id);
    }

    public Double getAverageRatingByProject(Long projectId) {
        return feedbackRepository.getAverageRatingByProjectId(projectId);
    }

    public Double getAverageRatingByStudent(Long studentId) {
        return feedbackRepository.getAverageRatingByStudentId(studentId);
    }

    private FeedbackDTO convertToDTO(Feedback feedback) {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setId(feedback.getId());
        dto.setProjectId(feedback.getProject().getId());
        dto.setFacultyId(feedback.getFaculty().getId());
        dto.setComment(feedback.getComment());
        dto.setRating(feedback.getRating());
        dto.setCreatedAt(feedback.getCreatedAt());
        return dto;
    }
}
