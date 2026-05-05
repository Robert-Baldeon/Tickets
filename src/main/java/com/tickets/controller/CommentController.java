package com.tickets.controller;

import com.tickets.dto.CommentRequest;
import com.tickets.dto.CommentResponse;
import com.tickets.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets/{ticketId}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long ticketId) {
        return ResponseEntity.ok(commentService.getByTicketId(ticketId));
    }

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long ticketId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        CommentResponse created = commentService.createComment(ticketId, request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
