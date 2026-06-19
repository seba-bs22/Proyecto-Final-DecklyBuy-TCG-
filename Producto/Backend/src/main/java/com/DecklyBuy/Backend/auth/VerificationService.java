package com.DecklyBuy.Backend.auth;

import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Servicio para manejar códigos de verificación temporales.
 * Incluye expiración automática para mayor seguridad.
 */
@Service
public class VerificationService {

    // Estructura para guardar código y fecha de expiración
    private static class CodeEntry {
        private final String code;
        private final OffsetDateTime expiry;

        public CodeEntry(String code, OffsetDateTime expiry) {
            this.code = code;
            this.expiry = expiry;
        }

        public String getCode() { return code; }
        public OffsetDateTime getExpiry() { return expiry; }
    }

    // ConcurrentHashMap para seguridad en entornos multi-hilo
    private final Map<String, CodeEntry> codes = new ConcurrentHashMap<>();

    /**
     * Guarda un código de verificación con expiración de 5 minutos.
     */
    public void saveCode(String email, String code) {
        OffsetDateTime expiry = OffsetDateTime.now().plusMinutes(5);
        codes.put(email, new CodeEntry(code, expiry));
    }

    /**
     * Verifica si el código es válido y no ha expirado.
     */
    public boolean checkCode(String email, String code) {
        CodeEntry entry = codes.get(email);
        if (entry == null) return false;

        if (OffsetDateTime.now().isAfter(entry.getExpiry())) {
            codes.remove(email); // limpiar código expirado
            return false;
        }

        return entry.getCode().equals(code);
    }
}
