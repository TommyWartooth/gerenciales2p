<template>
  <section id="inicio" class="hero">
    <div class="hero__overlay"></div>
    <div class="hero__content">
      <p class="hero__eyebrow">— Cocina Gourmet Boliviana —</p>
      <h1 class="hero__title">El alma de Bolivia<br>en cada plato</h1>
      <p class="hero__subtitle">Una experiencia gastronómica que honra nuestra tierra.</p>
      <a href="#carta" class="hero__btn" @click.prevent="scrollTo('carta')">Ver nuestra carta</a>
    </div>
    <div class="hero__bottom">
      <span class="hero__divider">✦ ✦ ✦</span>
    </div>
  </section>
</template>

<script setup>
const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url('/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  text-align: center;
  overflow: hidden;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(17, 15, 13, 0.6) 0%,
    rgba(68, 2, 14, 0.35) 50%,
    rgba(17, 15, 13, 0.8) 100%
  );
}

.hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  padding: 0 1.5rem;
}

.hero__eyebrow {
  font-family: 'Jost', sans-serif;
  font-size: 0.8rem;
  font-weight: 400;
  color: var(--gold);
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.hero__title {
  font-family: 'Times New Roman', Times, serif;
  font-size: clamp(2.8rem, 7vw, 5.5rem);
  font-weight: 700;
  color: var(--white);
  line-height: 1.08;
  text-shadow: 0 2px 32px rgba(17,15,13,0.5);
  font-style: italic;
}

.hero__subtitle {
  font-family: 'Jost', sans-serif;
  font-size: 1rem;
  color: rgba(250, 246, 240, 0.75);
  font-weight: 300;
  letter-spacing: 0.05em;
}

.hero__btn {
  display: inline-block;
  margin-top: 0.6rem;
  background: transparent;
  color: var(--gold);
  padding: 0.75rem 2.2rem;
  border: 1px solid var(--gold);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.3s;
}

.hero__btn:hover {
  background: var(--wine);
  border-color: var(--wine);
  color: var(--white);
}

.hero__bottom {
  position: absolute;
  bottom: 1.8rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  color: var(--gold-dim);
  font-size: 0.72rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  z-index: 1;
}

.hero__divider {
  font-size: 0.6rem;
  letter-spacing: 0.4em;
  opacity: 0.6;
}
</style>