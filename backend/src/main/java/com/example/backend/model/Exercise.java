package com.example.backend.model;

public class Exercise {
    private String name;
    private int sets;
    private int repetitions;
    private double weight;
    private String note;

    public Exercise(String name, int sets, int repetitions, double weight, String note) {
        this.name = name;
        this.sets = sets;
        this.repetitions = repetitions;
        this.weight = weight;
        this.note = note;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getSets() {
        return sets;
    }

    public void setSets(int sets) {
        this.sets = sets;
    }

    public int getRepetitions() {
        return repetitions;
    }

    public void setRepetitions(int repetitions) {
        this.repetitions = repetitions;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

}
