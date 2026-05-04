# tickets-backend

Backend for a multi-platform (web/mobile) ticket management application for private companies.
Built as a TFG with **Java 21**, **Spring Boot 3.3**, **PostgreSQL 16** and **Clean
Architecture**, with offline-first sync support.

> See [`AGENT.md`](AGENT.md) for the full developer/agent guide: stack, conventions,
> SOLID rules and security policies.

## Quick start

Prerequisites: JDK 21+ and `docker compose` (or `podman-compose`).

```bash
make db-up        # starts PostgreSQL on localhost:5432 (data persisted in ./postgres-data)
make run          # runs the Spring Boot app in dev profile (http://localhost:8080)
make test         # unit + slice tests
make verify       # full verify (JaCoCo coverage check on application.ticket)
```

Open `http://localhost:8080/swagger-ui.html` once the app is running to explore the API.

## Project layout

```
src/main/java/com/tfg/tickets/
├── domain/         # pure Java (no Spring/JPA): entities, value objects, repository ports
├── application/    # use cases that orchestrate the domain (Spring @Service allowed)
├── infrastructure/ # adapters: JPA, JWT, local file storage, Spring config
└── presentation/   # REST controllers and exception handlers
```

## Status

Initial scaffold. Use cases for `ticket` are implemented with unit tests as a safety net.
Authentication and persistence adapters are skeletons that will be filled in subsequent
iterations.
