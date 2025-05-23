package com.dhruvi.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String fileType;
    
    @Column(name = "job_description_text")
    private String jobDescriptionText;


    @Lob
    private byte[] data;

    @ManyToOne
    private JobDescription jobDescription;
}