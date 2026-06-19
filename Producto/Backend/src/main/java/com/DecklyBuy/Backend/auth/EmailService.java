package com.DecklyBuy.Backend.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    private boolean send(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            return true;
        } catch (Exception e) {
            logger.error("Error al enviar correo a {}: {}", to, e.getMessage());
            return false;
        }
    }

    // Método para enviar códigos de verificación
    public boolean sendVerificationCode(String to, String code) {
        return send(to, "Código de verificación", "Tu código de verificación es: " + code);
    }

    // Método genérico para enviar cualquier correo
    public boolean sendEmail(String to, String subject, String body) {
        return send(to, subject, body);
    }
}
