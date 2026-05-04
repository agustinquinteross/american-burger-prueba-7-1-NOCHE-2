<?php
namespace App\Services;

use App\Core\Database;

class AutomationService {
    public function buildWeekPlan(int $tenantId, int $projectId, string $industry = 'gastronomia'): array {
        $ai = new AIHybridService();
        $plan = [];
        $slots = [
            ['type' => 'reel', 'pillar' => 'educativo'],
            ['type' => 'post', 'pillar' => 'ventas'],
            ['type' => 'story', 'pillar' => 'emocional'],
            ['type' => 'carousel', 'pillar' => 'educativo'],
        ];

        foreach ($slots as $i => $slot) {
            $plan[] = [
                'day_offset' => $i,
                'type' => $slot['type'],
                'pillar' => $slot['pillar'],
                'title' => $ai->generateIdea($industry, $slot['pillar']),
                'copy' => $ai->generateCopy($slot['pillar'], 'Contenido recomendado por autopiloto'),
            ];
        }

        return $plan;
    }

    public function persistDrafts(int $tenantId, int $projectId, array $plan): int {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('INSERT INTO contents (tenant_id, project_id, type, pillar, title, copy_text, status, scheduled_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        $count = 0;
        foreach ($plan as $item) {
            $scheduled = date('Y-m-d H:i:s', strtotime('+' . $item['day_offset'] . ' day 11:00:00'));
            $stmt->execute([$tenantId, $projectId, $item['type'], $item['pillar'], $item['title'], $item['copy'], 'draft', $scheduled]);
            $count++;
        }
        return $count;
    }
}
