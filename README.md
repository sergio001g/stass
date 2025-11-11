# Stass – Redactor de fotos privado (MVP)

Stass ahora será un redactor de imágenes sencillo y rápido para ocultar información sensible (caras, matrículas, datos personales) antes de compartir fotos. Todo funciona localmente en tu navegador: sin subir a la nube.

Estado: documentación inicial con alcance y plan del MVP.

## Objetivos del MVP

- Privacidad primero: procesamiento offline, sin envíos a servidores.
- Rapidez: arrastrar/soltar, redactar con uno o dos clics.
- Control: diferentes estilos de redacción y exportación al instante.

## Funcionalidades del MVP

- Importar imágenes (`JPG`, `PNG`) por arrastrar/soltar.
- Herramientas de redacción: blur, pixelado y caja negra.
- Formas: rectángulos y trazos libres (freehand) para zonas irregulares.
- Capas: añadir, mover, ocultar/mostrar y borrar redacciones.
- Exportar imagen final manteniendo resolución; opción de eliminar metadatos EXIF.
- Atajos básicos: `Ctrl+Z` deshacer, `Del` borrar capa seleccionada.

## Pila tecnológica sugerida

- Frontend: `React` + `Vite` + `TypeScript`.
- Renderizado: `Canvas`/`OffscreenCanvas` para aplicar blur/pixelado.
- Estado: `Zustand` para simplicidad.
- Persistencia: ninguna (proyecto local y sin backend para MVP).
- Estilos: `TailwindCSS` o CSS simple.

## Estructura prevista (Web)

- `src/`
  - `components/` (Lienzo, barras de herramientas, lista de capas)
  - `store/` (capas, selecciones, historial)
  - `utils/` (operaciones de canvas, exportado y EXIF)
  - `pages/` (Editor principal)

## Roadmap propuesto

1. Día 1: Proyecto base (Vite + React), lienzo e importación.
2. Día 2: Herramientas de rectángulo con blur/pixelado/caja negra.
3. Día 3: Capas y deshacer/rehacer; exportar imagen.
4. Día 4: Trazos libres e interfaz pulida.
5. V2 (opcional): detección automática de caras y placas; presets.

## Guía de inicio (cuando exista el código)

1. Clonar: `git clone https://github.com/sergio001g/stass.git`
2. Instalar: `npm install`
3. Ejecutar: `npm run dev`
4. Abrir: `http://localhost:5173`

## Cómo colaborar

- Definimos issues por cada herramienta (blur, pixelado, exportación).
- PRs pequeños, revisiones rápidas y foco en rendimiento en canvas.
- Validamos privacidad (sin subidas) y UX de un solo clic.

---

Con esto el proyecto queda menos común y más útil en privacidad. Si te gusta, creo el esqueleto y empezamos por el lienzo y la importación de imágenes.

Repositorio inicial para el proyecto `stass`.

Este commit crea el archivo README para poder inicializar y subir el repositorio a GitHub.