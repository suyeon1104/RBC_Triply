package com.triply;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TriplyBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(TriplyBackApplication.class, args);
	}

}
