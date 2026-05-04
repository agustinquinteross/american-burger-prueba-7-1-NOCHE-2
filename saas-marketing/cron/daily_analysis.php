<?php
require_once __DIR__ . '/../app/Core/Database.php';
require_once __DIR__ . '/../app/Services/RuleEngineService.php';

use App\Core\Database;
use App\Services\RuleEngineService;

$pdo = Database::connection();
$engine = new RuleEngineService();
$tenants = $pdo->query('SELECT id FROM tenants')->fetchAll();

foreach ($tenants as $tenant) {
    $tenantId = (int)$tenant['id'];
    $last = $pdo->prepare('SELECT MAX(scheduled_at) last_post FROM contents WHERE tenant_id = ?');
    $last->execute([$tenantId]);
    $lastPost = $last->fetch()['last_post'] ?? null;
    $context = [
        'days_without_posts' => $lastPost ? (int)((time() - strtotime($lastPost))/86400) : 999,
        'sales_ratio' => 0.75,
        'format_diversity' => 0.35,
        'is_weekend' => in_array((int)date('N'), [6,7], true)
    ];
    $result = $engine->evaluate($context);

    foreach ($result['alerts'] as $alert) {
        $stmt = $pdo->prepare('INSERT INTO rule_alerts (tenant_id, severity, code, message) VALUES (?, ?, ?, ?)');
        $stmt->execute([$tenantId, $alert['level'], 'AUTO_RULE', $alert['message']]);
    }

    if (!empty($result['suggestions'])) {
        $payload = json_encode(['suggestions' => $result['suggestions']], JSON_UNESCAPED_UNICODE);
        $job = $pdo->prepare('INSERT INTO automation_jobs (tenant_id, job_type, payload, run_at) VALUES (?, ?, ?, NOW())');
        $job->execute([$tenantId, 'autopilot_week_plan', $payload]);
    }
}

echo "Daily analysis executed\n";
