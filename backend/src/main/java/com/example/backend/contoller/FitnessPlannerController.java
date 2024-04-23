package com.example.backend.contoller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.FitnessPlan;
import com.example.backend.repository.FitnessPlanRepo;

import jakarta.servlet.http.HttpServletResponse;
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

}
