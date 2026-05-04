# Marketing OS SaaS (PHP/MySQL)

Sistema SaaS multi-cliente de marketing inteligente con decisiones automáticas, IA híbrida y autopiloto semanal.

## Capacidades implementadas
- Multi-tenant con `api_tokens`.
- Calendario inteligente (FullCalendar) con sugerencias dinámicas.
- Motor de reglas estratégicas (alertas + recomendaciones).
- IA híbrida para ideas y copies por tono.
- Modo piloto automático: crea borradores semanales automáticamente.
- Cron diario: analiza actividad, genera alertas y jobs.

## Arranque rápido
1. Importar `database/migrations/001_schema.sql` en MySQL 8+
2. Configurar `config/app.php`
3. Seed de prueba mínimo:
   - tenant id=1
   - project id=1
   - token en `api_tokens`: `demo-token`
4. Levantar servidor:
   ```bash
   php -S localhost:8081 -t public
   ```
5. Abrir dashboard `http://localhost:8081`

## API interna
- `GET /api/dashboard?tenant_id=1`
- `GET /api/calendar/suggestions?tenant_id=1`
- `POST /api/content/generate-copy?tenant_id=1`
- `POST /api/automation/autopilot?tenant_id=1`

## Cron
```bash
php cron/daily_analysis.php
```
