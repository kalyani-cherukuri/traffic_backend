package com.example.traffic_backend.config;

import com.example.traffic_backend.security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()
                        .requestMatchers(
        "/v3/api-docs/**",
        "/swagger-ui/**",
        "/swagger-ui.html"
).permitAll()
                        .requestMatchers("/api/vehicles/my")
                        .hasRole("CITIZEN")

                        .requestMatchers("/api/vehicles/**")
                        .hasAnyRole("ADMIN", "CITIZEN")
                        .requestMatchers("/api/users/**")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/violations")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST,
        "/api/payments")
.hasRole("CITIZEN")

.requestMatchers(HttpMethod.GET,
        "/api/payments")
.hasRole("ADMIN")

.requestMatchers("/api/payments/my")
.hasRole("CITIZEN")
.requestMatchers(HttpMethod.POST,
        "/api/disputes")
.hasRole("CITIZEN")

.requestMatchers(HttpMethod.GET,
        "/api/disputes")
.hasAnyRole("ADMIN", "REVIEW_OFFICER")

.requestMatchers(HttpMethod.PUT,
        "/api/disputes/**")
.hasRole("REVIEW_OFFICER")

                        .requestMatchers(HttpMethod.GET,"/api/violations")
                        .authenticated()

                        .requestMatchers("/api/vehicles/**")
                        .hasAnyRole("ADMIN", "CITIZEN")

                        .requestMatchers("/api/tickets/**")
                        .hasAnyRole(
                                "ADMIN",
                                "TRAFFIC_OFFICER",
                                "CITIZEN"
                        )
                        .requestMatchers(HttpMethod.POST,"/api/tickets")
                        .hasRole("TRAFFIC_OFFICER")

                        .requestMatchers(HttpMethod.GET,"/api/tickets/**")
                        .hasAnyRole("ADMIN","CITIZEN","TRAFFIC_OFFICER")

                        .requestMatchers("/api/payments/**")
                        .hasAnyRole("ADMIN", "CITIZEN")

                        .requestMatchers("/api/disputes/**")
                        .hasAnyRole(
                                "ADMIN",
                                "CITIZEN",
                                "REVIEW_OFFICER"
                        )

                        .anyRequest()
                        .authenticated()
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {

        return config.getAuthenticationManager();
    }
}