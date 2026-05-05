# Skills Registry — tickets-backend

Este directorio es el **registro de habilidades** del proyecto: modulos Markdown especializados que el agente carga segun el dominio de la tarea.

## Router principal

- **[`AGENT.md`](../AGENT.md)** — Router liviano: stack canonico, estado del proyecto, invariantes de seguridad, tabla de routing y protocolo **Human in the Loop (HITL)**.

## Skills disponibles

| Skill | Archivo | Cuando usarlo |
|---|---|---|
| **Architecture** | [`architecture-expert.md`](architecture-expert.md) | Clean Architecture, capas, paquetes, naming, inversion de dependencias, tests por capa. |
| **Database** | [`db-expert.md`](db-expert.md) | PostgreSQL 16, Flyway, JPA/Hibernate, esquema, indices, offline-first en persistencia. |
| **Security** | [`security-expert.md`](security-expert.md) | Spring Security 6, JWT, BCrypt, CORS/CSRF, roles, auditoria segura. |
| **Frontend** | [`frontend-expert.md`](frontend-expert.md) | React 18, TypeScript, Vite 5, componentes, paginas, estilos inline, routing protegido, axios. |

## Protocolo de uso (resumen)

1. Leer primero [`AGENT.md`](../AGENT.md) para alinear versiones, estado actual e invariantes.
2. Clasificar la tarea por palabras clave (ver tabla de routing en `AGENT.md`).
3. Abrir uno o mas skills listados arriba; no duplicar reglas globales ya fijadas en `AGENT.md`.
4. Aplicar **gates HITL** antes de migraciones destructivas, cambios de seguridad o cruces de capas.

## Convencion de mantenimiento

- **Versiones de tecnologia** y **reglas de seguridad no negociables:** solo se editan en [`AGENT.md`](../AGENT.md).
- Los skills **expanden** detalle operativo sin contradecir el router.
