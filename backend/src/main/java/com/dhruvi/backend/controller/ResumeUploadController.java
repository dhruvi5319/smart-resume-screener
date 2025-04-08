package com.dhruvi.backend.controller;

import com.dhruvi.backend.model.Candidate;
import com.dhruvi.backend.model.Resume;
import com.dhruvi.backend.repository.ResumeRepository;
import com.dhruvi.backend.service.ResumeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "*")
public class ResumeUploadController {

    private static final Logger logger = LoggerFactory.getLogger(ResumeUploadController.class);

    @Autowired
    private ResumeService resumeService;
    @Autowired
    private ResumeRepository resumeRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("jobDescriptionId") Long jobDescriptionId) {

        logger.info("📥 Resume upload requested");
        logger.info("📄 File: {}", file.getOriginalFilename());
        logger.info("📝 Job ID: {}", jobDescriptionId);

        try {
            // Save the resume file
            Resume savedResume = resumeService.saveResume(file, jobDescriptionId);
            logger.info("✅ Resume saved with ID: {}", savedResume.getId());

            // 🔧 Mock a Candidate object as if processed by AI
            Candidate candidate = new Candidate();
            candidate.setId("candidate-" + savedResume.getId());
            candidate.setName(file.getOriginalFilename());
            candidate.setEmail("ai@example.com");
            candidate.setPhone("(555) 123-4567");
            candidate.setJobTitle("To Be Predicted");
            candidate.setMatchScore(70);
            candidate.setResumeId(savedResume.getFileName());
            candidate.setEducation("Pending AI Analysis");
            candidate.setExperience(List.of("Uploaded via ResumeUploader"));
            candidate.setStrengths(List.of("Hardworking", "Adaptable"));
            candidate.setWeaknesses(List.of("Not parsed yet"));
            candidate.setSkills(List.of());

            logger.info("📤 Returning mock candidate: {}", candidate.getName());
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

}
