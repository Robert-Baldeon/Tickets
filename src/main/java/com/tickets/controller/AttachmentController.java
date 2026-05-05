package com.tickets.controller;

import com.tickets.dto.AttachmentResponse;
import com.tickets.service.AttachmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/tickets/{ticketId}/attachments")
public class AttachmentController {

    private final AttachmentService attachmentService;

    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @GetMapping
    public ResponseEntity<List<AttachmentResponse>> getAttachments(@PathVariable Long ticketId) {
        return ResponseEntity.ok(attachmentService.getByTicketId(ticketId));
    }

    @PostMapping
    public ResponseEntity<AttachmentResponse> uploadAttachment(
            @PathVariable Long ticketId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) throws IOException {
        String userEmail = authentication.getName();
        AttachmentResponse uploaded = attachmentService.uploadFile(ticketId, file, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(uploaded);
    }
}
