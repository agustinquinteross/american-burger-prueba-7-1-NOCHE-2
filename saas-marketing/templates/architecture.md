# Arquitectura SaaS: Marketing Operating System

## 1) Capa Frontend
- Dashboard SPA con AJAX.
- Priorización visual por severidad: rojo/amarillo/verde.
- Módulos UX: estado operativo, asistente diario y generación de copy.

## 2) Capa Backend (PHP MVC)
- `Controllers`: endpoints REST internos.
- `Services`: reglas, IA híbrida, automatización.
- `Core`: router + conexión DB.
- API desacoplada para crecer a microservicios.

## 3) Capa de datos MySQL
- Multi-tenant lógico por `tenant_id`.
- Índices para agenda, cola y alertas.
- Entidades orientadas a escalabilidad SaaS.

## 4) Motor de reglas
- Evalúa contexto operativo y genera:
  - Alertas
  - Sugerencias ejecutables

## 5) IA híbrida
- Reglas + plantillas dinámicas por rubro/tipo.
- Generación de ideas + copies.
- Preparado para enchufar API externa LLM.

## 6) Automatización
- Cron diario de análisis.
- Inserción automática de alertas y jobs de autopiloto.
- Preparación para notificaciones multicanal.
