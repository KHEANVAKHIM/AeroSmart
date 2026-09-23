package com.aerosmart.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * Configures Spring Boot to serve the built React Single Page Application (SPA)
 * on a single port alongside REST APIs under /api/**.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations(
                        "classpath:/static/",
                        "file:backend/src/main/resources/static/",
                        "file:src/main/resources/static/"
                )
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        // Non-existent static files that do NOT start with api/ route back to index.html for SPA client-side routing
                        if (!resourcePath.startsWith("api") && !resourcePath.startsWith("/api")) {
                            Resource indexRes = location.createRelative("index.html");
                            if (indexRes.exists() && indexRes.isReadable()) {
                                return indexRes;
                            }
                        }
                        return null;
                    }
                });
    }
}
