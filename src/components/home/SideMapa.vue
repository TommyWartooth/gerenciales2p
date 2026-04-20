<template>
  <section id="contacto" class="mapa">
    <div class="mapa__inner">

      <div class="mapa__text">
        <span class="mapa__eyebrow">✦ Encuéntranos ✦</span>
        <h2 class="mapa__title">Genial Ubicación</h2>
        <p class="mapa__desc">
          Nos encontramos en la mejor zona de la ciudad, cerca de puntos de
          interés y con fácil acceso para todos nuestros comensales.
        </p>
        <div class="mapa__datos">
          <div class="mapa__dato">
            <div>
              <strong>Dirección</strong>
              <p>Edificio Girasoles, La Paz, Bolivia</p>
            </div>
          </div>
          <div class="mapa__dato">
            <div>
              <strong>Horario</strong>
              <p>Diario: 12:00pm – 21:00pm</p>
            </div>
          </div>
          <div class="mapa__dato">
            <div>
              <strong>Teléfono</strong>
              <p>(+591) 63249751</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mapa__iframe-wrap">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d239.09148275033212!2d-68.1214491!3d-16.5026705!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915f2067b7aaf839%3A0xf147e5a95ceb15d0!2sEdificio%20Girasoles!5e0!3m2!1ses-419!2sbo!4v1759955456567!5m2!1ses-419!2sbo"
          width="100%"
          height="100%"
          style="border: 0"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Ubicación El Taitita del sabor"
        ></iframe>
      </div>

    </div>
  </section>
</template>

<style scoped>
.mapa {
  background: var(--black-soft);
  padding: 6rem 2rem;
  border-top: 1px solid rgba(235,205,149,0.08);
}

.mapa__inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 4rem;
  align-items: center;
}

.mapa__eyebrow {
  display: block;
  font-size: 0.72rem;
  color: var(--gold-dim);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.mapa__title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-style: italic;
  color: var(--white);
  margin-bottom: 1rem;
  line-height: 1.15;
}

.mapa__desc {
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.8;
  margin-bottom: 2rem;
}

.mapa__datos {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center; 
  text-align: center; 
}

.mapa__dato {
  display: flex;
  flex-direction: column; 
  align-items: center;  
  gap: 0.5rem;           
  width: 100%;
}

.mapa__dato-icon { 
  font-size: 1.5rem; 
  color: var(--gold);
  margin-bottom: 0.2rem;
}

.mapa__dato-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mapa__dato strong {
  display: block;
  font-size: 0.72rem;
  color: var(--gold);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 0.3rem;
}

.mapa__dato p {
  font-size: 0.9rem;
  color: var(--muted);
  margin: 0;
  line-height: 1.4;
}

.mapa__iframe-wrap {
  height: 400px;
  border: 1px solid rgba(235,205,149,0.15);
  overflow: hidden;
  filter: grayscale(30%) sepia(20%);
  transition: filter 0.3s;
}

.mapa__iframe-wrap:hover {
  filter: grayscale(0%) sepia(0%);
}

@media (max-width: 768px) {
  .mapa__inner { grid-template-columns: 1fr; }
  .mapa__iframe-wrap { height: 280px; }
}
</style>