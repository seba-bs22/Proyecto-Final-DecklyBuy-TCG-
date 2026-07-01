package com.DecklyBuy.Backend.controller;

import com.DecklyBuy.Backend.mercadopago.MercadoPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/mercadopago")
public class MercadoPagoController {

    @Autowired
    private MercadoPagoService mpService;

    @PostMapping("/crear-preferencia")
        public ResponseEntity<Map<String, String>> crearPreferencia(@RequestBody Map<String, Object> payload) {
            // Leemos el valor de forma segura transformándolo a un String y luego a Double
            Double total = Double.parseDouble(payload.get("total").toString());
            
            String urlPago = mpService.crearOrdenDePago(total);

            Map<String, String> response = new HashMap<>();
            response.put("url", urlPago);

            return ResponseEntity.ok(response);
        }
}