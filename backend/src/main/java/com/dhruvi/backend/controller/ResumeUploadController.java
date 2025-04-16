package com.dhruvi.backend.controller;

import com.dhruvi.backend.dto.AIAnalysisResponse;
import com.dhruvi.backend.model.Candidate;
import com.dhruvi.backend.model.JobDescription;
import com.dhruvi.backend.model.Resume;
import com.dhruvi.backend.model.Skill;
import com.dhruvi.backend.model.User;
import com.dhruvi.backend.repository.CandidateRepository;
import com.dhruvi.backend.repository.JobDescriptionRepository;
import com.dhruvi.backend.repository.ResumeRepository;
import com.dhruvi.backend.service.AIService;
import com.dhruvi.backend.service.ResumeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "*")
public class ResumeUploadController {

    private static final Logger logger = LoggerFactory.getLogger(ResumeUploadController.class);

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private JobDescriptionRepository jobDescriptionRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private AIService aiService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("jobDescriptionId") Long jobDescriptionId,
            Authentication authentication) {

        logger.info("📥 Resume upload requested");
        logger.info("📄 File: {}", file.getOriginalFilename());
        logger.info("🆔 Job Description ID: {}", jobDescriptionId);

        try {
            // ✅ Get authenticated User from the SecurityContext
            User user = (User) authentication.getPrincipal();
            logger.info("✅ Authenticated user: {}", user.getEmail());

            JobDescription job = jobDescriptionRepository.findById(jobDescriptionId)
                    .orElseThrow(() -> new RuntimeException("Job not found with ID: " + jobDescriptionId));

            String jobDescriptionText = job.getDescription();
            String requiredSkillsCsv = String.join(", ", job.getRequiredSkills());

            Resume savedResume = resumeService.saveResume(file, job);

            AIAnalysisResponse aiResponse = aiService.analyze(file, jobDescriptionText, requiredSkillsCsv);
            logger.info("AI Response: {}", aiResponse);

            Candidate candidate = new Candidate();
            candidate.setId("candidate-" + UUID.randomUUID());
            candidate.setName(file.getOriginalFilename());
            candidate.setEmail("unknown@example.com");
            candidate.setPhone("(000) 000-0000");
            candidate.setResumeId(savedResume.getFileName());
            candidate.setJobTitle(job.getTitle());
            candidate.setMatchScore((int) Math.round(aiResponse.getMatchScore()));
            candidate.setEducation(aiResponse.getEducation());
            candidate.setExperience(aiResponse.getExperience());
            candidate.setSummary(aiResponse.getSummary());
            candidate.setUploadedBy(user); // ✅ Authenticated user

            List<Skill> skills = aiResponse.getExtractedSkills().stream()
                    .map(s -> new Skill(s.getName(), s.getScore(), s.isMatch()))
                    .collect(Collectors.toList());
            candidate.setSkills(skills);

            logger.info("Final candidate object: {}", candidate);
            candidateRepository.save(candidate);
            logger.info("✅ Candidate saved: {}", candidate.getName());

            return ResponseEntity.ok(candidate);
        } catch (Exception e) {
            logger.error("❌ Error during resume upload", e);
            return ResponseEntity.status(500).body("Failed to upload resume: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Resume>> getAllResumes() {
        List<Resume> resumes = resumeRepository.findAll();
        return ResponseEntity.ok(resumes);
    }

    @GetMapping("/candidate")
    public ResponseEntity<List<Candidate>> getAllCandidates() {
        return ResponseEntity.ok(candidateRepository.findAll());
    }

    @GetMapping("/candidates")
    public ResponseEntity<List<Candidate>> getCandidatesForLoggedInUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal(); // ✅ Directly cast to User
        logger.info("✅ User present: {}", user.getEmail());
        List<Candidate> userCandidates = candidateRepository.findByUploadedBy(user);
        return ResponseEntity.ok(userCandidates);
    }
}
