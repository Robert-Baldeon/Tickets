package com.tickets.controller;

import com.tickets.dto.NotificationDTO;
import com.tickets.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getMyNotifications(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(notificationService.getByUserEmail(email));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(notificationService.getUnreadCount(email));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        notificationService.markAsRead(id, email);
        return ResponseEntity.ok().build();
    }
}
