<template>
  <section class="platos">
    <div class="platos__header">
      <span class="platos__eyebrow">✦ Destacados ✦</span>
      <h2 class="platos__title">Nuestros Platos Estrella</h2>
      <p class="platos__subtitle">Siempre traemos el mejor sabor a tu paladar</p>
    </div>

    <div class="platos__wrapper">
      <button class="platos__arrow" @click="prevSlide" aria-label="Anterior">&#10094;</button>

      <div class="platos__slider" ref="sliderRoot">
        <div class="platos__track" ref="contenedor">
          <div class="platos__card" v-for="(item, i) in items" :key="i">
            <div class="platos__card-img">
              <img :src="item.src" :alt="item.alt" />
            </div>
            <div class="platos__card-info" v-if="item.titulo || item.sub">
              <p class="platos__card-titulo" v-if="item.titulo">{{ item.titulo }}</p>
              <p class="platos__card-sub" v-if="item.sub">{{ item.sub }}</p>
            </div>
          </div>
        </div>
      </div>

      <button class="platos__arrow" @click="nextSlide" aria-label="Siguiente">&#10095;</button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const sliderRoot = ref(null)
const contenedor = ref(null)
const currentIndex = ref(0)
const timer = ref(null)
const maxIndex = ref(0)

const items = [
  { src: '/imagenes/pique.png',     alt: 'Pique Macho Gourmet',     titulo: 'Pique Macho',         sub: 'Cortes premium de res en su jugo con aromas del valle' },
  { src: '/imagenes/silpancho.png', alt: 'Silpancho',               titulo: 'Silpancho de Antaño', sub: 'Fina lámina de res apanada sobre arroz graneado y huevo de granja' },
  { src: '/imagenes/sajta.png',     alt: 'Sajta de Pollo',          titulo: 'Sajta de Pollo',      sub: 'Pollo tierno en salsa de ají amarillo con texturas de chuño y maní' },
  { src: '/imagenes/fricase.png',   alt: 'Fricasé Paceño',          titulo: 'Fricasé Real',        sub: 'Cerdo confitado en esencia de ají amarillo y mote seleccionado' },
  { src: '/imagenes/majadito.png',  alt: 'Majadito',                titulo: 'Majadito de Charque', sub: 'Arroz meloso con charque crujiente, plátano frito y esencia de urucú' },
  { src: '/imagenes/mondongo.png',  alt: 'Mondongo Chuquisaqueño',  titulo: 'Mondongo Capital',    sub: 'Cerdo en salsa de ají colorado acompañado de mote al palillo' },
]

function getSlides() {
  return Array.from(contenedor.value?.querySelectorAll('.platos__card') ?? [])
}

function measureAndUpdate() {
  const slides = getSlides()
  if (!slides.length || !contenedor.value || !sliderRoot.value) return

  const slideWidth = slides[0].getBoundingClientRect().width
  const styles = getComputedStyle(contenedor.value)
  const gap = parseFloat(styles.gap || styles.columnGap || '16') || 16
  const containerWidth = sliderRoot.value.getBoundingClientRect().width
  const cardW = slideWidth + gap
  const visible = Math.max(1, Math.floor((containerWidth + gap) / cardW))
  maxIndex.value = Math.max(0, items.length - visible)

  if (currentIndex.value > maxIndex.value) currentIndex.value = maxIndex.value

  contenedor.value.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)'
  contenedor.value.style.transform = `translateX(-${cardW * currentIndex.value}px)`
}

function nextSlide() {
  currentIndex.value = currentIndex.value >= maxIndex.value ? 0 : currentIndex.value + 1
  measureAndUpdate()
}

function prevSlide() {
  currentIndex.value = currentIndex.value <= 0 ? maxIndex.value : currentIndex.value - 1
  measureAndUpdate()
}

onMounted(async () => {
  await nextTick()
  const imgs = Array.from(contenedor.value.querySelectorAll('img'))
  await Promise.all(
    imgs.map(img =>
      img.complete && img.naturalWidth
        ? Promise.resolve()
        : new Promise(r => {
            img.addEventListener('load', r, { once: true })
            img.addEventListener('error', r, { once: true })
          })
    )
  )
  measureAndUpdate()
  window.addEventListener('resize', measureAndUpdate)
  timer.value = setInterval(nextSlide, 4000)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', measureAndUpdate)
  if (timer.value) clearInterval(timer.value)
})
</script>

<style scoped>
.platos {
  background: var(--black);
  padding: 4rem 0;
  border-top: 1px solid rgba(235,205,149,0.08);
  overflow: hidden;
}

.platos__header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 0 2rem;
}

.platos__eyebrow {
  display: block;
  font-size: 0.72rem;
  color: var(--gold-dim);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 0.6rem;
}

.platos__title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-style: italic;
  color: var(--white);
  margin-bottom: 0.4rem;
}

.platos__subtitle {
  font-size: 0.82rem;
  color: var(--muted);
  letter-spacing: 0.05em;
}

/* Wrapper centrado con ancho fijo */
.platos__wrapper {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Slider ocupa el espacio entre las flechas */
.platos__slider {
  flex: 1;
  overflow: hidden;
}

.platos__track {
  display: flex;
  gap: 16px;
}

/* Tarjetas */
.platos__card {
  flex: 0 0 200px;
  border: 1px solid rgba(235,205,149,0.1);
  background: var(--black-soft);
  overflow: hidden;
  transition: border-color 0.3s, transform 0.3s;
}

.platos__card:hover {
  border-color: rgba(235,205,149,0.35);
  transform: translateY(-4px);
}

.platos__card-img {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.platos__card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.platos__card:hover .platos__card-img img {
  transform: scale(1.06);
}

.platos__card-info {
  padding: 0.75rem 0.9rem;
}

.platos__card-titulo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.92rem;
  font-style: italic;
  color: var(--gold);
  margin-bottom: 0.2rem;
}

.platos__card-sub {
  font-size: 0.7rem;
  color: var(--muted);
  line-height: 1.4;
}

/* Flechas */
.platos__arrow {
  flex-shrink: 0;
  background: rgba(68,2,14,0.9);
  border: 1px solid rgba(235,205,149,0.25);
  color: var(--gold);
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.platos__arrow:hover {
  background: var(--wine);
  border-color: var(--gold);
}
</style>