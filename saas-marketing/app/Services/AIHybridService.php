<?php
namespace App\Services;

class AIHybridService {
    private array $ideaTemplates = [
        'gastronomia' => [
            'educativo' => 'Tip del chef: cómo elegir el mejor pan para hamburguesas gourmet.',
            'emocional' => 'Historia del cliente feliz: la noche que una burger unió a amigos.',
            'ventas' => 'Oferta limitada: combo premium con bebida artesanal hoy.'
        ]
    ];

    public function generateIdea(string $industry, string $missingType = 'educativo'): string {
        $templates = $this->ideaTemplates[$industry] ?? $this->ideaTemplates['gastronomia'];
        return $templates[$missingType] ?? reset($templates);
    }

    public function generateCopy(string $tone, string $topic): string {
        $prefix = match($tone) {
            'ventas' => '🔥 Hoy es el día: ',
            'emocional' => '❤️ Lo que más nos inspira: ',
            default => '📚 Aprende algo útil: ',
        };
        return $prefix . $topic . ' ¿Quieres que te enviemos más ideas como esta?';
    }
}
