package com.prooflane.repository;

import com.prooflane.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {

    List<Project> findByClientId(String clientId);

    @Query("{ 'client.portalToken': ?0 }")
    List<Project> findByClientPortalToken(String portalToken);
}
