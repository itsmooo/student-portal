package com.studentporta.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
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
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/test/**").permitAll()
                
                // Admin endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/users/**").hasAnyRole("ADMIN", "FACULTY", "SUPERVISOR")
                
                // Faculty endpoints
                .requestMatchers("/api/projects/approve/**").hasAnyRole("ADMIN", "FACULTY", "SUPERVISOR")
                .requestMatchers("/api/projects/reject/**").hasAnyRole("ADMIN", "FACULTY", "SUPERVISOR")
                .requestMatchers("/api/evaluations/**").hasAnyRole("ADMIN", "FACULTY", "SUPERVISOR", "STUDENT")
                .requestMatchers("/api/feedback/**").hasAnyRole("ADMIN", "FACULTY", "SUPERVISOR")
                
                // Student endpoints
                .requestMatchers("/api/projects/submit/**").hasRole("STUDENT")
                .requestMatchers("/api/progress-updates/**").hasAnyRole("STUDENT", "FACULTY", "SUPERVISOR", "ADMIN")
                .requestMatchers("/api/projects/my/**").hasRole("STUDENT")
                
                // Document endpoints
                .requestMatchers("/api/documents/upload/**").hasAnyRole("ADMIN", "FACULTY", "SUPERVISOR")
                .requestMatchers("/api/documents/supervisor/**").hasAnyRole("ADMIN", "FACULTY", "SUPERVISOR")
                .requestMatchers("/api/documents/student/**").hasAnyRole("STUDENT", "ADMIN", "FACULTY", "SUPERVISOR")
                .requestMatchers("/api/documents/download/**").hasAnyRole("STUDENT", "ADMIN", "FACULTY", "SUPERVISOR")
                .requestMatchers("/api/documents/**").hasAnyRole("ADMIN", "FACULTY", "SUPERVISOR")
                
                // General project endpoints (read access for all authenticated users)
                .requestMatchers("/api/projects/**").authenticated()
                
                // All other requests need authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
