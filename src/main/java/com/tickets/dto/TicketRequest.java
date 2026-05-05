package com.tickets.dto;

import jakarta.validation.constraints.NotBlank;

public class TicketRequest {

    @NotBlank
    private String title;

    private String description;

    private String status;

    private String priority;

    private Long assignedToId;

    public TicketRequest() {}

    public TicketRequest(String title, String description, String status, String priority, Long assignedToId) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.assignedToId = assignedToId;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public Long getAssignedToId() { return assignedToId; }
    public void setAssignedToId(Long assignedToId) { this.assignedToId = assignedToId; }
}
