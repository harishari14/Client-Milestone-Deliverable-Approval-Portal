package com.prooflane.controller;

import com.prooflane.model.Project;
import com.prooflane.service.MilestoneService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/projects/{projectId}/milestones")
@CrossOrigin(origins = "*")
public class MilestoneController {

    private final MilestoneService milestoneService;

    public MilestoneController(MilestoneService milestoneService) {
        this.milestoneService = milestoneService;
    }

    @PostMapping("/{milestoneId}/approve")
    public ResponseEntity<Project> approve(
            @PathVariable String projectId,
            @PathVariable String milestoneId,
            @RequestBody(required = false) Map<String, String> payload) {
        String notes = payload != null ? payload.get("notes") : "";
        Project updated = milestoneService.approveMilestone(projectId, milestoneId, notes);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{milestoneId}/request-revision")
    public ResponseEntity<Project> requestRevision(
            @PathVariable String projectId,
            @PathVariable String milestoneId,
            @RequestBody Map<String, String> payload) {
        String changes = payload.getOrDefault("changes", "Revision requested by client.");
        Project updated = milestoneService.requestRevision(projectId, milestoneId, changes);
        return ResponseEntity.ok(updated);
    }
}
