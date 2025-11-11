# Stass — Redactor local de imágenes y video (beta)

Aplicación web para ocultar información sensible en contenido visual. El procesamiento se realiza localmente en el navegador; no se envían archivos a servidores.

## Características
- Redacción de imágenes: caja negra, desenfoque y pixelado con controles de intensidad.
- Exportación de imágenes: `PNG` a resolución original, sin metadatos `EXIF`.
- Interfaz cuidada: tema oscuro/claro, fondo animado, cabecera con enlaces.
- Redacción de video (beta): caja negra sobre un rango de tiempo definido y exportación a `WEBM` con audio.

## Requisitos
- Navegadores con soporte de `MediaRecorder` y `HTMLCanvasElement.captureStream` (Chrome/Edge recientes). En Firefox, el soporte puede variar.
- Node.js 18+ para ejecutar el servidor de desarrollo.

## Instalación y ejecución
```bash
npm install
npm run dev
```
El servidor de desarrollo inicia normalmente en `http://localhost:5173/`.

## Uso

### Imágenes
- En la pestaña “Imagen”, se permite arrastrar y soltar un archivo o utilizar el botón de carga.
- Se elige el estilo de redacción: caja negra, desenfoque o pixelado.
- Se dibujan uno o varios rectángulos sobre la imagen.
- Se exporta en `PNG`. La exportación utiliza el lienzo del navegador, por lo que se eliminan metadatos `EXIF`.

### Video (beta)
- En la pestaña “Video”, se carga un archivo `MP4` o `WEBM`.
- Se ajustan los controles “Inicio” y “Fin” para definir el rango temporal de redacción.
- Se dibuja un rectángulo sobre el reproductor; la redacción se muestra solo dentro del rango establecido.
- Se exporta a `WEBM` con el audio original mediante `MediaRecorder`. La compatibilidad del formato depende del navegador.

## Limitaciones actuales
- La exportación de video produce `WEBM` (VP8/VP9) según soporte. Para `MP4`, se requiere transcodificación externa (por ejemplo, FFmpeg.wasm o una herramienta de escritorio).
- La redacción en video es básica (caja negra). Estilos de desenfoque/pixelado en video se planifican.
- Se gestiona un único rectángulo en video. El soporte para múltiples áreas y rangos independientes se considera como mejora futura.
- La precisión de la previsualización puede depender del ritmo de `requestAnimationFrame`. En navegadores compatibles, se puede adoptar `requestVideoFrameCallback` para mayor exactitud.

## Privacidad
El contenido se procesa localmente en el navegador. No se realiza carga a servidores. La exportación de imágenes elimina metadatos `EXIF` al renderizar en un lienzo.

## Solución de problemas
- Si la exportación de video no inicia, se recomienda utilizar Chrome/Edge actualizados. Algunos navegadores no soportan `MediaRecorder` o el códec seleccionado.
- Si el enlace de descarga no aparece tras la exportación, puede tratarse de un error de grabación. Revisar la consola del navegador y probar con otro formato (`VP8/VP9`) según compatibilidad.
- Si la reproducción no arranca durante la exportación, el navegador puede bloquear la reproducción automática. Iniciar la reproducción manualmente antes de exportar.

## Enlaces
- Repositorio: https://github.com/sergio001g/stass
