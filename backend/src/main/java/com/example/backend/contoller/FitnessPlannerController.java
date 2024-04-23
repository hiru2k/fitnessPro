package com.example.backend.contoller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.FitnessPlan;
import com.example.backend.repository.FitnessPlanRepo;

import springfox.documentation.annotations.ApiIgnore;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class FitnessPlannerController {

    @Autowired
    FitnessPlanRepo repo;

    // when someone req for home page , the req redirect to swagger api
    @ApiIgnore // ignore default apis so we need to create requires apis
    @RequestMapping(value = "/")
    public void redirect(HttpServletResponse response) throws IOException {
        response.sendRedirect("/swagger-ui.html");
    }

    @GetMapping("/wplans")
    @CrossOrigin
    public List<FitnessPlan> getAllWorkoutPlans() {
        return repo.findAll();
    }

    @PostMapping("/wplan")
    @CrossOrigin
    public FitnessPlan addWorkoutPlan(@RequestBody FitnessPlan fitnessPlan) {
        return repo.save(fitnessPlan);
    }

    @DeleteMapping("/wplan/{id}")
    @CrossOrigin
    public void deleteWorkoutPlan(@PathVariable String id) {
        repo.deleteById(id);
    }

    @GetMapping("/wplan/{id}")
    @CrossOrigin
    public ResponseEntity<FitnessPlan> getWorkoutPlanById(@PathVariable String id) {
        FitnessPlan fitnessPlan = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout Plan not found with id: " + id));
        return ResponseEntity.ok(fitnessPlan);
    }

    @PutMapping("/wplan/{id}")
    @CrossOrigin
    public ResponseEntity<FitnessPlan> editWorkoutPlan(@PathVariable String id, @RequestBody FitnessPlan updatedPlan) {
        FitnessPlan existingPlan = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout Plan not found with id: " + id));

        existingPlan.setPlanName(updatedPlan.getPlanName());
        existingPlan.setRoutines(updatedPlan.getRoutines());

        FitnessPlan savedPlan = repo.save(existingPlan);
        return ResponseEntity.ok(savedPlan);
    }
}
