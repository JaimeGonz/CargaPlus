# Carga+ — Documentación de API

> Backend: NestJS + Swagger
> Base URL (producción): `https://cargaplus-production.up.railway.app`
> Base URL (local): `http://localhost:3000`
> Swagger interactivo: `{baseUrl}/api`
> Última actualización: 5 de septiembre de 2026

---

## Autenticación

Todos los endpoints, **excepto los de `/auth`**, requieren un JWT en el header:

```
Authorization: Bearer <token>
```

El `token` se obtiene al hacer login. El `userId` del usuario autenticado se extrae del payload del JWT en cada request — nunca se recibe del cliente vía body/params, por seguridad.

---

## Índice de módulos

1. [Auth](#1-auth)
2. [Exercises](#2-exercises)
3. [Programs](#3-programs)
4. [Routines](#4-routines)
5. [Workout Sessions](#5-workout-sessions)
6. [Workout Sets](#6-workout-sets)

---

## 1. Auth

### `POST /auth/register`
Registra un nuevo usuario. La contraseña se hashea con bcrypt antes de guardarse.

**Body:**
```json
{
  "email": "valdoc7@gmail.com",
  "password": "12345678",
  "name": "Valdo"
}
```

**Respuesta `201`:**
```json
{
  "id": 1,
  "email": "valdoc7@gmail.com",
  "name": "Valdo"
}
```

### `POST /auth/login`
Autentica y devuelve un JWT.

**Body:**
```json
{
  "email": "valdoc7@gmail.com",
  "password": "12345678"
}
```

**Respuesta `201`:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 2. Exercises

Catálogo de ejercicios, reutilizable en rutinas planeadas y sets reales.

### `POST /exercises`
Crea un ejercicio (global si es sembrado por sistema, o personalizado si lo crea un usuario).

**Body:**
```json
{
  "name": "Press banca inclinado con barra",
  "muscleGroup": "Pecho",
  "equipment": "Barra"
}
```

### `GET /exercises`
Lista el catálogo de ejercicios disponible.

**Respuesta `200`:** array de objetos `Exercise` (ver estructura en la documentación de base de datos).

---

## 3. Programs

Planes de entrenamiento completos, con ciclo de vida de 3 estados (`ACTIVE` / `AVAILABLE` / `ARCHIVED`).

### `POST /programs`
Crea un programa nuevo. Nace siempre en estado `AVAILABLE`.

**Body:**
```json
{
  "name": "Plan de Prueba",
  "splitType": "PUSH_PULL_LEGS"
}
```
*(`splitType` es opcional; valores válidos: `FULL_BODY`, `UPPER_LOWER`, `PUSH_PULL_LEGS`, `BRO_SPLIT`, `HYBRID`, `OTHER`)*

**Respuesta `201`:**
```json
{
  "id": 2,
  "userId": 1,
  "name": "Plan de Prueba",
  "splitType": "PUSH_PULL_LEGS",
  "status": "AVAILABLE",
  "startDate": "2026-09-04T03:57:37.835Z",
  "endDate": null,
  "createdAt": "2026-09-04T03:57:37.835Z"
}
```

### `GET /programs`
Lista los programas del usuario. **Excluye `ARCHIVED` por default.**

**Query params:**
- `archived` (opcional, `"true"` para incluir también los archivados)

**Respuesta `200`:** array de objetos `Program`.

### `GET /programs/:id`
Detalle de un programa. `404` si no existe o no pertenece al usuario.

### `PATCH /programs/:id`
Edita `name` y/o `splitType`. Ambos campos opcionales (actualización parcial).

**Body:**
```json
{ "name": "Nuevo nombre", "splitType": "HYBRID" }
```

### `PATCH /programs/:id/activate`
Activa el programa. **Si el usuario tenía otro programa `ACTIVE`, se desactiva automáticamente a `AVAILABLE` en la misma transacción** (garantiza que solo exista un programa activo a la vez).

Sin body.

### `PATCH /programs/:id/deactivate`
Desactiva el programa (`ACTIVE` → `AVAILABLE`). **Solo permitido si el programa está actualmente `ACTIVE`** — devuelve `400 Bad Request` en cualquier otro caso.

### `PATCH /programs/:id/archive`
Archiva el programa (`status` → `ARCHIVED`, `endDate` → fecha actual). Permitido desde `ACTIVE` o `AVAILABLE`. `400 Bad Request` si ya estaba `ARCHIVED`.

### `PATCH /programs/:id/unarchive`
Restaura un programa archivado (`status` → `AVAILABLE`, `endDate` → `null`). **Solo permitido si el programa está `ARCHIVED`** — no lo vuelve `ACTIVE` automáticamente, solo lo hace visible/elegible de nuevo.

### `DELETE /programs/:id`
Elimina el programa **y, en cascada, todas sus rutinas y ejercicios planeados**. Operación excepcional — el flujo recomendado para dejar de usar un plan es archivarlo, no borrarlo.

---

## 4. Routines

Días de entrenamiento individuales dentro de un `Program`.

### `POST /programs/:programId/routines`
Crea una rutina dentro de un programa específico. Verifica que el `Program` exista y pertenezca al usuario antes de crear.

**Body:**
```json
{
  "name": "Upper A - Empuje dominante",
  "type": "UPPER",
  "dayOfWeek": 1,
  "routineExercises": [
    {
      "exerciseId": 1,
      "sets": 4,
      "repsMin": 6,
      "repsMax": 8,
      "order": 1,
      "notes": "PRINCIPAL — registra en bitácora"
    }
  ]
}
```
*(`type` es opcional; valores válidos: `PUSH`, `PULL`, `LEGS`, `UPPER`, `LOWER`, `FULL_BODY`, `SPECIALIZATION`, `OTHER`. `dayOfWeek` opcional, `1`=lunes … `7`=domingo)*

**Respuesta `201`:**
```json
{
  "id": 1,
  "name": "Upper A - Empuje dominante",
  "description": null,
  "type": "UPPER",
  "dayOfWeek": 1,
  "userId": 1,
  "createdAt": "2026-09-03T18:28:40.900Z",
  "programId": 1
}
```

### `GET /routines`
Lista todas las rutinas del usuario (sin importar a qué programa pertenezcan).

### `GET /routines/:id`
Detalle de una rutina, **incluyendo sus `routineExercises`**.

**Respuesta `200` (ejemplo real):**
```json
{
  "id": 1,
  "name": "Upper A - Empuje dominante",
  "type": "UPPER",
  "dayOfWeek": 1,
  "userId": 1,
  "programId": 1,
  "routineExercises": [
    {
      "id": 1,
      "routineId": 1,
      "exerciseId": 1,
      "sets": 4,
      "repsMin": 6,
      "repsMax": 8,
      "order": 1,
      "notes": "PRINCIPAL — registra en bitácora",
      "rir": null,
      "restSeconds": null
    }
  ]
}
```

### `PATCH /routines/:id`
Edita una rutina existente (actualización parcial).

### `DELETE /routines/:id`
Elimina la rutina y, en cascada, sus `routineExercises`.

---

## 5. Workout Sessions

Sesiones reales de entrenamiento.

### `POST /workout-sessions`
Inicia una sesión nueva. `routineId` es opcional (permite entrenamiento libre).

**Body:**
```json
{ "routineId": 2 }
```

**Respuesta `201`:**
```json
{
  "id": 3,
  "userId": 1,
  "routineId": 2,
  "startTime": "2026-09-02T00:00:00.000Z",
  "endTime": null,
  "isCompleted": false,
  "notes": null,
  "createdAt": "2026-09-02T00:00:00.000Z"
}
```

### `GET /workout-sessions`
Lista las sesiones del usuario.

### `GET /workout-sessions/:id`
Detalle de una sesión, **incluyendo sus `workoutSets`**.

### `PATCH /workout-sessions/:id`
Finaliza la sesión (`isCompleted` → `true`, `endTime` → fecha actual). **`400 Bad Request` si la sesión ya estaba finalizada.**

**Body (opcional):**
```json
{ "notes": "Buena sesión, subí peso en press banca" }
```

---

## 6. Workout Sets

Series individuales registradas dentro de una sesión — la unidad de dato más granular del sistema.

### `POST /workout-sessions/:sessionId/sets`
Registra un nuevo set. `order` se calcula automáticamente (cuenta los sets existentes de la sesión + 1) — no se envía desde el cliente. **`400 Bad Request` si la sesión ya está finalizada** (`isCompleted: true`).

**Body:**
```json
{
  "exerciseId": 1,
  "weight": 60,
  "reps": 10,
  "rir": 2
}
```
*(`weight`, `rir`, `notes` opcionales; `exerciseId` y `reps` obligatorios)*

**Respuesta `201`:**
```json
{
  "id": 1,
  "sessionId": 3,
  "exerciseId": 1,
  "order": 1,
  "weight": 60,
  "reps": 10,
  "rir": 2,
  "isCompleted": false,
  "notes": null
}
```

### `GET /workout-sessions/:sessionId/sets`
Lista los sets de una sesión, **ordenados cronológicamente** (`orderBy: order asc`).

### `PATCH /workout-sessions/:sessionId/sets/:setId`
Edita un set existente. **Sí permitido aunque la sesión ya haya finalizado** (a diferencia de crear uno nuevo) — permite corregir datos mal registrados. Verifica que el set pertenezca específicamente a la sesión indicada en la URL (previene edición cruzada entre sesiones).

### `DELETE /workout-sessions/:sessionId/sets/:setId`
Elimina un set. Misma verificación de pertenencia sesión↔set que `PATCH`.

---

## Resumen de reglas de negocio no obvias (para quien integre con esta API)

| Regla | Dónde aplica |
|---|---|
| Solo puede haber 1 `Program` con `status: ACTIVE` por usuario | `PATCH /programs/:id/activate` (transaccional) |
| No se puede crear un `WorkoutSet` en una sesión ya finalizada | `POST /workout-sessions/:sessionId/sets` |
| Sí se puede editar/borrar un `WorkoutSet` en una sesión finalizada | `PATCH` / `DELETE` de sets |
| No se puede finalizar una `WorkoutSession` dos veces | `PATCH /workout-sessions/:id` |
| `order` de un `WorkoutSet` siempre se calcula en backend | Nunca se acepta del cliente |
| Todo endpoint con `:id` verifica dueño (`userId` del JWT) antes de responder | Todos los módulos — `404` si no es del usuario |
