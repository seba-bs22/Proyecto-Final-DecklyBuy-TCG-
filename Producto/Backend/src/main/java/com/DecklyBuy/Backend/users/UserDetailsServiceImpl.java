package com.DecklyBuy.Backend.users;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .map(user -> org.springframework.security.core.userdetails.User
                        .withUsername(user.getEmail())
                        .password(user.getPasswordHash() != null ? user.getPasswordHash() : "{noop}")
                        .roles(user.getRol() != null ? user.getRol() : "USER")
                        .accountLocked("LOCKED".equals(user.getEstadoCuenta()))
                        .disabled("DISABLED".equals(user.getEstadoCuenta()))
                        .build()
                )
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
    }
}