<?php
namespace App\Controllers;

use App\Services\AIHybridService;

class ContentController {
    public function generateCopy(): void {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $tone = $body['tone'] ?? 'educativo';
        $topic = $body['topic'] ?? 'Nuevas tendencias de contenido';

        $ai = new AIHybridService();
        $copy = $ai->generateCopy($tone, $topic);

        header('Content-Type: application/json');
        echo json_encode(['copy' => $copy]);
    }
}
