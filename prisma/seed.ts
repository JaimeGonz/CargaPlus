import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Buscar o crear el usuario semilla
  const hashedPassword = await bcrypt.hash('12345678', 10);

  const user = await prisma.user.upsert({
    where: { email: 'valdoc7@gmail.com' },
    update: {},
    create: {
      email: 'valdoc7@gmail.com',
      password: hashedPassword,
      name: 'Valdo',
    },
  });

  console.log(`Usuario listo: ${user.email} (id: ${user.id})`);

  // 2. Crear el catálogo de ejercicios
  const exercisesData = [
    {
      name: 'Press banca inclinado con barra',
      muscleGroup: 'Pecho',
      equipment: 'Barra',
    },
    {
      name: 'Press banca plano con mancuernas',
      muscleGroup: 'Pecho',
      equipment: 'Mancuernas',
    },
    {
      name: 'Press inclinado con mancuernas',
      muscleGroup: 'Pecho',
      equipment: 'Mancuernas',
    },
    {
      name: 'Press militar barra de pie',
      muscleGroup: 'Hombros',
      equipment: 'Barra',
    },
    {
      name: 'Elevaciones laterales en cable',
      muscleGroup: 'Hombros',
      equipment: 'Cable',
    },
    {
      name: 'Elevaciones laterales con mancuerna',
      muscleGroup: 'Hombros',
      equipment: 'Mancuernas',
    },
    {
      name: 'Face pulls con cuerda',
      muscleGroup: 'Hombros',
      equipment: 'Cable',
    },
    {
      name: 'Press de tríceps en polea con barra recta',
      muscleGroup: 'Tríceps',
      equipment: 'Cable',
    },
    {
      name: 'Extensión de tríceps con cuerda sobre cabeza',
      muscleGroup: 'Tríceps',
      equipment: 'Cable',
    },
    {
      name: 'Sentadilla trasera con barra',
      muscleGroup: 'Piernas',
      equipment: 'Barra',
    },
    {
      name: 'Prensa 45° pies juntos y altos',
      muscleGroup: 'Piernas',
      equipment: 'Máquina',
    },
    {
      name: 'Extensión de cuádriceps en máquina',
      muscleGroup: 'Piernas',
      equipment: 'Máquina',
    },
    {
      name: 'Sentadilla búlgara (split squat)',
      muscleGroup: 'Piernas',
      equipment: 'Mancuernas',
    },
    {
      name: 'Peso muerto rumano (RDL)',
      muscleGroup: 'Piernas',
      equipment: 'Barra',
    },
    {
      name: 'Peso muerto convencional con barra',
      muscleGroup: 'Piernas',
      equipment: 'Barra',
    },
    {
      name: 'Hip thrust con barra',
      muscleGroup: 'Glúteos',
      equipment: 'Barra',
    },
    {
      name: 'Curl femoral tumbado en máquina',
      muscleGroup: 'Piernas',
      equipment: 'Máquina',
    },
    {
      name: 'Elevación de talones de pie',
      muscleGroup: 'Pantorrilla',
      equipment: 'Máquina',
    },
    {
      name: 'Elevación de talones sentado',
      muscleGroup: 'Pantorrilla',
      equipment: 'Máquina',
    },
    {
      name: 'Dominadas con mochila',
      muscleGroup: 'Espalda',
      equipment: 'Peso corporal',
    },
    {
      name: 'Remo Pendlay con barra',
      muscleGroup: 'Espalda',
      equipment: 'Barra',
    },
    {
      name: 'Jalón al pecho polea agarre neutro',
      muscleGroup: 'Espalda',
      equipment: 'Cable',
    },
    {
      name: 'Remo en polea baja agarre ancho',
      muscleGroup: 'Espalda',
      equipment: 'Cable',
    },
    {
      name: 'Pullover en polea alta',
      muscleGroup: 'Espalda',
      equipment: 'Cable',
    },
    {
      name: 'Encogimientos con barra',
      muscleGroup: 'Espalda',
      equipment: 'Barra',
    },
    {
      name: 'Curl bíceps concentrado',
      muscleGroup: 'Bíceps',
      equipment: 'Mancuernas',
    },
    { name: 'Curl en polea baja', muscleGroup: 'Bíceps', equipment: 'Cable' },
    {
      name: 'Curl martillo con mancuernas',
      muscleGroup: 'Bíceps',
      equipment: 'Mancuernas',
    },
    { name: 'Rueda de abdomen', muscleGroup: 'Core', equipment: 'Rueda' },
    {
      name: 'Plancha con rotación lateral',
      muscleGroup: 'Core',
      equipment: 'Peso corporal',
    },
  ];

  const exerciseMap = new Map<string, number>();

  for (const ex of exercisesData) {
    const exercise = await prisma.exercise.create({
      data: { ...ex },
    });

    exerciseMap.set(ex.name, exercise.id);
  }

  console.log('ExerciseMap: ');
  console.log(exerciseMap);

  console.log(`${exerciseMap.size} ejercicios creados.`);

  // 3. Crear las 5 rutinas con sus ejercicios

  await prisma.routine.create({
    data: {
      userId: user.id,
      name: 'Upper A - Empuje dominante',
      type: 'Upper/Lower Híbrido',
      weeklyFrequency: 5,
      routineExercises: {
        create: [
          {
            exerciseId: exerciseMap.get('Press banca inclinado con barra')!,
            sets: 4,
            repsMin: 6,
            repsMax: 8,
            order: 1,
            notes: 'PRINCIPAL — registra en bitácora',
          },
          {
            exerciseId: exerciseMap.get('Press banca plano con mancuernas')!,
            sets: 3,
            repsMin: 10,
            repsMax: 12,
            order: 2,
            notes: 'Rango completo, estiramiento pectoral',
          },
          {
            exerciseId: exerciseMap.get('Press militar barra de pie')!,
            sets: 4,
            repsMin: 8,
            repsMax: 10,
            order: 3,
            notes: 'Sin impulso de piernas',
          },
          {
            exerciseId: exerciseMap.get('Elevaciones laterales en cable')!,
            sets: 4,
            repsMin: 15,
            repsMax: 20,
            order: 4,
            notes: 'Peso fijo — doble progresión',
          },
          {
            exerciseId: exerciseMap.get(
              'Press de tríceps en polea con barra recta',
            )!,
            sets: 4,
            repsMin: 10,
            repsMax: 12,
            order: 5,
            notes: 'Codos fijos al cuerpo',
          },
          {
            exerciseId: exerciseMap.get(
              'Extensión de tríceps con cuerda sobre cabeza',
            )!,
            sets: 3,
            repsMin: 12,
            repsMax: 15,
            order: 6,
            notes: 'Movimiento lento y controlado',
          },
        ],
      },
    },
  });

  await prisma.routine.create({
    data: {
      userId: user.id,
      name: 'Lower A - Cuádriceps dominante',
      type: 'Upper/Lower Híbrido',
      weeklyFrequency: 5,
      routineExercises: {
        create: [
          {
            exerciseId: exerciseMap.get('Sentadilla trasera con barra')!,
            sets: 4,
            repsMin: 6,
            repsMax: 8,
            order: 1,
            notes: 'PRINCIPAL — registra en bitácora',
          },
          {
            exerciseId: exerciseMap.get('Prensa 45° pies juntos y altos')!,
            sets: 4,
            repsMin: 10,
            repsMax: 12,
            order: 2,
            notes: 'No bloquees rodilla al extender',
          },
          {
            exerciseId: exerciseMap.get('Extensión de cuádriceps en máquina')!,
            sets: 3,
            repsMin: 15,
            repsMax: 15,
            order: 3,
            notes: 'Squeeze 1 seg arriba',
          },
          {
            exerciseId: exerciseMap.get('Peso muerto rumano (RDL)')!,
            sets: 3,
            repsMin: 10,
            repsMax: 12,
            order: 4,
            notes: 'Bisagra de cadera, espalda neutral',
          },
          {
            exerciseId: exerciseMap.get('Elevación de talones de pie')!,
            sets: 4,
            repsMin: 15,
            repsMax: 20,
            order: 5,
            notes: 'Pausa 1 seg arriba',
          },
          {
            exerciseId: exerciseMap.get('Rueda de abdomen')!,
            sets: 3,
            repsMin: 10,
            repsMax: 10,
            order: 6,
            notes: 'Desde rodillas si falla la forma',
          },
        ],
      },
    },
  });

  await prisma.routine.create({
    data: {
      userId: user.id,
      name: 'Especialización - Hombros y Espalda Superior',
      type: 'Upper/Lower Híbrido',
      weeklyFrequency: 5,
      routineExercises: {
        create: [
          {
            exerciseId: exerciseMap.get('Face pulls con cuerda')!,
            sets: 4,
            repsMin: 20,
            repsMax: 20,
            order: 1,
            notes: 'Polea a altura de ojos — no al tope',
          },
          {
            exerciseId: exerciseMap.get('Elevaciones laterales con mancuerna')!,
            sets: 5,
            repsMin: 15,
            repsMax: 20,
            order: 2,
            notes: 'Prioridad #1 estética — peso fijo',
          },
          {
            exerciseId: exerciseMap.get('Pullover en polea alta')!,
            sets: 3,
            repsMin: 12,
            repsMax: 12,
            order: 3,
            notes: 'Polea al tope — brazos extendidos',
          },
          {
            exerciseId: exerciseMap.get('Encogimientos con barra')!,
            sets: 3,
            repsMin: 12,
            repsMax: 15,
            order: 4,
            notes: 'Más peso + pausa 2 seg arriba + brazos rectos',
          },
          {
            exerciseId: exerciseMap.get('Curl bíceps concentrado')!,
            sets: 3,
            repsMin: 12,
            repsMax: 12,
            order: 5,
            notes: 'Bajada en 3 seg',
          },
        ],
      },
    },
  });

  await prisma.routine.create({
    data: {
      userId: user.id,
      name: 'Upper B - Jalón dominante',
      type: 'Upper/Lower Híbrido',
      weeklyFrequency: 5,
      routineExercises: {
        create: [
          {
            exerciseId: exerciseMap.get('Dominadas con mochila')!,
            sets: 4,
            repsMin: 6,
            repsMax: 8,
            order: 1,
            notes: 'PRINCIPAL — mochila con 5 kg ya',
          },
          {
            exerciseId: exerciseMap.get('Remo Pendlay con barra')!,
            sets: 4,
            repsMin: 6,
            repsMax: 8,
            order: 2,
            notes: 'Barra parte del piso cada rep',
          },
          {
            exerciseId: exerciseMap.get('Jalón al pecho polea agarre neutro')!,
            sets: 3,
            repsMin: 10,
            repsMax: 12,
            order: 3,
            notes: 'Codos al cuerpo al bajar',
          },
          {
            exerciseId: exerciseMap.get('Remo en polea baja agarre ancho')!,
            sets: 3,
            repsMin: 12,
            repsMax: 12,
            order: 4,
            notes: 'No te inclines',
          },
          {
            exerciseId: exerciseMap.get('Press inclinado con mancuernas')!,
            sets: 3,
            repsMin: 10,
            repsMax: 12,
            order: 5,
            notes: 'Segunda frecuencia pecho',
          },
          {
            exerciseId: exerciseMap.get('Curl en polea baja')!,
            sets: 3,
            repsMin: 12,
            repsMax: 15,
            order: 6,
            notes: 'Codos fijos',
          },
          {
            exerciseId: exerciseMap.get('Curl martillo con mancuernas')!,
            sets: 3,
            repsMin: 10,
            repsMax: 10,
            order: 7,
            notes: 'Estandariza en 30 lb todos los sets',
          },
        ],
      },
    },
  });

  await prisma.routine.create({
    data: {
      userId: user.id,
      name: 'Lower B - Femoral y Glúteo dominante',
      type: 'Upper/Lower Híbrido',
      weeklyFrequency: 5,
      routineExercises: {
        create: [
          {
            exerciseId: exerciseMap.get('Peso muerto convencional con barra')!,
            sets: 3,
            repsMin: 5,
            repsMax: 5,
            order: 1,
            notes: 'Patrón primero — espalda neutral',
          },
          {
            exerciseId: exerciseMap.get('Hip thrust con barra')!,
            sets: 4,
            repsMin: 10,
            repsMax: 12,
            order: 2,
            notes: 'Pausa 1 seg arriba — progresa desde 120 kg',
          },
          {
            exerciseId: exerciseMap.get('Sentadilla búlgara (split squat)')!,
            sets: 3,
            repsMin: 10,
            repsMax: 10,
            order: 3,
            notes: 'Torso ligeramente adelante (10 c/pierna)',
          },
          {
            exerciseId: exerciseMap.get('Curl femoral tumbado en máquina')!,
            sets: 4,
            repsMin: 12,
            repsMax: 15,
            order: 4,
            notes: 'Bajada en 3 seg',
          },
          {
            exerciseId: exerciseMap.get('Elevación de talones sentado')!,
            sets: 3,
            repsMin: 20,
            repsMax: 20,
            order: 5,
            notes: 'Sóleo — diferente al de pie',
          },
          {
            exerciseId: exerciseMap.get('Plancha con rotación lateral')!,
            sets: 3,
            repsMin: 30,
            repsMax: 30,
            order: 6,
            notes: 'Cadera estable (30 seg por lado)',
          },
        ],
      },
    },
  });

  console.log('5 rutinas creadas con sus ejercicios.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
