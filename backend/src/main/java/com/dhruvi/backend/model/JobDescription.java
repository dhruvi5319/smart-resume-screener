package com.dhruvi.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String department;
    private String location;

    @ElementCollection
    private List<String> requiredSkills;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime createdAt;
}
