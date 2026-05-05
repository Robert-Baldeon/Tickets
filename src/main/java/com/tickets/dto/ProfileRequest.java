package com.tickets.dto;

import jakarta.validation.constraints.NotBlank;

public class ProfileRequest {

    @NotBlank
    private String name;

    public ProfileRequest() {}

    public ProfileRequest(String name) {
        this.name = name;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
