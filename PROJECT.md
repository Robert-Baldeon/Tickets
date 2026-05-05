# Tickets Backend — Sistema de Gestion de Incidencias

## Descripcion

Aplicacion web para empresas que centraliza la gestion de incidencias y tickets a traves de una plataforma con soporte offline, notificaciones, roles de usuario y dashboard de estadisticas. Diseñada para entornos empresariales con datos sensibles, permite crear, gestionar y dar seguimiento a tickets de forma eficiente con comentarios, archivos adjuntos y control de estados.

## Problema que Resuelve

Las empresas necesitan un canal centralizado para reportar, gestionar y dar seguimiento a incidencias tecnicas o de cualquier tipo. Sin un sistema de tickets, la comunicacion se fragmenta entre correos, mensajes y conversaciones informales, lo que genera perdida de informacion, falta de trazabilidad y dificultades para medir tiempos de resolucion.

## Stack Tecnologico

| Tecnologia | Version | Funcion |
|---|---|---|
| Java | 25 | Lenguaje del backend |
| Spring Boot | 3.2.5 | Framework backend (Web, JPA, Security, Validation) |
| PostgreSQL | 16 | Base de datos relacional |
| Docker | - | Contenedor de la base de datos |
| jjwt | 0.12.5 | Generacion y validacion de tokens JWT (HS384) |
| React | 18 | Framework frontend |
| TypeScript | 5 | Tipado estatico en frontend |
| Vite | 5 | Bundler y servidor de desarrollo |
| React Router | 6 | Navegacion y rutas protegidas |
| axios | 1.7 | Cliente HTTP con interceptor JWT |

**Nota sobre Lombok:** Se elimino deliberadamente porque Java 25 no es compatible con ninguna version de Lombok actualmente. Los getters, setters y builders estan escritos manualmente.

## Funcionalidades Implementadas

### Autenticacion
- Registro de nuevos usuarios con email, contraseña y nombre
- Primer usuario registrado obtiene rol ADMIN automaticamente, resto son USER
- Inicio de sesion con email y contraseña
- Token JWT con expiracion de 24 horas
- Proteccion de rutas: solo `/auth/**` es publico, el resto requiere autenticacion
- Logout con limpieza de sesion local

### Roles y Permisos
- **ADMIN**: puede eliminar tickets, asignar tecnicos a tickets, ver lista completa de usuarios
- **USER**: puede crear tickets, añadir comentarios, cambiar estado de tickets
- Los permisos se aplican tanto en backend (`@PreAuthorize`) como en frontend (UI condicional)

### Gestion de Tickets
- Crear tickets con titulo, descripcion, prioridad y tecnico asignado (solo admin asigna)
- Listar todos los tickets en tabla con columnas: ID, titulo, estado, prioridad, fecha, usuario, tecnico
- Buscar tickets por ID o titulo (en tiempo real, filtrado en backend)
- Filtrar por estado (ABIERTO, EN PROCESO, CERRADO)
- Filtrar por prioridad (ALTA, MEDIA, BAJA)
- Paginacion server-side (10 por pagina) con controles de navegacion
- Ver detalle completo de un ticket al hacer clic en la fila
- Editar cualquier campo de un ticket existente (solo admin puede asignar tecnico)
- Eliminar tickets con confirmacion (solo admin)
- Cambiar estado de forma ciclica: ABIERTO -> EN PROCESO -> CERRADO

### Comentarios
- Añadir comentarios a un ticket concreto
- Lista de comentarios con autor y fecha/hora
- Contador visible de comentarios por ticket

### Archivos Adjuntos
- Subir archivos a un ticket (maximo 10MB por archivo)
- Lista de archivos adjuntos con nombre, tamaño y fecha
- Almacenamiento local en directorio `./uploads`

### Notificaciones
- Notificacion automatica al asignar un tecnico a un ticket
- Notificacion al creador del ticket cuando cambia de estado
- Notificacion al tecnico y al creador cuando hay un nuevo comentario
- Icono de campana en el header con badge de contador de no leidas
- Dropdown con lista de notificaciones, click redirige al ticket
- Polling cada 30 segundos para refrescar notificaciones

### Dashboard de Estadisticas
- Tarjeta de total de tickets
- 3 tarjetas por estado: Abiertos, En Proceso, Cerrados
- 3 tarjetas por prioridad: Alta, Media, Baja
- Tabla de tecnicos con cantidad de tickets asignados (ordenada descendente)

### Perfil de Usuario
- Ver informacion del perfil (email, nombre, rol)
- Editar nombre
- Cambiar contraseña (requiere contraseña actual)
- El nombre se actualiza en el header automaticamente tras editar

### Modo Offline
- Service Worker cachea assets estaticos y respuestas API GET
- IndexedDB almacena tickets cacheados y cola de operaciones pendientes
- Al perder conexion: listado muestra datos cacheados, crear/comentar/cambiar estado van a cola
- Al reconectar: sincronizacion automatica de la cola y refetch de datos
- Banner visual: rojo (sin conexion), verde (sincronizando), verde (completada)
- TicketList y Dashboard se refrescan automaticamente tras sincronizacion

### Frontend
- Navegacion consistente con links DASHBOARD / TICKETS en todas las paginas
- Nombre de usuario cliqueable que lleva al perfil
- Header consistente con campana de notificaciones y boton de logout
- Tabla de tickets con badges de estado y prioridad en color
- Formulario de crear/editar ticket con campos validados
- Pagina de detalle con secciones: info, descripcion, comentarios, adjuntos, acciones
- Pagina de perfil con edicion de nombre y cambio de contraseña
- Pagina de dashboard con metricas visuales
- Banner offline en la parte superior de toda la app
- Diseño responsive y consistente: paleta blanco/gris/`#1a1f2e`
- Sin emojis en la UI corporativa

## Arquitectura

### Backend

Estructura por capas simples dentro de `com.tickets`:

```
src/main/java/com/tickets/
├── entity/          Entidades JPA (User, Ticket, Comment, Attachment, Notification)
├── repository/      Interfaces JpaRepository
├── dto/             Objetos de transferencia (Request/Response)
├── service/         Logica de negocio
├── controller/      Endpoints REST
├── security/        Filtro JWT para Spring Security
├── config/          Configuracion de Spring Security
└── TicketsApplication.java
```

Las entidades se mapean a DTOs antes de exponerse en la API. La seguridad se gestiona con Spring Security 6 + JWT stateless (sin sesion de servidor). `@EnableMethodSecurity` habilita `@PreAuthorize` para control por roles.

### Frontend

```
frontend/src/
├── context/         AuthContext.tsx (estado global: token, email, name, role, isAdmin)
├── services/        api.ts, ticketService.ts, userService.ts, notificationService.ts,
│                    dashboardService.ts, profileService.ts
├── pages/           Login.tsx, Dashboard.tsx, Profile.tsx, TicketList.tsx,
│                    TicketForm.tsx, TicketDetail.tsx
├── types/           ticket.ts, notification.ts, dashboard.ts
├── components/      NotificationBell.tsx, OfflineBanner.tsx
├── hooks/           useNetworkStatus.ts
├── utils/           offlineStore.ts (IndexedDB wrapper), syncService.ts
├── styles.css       Reset y estilos base
├── App.tsx          Configuracion de rutas protegidas + OfflineBanner
└── main.tsx         Punto de entrada + registro de Service Worker

frontend/public/
└── sw.js            Service Worker
```

El flujo de autenticacion funciona con AuthContext que persiste el token, email, nombre y rol en localStorage. axios tiene un interceptor que añade automaticamente `Authorization: Bearer {token}` a cada peticion. Las rutas protegidas redirigen a `/login` si no hay token.

## Como Ejecutar

### Requisitos
- Java 25 o superior
- Maven 3.8+
- Docker y Docker Compose
- Node.js 18+ y npm

### Pasos

1. Levantar la base de datos:
   ```bash
   docker-compose up -d
   ```

2. Ejecutar el backend (desde la raiz del proyecto):
   ```bash
   mvn spring-boot:run
   ```
   El backend estara disponible en `http://localhost:8080`

3. Ejecutar el frontend (desde la carpeta `frontend`):
   ```bash
   cd frontend
   npm install   # solo la primera vez
   npm run dev
   ```
   El frontend estara disponible en `http://localhost:3000`

### Detener
```bash
docker-compose down    # Detener PostgreSQL
Ctrl+C                 # Detener backend
Ctrl+C                 # Detener frontend
```

## Endpoints API

### Autenticacion
| Metodo | Endpoint | Cuerpo | Auth |
|---|---|---|---|
| POST | `/auth/register` | `{ email, password, name }` | No | Primer usuario = ADMIN |
| POST | `/auth/login` | `{ email, password }` | No |

### Tickets
| Metodo | Endpoint | Query Params / Cuerpo | Auth |
|---|---|---|---|
| GET | `/tickets` | `search`, `status`, `priority`, `page`, `size` | Si |
| POST | `/tickets` | `{ title, description, priority, assignedToId }` | Si |
| GET | `/tickets/{id}` | - | Si |
| PUT | `/tickets/{id}` | `{ title, description, priority, status, assignedToId }` | Si |
| DELETE | `/tickets/{id}` | - | Si (ADMIN) |

### Comentarios
| Metodo | Endpoint | Cuerpo | Auth |
|---|---|---|---|
| GET | `/tickets/{ticketId}/comments` | - | Si |
| POST | `/tickets/{ticketId}/comments` | `{ content }` | Si |

### Archivos Adjuntos
| Metodo | Endpoint | Cuerpo | Auth |
|---|---|---|---|
| GET | `/tickets/{ticketId}/attachments` | - | Si |
| POST | `/tickets/{ticketId}/attachments` | `file` (multipart) | Si |

### Usuarios
| Metodo | Endpoint | Auth |
|---|---|---|
| GET | `/users` | Si (ADMIN) |
| GET | `/users/profile` | Si |
| PUT | `/users/profile` | Si |
| PUT | `/users/profile/password` | Si |

### Notificaciones
| Metodo | Endpoint | Auth |
|---|---|---|
| GET | `/notifications` | Si |
| GET | `/notifications/unread-count` | Si |
| PUT | `/notifications/{id}/read` | Si |

### Dashboard
| Metodo | Endpoint | Auth |
|---|---|---|
| GET | `/dashboard/stats` | Si |

## Decisiones Tecnicas

### Por que Java 25 + Spring Boot 3.2.5
Java 25 es la ultima LTS disponible en el entorno de desarrollo. Spring Boot 3.2.5 es la ultima version compatible con Java 17+ y tiene soporte completo para Hibernate 6 y Spring Security 6 con DSL lambda.

### Por que sin Lombok
Lombok no es compatible con Java 25. Los getters, setters, constructores y builders estan escritos manualmente. Esto no afecta al rendimiento ni a la mantenibilidad, solo requiere mas codigo.

### Por que JWT con localStorage
Para un MVP, el almacenamiento en localStorage es suficiente. La token tiene expiracion de 24 horas. En produccion se podria migrar a refresh tokens con rotacion y almacenamiento en cookies HttpOnly.

### Por que inline styles en React
Para mantener el proyecto ligero sin dependencias adicionales de estilado. La paleta corporativa es consistente y los estilos son reutilizables como objetos de `React.CSSProperties`.

### Por que Service Worker manual (sin Workbox)
Para evitar dependencias adicionales. El Service Worker cachea assets y usa estrategia cache-first para estaticos y network-first para API. IndexedDB se usa directamente via API nativa del navegador.

### Roles: primer usuario = ADMIN
El primer usuario que se registra en la base de datos obtiene automaticamente rol ADMIN. Los subsiguientes son USER. Esto permite bootstrap sin configuracion manual de base de datos.
