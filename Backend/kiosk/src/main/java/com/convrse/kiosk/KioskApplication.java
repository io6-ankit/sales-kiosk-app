package com.convrse.kiosk;

import com.convrse.kiosk.model.Tower;
import com.convrse.kiosk.model.Unit;
import com.convrse.kiosk.repository.TowerRepository;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class KioskApplication {

    public static void main(String[] args) {
        SpringApplication.run(KioskApplication.class, args);
    }


    @Bean
    public MongoClient mongoClient() {
        // यह सिस्टम से MONGO_URI की वैल्यू उठाएगा
String atlasUri=System.getenv("MONGO_URI");
//        String atlasUri = "mongodb+srv://mauryaankit993535_db_user:Ankit9935@cluster0.8m7b35j.mongodb.net/?appName=Cluster0";
        return MongoClients.create(atlasUri);
    }
}