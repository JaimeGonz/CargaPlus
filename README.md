# Carga+ 🏋️

App full-stack de seguimiento de entrenamiento (gym tracking). Permite organizar planes de entrenamiento completos (`Program`), crear rutinas por día con ejercicios personalizados, y registrar sesiones de entrenamiento en tiempo real con historial de progreso.

Proyecto personal en desarrollo activo — construido de cero para practicar diseño de arquitectura backend real, no solo consumir tutoriales.

---

## Table of contents

- [Carga+ 🏋️](#carga-️)
  - [Table of contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Architecture](#architecture)
    - [Modelo de datos](#modelo-de-datos)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Run with Docker](#run-with-docker)
    - [Prerequisites](#prerequisites-1)
    - [Run the app](#run-the-app)
  - [API Documentation](#api-documentation)
  - [Live Demo](#live-demo)
  - [API Endpoints](#api-endpoints)
    - [Auth](#auth)
    - [Exercises](#exercises)
    - [Programs](#programs)
    - [Routines](#routines)
    - [Workout Sessions](#workout-sessions)
    - [Workout Sets](#workout-sets)
  - [Technical Decisions](#technical-decisions)
  - [Known Limitations](#known-limitations)
  - [Roadmap](#roadmap)
  - [Author](#author)

---

## Tech Stack

- **NestJS** + TypeScript — backend framework
- **PostgreSQL** — base de datos relacional
- **Prisma ORM** — queries type-safe, migraciones, transacciones
- **JWT (Passport)** — autenticación
- **Swagger** — documentación interactiva de la API
- **Docker** — contenedorización (desarrollo y producción)
- **Railway** — deploy y hosting

---

## Architecture

Cada módulo sigue una separación estricta en 4 capas:

```
Controller  → traduce HTTP a llamadas de método (sin lógica de negocio)
Service     → orquesta reglas de negocio (validaciones, permisos, transacciones)
Repository  → única capa que habla con Prisma / la base de datos
DTOs        → validación (class-validator) y documentación (Swagger)
```

Módulos que dependen entre sí (ej. `Routines` verificando contra `Programs`, `WorkoutSets` verificando contra `WorkoutSessions`) se comunican inyectando el `Service` del módulo padre — nunca accediendo directo a su `Repository`.

### Modelo de datos

```
User
 ├─ Program (1:N)          — planes de entrenamiento (ACTIVE / AVAILABLE / ARCHIVED)
 │   └─ Routine (1:N)      — un día de entrenamiento (dayOfWeek, DayType)
 │        └─ RoutineExercise (1:N) — ejercicios planeados: sets, reps, notas
 └─ WorkoutSession (1:N)   — una sesión real de entrenamiento
      └─ WorkoutSet (1:N)  — series registradas en vivo (peso, reps, setType)

Exercise — catálogo reutilizable, usado tanto en rutinas planeadas como en sets reales
```

---

## Getting Started

### Prerequisites

- Node.js v20+
- PostgreSQL corriendo localmente

### Installation

```bash
git clone https://github.com/JaimeGonz/CargaPlus.git
cd CargaPlus
npm install
```

Crear un `.env` en la raíz:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/carga_plus_db"
JWT_SECRET="your_jwt_secret"
```

Correr migraciones y seed:
```bash
npx prisma migrate dev
npx prisma db seed
```

Levantar el servidor:
```bash
npm run start:dev
```

La API queda disponible en `http://localhost:3000`.

---

## Run with Docker

### Prerequisites
- Docker Desktop instalado y corriendo

Copia `.env.docker.example` a `.env.docker` (o créalo con las variables `DATABASE_URL`, `JWT_SECRET`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` — deben coincidir entre sí, ver [Technical Decisions](#technical-decisions)).

### Run the app
```bash
./up_dev.sh
```
> En Windows: ejecuta el script desde **Git Bash**. (WSL es una alternativa, pero requiere tener una distro de Linux ya configurada).

Esto construye la imagen, levanta Postgres con un healthcheck (esperando a que esté realmente listo antes de arrancar la API), aplica las migraciones automáticamente y arranca el servidor — todo en un solo comando.

La API queda disponible en `http://localhost:3000`.

---

## API Documentation

Swagger UI disponible en: `http://localhost:3000/api` (local) o en la URL de producción + `/api`.

## Live Demo

API desplegada en Railway:

**https://cargaplus-production.up.railway.app**

Swagger UI en producción:

**https://cargaplus-production.up.railway.app/api**

---

## API Endpoints

Todos los endpoints (excepto `/auth`) requieren `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Registrar un nuevo usuario |
| POST | `/auth/login` | Login, devuelve JWT |

### Exercises

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/exercises` | Crear ejercicio (global o personalizado) |
| GET | `/exercises` | Listar catálogo de ejercicios |

### Programs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/programs` | Crear un plan de entrenamiento |
| GET | `/programs` | Listar programas (excluye archivados por default) |
| GET | `/programs?archived=true` | Incluir programas archivados |
| GET | `/programs/:id` | Detalle de un programa |
| PATCH | `/programs/:id` | Editar name / splitType |
| PATCH | `/programs/:id/activate` | Activar (desactiva cualquier otro programa activo del usuario) |
| PATCH | `/programs/:id/deactivate` | Desactivar (solo si está `ACTIVE`) |
| PATCH | `/programs/:id/archive` | Archivar (solo si no está ya `ARCHIVED`) |
| PATCH | `/programs/:id/unarchive` | Desarchivar (solo si está `ARCHIVED`) |
| DELETE | `/programs/:id` | Eliminar (cascade sobre sus rutinas — uso excepcional) |

### Routines

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/programs/:programId/routines` | Crear una rutina dentro de un programa |
| GET | `/routines` | Listar rutinas del usuario |
| GET | `/routines/:id` | Detalle con ejercicios incluidos |
| PATCH | `/routines/:id` | Editar rutina |
| DELETE | `/routines/:id` | Eliminar (cascade sobre sus ejercicios) |

### Workout Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/workout-sessions` | Iniciar sesión (opcionalmente ligada a una rutina) |
| GET | `/workout-sessions` | Listar sesiones del usuario |
| GET | `/workout-sessions/:id` | Detalle, incluye sets registrados |
| PATCH | `/workout-sessions/:id` | Finalizar sesión (no se puede finalizar dos veces) |

### Workout Sets

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/workout-sessions/:sessionId/sets` | Registrar un set (orden autoincremental; bloqueado si la sesión ya finalizó) |
| GET | `/workout-sessions/:sessionId/sets` | Listar sets de una sesión, ordenados |
| PATCH | `/workout-sessions/:sessionId/sets/:setId` | Editar un set (permitido aunque la sesión haya finalizado) |
| DELETE | `/workout-sessions/:sessionId/sets/:setId` | Eliminar un set |

---

## Technical Decisions

**Nested writes de Prisma** — crear una rutina con sus ejercicios (o un programa con sus rutinas) ocurre en una sola operación atómica, evitando registros huérfanos si algo falla a medias.

**Prevención de IDOR** — endpoints de detalle/edición/borrado usan `findFirst({ where: { id, userId } })` en vez de `findUnique({ id })`, para que un usuario nunca acceda a datos de otro adivinando IDs. Para relaciones anidadas (ej. un `WorkoutSet` dentro de una `WorkoutSession`), se verifica también que el recurso hijo pertenezca al padre correcto de la URL, no solo que el padre sea del usuario.

**Sistema de 3 estados para `Program`** (`ACTIVE` / `AVAILABLE` / `ARCHIVED`) — diseñado tras analizar cómo lo resuelven apps como Hevy (biblioteca libre, sin estado "activo" forzado) y TrueCoach (modelo `assign`/`unassign` de coach-cliente). Se eligió un híbrido: solo un programa puede estar `ACTIVE` a la vez, pero el resto queda `AVAILABLE` (visible, elegible) en vez de forzar a elegir o archivar. `PATCH /programs/:id/activate` usa `$transaction()` de Prisma para garantizar que desactivar el programa anterior y activar el nuevo ocurran de forma atómica — sin transacción, una falla a medias podría dejar dos programas activos o ninguno.

**Enums sobre texto libre** (`SetType`, `ProgramStatus`, `SplitType`, `DayType`) — campos que representan categorías cerradas y conocidas (ej. tipo de split de entrenamiento) usan enums de Prisma en vez de strings, evitando inconsistencias de capitalización/redacción que dificultarían filtrar o agrupar datos más adelante (ej. "Push Pull Legs" vs "push pull legs" vs "PPL" quedando como valores distintos).

**Cascade deletes configurados explícitamente** — borrar un `Program` elimina sus `Routine` asociadas (y por cascada, sus `RoutineExercise`), evitando registros huérfanos. Es una operación excepcional: el flujo normal para "dejar de usar un plan" es archivarlo, no borrarlo.

**Reglas de negocio en el Service, nunca en el Repository** — el Repository solo ejecuta queries puras de Prisma; decisiones como "lanzar 404 si no existe" o "rechazar si el estado no es válido" viven en el Service. Única excepción: operaciones que requieren atomicidad real (como `activate`) viven completas en el Repository dentro de un `$transaction`, porque la búsqueda y las escrituras deben ocurrir en el mismo contexto transaccional.

**Zona muscular derivada, no duplicada** — no existe un campo de "grupo muscular" en `Routine`; se deriva consultando `RoutineExercise → Exercise → muscleGroup` cuando se necesita, evitando guardar la misma información dos veces (mismo patrón que usa Hevy para sus estadísticas de músculos trabajados).

---

## Known Limitations

- Sin cobertura de tests automatizados todavía (a diferencia de [notifications-api](https://github.com/JaimeGonz/notifications-api), que sí tiene tests con Jest) — priorizado para después de cerrar el MVP.
- Sin frontend todavía — actualmente solo expone la API (consumible vía Swagger o Postman).
- El seed usa un usuario y datos reales de ejemplo (rutina propia del autor), pensado para desarrollo/demo, no para producción real multiusuario.
- No hay recuperación de contraseña ni verificación de email — fuera de alcance del MVP.

## Roadmap

- [ ] Frontend con Next.js (Auth → Rutinas → Sesión de entrenamiento → Dashboard)
- [ ] Tests unitarios (Jest) para Services y reglas de negocio críticas (`activate`, verificación cruzada de ownership)
- [ ] Sitio de portafolio personal enlazando este proyecto
- [ ] Ver documento interno de ideas para v2 (Personal Records calculados, calculadora de discos, unidades kg/lb, historial de estados de Program, entre otras)

---

## Author

Jaime González — Full-Stack Developer

- GitHub: https://github.com/JaimeGonz
- LinkedIn: https://linkedin.com/in/jaimegonz01
- Email: valdoc7@gmail.com
