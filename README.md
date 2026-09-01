# Carga+ 🏋️

App full-stack de seguimiento de entrenamiento (gym tracking). Permite crear rutinas con ejercicios personalizados, registrar sesiones de entrenamiento en tiempo real y llevar un historial de progreso.

Proyecto personal en desarrollo activo — construido de cero para practicar diseño de arquitectura backend real, no solo consumir tutoriales.

## Stack

**Backend**
- NestJS + TypeScript
- Prisma ORM + PostgreSQL
- Autenticación JWT (Passport)
- Documentación con Swagger

**Frontend** (próximamente)
- Next.js

## Estado del proyecto

| Módulo | Estado |
|---|---|
| Auth (register / login) | ✅ Completo |
| Exercises (CRUD) | ✅ Completo |
| Routines (CRUD + relaciones anidadas) | ✅ Completo |
| Workout Sessions (crear, listar, finalizar) | ✅ Completo |
| Workout Sets | ⏳ En desarrollo |
| Seeds | ⏳ Pendiente |
| Deploy | ⏳ Pendiente |
| Frontend (Next.js) | ⏳ Pendiente |

## Arquitectura

El backend sigue una separación estricta en 4 capas por módulo:

```
Controller  → traduce HTTP a llamadas de método (sin lógica de negocio)
Service     → orquesta reglas de negocio (validaciones, permisos)
Repository  → única capa que habla con Prisma / la base de datos
DTOs        → validación y documentación de cada request (class-validator + Swagger)
```

Esta separación permite, por ejemplo, cambiar de ORM sin tocar la lógica de negocio, o testear el Service de forma aislada sin necesitar una base de datos real.

## Decisiones técnicas destacadas

- **Nested writes de Prisma**: al crear una rutina, sus ejercicios se crean en la misma operación atómica (`routine.create` con `routineExercises: { create: [...] }`), evitando el riesgo de una rutina huérfana sin ejercicios si algo falla a medias.
- **Prevención de IDOR**: los endpoints de detalle/edición/borrado usan `findFirst({ where: { id, userId } })` en vez de `findUnique({ id })`, para que un usuario nunca pueda acceder a datos de otro solo adivinando IDs.
- **Cascade deletes**: configurado en el schema (`onDelete: Cascade`) para que borrar una rutina elimine automáticamente sus ejercicios relacionados, sin dejar registros huérfanos.
- **Tipado con Prisma types**: los métodos de actualización usan tipos generados por Prisma (`Prisma.WorkoutSessionUpdateInput`) en vez de `any`, para que TypeScript valide en tiempo de compilación qué campos son válidos.
- **Reglas de negocio explícitas**: por ejemplo, no se puede finalizar dos veces la misma sesión de entrenamiento — validado en el Service, no solo confiado a la base de datos.

## Cómo correrlo localmente

```bash
# clonar el repo
git clone https://github.com/JaimeGonz/CargaPlus.git
cd CargaPlus

# instalar dependencias
npm install

# configurar variables de entorno
cp .env.example .env
# completar DATABASE_URL y JWT_SECRET en .env

# correr migraciones
npx prisma migrate dev

# levantar el servidor en modo desarrollo
npm run start:dev
```

La API queda disponible en `http://localhost:3000`. Documentación interactiva de endpoints (Swagger) en `http://localhost:3000/api` *(ajustar ruta si es distinta en el proyecto)*.

> Proyecto actualmente en desarrollo local — deploy a producción pendiente.

## Roadmap

- [ ] Completar `WorkoutSetsModule` (registro de series dentro de una sesión)
- [ ] Seeds de ejercicios base
- [ ] Dockerizar y desplegar backend (Railway)
- [ ] Construir frontend con Next.js
- [ ] Deploy completo end-to-end

## Autor

**Jaime González** — Full-Stack Developer
[LinkedIn](https://linkedin.com/in/jaimegonz01) · [GitHub](https://github.com/JaimeGonz)