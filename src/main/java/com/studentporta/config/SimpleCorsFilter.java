package com.studentporta.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(1)
public class SimpleCorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        
        String origin = request.getHeader("Origin");
        String method = request.getMethod();
        
        // Log the request for debugging
        System.out.println("CORS Filter: " + method + " request from origin: " + origin + " to: " + request.getRequestURI());
        
        // Set CORS headers for all responses
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
        response.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization, X-Requested-With");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Max-Age", "3600");
        
        // Handle OPTIONS preflight requests
        if ("OPTIONS".equalsIgnoreCase(method)) {
            System.out.println("CORS Filter: Handling OPTIONS preflight request");
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().flush();
            return;
        }
        
        // Continue with the request
        chain.doFilter(req, res);
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("CORS Filter initialized");
    }

    @Override
    public void destroy() {
        System.out.println("CORS Filter destroyed");
    }
} 