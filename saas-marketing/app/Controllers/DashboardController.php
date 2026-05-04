<?php
namespace App\Controllers;

use App\Core\Database;
use App\Core\Response;
use App\Services\RuleEngineService;

class DashboardController {
    public function index(int $tenantId): void {
        $pdo = Database::connection();

        $stmt = $pdo->prepare("SELECT COUNT(*) as total, MAX(COALESCE(published_at, scheduled_at)) as last_post,
          AVG(CASE WHEN pillar='ventas' THEN 1 ELSE 0 END) as sales_ratio,
          COUNT(DISTINCT type)/4 as format_diversity
          FROM contents WHERE tenant_id = ?");
        $stmt->execute([$tenantId]);
        $stats = $stmt->fetch() ?: ['total' => 0, 'last_post' => null, 'sales_ratio' => 0, 'format_diversity' => 0];

        $daysWithoutPosts = $stats['last_post'] ? (int)((time() - strtotime($stats['last_post'])) / 86400) : 999;
        $context = [
            'days_without_posts' => $daysWithoutPosts,
            'sales_ratio' => (float)$stats['sales_ratio'],
            'format_diversity' => (float)$stats['format_diversity'],
            'is_weekend' => in_array((int)date('N'), [6,7], true),
        ];

        $analysis = (new RuleEngineService())->evaluate($context);
        Response::json(['tenant_id' => $tenantId, 'stats' => $stats, 'analysis' => $analysis]);
    }
}
