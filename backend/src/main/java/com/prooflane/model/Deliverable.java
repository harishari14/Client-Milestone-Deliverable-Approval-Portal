package com.prooflane.model;

import java.time.LocalDateTime;

public class Deliverable {

    private String id;
    private String title;
    private DeliverableType type;
    private String url;
    private String description;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Deliverable() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public DeliverableType getType() { return type; }
    public void setType(DeliverableType type) { this.type = type; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
