# Stass – Redactor de fotos privado

¿Has querido compartir una foto pero aparece una matrícula, una cara o datos que preferirías ocultar? Stass te ayuda a redactar (tapar) esas partes rápido y en privado, sin subir nada a la nube. Funciona 100% en tu navegador.

Qué hace (de forma sencilla y útil)
- Importas una imagen arrastrándola a la app.
- Seleccionas zonas con un rectángulo.
- Tapas esas zonas con un estilo (por ahora: caja negra). 
- Exportas la imagen final lista para compartir.

Por qué es diferente
- Privacidad real: el procesamiento es local. No hay servidores.
- Enfoque práctico: menos botones, más velocidad.
- MVP honesto: empezamos por lo básico y lo vamos mejorando.

Primeras versiones (MVP)
- Importación por arrastrar/soltar (`PNG`, `JPG`).
- Redacción con rectángulos (caja negra).
- Exportar manteniendo la resolución original.

Próximos pasos (cuando el MVP esté estable)
- Nuevos estilos: blur y pixelado.
- Trazos libres para zonas irregulares.
- Capas y deshacer/rehacer.
- Opción de eliminar metadatos EXIF.

Cómo lo construiremos
- Frontend: `React` + `Vite` + `TypeScript`.
- Renderizado: `Canvas` para aplicar la redacción.
- Sin backend: todo local para empezar.

Uso (cuando el código esté listo)
1) `git clone https://github.com/sergio001g/stass.git`
2) `npm install`
3) `npm run dev`
4) Abrir `http://localhost:5173`

Contribución
- Issues pequeños y claros.
- PRs cortos y directos.
- Priorizamos privacidad y simplicidad.

Listo: ahora comenzamos a escribir el código del MVP.

Repositorio inicial para el proyecto `stass`.

Este commit crea el archivo README para poder inicializar y subir el repositorio a GitHub.