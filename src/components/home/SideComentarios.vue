<template>
  <section class="comentarios">
    <div class="comentarios__header">
      <span class="comentarios__eyebrow">✦ Testimonios ✦</span>
      <h2 class="comentarios__title">Lo que dicen nuestros comensales</h2>
    </div>

    <div class="ts-slider" ref="slider">
      <div class="ts-track" ref="track">
        <article
          v-for="(slide, i) in slides"
          :key="i"
          class="ts-slide"
          :style="{ backgroundImage: `url(${slide.bg})` }"
        >
          <div class="ts-slide__overlay"></div>
          <div class="ts-slide__content">
            <p class="ts-slide__texto">{{ slide.texto }}</p>
            <div class="ts-slide__autor">
              <img :src="slide.foto" :alt="slide.nombre" class="ts-slide__foto" />
              <span class="ts-slide__nombre">{{ slide.nombre }}</span>
            </div>
          </div>
        </article>
      </div>

      <!-- Dots -->
      <div class="ts-dots">
        <button
          v-for="(_, i) in slides"
          :key="i"
          class="ts-dot"
          :class="{ 'ts-dot--active': index === i }"
          @click="goTo(i)"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const slides = [
  {
    bg: '/imagenes/villazon2.jpg',
    texto: '"Desde el primer bocado hasta el postre, todo fue impecable. La presentación es una obra de arte y cada sabor tiene intención. El chef logra que lo tradicional se sienta contemporáneo. Sin duda, uno de los mejores restaurantes de comida boliviana en La Paz."',
    foto: '/imagenes/JoseFoto.jpeg',
    nombre: 'Jose Rodriguez de Mamani',
  },
  {
    bg: '/imagenes/cochebomba.jpg',
    texto: '"Lo que más me gustó es que, a pesar de ser un lugar sofisticado, los sabores siguen siendo auténticos. El pique macho tenía ese toque ahumado perfecto, y la sajta era pura nostalgia pero con una textura sedosa. El servicio fue cálido y atento."',
    foto: '/imagenes/BobinFoto.jpeg',
    nombre: 'Alejandro Bobarin',
  },
  {
    bg: '/imagenes/lapaz.jpg',
    texto: '"Cada plato llegaba con una historia. El camarero nos explicó el origen de los ingredientes y se notaba la pasión del equipo. El Wallake estaba fresco, equilibrado. El ambiente es elegante, íntimo, con música suave que no interfiere en la conversación."',
    foto: '/imagenes/DonGay.jpeg',
    nombre: 'Alfonso Gumucio',
  },
  {
    bg: '/imagenes/illimani.jpg',
    texto: '"El ambiente combina lujo con calidez — iluminación tenue, música andina instrumental y un servicio impecable. Realmente se nota el respeto por los ingredientes bolivianos y la dedicación de todo el equipo."',
    foto: '/imagenes/AlePaz.jpeg',
    nombre: 'Alejandro Paz',
  },
  {
    bg: '/imagenes/stacruz.jpg',
    texto: '"Desde que entras, el restaurante transmite elegancia sin pretensiones. El personal te hace sentir especial, y cada plato cuenta una historia de Bolivia. El mousse de tumbo fue mi favorito: cremoso, delicado y lleno de matices. Un lugar perfecto para celebrar."',
    foto: '/imagenes/ComensalContento.jpeg',
    nombre: 'Comensal Contento',
  },
]

const track = ref(null)
const index = ref(0)
let interval = null

function goTo(i) {
  index.value = (i + slides.length) % slides.length
  track.value.style.transform = `translateX(-${index.value * 100}%)`
}

onMounted(() => {
  interval = setInterval(() => goTo(index.value + 1), 5000)
})

onBeforeUnmount(() => clearInterval(interval))
</script>

<style scoped>
.comentarios {
  background: var(--black-soft);
  padding: 6rem 0 4rem;
  border-top: 1px solid rgba(235,205,149,0.08);
}

.comentarios__header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 0 2rem;
}

.comentarios__eyebrow {
  display: block;
  font-size: 0.72rem;
  color: var(--gold-dim);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 0.8rem;
}

.comentarios__title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-style: italic;
  color: var(--white);
}

/* Slider */
.ts-slider {
  position: relative;
  overflow: hidden;
}

.ts-track {
  display: flex;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.ts-slide {
  flex: 0 0 100%;
  min-height: 420px;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ts-slide__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(17,15,13,0.75) 0%,
    rgba(68,2,14,0.6) 50%,
    rgba(17,15,13,0.85) 100%
  );
}

.ts-slide__content {
  position: relative;
  z-index: 1;
  max-width: 780px;
  padding: 3rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.ts-slide__texto {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1rem, 2.2vw, 1.25rem);
  font-style: italic;
  color: var(--white);
  line-height: 1.85;
  opacity: 0.95;
}

.ts-slide__autor {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ts-slide__foto {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--gold-dim);
}

.ts-slide__nombre {
  font-family: 'Jost', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--gold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Dots */
.ts-dots {
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  padding: 1.5rem 0 0.5rem;
}

.ts-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(235,205,149,0.25);
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.ts-dot--active {
  background: var(--gold);
  width: 24px;
  border-radius: 3px;
}
</style>