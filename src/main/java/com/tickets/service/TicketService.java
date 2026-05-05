package com.tickets.service;

import com.tickets.dto.TicketRequest;
import com.tickets.dto.TicketResponse;
import com.tickets.entity.Ticket;
import com.tickets.entity.User;
import com.tickets.repository.TicketRepository;
import com.tickets.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public TicketService(TicketRepository ticketRepository, UserRepository userRepository, NotificationService notificationService) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public Page<TicketResponse> getTickets(String search, String status, String priority, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        String searchParam = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        String statusParam = (status != null && !status.equals("Todos")) ? status : null;
        String priorityParam = (priority != null && !priority.equals("Todas")) ? priority : null;

        return ticketRepository.findByFilters(searchParam, statusParam, priorityParam, pageable)
                .map(this::toResponse);
    }

    public TicketResponse getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + id));
        return toResponse(ticket);
    }

    public TicketResponse createTicket(TicketRequest request, String userEmail, boolean isAdmin) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority() != null ? request.getPriority() : "MEDIA");
        ticket.setStatus("ABIERTO");
        ticket.setCreatedBy(user);

        if (isAdmin && request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            ticket.setAssignedTo(assignedTo);
        }

        Ticket saved = ticketRepository.save(ticket);

        if (isAdmin && ticket.getAssignedTo() != null && !ticket.getAssignedTo().getId().equals(user.getId())) {
            notificationService.notifyUser(
                    ticket.getAssignedTo().getId(),
                    saved,
                    "Se te ha asignado el ticket: " + saved.getTitle()
            );
        }

        return toResponse(saved);
    }

    public TicketResponse updateTicket(Long id, TicketRequest request, String userEmail, boolean isAdmin) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + id));

        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());

        boolean statusChanged = false;
        String oldStatus = ticket.getStatus();

        if (request.getStatus() != null && !request.getStatus().equals(ticket.getStatus())) {
            ticket.setStatus(request.getStatus());
            statusChanged = true;
        }

        if (request.getPriority() != null) {
            ticket.setPriority(request.getPriority());
        }

        User oldAssigned = ticket.getAssignedTo();

        if (isAdmin && request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            ticket.setAssignedTo(assignedTo);

            if (oldAssigned == null || !oldAssigned.getId().equals(assignedTo.getId())) {
                if (!assignedTo.getEmail().equals(userEmail)) {
                    notificationService.notifyUser(
                            assignedTo.getId(),
                            ticket,
                            "Se te ha asignado el ticket: " + ticket.getTitle()
                    );
                }
            }
        }

        Ticket saved = ticketRepository.save(ticket);

        if (statusChanged) {
            User creator = ticket.getCreatedBy();
            if (creator != null && !creator.getEmail().equals(userEmail)) {
                notificationService.notifyUser(
                        creator.getId(),
                        saved,
                        "Tu ticket \"" + saved.getTitle() + "\" ha cambiado de estado de " + oldStatus.replace('_', ' ') + " a " + request.getStatus().replace('_', ' ')
                );
            }
        }

        return toResponse(saved);
    }

    public void deleteTicket(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new RuntimeException("Ticket not found: " + id);
        }
        ticketRepository.deleteById(id);
    }

    private TicketResponse toResponse(Ticket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .title(ticket.getTitle())
                .description(ticket.getDescription())
                .status(ticket.getStatus())
                .priority(ticket.getPriority())
                .createdByEmail(ticket.getCreatedBy() != null ? ticket.getCreatedBy().getEmail() : null)
                .createdByName(ticket.getCreatedBy() != null ? ticket.getCreatedBy().getName() : null)
                .assignedToEmail(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getEmail() : null)
                .assignedToId(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getId() : null)
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }
}
