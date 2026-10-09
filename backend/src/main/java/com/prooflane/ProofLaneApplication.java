package com.prooflane;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProofLaneApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProofLaneApplication.class, args);
        System.out.println("ProofLane Spring Boot Backend running on http://localhost:8080");
    }
}
