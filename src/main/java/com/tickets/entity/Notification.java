package com.tickets.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;

    @Column(nullable = false, length = 500)
    private String message;

    @Column(nullable = false)
    private boolean read;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Notification() {}

    public Notification(Long id, User user, Ticket ticket, String message, boolean read) {
        this.id = id;
        this.user = user;
        this.ticket = ticket;
        this.message = message;
        this.read = read;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        this.read = false;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Ticket getTicket() { return ticket; }
    public void setTicket(Ticket ticket) { this.ticket = ticket; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
