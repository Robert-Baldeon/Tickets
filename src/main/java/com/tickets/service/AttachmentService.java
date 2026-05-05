package com.tickets.service;

import com.tickets.dto.AttachmentResponse;
import com.tickets.entity.Attachment;
import com.tickets.entity.Ticket;
import com.tickets.entity.User;
import com.tickets.repository.AttachmentRepository;
import com.tickets.repository.TicketRepository;
import com.tickets.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    @Value("${app.upload-dir:./uploads}")
    private String uploadDir;

    public AttachmentService(AttachmentRepository attachmentRepository, TicketRepository ticketRepository, UserRepository userRepository) {
        this.attachmentRepository = attachmentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public List<AttachmentResponse> getByTicketId(Long ticketId) {
        return attachmentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId).stream()
                .map(this::toResponse)
                .toList();
    }

    public AttachmentResponse uploadFile(Long ticketId, MultipartFile file, String userEmail) throws IOException {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Path dir = Paths.get(uploadDir);
        if (!Files.exists(dir)) {
            Files.createDirectories(dir);
        }

        String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        String extension = "";
        int dotIndex = originalName.lastIndexOf('.');
        if (dotIndex >= 0) {
            extension = originalName.substring(dotIndex);
        }
        String storedName = UUID.randomUUID().toString() + extension;
        Path filePath = dir.resolve(storedName);

        Files.copy(file.getInputStream(), filePath);

        Attachment attachment = new Attachment();
        attachment.setFileName(originalName);
        attachment.setFilePath(filePath.toString());
        attachment.setContentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream");
        attachment.setFileSize(file.getSize());
        attachment.setTicket(ticket);
        attachment.setUploadedBy(user);

        return toResponse(attachmentRepository.save(attachment));
    }

    private AttachmentResponse toResponse(Attachment attachment) {
        return new AttachmentResponse(
                attachment.getId(),
                attachment.getFileName(),
                attachment.getContentType(),
                attachment.getFileSize(),
                attachment.getUploadedBy() != null ? attachment.getUploadedBy().getName() : null,
                attachment.getCreatedAt()
        );
    }
}
