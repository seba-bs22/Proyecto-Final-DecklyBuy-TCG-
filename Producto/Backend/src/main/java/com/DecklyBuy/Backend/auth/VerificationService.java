package com.DecklyBuy.Backend.auth;

import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VerificationService {

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

    private final Map<String, CodeEntry> codes = new ConcurrentHashMap<>();

    public void saveCode(String email, String code) {
        OffsetDateTime expiry = OffsetDateTime.now().plusMinutes(5);
        codes.put(email, new CodeEntry(code, expiry));
    }

    public boolean checkCode(String email, String code) {
        CodeEntry entry = codes.get(email);
        if (entry == null) return false;

        if (OffsetDateTime.now().isAfter(entry.getExpiry())) {
            codes.remove(email);
            return false;
        }

        return entry.getCode().equals(code);
    }
}