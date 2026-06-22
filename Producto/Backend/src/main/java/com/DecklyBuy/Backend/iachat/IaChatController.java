package com.DecklyBuy.Backend.iachat;

import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "https://localhost:5173", allowCredentials = "true")
public class IaChatController {

    private final OllamaChatModel chatModel;

    @Autowired
    public IaChatController(OllamaChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @PostMapping("/chat")
    public ResponseEntity<?> handleTcgChat(@RequestBody Map<String, String> requestBody) {
        String userPrompt = requestBody.get("message");

        if (userPrompt == null || userPrompt.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El mensaje no puede estar vacio"));
        }

        // Instrucciones del sistema para restringir las respuestas al ambito de TCG
        String sistemaInstrucciones = "Actuas como un experto mundial en cartas coleccionables de Pokemon TCG. "
                + "Tu objetivo es asesorar al usuario sobre la originalidad de sus cartas, analisis de sets, numeraciones y rarezas. "
                + "Se cordial pero directo. Si el usuario te pregunta sobre programacion, cocina, historia o cualquier tema ajeno a las "
                + "cartas coleccionables de Pokemon o TCG, debes responder estrictamente: 'Lo siento, solo estoy programado para resolver dudas especializadas en TCG y Pokemon.'";

        SystemMessage systemMessage = new SystemMessage(sistemaInstrucciones);
        UserMessage userMessage = new UserMessage(userPrompt);

        Prompt prompt = new Prompt(List.of(systemMessage, userMessage));
        
        try {
            String aiResponse = chatModel.call(prompt).getResult().getOutput().getContent();
            return ResponseEntity.ok(Map.of("response", aiResponse));
        } catch (Exception e) {
            System.err.println("Error llamando a Ollama: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("response", "Error al procesar el modelo de IA. Asegurate de que Ollama este abierto."));
        }
    }
}