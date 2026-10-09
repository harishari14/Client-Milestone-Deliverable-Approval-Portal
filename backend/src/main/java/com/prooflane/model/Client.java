package com.prooflane.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "clients")
public class Client {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String company;

    @Indexed(unique = true)
    private String portalToken;

    private String avatarInitials;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Client() {}

    public Client(String id, String name, String email, String company, String portalToken, String avatarInitials) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.company = company;
        this.portalToken = portalToken;
        this.avatarInitials = avatarInitials;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getPortalToken() { return portalToken; }
    public void setPortalToken(String portalToken) { this.portalToken = portalToken; }

    public String getAvatarInitials() { return avatarInitials; }
    public void setAvatarInitials(String avatarInitials) { this.avatarInitials = avatarInitials; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
