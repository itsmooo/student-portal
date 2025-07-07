package com.studentporta.respository;

import com.studentporta.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    List<Document> findBySupervisorIdOrderByCreatedAtDesc(Long supervisorId);
    
    List<Document> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    
    List<Document> findBySupervisorIdAndStudentIdOrderByCreatedAtDesc(Long supervisorId, Long studentId);
    
    @Query("SELECT d FROM Document d WHERE d.supervisor.id = :supervisorId AND d.student IS NULL")
    List<Document> findGeneralDocumentsBySupervisor(@Param("supervisorId") Long supervisorId);
    
    @Query("SELECT d FROM Document d WHERE d.supervisor.id = :supervisorId AND d.student.id = :studentId")
    List<Document> findStudentSpecificDocuments(@Param("supervisorId") Long supervisorId, @Param("studentId") Long studentId);
} 