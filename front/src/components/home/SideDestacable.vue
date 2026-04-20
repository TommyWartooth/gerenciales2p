<template>
  
  <section class="destacable">
    <div class="destacable__inner">

      <div class="destacable__header">
        <span class="destacable__eyebrow">✦ ¿Por qué elegirnos? ✦</span>
        <h2 class="destacable__title">Nuestras Fortalezas</h2>
      </div>

      <div class="destacable__grid">
        <div v-for="item in fortalezas" :key="item.titulo" class="destacable__card">
          <div class="destacable__icon">{{ item.icon }}</div>
          <h3 class="destacable__card-titulo">{{ item.titulo }}</h3>
          <p class="destacable__card-desc">{{ item.desc }}</p>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
const fortalezas = [
  {
    titulo: 'Higiénico',
    desc: 'Cumplimos los más altos estándares de limpieza e higiene en cada rincón de nuestra cocina.'
  },
  {
    titulo: 'Frescura',
    desc: 'Ingredientes frescos seleccionados diariamente de productores locales bolivianos.'
  },
  {
    titulo: 'Infraestructura',
    desc: 'Un espacio elegante, amplio y cuidadosamente diseñado para una experiencia gourmet.'
  },
  {
    titulo: 'Servicio al Cliente',
    desc: 'Atención personalizada y eficiente que te hará sentir como en casa desde el primer momento.'
  },
]
</script>

<style scoped>
.destacable {
  background: var(--wine-dark);
  padding: 5rem 2rem;
}

.destacable__inner {
  max-width: 1200px;
  margin: 0 auto;
}

.destacable__header {
  text-align: center;
  margin-bottom: 3rem;
}

.destacable__eyebrow {
  display: block;
  font-size: 0.72rem;
  color: var(--gold-dim);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 0.8rem;
}

.destacable__title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-style: italic;
  color: var(--white);
}

.destacable__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;
}

.destacable__card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(235,205,149,0.12);
  padding: 2rem 1.5rem;
  text-align: center;
  transition: border-color 0.3s, transform 0.3s, background 0.3s;
}

.destacable__card:hover {
  border-color: rgba(235,205,149,0.4);
  transform: translateY(-5px);
  background: rgba(255,255,255,0.07);
}

.destacable__icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.destacable__card-titulo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.15rem;
  font-style: italic;
  color: var(--gold);
  margin-bottom: 0.7rem;
}

.destacable__card-desc {
  font-size: 0.82rem;
  color: var(--muted);
  line-height: 1.75;
}

@media (max-width: 768px) {
  .destacable__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .destacable__grid { grid-template-columns: 1fr; }
}
</style>