package com.studentporta.controller;

import com.studentporta.dto.FeedbackDTO;
import com.studentporta.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {
    
    @Autowired
    private FeedbackService feedbackService;

    @GetMapping
    public ResponseEntity<List<FeedbackDTO>> getAllFeedback() {
        List<FeedbackDTO> feedback = feedbackService.getAllFeedback();
        return ResponseEntity.ok(feedback);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeedbackDTO> getFeedbackById(@PathVariable Long id) {
        return feedbackService.getFeedbackById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<FeedbackDTO>> getFeedbackByProjectId(@PathVariable Long projectId) {
        List<FeedbackDTO> feedback = feedbackService.getFeedbackByProjectId(projectId);
        return ResponseEntity.ok(feedback);
    }

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<FeedbackDTO>> getFeedbackByFacultyId(@PathVariable Long facultyId) {
        List<FeedbackDTO> feedback = feedbackService.getFeedbackByFacultyId(facultyId);
        return ResponseEntity.ok(feedback);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<FeedbackDTO>> getFeedbackByStudent(@PathVariable Long studentId) {
        List<FeedbackDTO> feedback = feedbackService.getFeedbackByStudent(studentId);
        return ResponseEntity.ok(feedback);
    }

    @PostMapping
    public ResponseEntity<FeedbackDTO> createFeedback(@RequestBody FeedbackDTO feedbackDTO) {
        FeedbackDTO createdFeedback = feedbackService.createFeedback(feedbackDTO);
        return ResponseEntity.ok(createdFeedback);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeedbackDTO> updateFeedback(@PathVariable Long id, @RequestBody FeedbackDTO feedbackDTO) {
        try {
            FeedbackDTO updatedFeedback = feedbackService.updateFeedback(id, feedbackDTO);
            return ResponseEntity.ok(updatedFeedback);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        try {
            feedbackService.deleteFeedback(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/average-rating/project/{projectId}")
    public ResponseEntity<Double> getAverageRatingByProject(@PathVariable Long projectId) {
        Double averageRating = feedbackService.getAverageRatingByProject(projectId);
        return ResponseEntity.ok(averageRating != null ? averageRating : 0.0);
    }

    @GetMapping("/average-rating/student/{studentId}")
    public ResponseEntity<Double> getAverageRatingByStudent(@PathVariable Long studentId) {
        Double averageRating = feedbackService.getAverageRatingByStudent(studentId);
        return ResponseEntity.ok(averageRating != null ? averageRating : 0.0);
    }
}
