package com.prooflane.controller;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class HealthController {

    private final MongoTemplate mongoTemplate;

    public HealthController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "ProofLane Spring Boot API");
        response.put("timestamp", Instant.now().toString());

        try {
            Document pingResult = mongoTemplate.getDb().runCommand(new Document("ping", 1));
            response.put("database", "CONNECTED");
            response.put("dbPing", "SUCCESS");
        } catch (Exception ex) {
            response.put("database", "DISCONNECTED");
            response.put("error", ex.getMessage());
        }

        return ResponseEntity.ok(response);
    }
}
