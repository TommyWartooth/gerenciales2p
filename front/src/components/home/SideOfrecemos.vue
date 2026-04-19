<template>
  <section class="platos">
    <div class="platos__header">
      <h2 class="platos__title">Te ofrecemos</h2>
      <p class="platos__subtitle">Sabores auténticos preparados con pasión</p>
    </div>

    <div class="platos__slider">
      <div class="platos__track">
        

        <div class="platos__card">
          <div class="platos__card-img">
            <img src="/imagenes/entrada.png" alt="Entradas" />
          </div>
          <div class="platos__card-info">
            <h3 class="platos__card-titulo">Entradas</h3>
            <p class="platos__card-sub">El comienzo ideal para tu cena.</p>
            <a href="carta.html#entradas" class="btn-boton-opciones">
              <span class="text text-1">Ver Menu</span>
            </a>
          </div>
        </div>

        <div class="platos__card">
          <div class="platos__card-img">
            <img src="/imagenes/fricase.png" alt="Platos fuertes" />
          </div>
          <div class="platos__card-info">
            <h3 class="platos__card-titulo">Platos Fuertes</h3>
            <p class="platos__card-sub">Nuestra especialidad de la casa.</p>
            <a href="carta.html#pf" class="btn-boton-opciones">
              <span class="text text-1">Ver Menu</span>
            </a>
          </div>
        </div>

        <div class="platos__card">
          <div class="platos__card-img">
            <img src="/imagenes/bebidas.png" alt="Bebidas" />
          </div>
          <div class="platos__card-info">
            <h3 class="platos__card-titulo">Bebidas</h3>
            <p class="platos__card-sub">Refrescantes y selección artesanal.</p>
            <a href="carta.html#bebidas" class="btn-boton-opciones">
              <span class="text text-1">Ver Menu</span>
            </a>
          </div>
        </div>

        <div class="platos__card">
          <div class="platos__card-img">
            <img src="/imagenes/postre.png" alt="Postres" />
          </div>
          <div class="platos__card-info">
            <h3 class="platos__card-titulo">Postres</h3>
            <p class="platos__card-sub">Un final dulce para tu experiencia.</p>
            <a href="carta.html#postres" class="btn-boton-opciones">
              <span class="text text-1">View Menu</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>

.platos {
  --black: #0a0a0a;
  --black-soft: #141414;
  --gold: #ebd595;
  --gold-dim: rgba(235, 205, 149, 0.6);
  --white: #ffffff;
  --muted: #a5a5a5;
  --wine: #44020e;

  background: var(--black);
  padding: 6rem 0;
  border-top: 1px solid rgba(235, 205, 149, 0.08);
  overflow: hidden;
}

.platos__header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 0 2rem;
}

.platos__eyebrow {
  display: block;
  font-size: 0.72rem;
  color: var(--gold-dim);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 0.8rem;
}

.platos__title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-style: italic;
  color: var(--white);
  margin-bottom: 0.5rem;
}

.platos__subtitle {
  font-size: 0.85rem;
  color: var(--muted);
  letter-spacing: 0.05em;
}

/* Slider / Track */
.platos__slider {
  position: relative;
  overflow: hidden;
  padding: 0 3rem;
}

.platos__track {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap; 
}

.platos__card {
  flex: 0 0 260px;
  border: 1px solid rgba(235, 205, 149, 0.1);
  background: var(--black-soft);
  overflow: hidden;
  transition: border-color 0.3s, transform 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.platos__card:hover {
  border-color: rgba(235, 205, 149, 0.35);
  transform: translateY(-4px);
}

.platos__card-img {
  width: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.platos__card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.platos__card:hover .platos__card-img img {
  transform: scale(1.05);
}

.platos__card-info {
  padding: 1.5rem 1.2rem;
}

.platos__card-titulo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem;
  font-style: italic;
  color: var(--gold);
  margin-bottom: 0.5rem;
}
</style scoped>