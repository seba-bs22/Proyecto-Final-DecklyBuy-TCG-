package com.DecklyBuy.Backend.auth;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class VerificationService {
    private final Map<String, String> codes = new HashMap<>();

    public void saveCode(String email, String code) {
        codes.put(email, code);
    }

    public boolean checkCode(String email, String code) {
        return code.equals(codes.get(email));
    }
}
