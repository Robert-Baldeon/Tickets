# Skill: Database Expert (PostgreSQL 16, JPA, Hibernate, Flyway)

**Ámbito:** modelo de datos, migraciones, consultas, transacciones y patrones offline-first en persistencia.  
**Fuente de verdad del stack:** ver tabla canónica en [`AGENT.md`](../AGENT.md).  
**Regla de capas:** los puertos de persistencia se definen en `domain`; las implementaciones JPA y Flyway viven en `infrastructure` (ver [`.skills/architecture-expert.md`](architecture-expert.md)).

---

## Activación (keywords)

Carga este skill cuando el prompt mencione: `PostgreSQL`, `schema`, `tabla`, `índice`, `migración`, `Flyway`, `V__`, `R__`, `entity`, `JPA`, `Hibernate`, `JPQL`, `Criteria`, `repository`, `transacción`, `@Transactional`, `offline`, `sincronización`, `versión`, `conflicto`, `tenant`, `PII`, `cifrado columna`.

---

## PostgreSQL 16 — lineamientos

- **IDs:** preferir `uuid` (generado en aplicación o `gen_random_uuid()` con extensión acordada).
- **Tiempo:** `timestamptz` para instantes; evitar `timestamp without time zone` para eventos globales.
- **Datos semiestructurados:** `jsonb` cuando el esquema evolucione; documentar contrato y validación en aplicación.
- **Collation / encoding:** UTF-8; collation explícita solo si hay requisito de negocio (HITL).
- **Extensiones:** permitidas por defecto solo si están justificadas y aprobadas: `pgcrypto` (UUID/cripto auxiliar), `pg_trgm` (búsqueda texto). Cualquier otra: **HITL**.
- **Soberanía:** tablespaces/volumen por entorno según política de despliegue; no hardcodear rutas en SQL de migración.

---

## Flyway

- **Ubicación:** `src/main/resources/db/migration` (convención Spring Boot).
- **Versioned:** `V{yyyyMMddHHmm}__{descripcion_snake_case}.sql` (o numeración secuencial estable acordada en el equipo — una sola convención por repo; cambiar convención = HITL).
- **Repeatable:** `R__{nombre}.sql` solo para vistas/procedimientos que deben re-aplicarse; evitar abuso.
- **Baseline / repair:** operaciones sensibles; solo con HITL y backup documentado.
- **Irreversibilidad:** asumir que `DOWN` no existe salvo estrategia explícita de rollback documentada.
- **Destructivo:** `DROP`, `TRUNCATE`, cambios que bloqueen tablas largas, rewrites masivos → **HITL obligatorio**.

---

## JPA / Hibernate (Spring Boot 3.x / Hibernate 6)

- `spring.jpa.open-in-view=false` como valor por defecto del diseño.
- Evitar `FetchType.EAGER`; preferir fetch explícito en casos de uso o proyecciones.
- **Transacciones:** `@Transactional` en la capa **application** (o en adaptadores de infra acotados), no en controladores.
- **API vs persistencia:** no exponer entidades JPA en contratos REST; mapear a DTOs en `interfaces`.
- **Consultas:** JPQL/Criteria con parámetros; SQL nativo solo en infra, siempre parametrizado.
- **Repositorios:** interfaz del puerto en `domain`; implementación `Jpa*` en `infrastructure`.

---

## Naming (base de datos)

| Elemento | Convención | Ejemplos |
|----------|------------|----------|
| Tablas | `snake_case`, plural donde tenga sentido | `tickets`, `ticket_comments` |
| Columnas | `snake_case` | `created_at`, `tenant_id` |
| PK | `id` o `{tabla}_id` según estándar único del proyecto | `id` |
| FK | `fk_{tabla_origen}_{tabla_referenciada}` o prefijo acordado | `fk_tickets_users` |
| Índices | `ix_{tabla}_{columnas_abrev}` | `ix_tickets_status_created_at` |
| Unique | `uq_{tabla}_{cols}` | `uq_users_email` |

---

## Offline-first y sincronización (persistencia)

- Columnas típicas: `version` (optimistic locking), `updated_at`, `synced_at`, `deleted_at` (soft delete si aplica).
- Identificadores estables expuestos a clientes offline: UUID generado una sola vez.
- Resolución de conflictos: política explícita (last-write-wins solo si negocio lo acepta; preferir merge o estados de conflicto) — **definir con HITL**.

---

## Soberanía y datos sensibles

- PII: minimizar columnas; considerar cifrado a nivel aplicación o pgcrypto según amenaza (decisión **HITL**).
- Multi-tenant: `tenant_id` obligatorio en tablas de negocio o schema por tenant; índices compuestos que incluyan `tenant_id`.

---

## Human in the Loop (HITL) — gates

- Cualquier migración **destructiva** o de larga duración en producción.
- Cambio de tipo de columna que implique reescritura o pérdida de precisión.
- Nuevas extensiones PostgreSQL.
- Desnormalización o eliminación de índices críticos sin medición.
- Estrategia de borrado físico vs soft delete en entidades reguladas.

---

## Anti-patrones

- `@Data` u otros generadores que rompan encapsulación en entidades de persistencia sin criterio.
- Fetch joins “globales” que arrastren grafos completos.
- SQL concatenado con entrada de usuario.
- Lógica de negocio en triggers salvo casos muy acotados y documentados (preferir dominio en Java).

---

## Relación con otros skills

- Capas y nombres Java: [`.skills/architecture-expert.md`](architecture-expert.md)
- Auth, secretos, auditoría de acceso: [`.skills/security-expert.md`](security-expert.md)
- Invariantes de seguridad globales: [`AGENT.md`](../AGENT.md)
