package com.tickets.service;

import com.tickets.dto.DashboardStats;
import com.tickets.entity.User;
import com.tickets.repository.TicketRepository;
import com.tickets.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public DashboardService(TicketRepository ticketRepository, UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public DashboardStats getStats() {
        long total = ticketRepository.count();
        long open = ticketRepository.countByStatus("ABIERTO");
        long inProgress = ticketRepository.countByStatus("EN_PROGRESO");
        long closed = ticketRepository.countByStatus("CERRADO");
        long high = ticketRepository.countByPriority("ALTA");
        long medium = ticketRepository.countByPriority("MEDIA");
        long low = ticketRepository.countByPriority("BAJA");

        Map<Long, User> userMap = userRepository.findAll().stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        List<DashboardStats.TechnicianStats> technicianStats = ticketRepository.countByAssignedUser().stream()
                .map(row -> {
                    Long userId = (Long) row[0];
                    long count = (long) row[1];
                    User user = userMap.get(userId);
                    return new DashboardStats.TechnicianStats(
                            userId,
                            user != null ? user.getName() : "Desconocido",
                            user != null ? user.getEmail() : "",
                            count
                    );
                })
                .collect(Collectors.toList());

        if (technicianStats == null) {
            technicianStats = List.of();
        }

        return new DashboardStats(total, open, inProgress, closed, high, medium, low, technicianStats);
    }
}
