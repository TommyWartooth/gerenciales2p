<template>
  <div class="overlay" @click.self="cerrar">
    <div class="modal">
      <header class="modal-header">
        <h3>Nuevo personal</h3>
        <button class="btn-cerrar" @click="cerrar">✕</button>
      </header>

      <form class="modal-body" @submit.prevent="guardar">
        <!-- ROL + FECHA CONTRATO -->
        <div class="grid-2">
          <div class="campo">
            <label>Rol</label>
            <select v-model="rol" required>
              <option disabled value="">Selecciona un rol</option>
              <option v-for="r in roles" :key="r.idRol" :value="r.idRol">
                {{ r.nombre }}
              </option>
            </select>
          </div>

          <div class="campo">
            <label>Fecha de contrato</label>
            <input v-model="fechaContrato" type="date" required />
          </div>
        </div>

        <!-- DOCUMENTO + NOMBRES -->
        <div class="grid-2">
          <div class="campo">
            <label>Documento (CI)</label>
            <input v-model="documento" type="text" required />
          </div>

          <div class="campo">
            <label>Nombres</label>
            <input v-model="nombre" type="text" required />
          </div>
        </div>

        <!-- APELLIDOS + FECHA NAC -->
        <div class="grid-2">
          <div class="campo">
            <label>Apellidos</label>
            <input v-model="apellidos" type="text" required />
          </div>

          <div class="campo">
            <label>Fecha de nacimiento</label>
            <input v-model="fechaNac" type="date" required />
          </div>
        </div>

        <!-- CORREO + CONTRASEÑA -->
        <div class="grid-2">
          <div class="campo">
            <label>Correo</label>
            <input v-model="correo" type="email" required />
          </div>

          <div class="campo">
            <label>Contraseña</label>
            <input v-model="contrasena" type="password" required />
          </div>
        </div>

        <!-- CELULAR + TELÉFONO FIJO -->
        <div class="grid-2">
          <div class="campo">
            <label>Celular</label>
            <input v-model="celular" type="tel" />
          </div>

          <div class="campo">
            <label>Teléfono fijo</label>
            <input v-model="telefonoFijo" type="tel" />
          </div>
        </div>

        <!-- (oculto) tipo_usuario fijo para personal -->
        <!-- esto no se muestra, pero se incluye en el objeto al guardar -->
      </form>

      <footer class="modal-footer">
        <button type="button" class="btn-secundario" @click="cerrar">
          Cancelar
        </button>
        <button type="button" class="btn-primario" @click="guardar">
          Guardar
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["cerrar", "guardado"]);

// Mock de roles (luego vendrá de la BD / API)
const roles = ref([
  { idRol: 1, nombre: "Administrador" },
  { idRol: 2, nombre: "Recepcionista" },
  { idRol: 3, nombre: "Cocinero" },
]);

// Campos del formulario
const rol = ref("");
const fechaContrato = ref("");
const documento = ref("");
const nombre = ref("");
const apellidos = ref("");
const fechaNac = ref("");
const correo = ref("");
const contrasena = ref("");
const celular = ref("");
const telefonoFijo = ref("");

// idTipo fijo para personal (ajusta el número según tu tabla)
const ID_TIPO_PERSONAL = 2; // por ejemplo: 1=cliente, 2=personal

function cerrar() {
  emit("cerrar");
}

function guardar() {
  // Validación básica
  if (!rol.value || !documento.value || !nombre.value || !apellidos.value) {
    alert("Completa los campos obligatorios.");
    return;
  }

  // roles es un ref, así que usamos roles.value
  const rolInfo = roles.value.find((r) => r.idRol === Number(rol.value));
  const nuevoPersonal = {
    documento: documento.value,
    nombre: nombre.value,
    apellidos: apellidos.value,
    fecha_nac: fechaNac.value,
    correo: correo.value,
    contrasena: contrasena.value,
    celular: celular.value,
    telefono_fijo: telefonoFijo.value,
    idTipo: ID_TIPO_PERSONAL, // 👈 siempre tipo 'personal'
    idRol: Number(rol.value),
    rolNombre: rolInfo ? rolInfo.nombre : "Personal",
    fecha_contrato: fechaContrato.value,
  };

  // 👇 AQUÍ SÍ: usar nuevoPersonal, no "nuevo"
  console.log("👉 OBJETO CREADO:", nuevoPersonal);

  // Aquí luego harías un POST a /api/personal
  // await axios.post('/api/personal', nuevoPersonal)

  emit("guardado", nuevoPersonal);
  emit("cerrar");
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 40;
}

.modal {
  background: #fffaf0;
  width: min(840px, 96vw);
  max-height: 700px;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 12px 18px;
  background: #f3e1c4;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #3b2f22;
}

.btn-cerrar {
  border: none;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
}

.modal-body {
  padding: 14px 18px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
/* Estilo general del input date */
.campo input[type="date"] {
  width: 90%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d0c0a4;
  background: #fffdf7;
  font-size: 0.85rem;
  color: #3b2f22; /* color del texto */
}

/* Forzar color del texto de la fecha en navegadores WebKit (Chrome, Edge) */
.campo input[type="date"]::-webkit-datetime-edit,
.campo input[type="date"]::-webkit-datetime-edit-year-field,
.campo input[type="date"]::-webkit-datetime-edit-month-field,
.campo input[type="date"]::-webkit-datetime-edit-day-field,
.campo input[type="date"]::-webkit-datetime-edit-text {
  color: #3b2f22;
}

/* Por si algún estilo global te lo está pisando */
.campo input[type="date"] {
  color: #3b2f22 !important;
}
.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px 36px;
}
input[type="date"] {
  color: #2c3e50; /* Cambia el color del número */
}
.campo label {
  display: block;
  font-size: 0.8rem;
  margin-bottom: 4px;
  color: #6d5e4a;
}

.campo input,
.campo select {
  width: 90%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d0c0a4;
  background: #fffdf7;
  font-size: 0.85rem;
}

.modal-footer {
  padding: 10px 18px;
  border-top: 1px solid #e2d2b7;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-secundario,
.btn-primario {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid #b9985b;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-secundario {
  background: #fffdf7;
}

.btn-primario {
  background: #f7e3b4;
}

.btn-primario:hover {
  background: #f2d793;
}
</style>
