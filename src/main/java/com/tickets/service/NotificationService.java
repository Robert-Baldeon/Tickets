package com.tickets.service;

import com.tickets.dto.NotificationDTO;
import com.tickets.entity.Notification;
import com.tickets.entity.Ticket;
import com.tickets.entity.User;
import com.tickets.repository.NotificationRepository;
import com.tickets.repository.TicketRepository;
import com.tickets.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository,
                               TicketRepository ticketRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
    }

    public void notifyUser(Long userId, Ticket ticket, String message) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTicket(ticket);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }

    public List<NotificationDTO> getByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toDTO)
                .toList();
    }

    public void markAsRead(Long notificationId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Notification does not belong to user");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public long getUnreadCount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.countByUserIdAndReadFalse(user.getId());
    }

    private NotificationDTO toDTO(Notification notification) {
        Ticket ticket = notification.getTicket();
        Long ticketId = ticket != null ? ticket.getId() : null;
        String ticketTitle = ticket != null ? ticket.getTitle() : null;

        return new NotificationDTO(
                notification.getId(),
                notification.getMessage(),
                ticketId,
                ticketTitle,
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
