package com.dhruvi.backend.controller;

import com.dhruvi.backend.dto.MatchRequest;
import com.dhruvi.backend.dto.MatchResponse;
import com.dhruvi.backend.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private MatchService matchService;

    @PostMapping("/match")
    public ResponseEntity<MatchResponse> match(@RequestBody MatchRequest request) {
        return ResponseEntity.ok(matchService.callAiService(request));
    }
}