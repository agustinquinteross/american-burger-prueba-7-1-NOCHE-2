<?php
namespace App\Services;

class RuleEngineService {
    public function evaluate(array $context): array {
        $alerts = [];
        $suggestions = [];

        if (($context['days_without_posts'] ?? 0) >= 3) {
            $alerts[] = ['level' => 'high', 'message' => 'No hay publicaciones hace 3+ días'];
            $suggestions[] = 'Programar 2 posts para las próximas 48h';
        }

        if (($context['sales_ratio'] ?? 0) > 0.7) {
            $alerts[] = ['level' => 'medium', 'message' => 'Exceso de contenido de venta'];
            $suggestions[] = 'Agregar 2 contenidos educativos y 1 emocional';
        }

        if (($context['format_diversity'] ?? 1) < 0.4) {
            $suggestions[] = 'Cambiar formato: incluir reel o carrusel';
        }

        if (($context['is_weekend'] ?? false) === true) {
            $suggestions[] = 'Fin de semana: usar storytelling emocional';
        }

        return ['alerts' => $alerts, 'suggestions' => $suggestions];
    }
}
