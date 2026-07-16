package com.triply.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {

	@Bean
	public OpenAPI opneAPI() {

		return new OpenAPI()
				.info(new Info().title("Spring Boot 4 JPA API").description("TRIPLY PROJECT REST API").version("1.0")
						.contact(new Contact().name("HJH").email("admin@test.com")))
				.externalDocs(new ExternalDocumentation().description("API Document"));
	}
}
