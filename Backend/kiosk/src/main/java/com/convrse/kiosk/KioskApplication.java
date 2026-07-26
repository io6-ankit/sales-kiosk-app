package com.convrse.kiosk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

@SpringBootApplication
public class KioskApplication {

    public static void main(String[] args) {
        SpringApplication.run(KioskApplication.class, args);
    }

    @Bean
    public MongoClient mongoClient() {

        String atlasUri = System.getenv("MONGO_URI");

        return MongoClients.create(atlasUri);
    }
}