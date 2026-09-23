# Carga+ (Backend) — Contexto para Claude Code

API REST del proyecto Carga+ (gym tracker). Repo hermano: `carga-plus-web`
(frontend Next.js) — tiene su propio CLAUDE.md, arquitectura de auth explicada ahí.

## Stack

NestJS + TypeScript + PostgreSQL + Prisma ORM. Auth: JWT + bcrypt. Documentación
de API con Swagger (`@nestjs/swagger`). Testing: Jest.

Desplegado en Railway. `start:migrate` (`npx prisma migrate deploy && node dist/main`)
corre las migraciones pendientes automáticamente en cada deploy — nunca asumir que
hace falta un paso manual aparte, pero si un deploy falla por conflicto de datos
(ver sección de gotchas), sí requiere limpieza manual antes de reintentar.

## Arquitectura — capas estrictas, nunca saltárselas

**Controller → Service → Repository → Prisma.** Regla no negociable: **la lógica de
negocio y las validaciones viven en el Service, nunca en el Repository.** El
Repository es queries puras de Prisma, sin `if` de reglas de negocio.

Patrón de un módulo completo (ejemplo real: `workout-sets/`):

- `dto/create-*.dto.ts` y `dto/update-*.dto.ts` — con `class-validator`
  (`@IsNumber`, `@IsOptional`, etc.) y `@nestjs/swagger` (`@ApiProperty`).
  `UpdateDto` normalmente `extends PartialType(CreateDto)`, pero campos que solo
  tienen sentido en actualización (ej. `isCompleted`) se agregan aparte, no se
  heredan de create — nadie "crea" algo ya completado.
- `*.repository.ts` — inyecta `PrismaService`, solo queries.
- `*.service.ts` — inyecta el Repository (y otros Services si necesita validar
  ownership cruzado, ej. `WorkoutSetsService` inyecta `WorkoutSessionsService`).
  Aquí van los `NotFoundException`/`BadRequestException`.
- `*.controller.ts` — rutas HTTP, `@UseGuards(JwtAuthGuard)`, `@GetUser('userId')`
  para sacar el usuario autenticado del JWT.

## Seguridad — protección anti-IDOR, patrón repetido en cada módulo

Cualquier query que involucre un recurso de otro usuario debe filtrar por `userId`
**a través de la relación**, no solo por el ID del recurso — ej. `findFirst({ 
where: { id, session: { userId } } })`, nunca solo `where: { id }`. Ya aplicado en
`WorkoutSets`, `WorkoutSessions`, `Routines`. Mantener el mismo patrón en cualquier
módulo nuevo.

## Convenciones de índices y concurrencia

- Cualquier foreign key usada seguido en un `where`/`orderBy` necesita `@@index`
  explícito en el schema — Prisma NO indexa foreign keys automáticamente.
- Operaciones tipo "contar + calcular el siguiente número" (ej. `order` de un
  `WorkoutSet`) NO son atómicas por sí solas — causó una condición de carrera real
  (dos peticiones simultáneas generaban el mismo `order`). Fix aplicado:
  `@@unique([sessionId, exerciseId, order])` + reintento en el Repository si Prisma
  lanza `P2002` (verificar con `e instanceof Prisma.PrismaClientKnownRequestError`,
  nunca `(e as any).code`).

## Convenciones de código

- Nombrar branches lógicos con precisión en mensajes de error — revisar gramática
  en inglés antes de comitear (ej. "Cannot edit sets _in_ a finished session", no
  "_to_ a finished session").
- Commits: Conventional Commits, atómicos.

## Gotchas del entorno de desarrollo (Windows específico)

- Si el proyecto vive dentro de una carpeta sincronizada por OneDrive, `npm run 
start:dev` puede fallar con `Cannot find module '.../dist/main'` de forma
  intermitente — condición de carrera entre OneDrive y la escritura de `dist/`. Fix:
  borrar `dist/` y cualquier `tsconfig.tsbuildinfo` manualmente, volver a correr.
  Solución de fondo: mover el proyecto fuera de OneDrive.
- `tsconfig.tsbuildinfo` debe estar en `.gitignore` (`*.tsbuildinfo`) — es caché
  local de compilación incremental, nunca debe comitearse.

## Estado actual (actualizado 23 sept 2026)

**Completo:** Auth (registro/login con JWT+bcrypt), Exercises (catálogo), Programs
(ciclo de vida ACTIVE/AVAILABLE/ARCHIVED), Routines (con RoutineExercises anidados),
WorkoutSessions (crear/finalizar), WorkoutSets (crear/actualizar/eliminar, endpoint
de "previous values" posición-por-posición excluyendo sesiones sin terminar), índice
en `exerciseId`, restricción única de `order` con reintento ante condición de carrera.

**En progreso (23 sept):** agregar `setType` a `CreateWorkoutSetDto` (hoy no está —
el campo existe en el schema con default `NORMAL`, pero no es editable desde la API
al crear). Necesario para el selector de tipo de serie que se está construyendo en
el frontend en paralelo.

**Pendiente:** refresh token (access + refresh, ver `docs/ideas-v2.md`), endpoint de
"descartar sesión" (distinto de finalizar — ver `docs/ideas-v2.md`, sección "Sesión
activa minimizable").

## Documentos de referencia — consultar cuándo

- `docs/roadmap.html` — plan de fases completo, abrir en navegador.
- `docs/ideas-v2.md` — todo lo pospuesto, con su razón. Revisar antes de sugerir
  cualquier feature "nueva" como si no se hubiera evaluado ya.
- `docs/api-documentation.md` — documentación de endpoints existentes.
- `docs/database-documentation.md` — schema y relaciones completas.

## Filosofía de trabajo de Valdo (aplica también a Claude Code)

Mismo criterio que en el frontend: prioriza explicar el _porqué_ sobre solo dar el
fix, confirma `git status`/`git diff` antes de asumir qué cambió, decisiones de
alcance explícitas antes de construir algo no pedido, commits atómicos siempre.
