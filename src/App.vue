<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ImageRedactor from './components/ImageRedactor.vue'
import VideoRedactor from './components/VideoRedactor.vue'

const activeTab = ref<'image' | 'video'>('image')
const theme = ref<'dark' | 'light'>('dark')

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme.value)
}

onMounted(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
})
</script>

<template>
  <header class="site-header">
    <div class="brand">
      <span class="logo-dot" />
      <span class="brand-name">Stass</span>
      <span class="brand-sub">Redactor de fotos privado</span>
    </div>
    <nav class="actions">
      <a href="https://github.com/sergio001g" target="_blank" rel="noopener" class="link">
        <svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.8-.26.8-.58l-.02-2.03c-3.2.7-3.88-1.37-3.88-1.37-.53-1.35-1.3-1.71-1.3-1.71-1.06-.72.08-.7.08-.7 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.76.41-1.27.75-1.56-2.55-.29-5.23-1.27-5.23-5.65 0-1.25.45-2.27 1.2-3.07-.12-.3-.52-1.52.11-3.16 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 2.92-.39c.99 0 1.99.13 2.92.39 2.22-1.49 3.19-1.18 3.19-1.18.63 1.64.23 2.86.11 3.16.75.8 1.2 1.82 1.2 3.07 0 4.39-2.69 5.36-5.25 5.64.42.36.8 1.07.8 2.16l-.02 3.2c0 .32.22.69.81.58A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/>
        </svg>
        Mi GitHub
      </a>
      <a href="https://github.com/sergio001g/stass" target="_blank" rel="noopener" class="link primary">
        <svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7 8l-4 4 4 4"/>
          <path d="M17 8l4 4-4 4"/>
          <path d="M14 4l-4 16"/>
        </svg>
        Código
      </a>
      <button class="link" @click="toggleTheme">
        <svg v-if="theme==='dark'" class="icon-svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3a9 9 0 1 0 9 9c0-.3 0-.6-.03-.9A7 7 0 0 1 12 3z"/>
        </svg>
        <svg v-else class="icon-svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
        Tema: {{ theme === 'dark' ? 'Oscuro' : 'Claro' }}
      </button>
    </nav>
  </header>
  <section class="hero">
    <h1 class="hero-title">Oculta lo sensible en tus fotos, fácil y privado.</h1>
    <p class="hero-sub">Todo se procesa localmente. Elige estilo, dibuja, exporta.</p>
  </section>
  <div class="tabs">
    <button class="tab" :class="{active: activeTab==='image'}" @click="activeTab='image'">Imagen</button>
    <button class="tab" :class="{active: activeTab==='video'}" @click="activeTab='video'">Video (beta UI)</button>
  </div>
  <main class="content">
    <ImageRedactor v-if="activeTab==='image'" />
    <VideoRedactor v-else />
  </main>
  <footer class="site-footer"><small>Procesa todo localmente. No se suben imágenes.</small></footer>
</template>

<style scoped>
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 8px 0;
}
.brand {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.logo-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 20px rgba(37, 99, 235, 0.6);
}
.brand-name { font-weight: 700; font-size: 20px; }
.brand-sub { color: var(--muted); font-size: 14px; }

.actions { display: flex; gap: 8px; }
.link {
  background: var(--panel-bg);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 8px 12px;
  border-radius: 8px;
  text-decoration: none;
}
.link.primary { background: var(--primary); border-color: var(--primary); }

.icon-svg { width: 16px; height: 16px; margin-right: 6px; vertical-align: -2px; }

.hero { margin: 24px 8px 8px; }
.hero-title { margin: 0; font-size: 28px; }
.hero-sub { margin: 8px 0 0; color: var(--muted); }

.tabs { display: flex; gap: 6px; margin: 8px 0 12px; }
.tab { background: var(--panel-bg); color: var(--text); border: 1px solid var(--border); padding: 8px 12px; border-radius: 10px; }
.tab.active { background: #0f172a; }

.content { margin-top: 8px; }

.site-footer { margin-top: 16px; color: var(--muted); }
</style>
