# Marketing OS SaaS (PHP/MySQL)

Plataforma SaaS multi-cliente para operación de marketing con reglas de decisión, IA híbrida y automatización.

## Módulos
- Multi-tenant (cliente/proyecto)
- Calendario inteligente
- Motor de reglas
- IA híbrida (plantillas + scoring + opcional LLM)
- Automatización por cron
- Notificaciones (email, WhatsApp link, Telegram)

## Arranque rápido
1. Importar `database/migrations/001_schema.sql` en MySQL 8+
2. Configurar `config/app.php`
3. Levantar servidor:
   ```bash
   php -S localhost:8081 -t public
   ```
4. Ejecutar análisis diario:
   ```bash
   php cron/daily_analysis.php
   ```

## Endpoints API
- `GET /api/dashboard?tenant_id=1`
- `GET /api/calendar/suggestions?tenant_id=1&project_id=1`
- `POST /api/content/generate-copy`
- `POST /api/automation/autopilot`

## Arquitectura
Ver `templates/architecture.md`.
