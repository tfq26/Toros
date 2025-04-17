package com.example.pickleballtournament.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.io.IOException;
import java.util.Collections;

@Configuration
@Order(0)      // run before security
public class HeaderDumpFilter implements Filter {
    private static final Logger log = LoggerFactory.getLogger(HeaderDumpFilter.class);

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest r = (HttpServletRequest) req;
        if (r.getRequestURI().startsWith("/api/users/me")) {   // limit noise
            log.debug("─── Incoming headers for {} {}", r.getMethod(), r.getRequestURI());
            Collections.list(r.getHeaderNames())
                    .forEach(name -> log.debug("{}: {}", name, r.getHeader(name)));
        }
        chain.doFilter(req, res);
    }
}
