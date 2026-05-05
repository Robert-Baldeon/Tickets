package com.tickets.dto;

import java.time.LocalDateTime;

public class NotificationDTO {

    private Long id;
    private String message;
    private Long ticketId;
    private String ticketTitle;
    private boolean read;
    private LocalDateTime createdAt;

    public NotificationDTO() {}

    public NotificationDTO(Long id, String message, Long ticketId, String ticketTitle, boolean read, LocalDateTime createdAt) {
        this.id = id;
        this.message = message;
        this.ticketId = ticketId;
        this.ticketTitle = ticketTitle;
        this.read = read;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Long getTicketId() { return ticketId; }
    public void setTicketId(Long ticketId) { this.ticketId = ticketId; }
    public String getTicketTitle() { return ticketTitle; }
    public void setTicketTitle(String ticketTitle) { this.ticketTitle = ticketTitle; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
