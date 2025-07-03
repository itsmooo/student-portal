package com.studentporta.respository;

import com.studentporta.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByProjectId(Long projectId);
    List<Feedback> findByFacultyId(Long facultyId);
    
    @Query("SELECT f FROM Feedback f WHERE f.project.student.id = :studentId ORDER BY f.createdAt DESC")
    List<Feedback> findByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.project.id = :projectId")
    Double getAverageRatingByProjectId(@Param("projectId") Long projectId);
    
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.project.student.id = :studentId")
    Double getAverageRatingByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT f FROM Feedback f WHERE f.project.id = ?1")
    List<Feedback> findAllByProjectId(Long projectId);
}
