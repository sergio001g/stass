# Stass – Micro gestor de tareas y hábitos (MVP)

Stass es un producto pequeño y útil para gestionar tareas y hábitos diarios con enfoque minimalista. La idea es construir juntos un MVP rápido que te permita:

- Crear tareas y marcarlas como completadas.
- Definir hábitos (ej. beber agua, leer) y registrar su cumplimiento diario.
- Ver estadísticas simples (tareas completadas hoy, streaks de hábitos).
- Mantener todo offline primero, con sincronización opcional más adelante.

Estado actual: documentación inicial para arrancar el proyecto.

## Objetivos del MVP

- Simplicidad: interfaz limpia, 0 fricción para añadir y completar.
- Rapidez: carga instantánea, operaciones locales.
- Claridad: métricas básicas y útiles (streak, completadas hoy, pendientes).

## Funcionalidades del MVP

- Tareas
  - Crear, editar, completar, borrar.
  - Agrupar por “hoy”, “esta semana”.
- Hábitos
  - Crear hábito con periodicidad diaria.
  - Marcar cumplimiento por día y calcular streak.
- Estadísticas
  - Contadores de tareas completadas hoy.
  - Streak actual por hábito.

## Pila tecnológica sugerida

Opción Web (recomendada para empezar):
- Frontend: `React` + `Vite` + `TypeScript`.
- Estado: `Zustand` o `Redux Toolkit` (simple preferible).
- Persistencia local: `localStorage` o `IndexedDB` (via `idb`), sin backend inicialmente.
- Estilos: `TailwindCSS` o CSS simple.

Opción CLI (alternativa mínima):
- Lenguaje: `Python`.
- Persistencia: archivo `JSON` local.

Podemos empezar por la opción Web y luego añadir un backend si hace falta.

## Estructura prevista (Web)

- `src/`
  - `components/` (Lista de tareas, hábitos, estadísticas)
  - `store/` (estado global: tareas, hábitos)
  - `utils/` (persistencia local, helpers)
  - `pages/` (Home, Estadísticas)

## Roadmap propuesto

1. Día 1–2: Estructura del proyecto (Vite + React) y estado básico.
2. Día 3–4: CRUD de tareas y persistencia en `localStorage`.
3. Día 5–6: Módulo de hábitos y cálculo de streak.
4. Día 7: Estadísticas simples y pulido visual.
5. V2 (opcional): Sincronización en la nube y autenticación.

## Guía de inicio (cuando exista el código)

1. Clonar el repo: `git clone https://github.com/sergio001g/stass.git`
2. Instalar dependencias: `npm install`
3. Ejecutar desarrollo: `npm run dev`
4. Abrir en navegador: `http://localhost:5173`

## Cómo colaborar (tú y yo)

- Abrimos issues con tareas claras del roadmap.
- Trabajamos por PRs pequeños y revisiones rápidas.
- Priorizamos entregar valor del MVP antes del “nice to have”.

---

Este README es el primer archivo del repositorio y define el producto pequeño que podemos construir juntos. A continuación haré el push inicial para que quede publicado en GitHub.

Repositorio inicial para el proyecto `stass`.

Este commit crea el archivo README para poder inicializar y subir el repositorio a GitHub.