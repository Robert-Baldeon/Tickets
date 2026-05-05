package com.tickets.service;

import com.tickets.dto.CommentRequest;
import com.tickets.dto.CommentResponse;
import com.tickets.entity.Comment;
import com.tickets.entity.Ticket;
import com.tickets.entity.User;
import com.tickets.repository.CommentRepository;
import com.tickets.repository.TicketRepository;
import com.tickets.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public CommentService(CommentRepository commentRepository, TicketRepository ticketRepository, UserRepository userRepository, NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public List<CommentResponse> getByTicketId(Long ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId).stream()
                .map(this::toResponse)
                .toList();
    }

    public CommentResponse createComment(Long ticketId, CommentRequest request, String userEmail) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketId));

        User author = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setTicket(ticket);
        comment.setAuthor(author);

        Comment saved = commentRepository.save(comment);

        User assignedTo = ticket.getAssignedTo();
        if (assignedTo != null && !assignedTo.getEmail().equals(userEmail)) {
            notificationService.notifyUser(
                    assignedTo.getId(),
                    ticket,
                    "Nuevo comentario en ticket \"" + ticket.getTitle() + "\": " + author.getName()
            );
        }

        User creator = ticket.getCreatedBy();
        if (creator != null && !creator.getEmail().equals(userEmail) && !creator.getId().equals(author.getId())) {
            notificationService.notifyUser(
                    creator.getId(),
                    ticket,
                    "Nuevo comentario en tu ticket \"" + ticket.getTitle() + "\": " + author.getName()
            );
        }

        return toResponse(saved);
    }

    private CommentResponse toResponse(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getAuthor() != null ? comment.getAuthor().getName() : null,
                comment.getAuthor() != null ? comment.getAuthor().getEmail() : null,
                comment.getCreatedAt()
        );
    }
}
