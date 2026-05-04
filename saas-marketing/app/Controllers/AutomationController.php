<?php
namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Services\AutomationService;

class AutomationController {
    public function autopilot(int $tenantId): void {
        $body = Request::json();
        $projectId = (int)($body['project_id'] ?? 0);
        $industry = $body['industry'] ?? 'gastronomia';

        if ($projectId <= 0) {
            Response::json(['error' => 'project_id requerido'], 422);
            return;
        }

        $automation = new AutomationService();
        $plan = $automation->buildWeekPlan($tenantId, $projectId, $industry);
        $created = $automation->persistDrafts($tenantId, $projectId, $plan);

        Response::json(['created_drafts' => $created, 'plan' => $plan]);
    }
}
