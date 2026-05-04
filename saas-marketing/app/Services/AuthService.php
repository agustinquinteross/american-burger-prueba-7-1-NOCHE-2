<?php
namespace App\Services;

use App\Core\Database;

class AuthService {
    public function resolveTenantId(?string $token): ?int {
        if (!$token) return null;
        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT tenant_id FROM api_tokens WHERE token = ? AND is_active = 1 LIMIT 1');
        $stmt->execute([$token]);
        $row = $stmt->fetch();
        return $row ? (int)$row['tenant_id'] : null;
    }
}
