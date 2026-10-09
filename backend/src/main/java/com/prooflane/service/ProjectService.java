package com.prooflane.service;

import com.prooflane.model.Client;
import com.prooflane.model.Project;
import com.prooflane.repository.ClientRepository;
import com.prooflane.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ClientRepository clientRepository;

    public ProjectService(ProjectRepository projectRepository, ClientRepository clientRepository) {
        this.projectRepository = projectRepository;
        this.clientRepository = clientRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(String id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found: " + id));
    }

    public Project createProject(Project project, String clientId) {
        if (project.getId() == null || project.getId().isEmpty()) {
            project.setId(UUID.randomUUID().toString());
        }
        Client client = clientRepository.findById(clientId)
                .orElse(null);
        project.setClient(client);
        project.setClientId(clientId);
        return projectRepository.save(project);
    }
}
