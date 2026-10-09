package com.prooflane.repository;

import com.prooflane.model.Client;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends MongoRepository<Client, String> {

    Optional<Client> findByPortalToken(String portalToken);

    Optional<Client> findByEmail(String email);
}
