package com.dhruvi.backend.service;

import com.dhruvi.backend.dto.AIAnalysisResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class AIService {

    // @Value("${ai.model.url:http://localhost:8000}")
    @Value("${ai.model.url:smart-resume-screener-production.up.railway.app}")
    private String aiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public AIAnalysisResponse analyze(MultipartFile resumeFile, String jobDescriptionText, String requiredSkillsCsv) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("resume_file", new MultipartInputStreamFileResource(resumeFile.getInputStream(), resumeFile.getOriginalFilename()));
        body.add("job_description", jobDescriptionText);
        body.add("required_skills", requiredSkillsCsv); // ✅ Add this

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<AIAnalysisResponse> response = restTemplate.postForEntity(
                aiUrl + "/analyze-file",
                requestEntity,
                AIAnalysisResponse.class
        );

        return response.getBody();
    }
}
