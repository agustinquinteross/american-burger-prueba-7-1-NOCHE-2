<?php
namespace App\Core;

class Router {
    private array $routes = [];

    public function get(string $path, callable $handler): void { $this->add('GET', $path, $handler); }
    public function post(string $path, callable $handler): void { $this->add('POST', $path, $handler); }

    private function add(string $method, string $path, callable $handler): void {
        $this->routes[$method][$path] = $handler;
    }

    public function dispatch(string $method, string $path): void {
        $handler = $this->routes[$method][$path] ?? null;
        if (!$handler) {
            http_response_code(404);
            echo json_encode(['error' => 'Route not found']);
            return;
        }
        $handler();
    }
}
