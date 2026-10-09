package com.prooflane.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Milestone {

    private String id;
    private String title;
    private String description;
    private BigDecimal amount = BigDecimal.ZERO;
    private LocalDate dueDate;
    private MilestoneStatus status = MilestoneStatus.DRAFT;
    private String reviewNotes;
    private LocalDateTime approvedAt;
    private Integer orderIndex = 1;
    private List<Deliverable> deliverables = new ArrayList<>();

    public Milestone() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public MilestoneStatus getStatus() { return status; }
    public void setStatus(MilestoneStatus status) { this.status = status; }

    public String getReviewNotes() { return reviewNotes; }
    public void setReviewNotes(String reviewNotes) { this.reviewNotes = reviewNotes; }

    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }

    public List<Deliverable> getDeliverables() { return deliverables; }
    public void setDeliverables(List<Deliverable> deliverables) { this.deliverables = deliverables; }
}
