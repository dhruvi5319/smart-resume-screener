package com.dhruvi.backend.service;

import com.dhruvi.backend.model.Resume;
import com.dhruvi.backend.model.Candidate;
import com.dhruvi.backend.model.Skill;
import com.dhruvi.backend.model.JobDescription;
import com.dhruvi.backend.repository.ResumeRepository;
import com.dhruvi.backend.repository.CandidateRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class ResumeService {

    private static final Logger logger = LoggerFactory.getLogger(ResumeService.class);

    private final ResumeRepository resumeRepository;
    private final CandidateRepository candidateRepository;

    public ResumeService(
            ResumeRepository resumeRepository,
            CandidateRepository candidateRepository
    ) {
        this.resumeRepository = resumeRepository;
        this.candidateRepository = candidateRepository;
    }

    // ✅ Now takes JobDescription object instead of plain text
    public Resume saveResume(MultipartFile file, JobDescription job) throws Exception {
        Resume resume = Resume.builder()
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .data(file.getBytes())
                .jobDescription(job) // 🔁 store reference to job
                .build();

        Resume savedResume = resumeRepository.save(resume);
        logger.info("✅ Saved resume file: {}", savedResume.getFileName());

        // Create placeholder Candidate
        Candidate candidate = new Candidate();
        candidate.setId("candidate-" + UUID.randomUUID());
        candidate.setName(file.getOriginalFilename());
        candidate.setEmail("unknown@example.com");
        candidate.setPhone("(000) 000-0000");
        candidate.setResumeId(savedResume.getFileName());
        candidate.setJobTitle(job.getTitle());
        candidate.setMatchScore((int)(Math.random() * 40 + 60)); // random score for placeholder
        candidate.setEducation("Pending AI analysis");

        candidate.setSkills(List.of(
                new Skill("Java", 80, true),
                new Skill("Spring Boot", 75, true),
                new Skill("SQL", 70, false)
        ));
        

        candidate.setExperience(List.of("Experience pending AI parsing"));
        candidate.setWeaknesses(List.of("None detected"));

        candidateRepository.save(candidate);
        logger.info("✅ Created candidate entry for: {}", candidate.getName());

        return savedResume;
    }
}
