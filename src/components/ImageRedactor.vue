<template>
  <div class="editor">
    <div class="toolbar">
      <label class="file-btn">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 20h14a2 2 0 0 0 2-2v-5h-2v5H5V6h5V4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Zm7-14v4h4l-5 5l-5-5h4V6h2Z"/></svg>
        Cargar imagen
        <input type="file" accept="image/png,image/jpeg" @change="onFileInput" />
      </label>

      <div class="segmented" :class="{ disabled: !hasImage }">
        <button class="seg-btn" :class="{ active: mode==='black' }" @click="mode='black'">Caja negra</button>
        <button class="seg-btn" :class="{ active: mode==='blur' }" @click="mode='blur'">Blur</button>
        <button class="seg-btn" :class="{ active: mode==='pixelate' }" @click="mode='pixelate'">Pixelado</button>
      </div>

      <div class="controls" v-if="hasImage">
        <label v-if="mode==='blur'" class="ctrl">
          Blur
          <input type="range" min="2" max="16" v-model.number="blurRadius"/>
          <span class="val">{{ blurRadius }}px</span>
        </label>
        <label v-if="mode==='pixelate'" class="ctrl">
          Pixel
          <input type="range" min="4" max="32" v-model.number="pixelSize"/>
          <span class="val">{{ pixelSize }}px</span>
        </label>
      </div>

      <button class="btn" :disabled="!hasImage" @click="clearRects">Limpiar</button>
      <button class="btn primary" :disabled="!hasImage" @click="exportImage">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3a1 1 0 0 1 1 1v9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L11 13.586V4a1 1 0 0 1 1-1ZM5 19a1 1 0 0 0 0 2h14a1 1 0 1 0 0-2H5Z"/></svg>
        Exportar PNG
      </button>
    </div>

    <div
      class="dropzone"
      ref="dropRef"
      @dragover.prevent
      @drop.prevent="onDrop"
    >
      <p v-if="!hasImage" class="hint">Arrastra aquí una imagen (JPG/PNG) o usa “Cargar imagen”. Selecciona estilo y dibuja un rectángulo para redactar.</p>
      <canvas
        v-show="hasImage"
        ref="canvasRef"
        class="canvas"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

type Rect = { x: number; y: number; w: number; h: number; style: 'black' | 'blur' | 'pixelate' }

const dropRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const img = ref<HTMLImageElement | null>(null)
const displayW = ref<number>(0)
const displayH = ref<number>(0)
const scale = ref<number>(1) // natural -> display

const rects = ref<Rect[]>([])
let drawing = false
let startX = 0
let startY = 0
let currentRect: Rect | null = null

// estilo actual
const mode = ref<'black' | 'blur' | 'pixelate'>('black')
const blurRadius = ref<number>(8)
const pixelSize = ref<number>(12)

const hasImage = computed(() => !!img.value)

function onFileInput(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) loadImageFile(file)
}

function onDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0]
  if (file) loadImageFile(file)
}

function loadImageFile(file: File) {
  const url = URL.createObjectURL(file)
  const image = new Image()
  image.onload = () => {
    img.value = image
    setupCanvasForImage()
    URL.revokeObjectURL(url)
  }
  image.src = url
}

function setupCanvasForImage() {
  const canvas = canvasRef.value!
  const maxW = 900
  const naturalW = img.value!.naturalWidth
  const naturalH = img.value!.naturalHeight
  const targetW = Math.min(naturalW, maxW)
  const targetH = Math.round((naturalH * targetW) / naturalW)

  displayW.value = targetW
  displayH.value = targetH
  scale.value = naturalW / targetW

  canvas.width = targetW
  canvas.height = targetH

  rects.value = []
  redraw()
}

function redraw() {
  const canvas = canvasRef.value!
  const ctx = canvas.getContext('2d')!
  // fondo: imagen
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (img.value) {
    ctx.drawImage(img.value, 0, 0, displayW.value, displayH.value)
  }
  // overlays
  rects.value.forEach((r) => drawOverlay(ctx, r, false))
  if (currentRect) drawOverlay(ctx, currentRect, true)
}

function drawOverlay(ctx: CanvasRenderingContext2D, r: Rect, isPreview: boolean) {
  if (r.style === 'black') {
    ctx.save()
    ctx.globalAlpha = isPreview ? 0.7 : 1
    ctx.fillStyle = '#000'
    ctx.fillRect(r.x, r.y, r.w, r.h)
    ctx.restore()
    return
  }

  if (r.style === 'blur') {
    ctx.save()
    ctx.beginPath()
    ctx.rect(r.x, r.y, r.w, r.h)
    ctx.clip()
    ctx.filter = `blur(${blurRadius.value}px)`
    ctx.drawImage(img.value!, 0, 0, displayW.value, displayH.value)
    ctx.filter = 'none'
    ctx.restore()
    return
  }

  if (r.style === 'pixelate') {
    const temp = document.createElement('canvas')
    temp.width = Math.max(1, Math.floor(r.w))
    temp.height = Math.max(1, Math.floor(r.h))
    const sctx = temp.getContext('2d')!
    sctx.imageSmoothingEnabled = false

    // natural coords para muestreo
    const nsx = Math.round(r.x * scale.value)
    const nsy = Math.round(r.y * scale.value)
    const nsw = Math.round(r.w * scale.value)
    const nsh = Math.round(r.h * scale.value)

    const dw = Math.max(1, Math.floor(r.w / pixelSize.value))
    const dh = Math.max(1, Math.floor(r.h / pixelSize.value))

    // dibujar reducido
    sctx.drawImage(img.value!, nsx, nsy, nsw, nsh, 0, 0, dw, dh)
    // escalar al tamaño del rectángulo (pixelado)
    sctx.drawImage(temp, 0, 0, dw, dh, 0, 0, r.w, r.h)

    ctx.drawImage(temp, r.x, r.y)
    return
  }
}

function canvasPos(e: MouseEvent) {
  const canvas = canvasRef.value!
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  return { x, y }
}

function onMouseDown(e: MouseEvent) {
  if (!hasImage.value) return
  const p = canvasPos(e)
  drawing = true
  startX = p.x
  startY = p.y
  currentRect = { x: startX, y: startY, w: 0, h: 0, style: mode.value }
}

function onMouseMove(e: MouseEvent) {
  if (!drawing || !currentRect) return
  const p = canvasPos(e)
  currentRect.w = p.x - startX
  currentRect.h = p.y - startY
  // asegurar dimensiones positivas
  const x = Math.min(startX, p.x)
  const y = Math.min(startY, p.y)
  const w = Math.abs(p.x - startX)
  const h = Math.abs(p.y - startY)
  currentRect.x = x
  currentRect.y = y
  currentRect.w = w
  currentRect.h = h
  redraw()
}

function onMouseUp() {
  if (!drawing) return
  drawing = false
  if (currentRect && currentRect.w > 2 && currentRect.h > 2) {
    rects.value.push(currentRect)
  }
  currentRect = null
  redraw()
}

function clearRects() {
  rects.value = []
  redraw()
}

function exportImage() {
  if (!img.value) return
  const naturalW = img.value.naturalWidth
  const naturalH = img.value.naturalHeight

  const off = document.createElement('canvas')
  off.width = naturalW
  off.height = naturalH
  const octx = off.getContext('2d')!

  // dibujar imagen original a tamaño natural
  octx.drawImage(img.value, 0, 0, naturalW, naturalH)

  // dibujar overlays por estilo en tamaño natural
  rects.value.forEach((r) => {
    const sx = Math.round(r.x * scale.value)
    const sy = Math.round(r.y * scale.value)
    const sw = Math.round(r.w * scale.value)
    const sh = Math.round(r.h * scale.value)

    if (r.style === 'black') {
      octx.fillStyle = '#000'
      octx.fillRect(sx, sy, sw, sh)
      return
    }

    if (r.style === 'blur') {
      octx.save()
      octx.beginPath()
      octx.rect(sx, sy, sw, sh)
      octx.clip()
      octx.filter = `blur(${Math.round(blurRadius.value * scale.value)}px)`
      octx.drawImage(img.value!, 0, 0, naturalW, naturalH)
      octx.filter = 'none'
      octx.restore()
      return
    }

    if (r.style === 'pixelate') {
      const temp = document.createElement('canvas')
      const sctx = temp.getContext('2d')!
      sctx.imageSmoothingEnabled = false

      const dw = Math.max(1, Math.floor(sw / pixelSize.value))
      const dh = Math.max(1, Math.floor(sh / pixelSize.value))
      temp.width = sw
      temp.height = sh
      // reducido
      sctx.drawImage(img.value!, sx, sy, sw, sh, 0, 0, dw, dh)
      // ampliado sin suavizado
      sctx.drawImage(temp, 0, 0, dw, dh, 0, 0, sw, sh)
      octx.drawImage(temp, sx, sy)
      return
    }
  })

  const url = off.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = 'redacted.png'
  a.click()
}

onMounted(() => {
  // opcional: estilos de borde al arrastrar sobre la zona
  const el = dropRef.value!
  const onEnter = () => el.classList.add('dragover')
  const onLeave = () => el.classList.remove('dragover')
  el.addEventListener('dragenter', onEnter)
  el.addEventListener('dragleave', onLeave)
})
</script>

<style scoped>
.editor {
  max-width: 960px;
  margin: 24px auto;
  padding: 0 16px;
}
.toolbar {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}
.btn, .file-btn {
  background: var(--panel-bg);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}
.btn:disabled { opacity: 0.55; cursor: not-allowed; }
.primary { background: var(--primary); border-color: var(--primary); }
.file-btn input { display: none; }

.icon { width: 16px; height: 16px; margin-right: 6px; vertical-align: -2px; }

.segmented { display: inline-flex; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
.segmented.disabled { opacity: 0.6; pointer-events: none; }
.seg-btn { background: var(--panel-bg); color: var(--text); padding: 8px 10px; border: none; border-right: 1px solid var(--border); }
.seg-btn:last-child { border-right: none; }
.seg-btn.active { background: #0f172a; }

.controls { display: inline-flex; gap: 12px; align-items: center; margin-left: 6px; }
.ctrl { display: inline-flex; gap: 6px; align-items: center; color: var(--muted); }
.ctrl .val { color: var(--text); font-variant-numeric: tabular-nums; }

.dropzone {
  border: 2px dashed var(--border);
  border-radius: 10px;
  padding: 20px;
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(17, 24, 39, 0.35);
  backdrop-filter: blur(6px);
}
.dropzone.dragover { border-color: var(--primary); }
.hint { color: var(--muted); }
.canvas { max-width: 100%; display: block; border-radius: 8px; }
</style>