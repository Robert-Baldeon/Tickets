package com.tickets.repository;

import com.tickets.entity.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    long countByStatus(String status);
    long countByPriority(String priority);

    @Query("SELECT t FROM Ticket t WHERE (:search IS NULL OR :search = '' OR CAST(t.id AS STRING) LIKE CONCAT('%', :search, '%') OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%'))) AND (:status IS NULL OR t.status = :status) AND (:priority IS NULL OR t.priority = :priority) ORDER BY t.createdAt DESC")
    Page<Ticket> findByFilters(@Param("search") String search, @Param("status") String status, @Param("priority") String priority, Pageable pageable);

    @Query("SELECT t.assignedTo.id, COUNT(t) FROM Ticket t WHERE t.assignedTo IS NOT NULL GROUP BY t.assignedTo.id ORDER BY COUNT(t) DESC")
    List<Object[]> countByAssignedUser();
}
