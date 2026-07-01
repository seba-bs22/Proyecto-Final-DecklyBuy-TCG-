package com.DecklyBuy.Backend.ia;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ia")
public class IaController {

    private final RestTemplate restTemplate;

    @Value("${ia.service.url}")
    private String iaServiceUrl;

    public IaController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping(value = "/detect-score", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<IaResponse> detectScore(@RequestPart("file") MultipartFile file) {
        try {
            String iaUrl = iaServiceUrl + "/api/ia/detect-score";

            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileResource);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<IaResponse> response = restTemplate.postForEntity(
                    iaUrl,
                    requestEntity,
                    IaResponse.class
            );

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            IaResponse errorResponse = new IaResponse();
            errorResponse.setValid(false);
            errorResponse.setEstado("Error");
            errorResponse.setScore(0.0);
            errorResponse.setConfidence("0%");
            errorResponse.setMensaje("Error al conectar con el servicio de IA: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}