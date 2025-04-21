package com.dhruvi.backend.service;

import com.dhruvi.backend.model.Resume;
import com.dhruvi.backend.dto.AIAnalysisResponse;
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
    private final AIService aiService;

    public ResumeService(
            ResumeRepository resumeRepository,
            CandidateRepository candidateRepository,
            AIService aiService
    ) {
        this.resumeRepository = resumeRepository;
        this.candidateRepository = candidateRepository;
        this.aiService = aiService;
    }

    public Resume saveResume(MultipartFile file, JobDescription job) throws Exception {
        AIAnalysisResponse aiResponse = aiService.analyze(file, job.getDescription(), job.getRequiredSkillsCsv());

        Resume resume = Resume.builder()
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .data(file.getBytes())
                .jobDescription(job)
                .build();

        Resume savedResume = resumeRepository.save(resume);

        Candidate candidate = new Candidate();
        candidate.setId("candidate-" + UUID.randomUUID());
        candidate.setName(file.getOriginalFilename());
        candidate.setEmail("unknown@example.com");
        candidate.setPhone("(000) 000-0000");
        candidate.setResumeId(savedResume.getFileName());
        candidate.setJobTitle(job.getTitle());
        candidate.setMatchScore((int) aiResponse.getMatchScore());
        candidate.setSummary(aiResponse.getSummary());
        candidate.setEducation(aiResponse.getEducation());
        candidate.setExperience(aiResponse.getExperience());

        List<Skill> skills = aiResponse.getExtractedSkills().stream()
            .map(s -> new Skill(s.getName(), s.getScore(), s.isMatch()))
            .toList();

        candidate.setSkills(skills);
        candidate.setWeaknesses(List.of("Auto-extracted from AI"));

        candidateRepository.save(candidate);
        return savedResume;
    }
}
