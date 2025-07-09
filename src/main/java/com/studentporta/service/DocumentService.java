package com.studentporta.service;

import com.studentporta.dto.DocumentDTO;
import com.studentporta.entity.Document;
import com.studentporta.entity.User;
import com.studentporta.respository.DocumentRepository;
import com.studentporta.respository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    private static final String UPLOAD_DIR = "uploads/documents/";

    public DocumentService() {
        // Create upload directory if it doesn't exist
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public DocumentDTO uploadDocument(MultipartFile file, String title, String description, 
                                    Long supervisorId, Long studentId) throws IOException {
        
        User supervisor = userRepository.findById(supervisorId)
                .orElseThrow(() -> new RuntimeException("Supervisor not found"));

        User student = null;
        if (studentId != null) {
            student = userRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
        
        // Save file to disk
        Path filePath = Paths.get(UPLOAD_DIR + uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Create document entity
        Document document = new Document(
                title,
                description,
                filePath.toString(),
                originalFilename,
                file.getSize(),
                file.getContentType(),
                supervisor,
                student
        );

        Document savedDocument = documentRepository.save(document);
        return convertToDTO(savedDocument);
    }

    public List<DocumentDTO> getDocumentsBySupervisor(Long supervisorId) {
        List<Document> documents = documentRepository.findBySupervisorIdOrderByCreatedAtDesc(supervisorId);
        return documents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DocumentDTO> getDocumentsForStudent(Long studentId) {
        // Get student-specific documents
        List<Document> studentSpecificDocuments = documentRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
        
        // Get student's supervisor
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        // Get general documents from student's supervisor
        List<Document> generalDocuments = new ArrayList<>();
        if (student.getSupervisor() != null) {
            generalDocuments = documentRepository.findGeneralDocumentsBySupervisor(student.getSupervisor().getId());
        }
        
        // Combine both lists
        List<Document> allDocuments = new ArrayList<>();
        allDocuments.addAll(studentSpecificDocuments);
        allDocuments.addAll(generalDocuments);
        
        // Sort by creation date (newest first)
        allDocuments.sort((d1, d2) -> d2.getCreatedAt().compareTo(d1.getCreatedAt()));
        
        return allDocuments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DocumentDTO> getGeneralDocumentsBySupervisor(Long supervisorId) {
        List<Document> documents = documentRepository.findGeneralDocumentsBySupervisor(supervisorId);
        return documents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DocumentDTO> getStudentSpecificDocuments(Long supervisorId, Long studentId) {
        List<Document> documents = documentRepository.findStudentSpecificDocuments(supervisorId, studentId);
        return documents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DocumentDTO getDocumentById(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        return convertToDTO(document);
    }

    public void deleteDocument(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        // Delete file from disk
        try {
            Path filePath = Paths.get(document.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log error but don't throw exception
            System.err.println("Could not delete file: " + document.getFilePath());
        }
        
        documentRepository.delete(document);
    }

    private DocumentDTO convertToDTO(Document document) {
        DocumentDTO dto = new DocumentDTO();
        dto.setId(document.getId());
        dto.setTitle(document.getTitle());
        dto.setDescription(document.getDescription());
        dto.setFilePath(document.getFilePath());
        dto.setFileName(document.getFileName());
        dto.setFileSize(document.getFileSize());
        dto.setFileType(document.getFileType());
        dto.setSupervisorId(document.getSupervisor().getId());
        dto.setSupervisorName(document.getSupervisor().getFirstName() + " " + document.getSupervisor().getLastName());
        
        if (document.getStudent() != null) {
            dto.setStudentId(document.getStudent().getId());
            dto.setStudentName(document.getStudent().getFirstName() + " " + document.getStudent().getLastName());
        }
        
        dto.setCreatedAt(document.getCreatedAt());
        dto.setUpdatedAt(document.getUpdatedAt());
        
        return dto;
    }
} 