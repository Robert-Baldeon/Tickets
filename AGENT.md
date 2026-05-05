# AGENT.md — tickets-backend

## Stack canónico

| Tecnología | Versión | Notas |
|---|---|---|
| Java | 25 | Sin Lombok (no compatible) |
| Spring Boot | 3.2.5 | Web, Data JPA, Security, Validation |
| PostgreSQL | 16 | Docker container |
| JWT | jjwt 0.12.5 | HS384 |
| React | 18 | Funcional components, hooks |
| TypeScript | 5 | Strict mode |
| Vite | 5 | Con proxy a :8080 |
| React Router | 6 | ProtectedRoute pattern |
| axios | 1.7 | Interceptor JWT |

## Estado actual del proyecto

| Funcionalidad | Backend | Frontend |
|---|---|---|
| Login / Registro / JWT | OK | OK |
| CRUD tickets | OK | OK |
| Listado con busqueda | OK | OK |
| Filtro por estado | OK | OK |
| Filtro por prioridad | OK | OK |
| Detalle del ticket | OK | OK |
| Comentarios | OK | OK |
| Adjuntar archivos | OK | OK |
| Cambiar estado | OK | OK |
| Asignar tecnico | OK | OK |
| Notificaciones | OK | OK |
| Dashboard estadisticas | OK | OK |
| Paginacion | OK | OK |
| Perfil de usuario | OK | OK |
| Roles (ADMIN/USER) | OK | OK |
| Modo offline | OK | OK |

**MVP completo.** Sin pendientes.

## Estructura de directorios

```
src/main/java/com/tickets/
├── config/          SecurityConfig.java
├── controller/      AuthController, TicketController, CommentController, AttachmentController,
│                    UserController, NotificationController, DashboardController, ProfileController
├── dto/             LoginRequest, RegisterRequest, AuthResponse, TicketRequest, TicketResponse,
│                    CommentRequest, CommentResponse, AttachmentResponse, UserDTO, NotificationDTO,
│                    DashboardStats, ProfileRequest, PasswordChangeRequest
├── entity/          User, Ticket, Comment, Attachment, Notification
├── repository/      UserRepository, TicketRepository, CommentRepository, AttachmentRepository,
│                    NotificationRepository
├── security/        JwtAuthenticationFilter
├── service/         AuthService, JwtService, CustomUserDetailsService, TicketService,
│                    CommentService, AttachmentService, NotificationService, DashboardService,
│                    ProfileService
└── TicketsApplication.java

frontend/src/
├── context/         AuthContext.tsx (token, email, name, role, isAdmin)
├── services/        api.ts, ticketService.ts, userService.ts, notificationService.ts,
│                    dashboardService.ts, profileService.ts
├── pages/           Login.tsx, Dashboard.tsx, Profile.tsx, TicketList.tsx, TicketForm.tsx,
│                    TicketDetail.tsx
├── types/           ticket.ts, notification.ts, dashboard.ts
├── components/      NotificationBell.tsx, OfflineBanner.tsx
├── hooks/           useNetworkStatus.ts
├── utils/           offlineStore.ts (IndexedDB), syncService.ts
├── styles.css
├── App.tsx
└── main.tsx

frontend/public/
└── sw.js           (Service Worker)
```

## Rutas API

| Metodo | Endpoint | Auth |
|---|---|---|
| POST | `/auth/register` | No | Primer usuario = ADMIN, resto = USER |
| POST | `/auth/login` | No |
| GET | `/users` | Si (ADMIN) |
| GET | `/tickets` | Si | Query params: search, status, priority, page (0), size (10) |
| POST | `/tickets` | Si |
| GET | `/tickets/{id}` | Si |
| PUT | `/tickets/{id}` | Si |
| DELETE | `/tickets/{id}` | Si (ADMIN) |
| GET | `/tickets/{ticketId}/comments` | Si |
| POST | `/tickets/{ticketId}/comments` | Si |
| GET | `/tickets/{ticketId}/attachments` | Si |
| POST | `/tickets/{ticketId}/attachments` | Si (multipart) |
| GET | `/notifications` | Si |
| GET | `/notifications/unread-count` | Si |
| PUT | `/notifications/{id}/read` | Si |
| GET | `/dashboard/stats` | Si |
| GET | `/users/profile` | Si |
| PUT | `/users/profile` | Si |
| PUT | `/users/profile/password` | Si |

## Rutas Frontend

| Ruta | Componente | Auth |
|---|---|---|
| `/` | Redirect a /dashboard o /login | - |
| `/login` | Login.tsx | No |
| `/dashboard` | Dashboard.tsx | Si |
| `/profile` | Profile.tsx | Si |
| `/tickets` | TicketList.tsx | Si |
| `/tickets/:id` | TicketDetail.tsx | Si |
| `/tickets/new` | TicketForm.tsx | Si |
| `/tickets/edit/:id` | TicketForm.tsx | Si |

## Modo offline

- **Service Worker** (`public/sw.js`): Cachea assets estaticos y respuestas API GET. Estrategia stale-while-revalidate
- **IndexedDB** (`offlineStore.ts`): Stores `tickets` (cache) y `queue` (operaciones pendientes)
- **Banner** (`OfflineBanner.tsx`): Rojo cuando offline, verde durante sync, desaparece tras completar
- **Hook** (`useNetworkStatus.ts`): Escucha eventos `online`/`offline` del navegador
- **Sync** (`syncService.ts`): Al reconectar, procesa cola secuencialmente (create, comment, status)
- **Flujo offline**: Listado muestra cache, crear/comment/status van a cola con ID temporal, UI refleja cambios inmediatamente, al reconectar se sincroniza automaticamente

## Roles

| Rol | Permisos |
|---|---|
| ADMIN | Primer usuario registrado. Puede eliminar tickets, asignar tecnicos, ver lista de usuarios |
| USER | Usuarios posteriores. Pueden crear tickets, comentar, cambiar estado. No pueden eliminar ni asignar |

## Invariantes de seguridad

- Contraseñas con **BCrypt** (`BCryptPasswordEncoder`)
- JWT en header `Authorization: Bearer {token}`
- `SecurityFilterChain` con **deny-by-default**: solo `/auth/**` es `permitAll`
- Secrets solo en `.env`, nunca versionados
- PII no loguear contraseñas, tokens ni datos sensibles
- Archivos adjuntos: max 10MB, directorio `./uploads`

## Routing de skills

| Keywords | Skill |
|---|---|
| `capa`, `package`, `clean architecture`, `domain`, `DTO`, `mapper` | `.skills/architecture-expert.md` |
| `PostgreSQL`, `schema`, `tabla`, `Flyway`, `JPA`, `Hibernate`, `migracion` | `.skills/db-expert.md` |
| `Security`, `JWT`, `BCrypt`, `CORS`, `CSRF`, `rol`, `token` | `.skills/security-expert.md` |
| `frontend`, `react`, `componente`, `pagina`, `estilo`, `ruta`, `formulario`, `typescript` | `.skills/frontend-expert.md` |

## Gates HITL — pedir aprobacion antes de

- Migraciones destructivas en BD (`DROP`, `TRUNCATE`, `ALTER` de columnas existentes)
- Cambiar `SecurityFilterChain` que amplie superficie (nuevo `permitAll`)
- Rotar claves de firma JWT o cambiar algoritmo
- Cambiar estructura de carpetas existente
- Añadir dependencias nuevas al backend o frontend

## Reglas de contexto

- **No releer** archivos que ya conoces del estado actual (ver estructura arriba)
- **No regenerar** codigo existente — solo modificar lo necesario
- **Referencia cruzada**: para detalles de capa, DB o seguridad, leer el skill correspondiente
- Este archivo se carga **siempre** al iniciar sesion; los skills son on-demand por keywords
