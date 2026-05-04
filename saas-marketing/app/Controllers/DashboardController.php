<?php
namespace App\Controllers;

use App\Core\Database;
use App\Services\RuleEngineService;

class DashboardController {
    public function index(): void {
        $tenantId = (int)($_GET['tenant_id'] ?? 0);
        $pdo = Database::connection();

        $stmt = $pdo->prepare('SELECT COUNT(*) as total, MAX(scheduled_at) as last_post FROM contents WHERE tenant_id = ?');
        $stmt->execute([$tenantId]);
        $stats = $stmt->fetch() ?: ['total' => 0, 'last_post' => null];

        $daysWithoutPosts = $stats['last_post'] ? (int)((time() - strtotime($stats['last_post'])) / 86400) : 999;
        $context = [
            'days_without_posts' => $daysWithoutPosts,
            'sales_ratio' => 0.8,
            'format_diversity' => 0.3,
            'is_weekend' => in_array((int)date('N'), [6,7], true),
        ];

        $engine = new RuleEngineService();
        $analysis = $engine->evaluate($context);

        header('Content-Type: application/json');
        echo json_encode(['stats' => $stats, 'analysis' => $analysis]);
    }
}
