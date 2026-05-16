package com.springboot.service;

import com.springboot.dto.ChatbotRequest;
import com.springboot.dto.ChatbotResponse;
import com.springboot.entity.Product;
import com.springboot.repository.ProductRepository;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatbotService {
    
    @Value("${openai.api.key}")
    private String openaiApiKey;
    
    @Autowired
    private ProductRepository productRepository;
    
    private static final String SYSTEM_PROMPT = """
        You are an AI shopping assistant for an online clothing store (shirts, pants, t-shirts).
        
        You are used in both:
        - Backend (Spring Boot API deployed on AWS)
        - Frontend (React chat UI)
        
        So your response must be compatible for both systems.
        
        CORE GOAL:
        Help users find the best clothing products from the available database.
        
        RULES:
        1. Always use only available product data from backend.
        2. Do not invent or assume products.
        3. Suggest maximum 3 products only.
        4. Keep responses short and structured.
        5. Do not use HTML, JSON, or markdown tables.
        6. Do not give long paragraphs.
        7. Make responses easy to display in chat UI (frontend friendly).
        
        RESPONSE FORMAT (IMPORTANT):
        - Each product must be on a new line
        - Include: Product Name - Price - Color - Short Reason
        - Keep spacing clean for chat UI
        
        EXAMPLE FORMAT:
        Product Name - ₹Price - Color - Reason
        Product Name - ₹Price - Color - Reason
        
        BEHAVIOR:
        - Act like a personal fashion assistant.
        - Help users choose outfits for office, casual, gym, party, summer wear.
        - Ask follow-up questions if needed (budget, size, color, style).
        - If no matching product found, politely ask for more details.
        """;
    
    public ChatbotResponse getChatbotResponse(ChatbotRequest request) {
        List<Product> allProducts = productRepository.findAll();
        String productContext = formatProductsForContext(allProducts);
        
        String fullSystemPrompt = SYSTEM_PROMPT + "\n\nAvailable Products:\n" + productContext;
        
        OpenAiService service = new OpenAiService(openaiApiKey);
        
        List<ChatMessage> messages = new ArrayList<>();
        messages.add(new ChatMessage(ChatMessageRole.SYSTEM.value(), fullSystemPrompt));
        messages.add(new ChatMessage(ChatMessageRole.USER.value(), request.getMessage()));
        
        ChatCompletionRequest chatRequest = ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(messages)
                .maxTokens(500)
                .temperature(0.7)
                .build();
        
        String response = service.createChatCompletion(chatRequest)
                .getChoices()
                .get(0)
                .getMessage()
                .getContent();
        
        return new ChatbotResponse(response);
    }
    
    private String formatProductsForContext(List<Product> products) {
        if (products == null || products.isEmpty()) {
            return "No products available.";
        }
        
        return products.stream()
                .limit(20)
                .map(p -> String.format("- %s (Category: %s, Price: ₹%.2f, Stock: %d, Description: %s)",
                        p.getName(),
                        p.getCategory(),
                        p.getPrice(),
                        p.getStockQuantity(),
                        p.getDescription() != null ? p.getDescription() : "N/A"))
                .collect(Collectors.joining("\n"));
    }
}
