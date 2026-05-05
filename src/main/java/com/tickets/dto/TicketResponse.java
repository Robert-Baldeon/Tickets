package com.tickets.dto;

import java.time.LocalDateTime;

public class TicketResponse {

    private Long id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private String createdByEmail;
    private String createdByName;
    private String assignedToEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TicketResponse() {}

    private TicketResponse(Long id, String title, String description, String status, String priority,
                           String createdByEmail, String createdByName, String assignedToEmail,
                           LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.createdByEmail = createdByEmail;
        this.createdByName = createdByName;
        this.assignedToEmail = assignedToEmail;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static TicketResponseBuilder builder() {
        return new TicketResponseBuilder();
    }

    public static class TicketResponseBuilder {
        private Long id;
        private String title;
        private String description;
        private String status;
        private String priority;
        private String createdByEmail;
        private String createdByName;
        private String assignedToEmail;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public TicketResponseBuilder id(Long id) { this.id = id; return this; }
        public TicketResponseBuilder title(String title) { this.title = title; return this; }
        public TicketResponseBuilder description(String description) { this.description = description; return this; }
        public TicketResponseBuilder status(String status) { this.status = status; return this; }
        public TicketResponseBuilder priority(String priority) { this.priority = priority; return this; }
        public TicketResponseBuilder createdByEmail(String createdByEmail) { this.createdByEmail = createdByEmail; return this; }
        public TicketResponseBuilder createdByName(String createdByName) { this.createdByName = createdByName; return this; }
        public TicketResponseBuilder assignedToEmail(String assignedToEmail) { this.assignedToEmail = assignedToEmail; return this; }
        public TicketResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public TicketResponseBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public TicketResponse build() {
            return new TicketResponse(id, title, description, status, priority, createdByEmail, createdByName, assignedToEmail, createdAt, updatedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getCreatedByEmail() { return createdByEmail; }
    public void setCreatedByEmail(String createdByEmail) { this.createdByEmail = createdByEmail; }
    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }
    public String getAssignedToEmail() { return assignedToEmail; }
    public void setAssignedToEmail(String assignedToEmail) { this.assignedToEmail = assignedToEmail; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
