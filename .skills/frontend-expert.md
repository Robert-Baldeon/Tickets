# Skill: Frontend Expert (React 18 + TypeScript + Vite 5)

**Ambito:** componentes React, paginas, estilos inline, routing protegido, comunicacion con API, tipos TypeScript, modo offline.
**Fuente de verdad del stack:** ver tabla canonica en [`AGENT.md`](../AGENT.md).

---

## Activacion (keywords)

Carga este skill cuando el prompt mencione: `frontend`, `react`, `componente`, `pagina`, `estilo`, `ruta`, `formulario`, `typescript`, `vite`, `auth`, `hook`, `context`, `axios`, `ts`, `tsx`, `offline`, `service worker`, `indexeddb`, `notificaciones`, `dashboard`.

---

## Stack

| Tecnologia | Version |
|---|---|
| React | 18 (functional components, hooks) |
| TypeScript | 5 (strict mode, no `any`) |
| Vite | 5 (con proxy a `:8080`) |
| React Router | 6 (ProtectedRoute pattern) |
| axios | 1.7 (interceptor JWT) |

---

## Estructura de carpetas

```
frontend/src/
├── context/         AuthContext.tsx (token, email, name, role, isAdmin)
├── services/        api.ts, ticketService.ts, userService.ts,
│                    notificationService.ts, dashboardService.ts,
│                    profileService.ts
├── pages/           Login.tsx, Dashboard.tsx, Profile.tsx,
│                    TicketList.tsx, TicketForm.tsx, TicketDetail.tsx
├── types/           ticket.ts, notification.ts, dashboard.ts
├── components/      NotificationBell.tsx, OfflineBanner.tsx
├── hooks/           useNetworkStatus.ts
├── utils/           offlineStore.ts (IndexedDB), syncService.ts
├── styles.css
├── App.tsx
└── main.tsx         (registra Service Worker)

frontend/public/
└── sw.js            Service Worker
```

---

## Convenciones de codigo

- **Componentes funcionales** con hooks — nunca clases
- **Inline styles** como objetos de `React.CSSProperties` — sin CSS-in-JS, sin styled-components
- **TypeScript estricto** — interfaces para todos los props y datos de API, sin `any`
- **Nombres** — PascalCase para componentes, camelCase para funciones/variables
- **Archivos** — un componente por archivo, nombre del archivo = nombre del componente

---

## Paleta de colores

| Uso | Color |
|---|---|
| Oscuro (botones, cabeceras) | `#1a1f2e` |
| Borde sutil | `#e0e0e0` |
| Fondo de pagina | `#f5f5f5` |
| Fondo de cards | `#ffffff` |
| Texto principal | `#1a1f2e` |
| Texto secundario | `#888` |

**Estado badges:**
- ABIERTO: `#1a1f2e` | EN_PROGRESO: `#e67e22` | CERRADO: `#888`
- ALTA: `#c0392b` | MEDIA: `#e67e22` | BAJA: `#27ae60`

**Offline banner:**
- Sin conexion: `#c0392b`
- Sincronizando/sincronizado: `#27ae60`

---

## Patrones de auth

- **AuthContext** — estado global con `token`, `email`, `name`, `role`, `isAdmin` persistidos en localStorage
- **Interceptor axios** — añade `Authorization: Bearer {token}` a cada request si existe token
- **ProtectedRoute** — wrapper que redirige a `/login` si no hay token
- **Roles**: primer usuario registrado = ADMIN, resto = USER
- **Logout** — limpia todo de contexto y localStorage

---

## Servicios de API

- `api.ts` — instancia axios base con interceptor JWT
- `ticketService.ts` — tickets (con soporte offline), comentarios, adjuntos
- `userService.ts` — listado de usuarios (solo ADMIN)
- `notificationService.ts` — notificaciones (getAll, getUnreadCount, markAsRead)
- `dashboardService.ts` — estadisticas del dashboard
- `profileService.ts` — perfil (getProfile, updateProfile, changePassword)
- Los servicios devuelven datos tipados (interfaces de `types/`)
- No hardcodear URLs — el proxy de Vite redirige automaticamente

---

## Formularios

- Controlados con `useState`
- Validacion basica con atributos HTML (`required`, `type="email"`)
- Botones disabled durante saving para evitar doble submit
- Feedback visual de carga (`guardando...`, `cargando...`)

---

## Modo offline

- **Service Worker** (`public/sw.js`): Cachea assets y respuestas API GET
- **IndexedDB** (`offlineStore.ts`): Stores `tickets` (cache) y `queue` (operaciones pendientes)
- **Banner** (`OfflineBanner.tsx`): Rojo (offline), verde (syncing/synced)
- **Hook** (`useNetworkStatus.ts`): Escucha eventos `online`/`offline`
- **Sync** (`syncService.ts`): Procesa cola al reconectar, emite evento `offline-sync`
- **ticketService.ts**: Intenta API online; si falla, usa cache/cola IndexedDB
- Listeners `offline-sync` en TicketList y Dashboard para refetch tras sincronizacion

---

## Anti-patrones

- **Nunca** hardcodear datos de ejemplo en tablas o listas
- **Nunca** usar emojis en UI corporativa
- **No** CSS-in-JS ni librerias de estilos — inline styles con objetos tipados
- **No** duplicar logica de auth — todo via AuthContext
- **No** exponer datos sensibles en console.log en produccion
- **No** `any` en TypeScript — usar interfaces definidas
- **No** depender de internet para operaciones basicas — los servicios deben funcionar offline

---

## Human in the Loop (HITL)

- Cambiar la paleta de colores global
- Introducir libreria de UI nueva (Material-UI, Tailwind, etc.)
- Cambiar el patron de autenticacion
- Modificar la estructura de carpetas del frontend

---

## Relacion con otros skills

- Auth/JWT backend: [`.skills/security-expert.md`](security-expert.md)
- Invariantes globales: [`AGENT.md`](../AGENT.md)
