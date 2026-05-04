<?php
require_once __DIR__ . '/../app/Core/Router.php';
require_once __DIR__ . '/../app/Core/Database.php';
require_once __DIR__ . '/../app/Core/Request.php';
require_once __DIR__ . '/../app/Core/Response.php';
require_once __DIR__ . '/../app/Services/AuthService.php';
require_once __DIR__ . '/../app/Services/RuleEngineService.php';
require_once __DIR__ . '/../app/Services/AIHybridService.php';
require_once __DIR__ . '/../app/Services/AutomationService.php';
require_once __DIR__ . '/../app/Controllers/DashboardController.php';
require_once __DIR__ . '/../app/Controllers/ContentController.php';
require_once __DIR__ . '/../app/Controllers/CalendarController.php';
require_once __DIR__ . '/../app/Controllers/AutomationController.php';

use App\Core\Router;
use App\Core\Request;
use App\Core\Response;
use App\Services\AuthService;
use App\Controllers\DashboardController;
use App\Controllers\ContentController;
use App\Controllers\CalendarController;
use App\Controllers\AutomationController;

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($uri === '/') {
    readfile(__DIR__ . '/spa.html');
    exit;
}

$tenantId = (new AuthService())->resolveTenantId(Request::bearerToken()) ?? (int)($_GET['tenant_id'] ?? 0);
if (str_starts_with($uri, '/api/') && $tenantId <= 0) {
    Response::json(['error' => 'Unauthorized. Use Bearer token o tenant_id.'], 401);
    exit;
}

$router = new Router();
$router->get('/api/dashboard', fn() => (new DashboardController())->index($tenantId));
$router->get('/api/calendar/suggestions', fn() => (new CalendarController())->suggestions($tenantId));
$router->post('/api/content/generate-copy', fn() => (new ContentController())->generateCopy($tenantId));
$router->post('/api/automation/autopilot', fn() => (new AutomationController())->autopilot($tenantId));

$router->dispatch($_SERVER['REQUEST_METHOD'], $uri);
