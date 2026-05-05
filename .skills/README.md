# Skills Registry — tickets-backend

Este directorio es el **registro de habilidades** del proyecto: módulos Markdown especializados que el agente (o un humano) carga según el dominio de la tarea.

## Router principal

- **[`AGENT.md`](../AGENT.md)** — Router liviano: stack canónico, invariantes de seguridad globales, regla de dependencia resumida, tabla de routing y protocolo **Human in the Loop (HITL)**.

## Skills disponibles

| Skill | Archivo | Cuándo usarlo |
|-------|---------|----------------|
| **Architecture** | [`architecture-expert.md`](architecture-expert.md) | Clean Architecture, capas, paquetes, naming, inversión de dependencias, tests por capa. |
| **Database** | [`db-expert.md`](db-expert.md) | PostgreSQL 16, Flyway, JPA/Hibernate, esquema, índices, offline-first en persistencia. |
| **Security** | [`security-expert.md`](security-expert.md) | Spring Security 6, JWT, BCrypt (según AGENT), CORS/CSRF, roles, auditoría segura. |

## Protocolo de uso (resumen)

1. Leer primero [`AGENT.md`](../AGENT.md) para alinear versiones e invariantes.
2. Clasificar la tarea por palabras clave (ver tabla de routing en `AGENT.md`).
3. Abrir uno o más skills listados arriba; no duplicar reglas globales ya fijadas en `AGENT.md`.
4. Aplicar **gates HITL** antes de migraciones destructivas, cambios de seguridad o cruces de capas.

## Convención de mantenimiento

- **Versiones de tecnología** y **reglas de seguridad no negociables:** solo se editan en [`AGENT.md`](../AGENT.md) salvo que el equipo decida otra fuente de verdad (requiere HITL y actualización cruzada de referencias).
- Los skills **expanden** detalle operativo sin contradecir el router.
