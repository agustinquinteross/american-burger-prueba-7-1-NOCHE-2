<?php
namespace App\Controllers;

use App\Core\Response;
use App\Services\AIHybridService;

class CalendarController {
    public function suggestions(int $tenantId): void {
        $industry = $_GET['industry'] ?? 'gastronomia';
        $ai = new AIHybridService();

        $data = [
            ['date' => date('Y-m-d'), 'type' => 'educativo', 'idea' => $ai->generateIdea($industry, 'educativo')],
            ['date' => date('Y-m-d', strtotime('+1 day')), 'type' => 'ventas', 'idea' => $ai->generateIdea($industry, 'ventas')],
            ['date' => date('Y-m-d', strtotime('+2 day')), 'type' => 'emocional', 'idea' => $ai->generateIdea($industry, 'emocional')],
        ];

        Response::json(['tenant_id' => $tenantId, 'suggestions' => $data]);
    }
}
