package com.dhruvi.backend.controller;

import com.dhruvi.backend.dto.AIAnalysisResponse;
import com.dhruvi.backend.dto.MatchRequest;
import com.dhruvi.backend.dto.MatchResponse;
import com.dhruvi.backend.service.AIService;
import com.dhruvi.backend.service.MatchService;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private MatchService matchService;
    @Autowired
    private AIService aiService;

    @PostMapping("/match")
    public ResponseEntity<MatchResponse> match(@RequestBody MatchRequest request) {
        return ResponseEntity.ok(matchService.callAiService(request));
    }

    @PostMapping("/analyze-file")
    public AIAnalysisResponse analyzeFile(
            @RequestParam("resumeFile") MultipartFile resumeFile,
            @RequestParam("jobDescription") String jobDescription,
            @RequestParam("requiredSkills") String requiredSkills // ✅ include this
    ) throws IOException {
        return aiService.analyze(resumeFile, jobDescription, requiredSkills);
    }
}