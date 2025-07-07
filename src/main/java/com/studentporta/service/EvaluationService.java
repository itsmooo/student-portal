package com.studentporta.service;

import com.studentporta.dto.EvaluationDTO;
import com.studentporta.entity.Evaluation;
import com.studentporta.entity.Project;
import com.studentporta.respository.EvaluationRepository;
import com.studentporta.respository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EvaluationService {

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public EvaluationDTO createEvaluation(EvaluationDTO dto) {
        Optional<Project> projectOpt = projectRepository.findById(dto.getProjectId());
        if (projectOpt.isEmpty()) {
            throw new RuntimeException("Project not found with id: " + dto.getProjectId());
        }

        Project project = projectOpt.get();
        Evaluation evaluation = new Evaluation(
            project, 
            dto.getFinalScore(), 
            dto.getFinalComment()
        );

        Evaluation saved = evaluationRepository.save(evaluation);
        return convertToDTO(saved);
    }

    public EvaluationDTO updateEvaluation(Long id, EvaluationDTO dto) {
        Optional<Evaluation> existingOpt = evaluationRepository.findById(id);
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Evaluation not found with id: " + id);
        }

        Evaluation existing = existingOpt.get();
        existing.setFinalScore(dto.getFinalScore());
        existing.setFinalComment(dto.getFinalComment());

        Evaluation saved = evaluationRepository.save(existing);
        return convertToDTO(saved);
    }

    public EvaluationDTO getEvaluationById(Long id) {
        Optional<Evaluation> evaluation = evaluationRepository.findById(id);
        if (evaluation.isEmpty()) {
            throw new RuntimeException("Evaluation not found with id: " + id);
        }
        return convertToDTO(evaluation.get());
    }

    public List<EvaluationDTO> getEvaluationsByProjectId(Long projectId) {
        List<Evaluation> evaluations = evaluationRepository.findByProjectIdOrderByTimestampDesc(projectId);
        return evaluations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EvaluationDTO getLatestEvaluationByProjectId(Long projectId) {
        Optional<Evaluation> evaluation = evaluationRepository.findLatestByProjectId(projectId);
        if (evaluation.isEmpty()) {
            throw new RuntimeException("No evaluation found for project: " + projectId);
        }
        return convertToDTO(evaluation.get());
    }

    public Double getAverageScoreByProjectId(Long projectId) {
        Double average = evaluationRepository.getAverageScoreByProjectId(projectId);
        return average != null ? average : 0.0;
    }

    public void deleteEvaluation(Long id) {
        if (!evaluationRepository.existsById(id)) {
            throw new RuntimeException("Evaluation not found with id: " + id);
        }
        evaluationRepository.deleteById(id);
    }

    public boolean hasEvaluationForProject(Long projectId) {
        return evaluationRepository.existsByProjectId(projectId);
    }

    private EvaluationDTO convertToDTO(Evaluation evaluation) {
        EvaluationDTO dto = new EvaluationDTO();
        dto.setId(evaluation.getId());
        dto.setProjectId(evaluation.getProject().getId());
        dto.setFinalScore(evaluation.getFinalScore());
        dto.setFinalComment(evaluation.getFinalComment());
        dto.setTimestamp(evaluation.getTimestamp());
        return dto;
    }
} 