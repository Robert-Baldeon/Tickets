# Skill: Security Expert (Spring Security 6, JWT, contraseñas)

**Ámbito:** autenticación, autorización, tokens, hashing de contraseñas, cabeceras HTTP y endurecimiento de API.  
**Fuente de verdad del stack:** ver tabla canónica en [`AGENT.md`](../AGENT.md).  
**Invariantes de seguridad obligatorias (BCrypt cost, JWT, TLS, deny-by-default, etc.):** están definidas **solo** en [`AGENT.md`](../AGENT.md); este skill **amplía** prácticas y patrones sin contradecirlas.

---

## Activación (keywords)

Carga este skill cuando el prompt mencione: `Spring Security`, `SecurityFilterChain`, `JWT`, `token`, `refresh`, `login`, `logout`, `password`, `BCrypt`, `encoder`, `rol`, `permiso`, `CORS`, `CSRF`, `OAuth2`, `Resource Server`, `cabecera`, `HSTS`, `CSP`, `auditoría`, `rate limit`.

---

## Spring Security 6 — diseño base

- Configurar la cadena con **`SecurityFilterChain`** (DSL lambda), beans explícitos, mínimo privilegio.
- **Autorización:** preferir `authorizeHttpRequests` + reglas explícitas; usar `AuthorizationManager` cuando la lógica sea contextual (tenant, dueño del recurso).
- **API REST stateless:** típicamente sin sesión de servidor; sesión solo si hay decisión explícita documentada (HITL).
- **Deny-by-default:** cualquier endpoint nuevo debe quedar cubierto por reglas; no confiar en “permitAll” residual.
- **Métodos:** `@PreAuthorize` / `@PostAuthorize` alineados con roles del dominio de tickets (ver jerarquía sugerida abajo).

---

## JWT (orientación; algoritmo y claves según AGENT.md)

- **Claims mínimos recomendados:** `sub`, `iat`, `exp`, `jti`, `roles` (o `authorities`), y `tenant_id` si multi-tenant.
- **TTL orientativos (ajustar con HITL):** access token corto (p. ej. ≤ 15 min); refresh más largo (p. ej. ≤ 7 días) con rotación y revocación.
- **Logout:** invalidar o rotar refresh; considerar denylist por `jti` para access de corta vida si el modelo de amenaza lo exige.
- **Almacenamiento en cliente:** evitar patrones inseguros (p. ej. access token de larga vida en `localStorage` sin rotación); la elección final de almacenamiento es **HITL** junto con el equipo frontend.
- **Offline / soberanía:** validación local con firma asimétrica (p. ej. RS256) y JWKS embebido o empaquetado puede ser adecuada; cualquier cambio de modelo de claves = HITL.

**Librería JWT:** elegir entre `jjwt`, `nimbus-jose-jwt` u otra mantenida — **decisión HITL** al crear el primer módulo de código.

---

## Hashing de contraseñas

- Aplicar estrictamente el **coste BCrypt** y políticas definidas en [`AGENT.md`](../AGENT.md) (cost 12 canónico).
- Un único bean `PasswordEncoder` (p. ej. `BCryptPasswordEncoder` con strength alineado al AGENT) registrado en configuración de infraestructura.
- **Prohibido** usar MD5, SHA-1 o SHA-256 “plano” para almacenar contraseñas.

---

## CORS y CSRF

- **CORS:** lista blanca por entorno (origins explícitos); nunca `*` con credenciales.
- **CSRF:** para API puramente stateless con JWT en cabecera, CSRF suele desactivarse; si hay cookies de sesión o formularios web mixtos, reactivar protección CSRF — **HITL**.

---

## Cabeceras y endurecimiento

- Orientación: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy` restrictivo; **CSP** donde haya UI servida por el mismo backend.
- No registrar secretos en código fuente; usar variables de entorno o secret manager (detalle de implementación fuera de este repo de skills).

---

## Roles sugeridos (dominio tickets)

Jerarquía orientativa: `ADMIN` > `MANAGER` > `AGENT` > `REQUESTER`.  
Los nombres exactos y el mapeo a `GrantedAuthority` deben alinearse con el modelo de negocio (HITL al introducir nuevos roles).

---

## Auditoría (sin violar invariantes de AGENT.md)

- Eventos: login fallido/exitoso, cambio de contraseña, revocación de refresh, cambios de rol críticos.
- Correlación con `traceId` / MDC donde exista observabilidad.
- Nunca loguear contraseñas, tokens completos ni PII innecesaria (cumplir AGENT.md).

---

## Human in the Loop (HITL) — gates

- Cualquier cambio en **`SecurityFilterChain`** que amplíe superficie (nuevo `permitAll`, reglas más laxas).
- Rotación de claves de firma JWT, cambio de algoritmo, o paso de simétrico a asimétrico.
- Ajuste del **coste BCrypt** o del algoritmo de hashing.
- Nuevos endpoints públicos o integraciones IdP.
- Almacenamiento de refresh tokens en BD (esquema, hashing, índices).

---

## Anti-patrones

- Secretos o PEMs en `application.yml` versionado.
- `@PreAuthorize` desalineado con la jerarquía real de datos (p. ej. olvidar `tenant_id`).
- Confiar solo en validación en cliente.
- JWT sin `exp` / sin `jti` cuando se requiere revocación.

---

## Relación con otros skills

- Capas (dónde vive la lógica de autorización de casos de uso): [`.skills/architecture-expert.md`](architecture-expert.md)
- Esquema para sesiones/tokens en BD: [`.skills/db-expert.md`](db-expert.md)
