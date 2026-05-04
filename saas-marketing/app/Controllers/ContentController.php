<?php
namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Services\AIHybridService;

class ContentController {
    public function generateCopy(int $tenantId): void {
        $body = Request::json();
        $tone = $body['tone'] ?? 'educativo';
        $topic = $body['topic'] ?? 'Nuevas tendencias de contenido';

        $ai = new AIHybridService();
        $copy = $ai->generateCopy($tone, $topic);

        Response::json(['tenant_id' => $tenantId, 'copy' => $copy]);
    }
}
