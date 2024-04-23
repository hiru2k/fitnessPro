package com.example.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.model.FitnessPlan;

public interface FitnessPlanRepo extends MongoRepository<FitnessPlan, String> {
}