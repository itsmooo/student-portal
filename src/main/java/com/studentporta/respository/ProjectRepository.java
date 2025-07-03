package com.studentporta.respository;

import com.studentporta.entity.Project;
import com.studentporta.entity.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStudentId(Long studentId);
    List<Project> findByFacultyId(Long facultyId);
    List<Project> findByStatus(ProjectStatus status);
    
    @Query("SELECT p FROM Project p WHERE p.student.id = ?1")
    List<Project> findAllByStudentId(Long studentId);
    
    @Query("SELECT p FROM Project p WHERE p.faculty.id = ?1")
    List<Project> findAllByFacultyId(Long facultyId);
    
    @Query("SELECT p FROM Project p WHERE p.student.id = :studentId AND p.status = :status")
    List<Project> findByStudentIdAndStatus(@Param("studentId") Long studentId, @Param("status") ProjectStatus status);
    
    @Query("SELECT p FROM Project p WHERE p.faculty.id = :facultyId AND p.status = :status")
    List<Project> findByFacultyIdAndStatus(@Param("facultyId") Long facultyId, @Param("status") ProjectStatus status);
    
    @Query("SELECT COUNT(p) FROM Project p WHERE p.student.id = :studentId")
    Long countByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT COUNT(p) FROM Project p WHERE p.faculty.id = :facultyId")
    Long countByFacultyId(@Param("facultyId") Long facultyId);
}
