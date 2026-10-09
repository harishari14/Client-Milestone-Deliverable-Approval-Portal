package com.prooflane.service;

import com.prooflane.model.Milestone;
import com.prooflane.model.MilestoneStatus;
import com.prooflane.model.Project;
import com.prooflane.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MilestoneService {

    private final ProjectRepository projectRepository;

    public MilestoneService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Project approveMilestone(String projectId, String milestoneId, String clientNotes) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));

        for (Milestone m : project.getMilestones()) {
            if (m.getId().equals(milestoneId)) {
                m.setStatus(MilestoneStatus.APPROVED);
                m.setApprovedAt(LocalDateTime.now());
                if (clientNotes != null && !clientNotes.trim().isEmpty()) {
                    m.setReviewNotes(clientNotes);
                }
                break;
            }
        }
        return projectRepository.save(project);
    }

    public Project requestRevision(String projectId, String milestoneId, String requestedChanges) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));

        for (Milestone m : project.getMilestones()) {
            if (m.getId().equals(milestoneId)) {
                m.setStatus(MilestoneStatus.REVISION_REQUESTED);
                m.setReviewNotes(requestedChanges);
                break;
            }
        }
        return projectRepository.save(project);
    }
}
