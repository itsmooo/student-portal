package com.studentporta.respository;

import com.studentporta.entity.ProgressUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgressUpdateRepository extends JpaRepository<ProgressUpdate, Long> {
    
    List<ProgressUpdate> findByProjectIdOrderByWeekNumberAsc(Long projectId);
    
    List<ProgressUpdate> findByProjectIdOrderByTimestampDesc(Long projectId);
    
    @Query("SELECT pu FROM ProgressUpdate pu WHERE pu.project.id = :projectId AND pu.weekNumber = :weekNumber")
    ProgressUpdate findByProjectIdAndWeekNumber(@Param("projectId") Long projectId, @Param("weekNumber") Integer weekNumber);
    
    @Query("SELECT COUNT(pu) FROM ProgressUpdate pu WHERE pu.project.id = :projectId")
    Long countByProjectId(@Param("projectId") Long projectId);
} 