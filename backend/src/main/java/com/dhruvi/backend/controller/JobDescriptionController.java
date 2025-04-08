package com.dhruvi.backend.controller;

import com.dhruvi.backend.dto.JobDescriptionRequest;
import com.dhruvi.backend.model.JobDescription;
import com.dhruvi.backend.repository.JobDescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/job-descriptions")
@CrossOrigin(origins = "*")
public class JobDescriptionController {

    @Autowired
    private JobDescriptionRepository repository;
   
    @PostMapping
    public JobDescription createJob(@RequestBody JobDescriptionRequest request) {
        JobDescription job = JobDescription.builder()
                .title(request.getTitle())
                .department(request.getDepartment())
                .location(request.getLocation())
                .requiredSkills(request.getRequiredSkills())
                .description(request.getDescription())
                .createdAt(LocalDateTime.now())
                .build();
        return repository.save(job);
    }

    @GetMapping
    public List<JobDescription> getAllJobs() {
        return repository.findAll();
    }
}
