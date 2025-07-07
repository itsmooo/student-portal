package com.studentporta.respository;

import com.studentporta.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    
    List<Evaluation> findByProjectIdOrderByTimestampDesc(Long projectId);
    
    @Query("SELECT e FROM Evaluation e WHERE e.project.id = :projectId ORDER BY e.timestamp DESC")
    Optional<Evaluation> findLatestByProjectId(@Param("projectId") Long projectId);
    
    @Query("SELECT AVG(e.finalScore) FROM Evaluation e WHERE e.project.id = :projectId")
    Double getAverageScoreByProjectId(@Param("projectId") Long projectId);
    
    boolean existsByProjectId(Long projectId);
} 