# Carga+ — Documentación de Base de Datos

> Backend: NestJS + Prisma ORM + PostgreSQL
> Última actualización: 5 de septiembre de 2026

---

## Índice

1. [Diagrama de relaciones (resumen)](#diagrama-de-relaciones-resumen)
2. [Enums](#enums)
3. [Modelos](#modelos)
4. [Relaciones y reglas de eliminación (cascade)](#relaciones-y-reglas-de-eliminación-cascade)
5. [Índices únicos](#índices-únicos)
6. [Decisiones de diseño](#decisiones-de-diseño)

---

## Diagrama de relaciones (resumen)

```
User (1) ──< (N) Program ──< (N) Routine ──< (N) RoutineExercise >── (1) Exercise
  │                                │
  │                                └──< (N) WorkoutSession
  │
  └──< (N) WorkoutSession ──< (N) WorkoutSet >── (1) Exercise
```

- Un `User` tiene muchos `Program`, y también muchas `WorkoutSession` directamente.
- Un `Program` agrupa muchas `Routine` (los "días" de un plan de entrenamiento).
- Una `Routine` tiene muchos `RoutineExercise` (los ejercicios planeados de ese día).
- Una `WorkoutSession` (sesión real de entrenamiento) puede estar ligada opcionalmente a una `Routine`, y contiene muchos `WorkoutSet` (las series realmente registradas).
- `Exercise` es un catálogo reutilizable: el mismo ejercicio puede aparecer tanto en `RoutineExercise` (plan) como en `WorkoutSet` (registro real).

---

## Enums

### `SetType`
Tipo de serie registrada durante un entrenamiento real.

| Valor | Significado |
|---|---|
| `NORMAL` | Serie de trabajo estándar (default) |
| `WARMUP` | Serie de calentamiento — se puede excluir de estadísticas de volumen/PRs |
| `DROPSET` | Serie con reducción de peso inmediata al fallo |
| `FAILURE` | Serie llevada al fallo muscular |
| `OTHER` | Cualquier otro tipo no cubierto arriba |

### `ProgramStatus`
Estado de un plan de entrenamiento (`Program`).

| Valor | Significado |
|---|---|
| `ACTIVE` | El plan que el usuario sigue actualmente. **Solo puede haber uno por usuario a la vez** (garantizado por transacción, ver [Decisiones de diseño](#decisiones-de-diseño)). |
| `AVAILABLE` | Plan guardado, visible, elegible para activarse — pero no es el actual. |
| `ARCHIVED` | Plan archivado — oculto del listado por default, recuperable vía `unarchive`. |

### `SplitType`
Categoría general de un `Program` (opcional).

| Valor |
|---|
| `FULL_BODY` |
| `UPPER_LOWER` |
| `PUSH_PULL_LEGS` |
| `BRO_SPLIT` |
| `HYBRID` |
| `OTHER` |

### `DayType`
Categoría de un día específico (`Routine`) dentro de un `Program` — puede no coincidir con el `SplitType` del programa padre (ej. un día de "Especialización" dentro de un programa `HYBRID`).

| Valor |
|---|
| `PUSH` |
| `PULL` |
| `LEGS` |
| `UPPER` |
| `LOWER` |
| `FULL_BODY` |
| `SPECIALIZATION` |
| `OTHER` |

---

## Modelos

### `User`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `Int` | PK, autoincremental |
| `email` | `String` | `@unique` |
| `password` | `String` | Hasheado con bcrypt |
| `name` | `String` | |
| `birthDate` | `DateTime?` | Opcional |
| `height` | `Float?` | Opcional |
| `goal` | `String?` | Opcional |
| `createdAt` | `DateTime` | Default `now()` |

**Relaciones:** `routines[]`, `workoutSessions[]`, `programs[]` (todas 1:N, este usuario es el "uno").

---

### `Exercise`

Catálogo de ejercicios — puede ser global (`userId: null`) o personalizado por un usuario.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `Int` | PK |
| `name` | `String` | |
| `muscleGroup` | `String` | Ej. "Pecho", "Espalda" |
| `isCustom` | `Boolean` | Default `false` |
| `equipment` | `String?` | Opcional |
| `description` | `String?` | Opcional |
| `userId` | `Int?` | `null` = ejercicio global del catálogo; con valor = personalizado de ese usuario |
| `createdAt` | `DateTime` | Default `now()` |

**Relaciones:** `routineExercises[]`, `workoutSets[]`.

**Restricción:** `@@unique([name, userId])` — un mismo nombre de ejercicio no puede repetirse para el mismo usuario (o dos veces como global), pero sí puede coincidir entre un ejercicio global y uno personalizado de un usuario distinto.

---

### `Program`

Un plan de entrenamiento completo (ej. "Plan del Nutriólogo A", o un split tipo PPL que el usuario decide seguir).

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `Int` | PK |
| `userId` | `Int` | FK → `User` |
| `name` | `String` | |
| `splitType` | `SplitType?` | Opcional |
| `status` | `ProgramStatus` | Default `AVAILABLE` |
| `startDate` | `DateTime` | Default `now()` |
| `endDate` | `DateTime?` | `null` mientras no está `ARCHIVED`; se limpia a `null` al hacer `unarchive` |
| `createdAt` | `DateTime` | Default `now()` |

**Relaciones:** `user` (N:1), `routines[]` (1:N).

---

### `Routine`

Un día específico de entrenamiento dentro de un `Program` (ej. "Upper A").

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `Int` | PK |
| `name` | `String` | |
| `description` | `String?` | Opcional |
| `type` | `DayType?` | Opcional |
| `dayOfWeek` | `Int?` | `1` = lunes … `7` = domingo. Informativo, no forzado por el sistema (ver Decisiones de diseño) |
| `userId` | `Int` | FK → `User` (redundante respecto a `program.userId`, mantenido por simplicidad de queries — ver Decisiones de diseño) |
| `programId` | `Int` | FK → `Program`, **obligatorio** |
| `createdAt` | `DateTime` | Default `now()` |

**Relaciones:** `user` (N:1), `program` (N:1, `onDelete: Cascade`), `routineExercises[]` (1:N), `workoutSessions[]` (1:N).

---

### `RoutineExercise`

Un ejercicio planeado dentro de una `Routine`, con sus parámetros objetivo (sets, reps).

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `Int` | PK |
| `routineId` | `Int` | FK → `Routine` |
| `exerciseId` | `Int` | FK → `Exercise` |
| `sets` | `Int` | |
| `repsMin` | `Int` | |
| `repsMax` | `Int` | |
| `order` | `Int` | Orden dentro de la rutina |
| `notes` | `String?` | Notas técnicas (ej. "Sin impulso de piernas") |
| `rir` | `Int?` | Reps in reserve objetivo |
| `restSeconds` | `Int?` | Opcional |

**Relaciones:** `routine` (N:1, `onDelete: Cascade`), `exercise` (N:1).

---

### `WorkoutSession`

Una sesión real de entrenamiento (cuando el usuario va al gym).

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `Int` | PK |
| `userId` | `Int` | FK → `User` |
| `routineId` | `Int?` | Opcional — permite entrenamiento "libre" sin rutina asociada |
| `startTime` | `DateTime` | Default `now()` |
| `endTime` | `DateTime?` | Se llena al finalizar |
| `isCompleted` | `Boolean` | Default `false` |
| `notes` | `String?` | Opcional |
| `createdAt` | `DateTime` | Default `now()` |

**Relaciones:** `user` (N:1), `routine` (N:1, opcional), `workoutSets[]` (1:N).

---

### `WorkoutSet`

Una serie real registrada durante una `WorkoutSession`.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `Int` | PK |
| `sessionId` | `Int` | FK → `WorkoutSession` |
| `exerciseId` | `Int` | FK → `Exercise` |
| `order` | `Int` | Autoincremental por sesión (calculado en backend, no lo manda el cliente) |
| `weight` | `Float?` | En kilogramos (normalizado — la conversión kg/lb es responsabilidad del frontend) |
| `reps` | `Int` | Obligatorio |
| `rir` | `Int?` | Opcional |
| `setType` | `SetType` | Default `NORMAL` |
| `isCompleted` | `Boolean` | Default `false` |
| `notes` | `String?` | Opcional |

**Relaciones:** `session` (N:1), `exercise` (N:1).

---

## Relaciones y reglas de eliminación (cascade)

| Relación | Comportamiento al borrar el padre |
|---|---|
| `Program` → `Routine` | **Cascade** — borrar un `Program` borra todas sus `Routine` |
| `Routine` → `RoutineExercise` | **Cascade** — borrar una `Routine` borra todos sus `RoutineExercise` |
| `Routine` → `WorkoutSession` | Sin cascade — una sesión conserva su `routineId` histórico aunque la rutina original ya no exista de la misma forma (relación opcional) |
| `WorkoutSession` → `WorkoutSet` | Sin `onDelete` explícito configurado |

**Nota de diseño:** el borrado de `Program` (con su cascade completo) se trata como una operación **excepcional** — el flujo normal para "dejar de usar un plan" es archivarlo (`PATCH /programs/:id/archive`), no eliminarlo.

---

## Índices únicos

```prisma
// User
email  @unique

// Exercise
@@unique([name, userId])
```

---

## Decisiones de diseño

**Sistema de 3 estados para `Program`** — en vez de un simple booleano `isActive`, se usa el enum `ProgramStatus` con 3 valores. Esto permite representar: el plan que se sigue ahora (`ACTIVE`, único), planes guardados y disponibles para cambiarse (`AVAILABLE`, pueden ser varios), y planes archivados pero recuperables (`ARCHIVED`). La transición a `ACTIVE` (`PATCH /programs/:id/activate`) usa una transacción de Prisma (`$transaction`) para garantizar atómicamente que, si había otro programa `ACTIVE`, pase a `AVAILABLE` en la misma operación — nunca hay un momento con dos programas activos o cero por una falla a medias.

**`Routine.userId` es redundante respecto a `Routine.program.userId`** — se mantiene de forma intencional (no es un descuido) para permitir verificaciones de dueño directas (`findFirst({ where: { id, userId } })`) sin necesitar un `join` a través de `Program` en cada consulta. Trade-off consciente de simplicidad de queries sobre normalización estricta.

**`dayOfWeek` es informativo, no una restricción del sistema** — decisión tomada tras investigar cómo lo resuelven apps del sector (Hevy explícitamente no fuerza una asignación fija rutina↔día). El usuario puede entrenar cualquier `Routine` cualquier día; el campo solo sirve como sugerencia visual para el frontend.

**No existe un campo de "grupo muscular" a nivel de `Routine`** — se deriva consultando `RoutineExercise → Exercise → muscleGroup` cuando se necesita (ej. para mostrar qué músculos trabaja un día tipo "Bro Split"), evitando duplicar información que ya vive en `Exercise`.

**Prevención de IDOR (Insecure Direct Object Reference)** — todos los endpoints de detalle/edición/borrado verifican dueño con `findFirst({ where: { id, userId } })` en vez de `findUnique({ id })`. Para relaciones anidadas (ej. un `WorkoutSet` dentro de una `WorkoutSession`), se verifica adicionalmente que el recurso hijo pertenezca específicamente al padre indicado en la URL, no solo que el padre pertenezca al usuario.

**Peso siempre en kilogramos** — `WorkoutSet.weight` se normaliza siempre a kg en base de datos. La conversión a libras (si el usuario lo prefiere) es responsabilidad exclusiva del frontend, evitando tener que convertir unidades cada vez que se comparan sets entre sí para calcular progreso o récords personales.
