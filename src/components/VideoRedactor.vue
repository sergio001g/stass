<template>
  <div class="editor">
    <div class="toolbar">
      <label class="file-btn">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 20h14a2 2 0 0 0 2-2v-5h-2v5H5V6h5V4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Zm7-14v4h4l-5 5l-5-5h4V6h2Z"/></svg>
        Cargar video
        <input type="file" accept="video/mp4,video/webm" @change="onFile" />
      </label>

      <div class="segmented" :class="{ disabled: !hasVideo }">
        <button class="seg-btn active">Caja negra</button>
        <button class="seg-btn">Blur</button>
        <button class="seg-btn">Pixelado</button>
      </div>

      <button class="btn" :disabled="!hasVideo" @click="clearRect">Limpiar</button>
      <button class="btn primary" :disabled="!hasVideo" @click="exportVideo">Exportar video</button>
    </div>

    <div class="panel">
      <div class="player" v-if="videoUrl">
        <video ref="videoRef" class="video" :src="videoUrl" controls @loadedmetadata="onLoadedMeta" @play="startOverlayLoop" @pause="stopOverlayLoop"></video>
        <canvas ref="overlayRef" class="overlay"
          @mousedown="onOverlayDown"
          @mousemove="onOverlayMove"
          @mouseup="onOverlayUp"
          @mouseleave="onOverlayUp"
        ></canvas>
      </div>
      <p v-else class="hint">Carga un video (MP4/WebM) para previsualizar y marcar tiempos.</p>

      <div class="timeline" v-if="hasVideo">
        <label class="ctrl">
          Inicio
          <input type="range" min="0" :max="duration" step="0.1" v-model.number="start"/>
          <span class="val">{{ start.toFixed(1) }}s</span>
        </label>
        <label class="ctrl">
          Fin
          <input type="range" min="0" :max="duration" step="0.1" v-model.number="end"/>
          <span class="val">{{ end.toFixed(1) }}s</span>
        </label>
      </div>

      <div v-if="downloadUrl" class="export">
        <a class="btn" :href="downloadUrl" download="redactado.webm">Descargar video redactado</a>
      </div>
      <p v-if="statusMsg" class="status">{{ statusMsg }}</p>
      <p v-if="hasVideo" class="note">Redacción activa: dibuja un rectángulo y se aplicará entre Inicio y Fin durante reproducción y exportación.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const videoRef = ref<HTMLVideoElement | null>(null)
const videoUrl = ref<string | null>(null)
const duration = ref<number>(60)
const start = ref<number>(0)
const end = ref<number>(5)

const hasVideo = ref(false)
const overlayRef = ref<HTMLCanvasElement | null>(null)
type Rect = { x: number, y: number, w: number, h: number } | null
const rect = ref<Rect>(null)
let drawing = false
let startX = 0, startY = 0
let overlayRaf = 0
const downloadUrl = ref<string | null>(null)
const statusMsg = ref<string>('')

onMounted(() => {
  window.addEventListener('resize', resizeOverlay)
})
onUnmounted(() => {
  window.removeEventListener('resize', resizeOverlay)
})

function resizeOverlay() {
  const v = videoRef.value
  const c = overlayRef.value
  if (!v || !c) return
  const bounds = v.getBoundingClientRect()
  c.width = Math.floor(bounds.width)
  c.height = Math.floor(bounds.height)
}

function onLoadedMeta() {
  const v = videoRef.value
  if (!v) return
  duration.value = v.duration
  end.value = Math.min(end.value, duration.value)
  resizeOverlay()
  startOverlayLoop()
}

function onOverlayDown(e: MouseEvent) {
  if (!hasVideo.value || !overlayRef.value) return
  const rectBounds = overlayRef.value.getBoundingClientRect()
  startX = e.clientX - rectBounds.left
  startY = e.clientY - rectBounds.top
  rect.value = { x: startX, y: startY, w: 0, h: 0 }
  drawing = true
}
function onOverlayMove(e: MouseEvent) {
  if (!drawing || !overlayRef.value) return
  const rectBounds = overlayRef.value.getBoundingClientRect()
  const x = e.clientX - rectBounds.left
  const y = e.clientY - rectBounds.top
  rect.value = { x: startX, y: startY, w: x - startX, h: y - startY }
}
function onOverlayUp() {
  drawing = false
}

function drawOverlay() {
  const c = overlayRef.value
  const v = videoRef.value
  if (!c || !v) return
  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, c.width, c.height)
  const t = v.currentTime
  const show = rect.value && t >= start.value && t <= end.value
  if (show && rect.value) {
    ctx.fillStyle = 'rgba(0,0,0,0.85)'
    const rx = Math.min(rect.value.w, 0) + rect.value.x
    const ry = Math.min(rect.value.h, 0) + rect.value.y
    const rw = Math.abs(rect.value.w)
    const rh = Math.abs(rect.value.h)
    ctx.fillRect(rx, ry, rw, rh)
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'
    ctx.lineWidth = 2
    ctx.setLineDash([6,4])
    ctx.strokeRect(rx, ry, rw, rh)
  }
}

function loop() {
  drawOverlay()
  overlayRaf = requestAnimationFrame(loop)
}
function startOverlayLoop() {
  stopOverlayLoop()
  overlayRaf = requestAnimationFrame(loop)
}
function stopOverlayLoop() {
  if (overlayRaf) cancelAnimationFrame(overlayRaf)
  overlayRaf = 0
}

function onFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  videoUrl.value = url
  hasVideo.value = true
  // Obtener duración cuando cargue
  setTimeout(() => {
    const v = videoRef.value
    if (v && !isNaN(v.duration) && v.duration > 0) {
      duration.value = v.duration
      end.value = Math.min(end.value, duration.value)
    }
  }, 200)
}

function clearRect() {
  rect.value = null
}

async function exportVideo() {
  const v = videoRef.value
  if (!v || !videoUrl.value) return
  downloadUrl.value = null

  const canvas = document.createElement('canvas')
  canvas.width = v.videoWidth
  canvas.height = v.videoHeight
  const ctx = canvas.getContext('2d')!

  const canvasStream = (canvas as HTMLCanvasElement).captureStream(30)
  const sourceStream: MediaStream = (v as any).captureStream ? (v as any).captureStream() : new MediaStream()
  const audioTracks = sourceStream.getAudioTracks()
  const videoTrack = canvasStream.getVideoTracks()[0]
  const tracks: MediaStreamTrack[] = [...audioTracks]
  if (videoTrack) tracks.push(videoTrack)
  const combined = new MediaStream(tracks)

  function getSupportedMime(): string {
    const candidates = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']
    for (const type of candidates) {
      if ((window as any).MediaRecorder && (MediaRecorder as any).isTypeSupported && MediaRecorder.isTypeSupported(type)) {
        return type
      }
    }
    return ''
  }

  const chunks: BlobPart[] = []
  let recorder: MediaRecorder
  try {
    const mime = getSupportedMime()
    const options = mime ? { mimeType: mime } : {}
    recorder = new MediaRecorder(combined, options as MediaRecorderOptions)
  } catch (err) {
    statusMsg.value = 'MediaRecorder no soportado en este navegador.'
    return
  }
  recorder.ondataavailable = (ev) => { if (ev.data.size > 0) chunks.push(ev.data) }
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' })
    downloadUrl.value = URL.createObjectURL(blob)
    statusMsg.value = 'Exportación completa. Enlace de descarga disponible.'
  }
  recorder.onerror = () => { statusMsg.value = 'Error durante la grabación.' }

  function drawFrame() {
    const videoEl = v as HTMLVideoElement
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
    const t = videoEl.currentTime
    if (rect.value && t >= start.value && t <= end.value) {
      const c = overlayRef.value!
      const rw = Math.abs(rect.value.w)
      const rh = Math.abs(rect.value.h)
      const rx = Math.min(rect.value.w, 0) + rect.value.x
      const ry = Math.min(rect.value.h, 0) + rect.value.y
      const sx = rx / c.width
      const sy = ry / c.height
      const sw = rw / c.width
      const sh = rh / c.height
      ctx.fillStyle = 'black'
      ctx.fillRect(sx * canvas.width, sy * canvas.height, sw * canvas.width, sh * canvas.height)
    }
    if (!videoEl.paused && !videoEl.ended) {
      requestAnimationFrame(drawFrame)
    }
  }

  recorder.start()
  statusMsg.value = 'Grabando...'
  v.currentTime = 0
  try {
    await v.play()
  } catch (err) {
    statusMsg.value = 'No se pudo iniciar la reproducción para grabar.'
    try { recorder.stop() } catch {}
    return
  }
  requestAnimationFrame(drawFrame)
  v.onended = () => { recorder.stop() }
}
</script>

<style scoped>
.editor { max-width: 960px; margin: 24px auto; padding: 0 16px; }
.toolbar { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
.btn, .file-btn { background: var(--panel-bg); color: var(--text); border: 1px solid var(--border); padding: 8px 12px; border-radius: 8px; cursor: pointer; }
.btn:disabled { opacity: 0.55; cursor: not-allowed; }
.primary { background: var(--primary); border-color: var(--primary); }
.file-btn input { display: none; }
.icon { width: 16px; height: 16px; margin-right: 6px; vertical-align: -2px; }

.segmented { display: inline-flex; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
.segmented.disabled { opacity: 0.6; pointer-events: none; }
.seg-btn { background: var(--panel-bg); color: var(--text); padding: 8px 10px; border: none; border-right: 1px solid var(--border); }
.seg-btn:last-child { border-right: none; }
.seg-btn.active { background: #0f172a; }

.panel { background: rgba(17,24,39,0.35); backdrop-filter: blur(6px); border: 1px solid var(--border); border-radius: 10px; padding: 16px; }
.player { position: relative; display: flex; justify-content: center; }
.video { max-width: 100%; border-radius: 8px; }
.overlay { position: absolute; inset: 0; width: 100%; height: 100%; cursor: crosshair; }
.timeline { display: flex; gap: 12px; align-items: center; margin-top: 12px; }
.ctrl { display: inline-flex; gap: 6px; align-items: center; color: var(--muted); }
.ctrl .val { color: var(--text); font-variant-numeric: tabular-nums; }
.hint { color: var(--muted); }
.note { color: var(--muted); margin-top: 8px; }
.status { color: var(--muted); margin-top: 8px; }
.export { margin-top: 12px; }
</style>