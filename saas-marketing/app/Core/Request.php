<?php
namespace App\Core;

class Request {
    public static function json(): array {
        $raw = file_get_contents('php://input');
        return $raw ? (json_decode($raw, true) ?? []) : [];
    }

    public static function bearerToken(): ?string {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s+(.*)$/i', $header, $m)) {
            return trim($m[1]);
        }
        return null;
    }
}
