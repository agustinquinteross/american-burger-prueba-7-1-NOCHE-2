<?php
require_once __DIR__ . '/../app/Core/Router.php';
require_once __DIR__ . '/../app/Core/Database.php';
require_once __DIR__ . '/../app/Services/RuleEngineService.php';
require_once __DIR__ . '/../app/Services/AIHybridService.php';
require_once __DIR__ . '/../app/Controllers/DashboardController.php';
require_once __DIR__ . '/../app/Controllers/ContentController.php';
require_once __DIR__ . '/../app/Controllers/CalendarController.php';

use App\Core\Router;
use App\Controllers\DashboardController;
use App\Controllers\ContentController;
use App\Controllers\CalendarController;

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($uri === '/') {
    readfile(__DIR__ . '/spa.html');
    exit;
}

$router = new Router();
$router->get('/api/dashboard', fn() => (new DashboardController())->index());
$router->get('/api/calendar/suggestions', fn() => (new CalendarController())->suggestions());
$router->post('/api/content/generate-copy', fn() => (new ContentController())->generateCopy());

$router->dispatch($_SERVER['REQUEST_METHOD'], $uri);
