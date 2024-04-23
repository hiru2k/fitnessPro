package com.example.backend.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "workout_plans")
public class FitnessPlan {

    @Id
    private String id;

    private String planName;
    private List<Routine> routines;

    public FitnessPlan() {
        this.routines = new ArrayList<>();
    }

    public FitnessPlan(String planName) {
        this.planName = planName;
        this.routines = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public List<Routine> getRoutines() {
        return routines;
    }

    public void setRoutines(List<Routine> routines) {
        this.routines = routines;
    }

    public void addRoutine(Routine routine) {
        routines.add(routine);
    }
}
