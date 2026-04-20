<template>
  <div class="fondomenu">
    <section class="section-slider" aria-label="home" id="home">
      <div class="fondo_carta">
        <div class="titulos">
          <span class="subtitle">Tradición en cada bocado</span>
          <h1 class="title_carta">Nuestra Carta</h1>
          
          <div class="separator-container">
            <img
              src="/imagenes/imagen-pagina-web-5.png"
              alt="divisor decorativo"
              class="division"
            />
          </div>
          
          <p class="desc">
            Explora una selección única de sabores tradicionales bolivianos, 
            cultivados con historia y servidos con pasión.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
    :root {
  --wine: #44020e;
  --wine-dark: #2e0109;
  --wine-light: #6a0318;
  --gold: #ebcd95;
  --gold-dim: #c9a96e;
  --black: #110f0d;
  --black-soft: #1c1917;
  --white: #faf6f0;
  --muted: #9e8e7e;
  --shadow: 0 8px 30px rgba(0, 0, 0, .25);
  --transition: all .3s ease;
}

.fondomenu {
  background-color: var(--black);
  padding: 0; 
  width: 100%;
  margin-top: -30px;
}

.fondo_carta {
  background-color: var(--wine);
  width: 100%; 
  max-width: 100%; 
 
  padding: 140px 20px; 
  
  border-top: 2px solid var(--gold-dim);
  border-bottom: 2px solid var(--gold-dim);
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow);

  margin-bottom: -50px;
}


.subtitle {
  color: var(--gold-dim);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.5rem;
  text-align: center;
}

.title_carta {
  color: var(--gold);
  font-family: 'Serif', Georgia, serif; /* O la fuente que uses para títulos */
  font-size: 3.5rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  text-align: center;
}

.separator-container {
  margin: 20px auto;
  width: 60%;
  filter: sepia(1) saturate(2) hue-rotate(330deg); /* Ajusta el color de la imagen a tonos dorados si es blanca/negra */
}

.division {
  width: 100%;
  height: auto;
  display: block;
}

.desc {
  color: var(--white);
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto;
  font-style: italic;
  text-align: center;
}
/* Para asegurar que la sección de arriba (header/negro) no empuje hacia abajo */
.section-slider {
  padding-top: 0 !important;
  margin-top: 0 !important;
}
</style>