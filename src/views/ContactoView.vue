<template>
  <div class="contacto">
    <h1>Contacto</h1>

    <form @submit.prevent="enviarFormulario">
      <div>
        <label>Nombre:</label>
        <input v-model="nombre" type="text" required />
      </div>

      <div>
        <label>Email:</label>
        <input v-model="email" type="email" required />
      </div>

      <div>
        <label>Mensaje:</label>
        <textarea v-model="mensaje" required></textarea>
      </div>

      <button type="submit">Enviar</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const nombre = ref('')
const email = ref('')
const mensaje = ref('')

const enviarFormulario = () => {
  alert(`Gracias ${nombre.value}, tu mensaje fue enviado.`)

  nombre.value = ''
  email.value = ''
  mensaje.value = ''
}
</script>

<style scoped>
.contacto {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}

div {
  margin-bottom: 15px;
}

input, textarea {
  width: 100%;
  padding: 8px;
}

button {
  padding: 10px 20px;
}
</style>