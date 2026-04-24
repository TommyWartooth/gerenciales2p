<template>
  <section class="contact-section">
    <div class="circle circle-1"></div>
    <div class="circle circle-2"></div>
    <div class="circle circle-3"></div>

    <!--animación por scroll -->
    <h1 class="contact-title obs-anim">Contáctanos</h1>

    <div class="hero-contact obs-anim">
      <div class="contact-card">
        <div class="contact-item">
          <span class="contact-icon">
            <i class="fa-solid fa-phone"></i>
          </span>
          <div class="contact-text">
            <span class="contact-label">Teléfono</span>
            <span class="contact-value">      (+591) 63249751</span>
          </div>
        </div>

        <div class="contact-item">
          <span class="contact-icon">
            <i class="fa-solid fa-envelope"></i>
          </span>
          <div class="contact-text">
            <span class="contact-label">Correo electrónico</span>
            <span class="contact-value">      taitita96@gmail.com</span>
          </div>
        </div>
      </div>
    </div>

    <!-- FORMULARIO -->
    <form
      class="contact-form obs-anim"
      @submit.prevent="enviarFormulario"
    >
      <div class="campo">
        <label for="nombre">Nombre</label>
        <input id="nombre" v-model="nombre" type="text" placeholder= "Ingresa tu nombre" required />
      </div>

      <div class="campo">
        <label for="correo">Correo</label>
        <input id="correo" v-model="correo" type="email" placeholder= "Ingresa tu correo electrónico" required />
      </div>

      <div class="campo">
        <label for="mensaje">Mensaje</label>
        <textarea id="mensaje" v-model="mensaje" rows="4" placeholder= "¿En qué podemos ayudarte?" required></textarea>
      </div>

      <button type="submit" class="btn-enviar">Enviar mensaje</button>
    </form>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue"; 

const nombre = ref("");
const correo = ref("");
const mensaje = ref("");

const enviarFormulario = () => {
  console.log("Nombre:", nombre.value);
  console.log("Correo:", correo.value);
  console.log("Mensaje:", mensaje.value);

  alert(`¡Gracias por contactarnos, ${nombre.value}!`);

  nombre.value = "";
  correo.value = "";
  mensaje.value = "";
};

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll(".obs-anim").forEach((el) => observer.observe(el));
});
</script>

<style src="../components/contacto/contacto.css"></style>
