<template>
    <!-- Franja con frase -->
  <div class="franja">
    <span class="franja__deco">✦</span>
    <p class="franja__frase">"Donde la tradición boliviana se convierte en arte culinario"</p>
    <span class="franja__deco">✦</span>
  </div>

  <section class="oferta">
    <div class="oferta__inner">
      <div v-for="item in ofertas" :key="item.title" class="oferta__card">
        <div class="oferta__icon">{{ item.icon }}</div>
        <h3 class="oferta__title">{{ item.title }}</h3>
        <p class="oferta__desc">{{ item.desc }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const ofertas = [
  {
    title: 'Cocina Gourmet Boliviana',
    desc: 'Platos de alta cocina que reinterpretan la tradición culinaria de Bolivia con técnicas contemporáneas.'
  },
  {
    title: 'Ingredientes Locales',
    desc: 'Trabajamos con productores locales para llevar a tu mesa los mejores ingredientes de nuestra tierra.'
  },
  {
    title: 'Sabores Andinos',
    desc: 'Quinua, chuño, locoto y más — productos ancestrales elevados a su máxima expresión gastronómica.'
  },
  {
    title: 'Experiencia Única',
    desc: 'Un ambiente íntimo y sofisticado donde cada visita se convierte en un recuerdo imborrable.'
  }
]
</script>

<style scoped>
.franja {
  width: 100%;
  background: var(--wine-dark);
  border-top: 1px solid rgba(235,205,149,0.2);
  border-bottom: 1px solid rgba(235,205,149,0.2);
  padding: 1.6rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}
 
.franja__frase {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  font-style: italic;
  color: var(--gold);
  text-align: center;
  letter-spacing: 0.03em;
}
 
.franja__deco {
  color: var(--gold-dim);
  font-size: 0.8rem;
  opacity: 0.6;
  flex-shrink: 0;
}

.oferta {
  background-color: var(--black-soft);
  font-family: 'Times New Roman', Times, serif;
  padding: 5rem 2rem;
  border-top: 1px solid rgba(235,205,149,0.08);
}

.oferta__inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.oferta__card {
  background: rgba(68, 2, 14, 0.12);
  border: 1px solid rgba(235, 205, 149, 0.12);
  border-radius: 2px;
  padding: 2.5rem 1.8rem;
  text-align: center;
  transition: transform 0.3s, border-color 0.3s, background 0.3s;
}

.oferta__card:hover {
  transform: translateY(-6px);
  border-color: rgba(235,205,149,0.4);
  background: rgba(68, 2, 14, 0.25);
}

.oferta__icon {
  font-size: 2rem;
  margin-bottom: 1.2rem;
}

.oferta__title {
  font-family: 'Times New Roman', Times, serif;
  font-size: 1.2rem;
  font-style: italic;
  color: var(--gold);
  margin-bottom: 0.8rem;
}

.oferta__desc {
  font-size: 0.85rem;
  color: var(--muted);
  line-height: 1.75;
}
</style>