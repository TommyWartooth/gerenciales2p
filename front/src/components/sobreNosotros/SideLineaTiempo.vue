<style src="./sobreNosotros_css/sobreNosotros.css"></style>
<template>
  <!-- CONTENEDOR TIMELINE -->
  <section class="container-timeline">
    <div class="separador-ventana-inicial">
      <div class="subtitulo-medio">
        <div class="imagen-middle">
          <img
            src="/imagenes/imagen-pagina-web-2.png"
            alt="imagen-lateral-1"
            class="imagen-lateral-1"
          />
        </div>
      </div>
    </div>

    <div class="timeline-title-box">
      <h2 class="timeline-title">Nuestra historia</h2>
    </div>
    <!-- TIMELINE VERTICAL -->
    <ul class="timeline">
      <li class="timeline-item">
        <div class="timeline-badge"><i class="fas fa-utensils"></i></div>
        <div class="timeline-content">
          <h3>2015 - Apertura</h3>
          <p>
            Comenzamos nuestra aventura gastronómica con la misión de compartir
            la comida peruana auténtica.
          </p>
        </div>
      </li>

      <li class="timeline-item timeline-inverted">
        <div class="timeline-badge"><i class="fas fa-award"></i></div>
        <div class="timeline-content">
          <h3>2016 - Primer Reconocimiento</h3>
          <p>
            Recibimos nuestro primer premio nacional por excelencia culinaria.
          </p>
        </div>
      </li>

      <li class="timeline-item">
        <div class="timeline-badge"><i class="fas fa-globe"></i></div>
        <div class="timeline-content">
          <h3>2017 - Expansión nacional</h3>
          <p>
            Participamos en ferias gastronómicas nacionales mostrando la cocina
            boliviana.
          </p>
        </div>
      </li>

      <li class="timeline-item timeline-inverted">
        <div class="timeline-badge"><i class="fas fa-star"></i></div>
        <div class="timeline-content">
          <h3>2022 - Reconocimiento Gourmet</h3>
          <p>
            Somos catalogados como uno de los mejores restaurantes de comida
            boliviana en la ciudad.
          </p>
        </div>
      </li>
    </ul>
  </section>
</template>
<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  const observerOptions = {
    threshold: 0.2, // Se activa cuando el 20% del elemento es visible
    rootMargin: '0px 0px -50px 0px' 
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Opcional: dejar de observar una vez que ya apareció
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const items = document.querySelectorAll('.timeline-item');
  items.forEach(item => observer.observe(item));
});
</script>