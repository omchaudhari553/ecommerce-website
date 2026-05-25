package com.springboot.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsFilter implements Filter {

    private static final List<String> ALLOWED_SUFFIXES = Arrays.asList(
            "localhost",
            "127.0.0.1",
            "vercel.app",
            "railway.app",
            "onrender.com",
            "shopping-platform.site",
            "elasticbeanstalk.com"
    );

    @Value("${spring.mvc.cors.allowed-origins:}")
    private String allowedOriginsConfig;

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;

        String origin = request.getHeader("Origin");
        if (origin != null && isAllowedOrigin(origin)) {
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Access-Control-Allow-Credentials", "true");
        }

        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
        response.setHeader("Access-Control-Allow-Headers", "*");
        response.setHeader("Access-Control-Max-Age", "3600");

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        chain.doFilter(req, res);
    }

    private boolean isAllowedOrigin(String origin) {
        if (allowedOriginsConfig != null && !allowedOriginsConfig.isBlank()) {
            for (String allowed : allowedOriginsConfig.split(",")) {
                String trimmed = allowed.trim();
                if (!trimmed.isEmpty() && origin.equalsIgnoreCase(trimmed)) {
                    return true;
                }
            }
        }
        String lower = origin.toLowerCase();
        return ALLOWED_SUFFIXES.stream().anyMatch(lower::contains);
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void destroy() {
    }
}
