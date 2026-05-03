package com.gui.dashboard.controller;

import org.springframework.web.bind.annotation.GetMapping;

import com.gui.dashboard.dto.DashboardResponse;
import com.gui.dashboard.service.DashboardService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/team-overview")
    public DashboardResponse getTeamOverview() {
        return dashboardService.getDashboard();
    }
}
