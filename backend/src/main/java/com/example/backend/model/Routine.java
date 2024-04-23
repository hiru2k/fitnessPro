package com.example.backend.model;

import java.util.ArrayList;
import java.util.List;

public class Routine {
    private String name;
    private List<Exercise> exercises;

    public Routine() {
        this.exercises = new ArrayList<>();
    }

    public Routine(String name) {
        this.name = name;
        this.exercises = new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Exercise> getExercises() {
        return exercises;
    }

    public void setExercises(List<Exercise> exercises) {
        this.exercises = exercises;
    }

    public void addExercise(Exercise exercise) {
        exercises.add(exercise);
    }

}
