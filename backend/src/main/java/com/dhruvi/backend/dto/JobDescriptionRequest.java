package com.dhruvi.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class JobDescriptionRequest {
    private String title;
    private String department;
    private String location;
    private List<String> requiredSkills;
    private String description;
}