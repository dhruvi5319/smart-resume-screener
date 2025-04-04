package com.dhruvi.backend.service;

import com.dhruvi.backend.dto.MatchRequest;
import com.dhruvi.backend.dto.MatchResponse;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MatchService {
    private final RestTemplate restTemplate = new RestTemplate();

    public MatchResponse callAiService(MatchRequest request) {
        String aiUrl = "http://localhost:5000/api/match";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<MatchRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<MatchResponse> response = restTemplate.postForEntity(
                aiUrl, entity, MatchResponse.class
        );

        return response.getBody();
    }
}