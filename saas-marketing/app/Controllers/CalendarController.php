<?php
namespace App\Controllers;

use App\Services\AIHybridService;

class CalendarController {
    public function suggestions(): void {
        $industry = $_GET['industry'] ?? 'gastronomia';
        $ai = new AIHybridService();

        $data = [
            ['day_offset' => 0, 'type' => 'educativo', 'idea' => $ai->generateIdea($industry, 'educativo')],
            ['day_offset' => 1, 'type' => 'ventas', 'idea' => $ai->generateIdea($industry, 'ventas')],
            ['day_offset' => 2, 'type' => 'emocional', 'idea' => $ai->generateIdea($industry, 'emocional')],
        ];

        header('Content-Type: application/json');
        echo json_encode(['suggestions' => $data]);
    }
}
