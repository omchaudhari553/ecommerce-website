package com.springboot.controller;

import com.springboot.dto.ChatbotRequest;
import com.springboot.dto.ChatbotResponse;
import com.springboot.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
@ConditionalOnExpression("!'${openai.api.key:}'.trim().isEmpty()")
public class ChatbotController {
    
    @Autowired
    private ChatbotService chatbotService;
    
    @PostMapping
    public ResponseEntity<ChatbotResponse> chat(@Valid @RequestBody ChatbotRequest request) {
        ChatbotResponse response = chatbotService.getChatbotResponse(request);
        return ResponseEntity.ok(response);
    }
}
