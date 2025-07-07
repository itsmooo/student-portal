package com.studentporta.controller;

import com.studentporta.dto.DocumentDTO;
import com.studentporta.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<DocumentDTO> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("supervisorId") Long supervisorId,
            @RequestParam(value = "studentId", required = false) Long studentId) {
        
        try {
            DocumentDTO document = documentService.uploadDocument(file, title, description, supervisorId, studentId);
            return ResponseEntity.ok(document);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/supervisor/{supervisorId}")
    public ResponseEntity<List<DocumentDTO>> getDocumentsBySupervisor(@PathVariable Long supervisorId) {
        List<DocumentDTO> documents = documentService.getDocumentsBySupervisor(supervisorId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<DocumentDTO>> getDocumentsForStudent(@PathVariable Long studentId) {
        List<DocumentDTO> documents = documentService.getDocumentsForStudent(studentId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/supervisor/{supervisorId}/general")
    public ResponseEntity<List<DocumentDTO>> getGeneralDocumentsBySupervisor(@PathVariable Long supervisorId) {
        List<DocumentDTO> documents = documentService.getGeneralDocumentsBySupervisor(supervisorId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/supervisor/{supervisorId}/student/{studentId}")
    public ResponseEntity<List<DocumentDTO>> getStudentSpecificDocuments(
            @PathVariable Long supervisorId, 
            @PathVariable Long studentId) {
        List<DocumentDTO> documents = documentService.getStudentSpecificDocuments(supervisorId, studentId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<DocumentDTO> getDocumentById(@PathVariable Long documentId) {
        try {
            DocumentDTO document = documentService.getDocumentById(documentId);
            return ResponseEntity.ok(document);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/download/{documentId}")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long documentId) {
        try {
            DocumentDTO document = documentService.getDocumentById(documentId);
            Path filePath = Paths.get(document.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, 
                                "attachment; filename=\"" + document.getFileName() + "\"")
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long documentId) {
        try {
            documentService.deleteDocument(documentId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 