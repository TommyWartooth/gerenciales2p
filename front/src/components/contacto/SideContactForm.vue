<template>
  <section class="contact-form-wrapper">
    <form class="contact-form" @submit.prevent="enviar">
      <h2 class="form-title">Envíanos un mensaje</h2>

      <div class="campo">
        <label for="nombre">Nombre</label>
        <input id="nombre" v-model="nombre" type="text" required />
      </div>

      <div class="campo">
        <label for="correo">Correo</label>
        <input id="correo" v-model="correo" type="email" required />
      </div>

      <div class="campo">
        <label for="mensaje">Mensaje</label>
        <textarea id="mensaje" v-model="mensaje" rows="4" required></textarea>
      </div>

      <button type="submit" class="btn-enviar">Enviar</button>
    </form>
  </section>
</template>

<script setup>
import { ref } from "vue";

const nombre = ref("");
const correo = ref("");
const mensaje = ref("");

const enviar = () => {
  // aquí antes en HTML lo enviabas o mostrabas algo
  console.log({ nombre: nombre.value, correo: correo.value, mensaje: mensaje.value });
  alert(`¡Gracias por contactarnos, ${nombre.value}!`);

  nombre.value = "";
  correo.value = "";
  mensaje.value = "";
};
</script>

