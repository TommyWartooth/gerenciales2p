<template>
  <div class="overlay" @click.self="cerrar">
    <div class="modal">
      <header class="modal-header">
        <h3>Editar personal</h3>
        <button class="btn-cerrar" @click="cerrar">✕</button>
      </header>

      <section class="modal-body">
        <div class="grid-2">
          <div class="campo">
            <label>Rol</label>
            <select v-model="rol" required>
              <option value="">Selecciona un rol</option>
              <option v-for="r in roles" :key="r.idRol" :value="r.idRol">
                {{ r.nombre }}
              </option>
            </select>
          </div>

          <div class="campo">
            <label>Fecha contrato</label>
            <input type="date" v-model="fechaContrato" required />
          </div>
        </div>

        <div class="grid-2">
          <div class="campo">
            <label>Documento</label>
            <input v-model="documento" required />
          </div>

          <div class="campo">
            <label>Nombres</label>
            <input v-model="nombre" required />
          </div>
        </div>

        <div class="grid-2">
          <div class="campo">
            <label>Apellidos</label>
            <input v-model="apellidos" required />
          </div>

          <div class="campo">
            <label>Fecha nacimiento</label>
            <input type="date" v-model="fechaNac" />
          </div>
        </div>

        <div class="grid-2">
          <div class="campo">
            <label>Correo</label>
            <input type="email" v-model="correo" />
          </div>

          <div class="campo">
            <label>Contraseña</label>
            <input type="password" v-model="contrasena" />
          </div>
        </div>

        <div class="grid-2">
          <div class="campo">
            <label>Celular</label>
            <input v-model="celular" />
          </div>

          <div class="campo">
            <label>Teléfono fijo</label>
            <input v-model="telefonoFijo" />
          </div>
        </div>
      </section>

      <footer class="modal-footer">
        <button type="button" class="btn-secundario" @click="cerrar">
          Cancelar
        </button>
        <button type="button" class="btn-primario" @click="guardarCambios">
          Actualizar
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  usuario: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["cerrar", "actualizar"]);

const roles = [
  { idRol: 1, nombre: "Administrador" },
  { idRol: 2, nombre: "Recepcionista" },
  { idRol: 3, nombre: "Cocinero" },
];

// descomponer nombre completo si viene junto
const nombreCompleto = props.usuario.nombre || "";
const partes = nombreCompleto.split(" ");
const nombreInicial = partes.shift() || "";
const apellidosInicial = props.usuario.apellidos || partes.join(" ");

const rol = ref(
  props.usuario.idRol ??
    (roles.find((r) => r.nombre === props.usuario.rol)?.idRol || "")
);
const fechaContrato = ref(props.usuario.fecha_contrato || "");
const documento = ref(props.usuario.documento || "");
const nombre = ref(nombreInicial);
const apellidos = ref(apellidosInicial);
const fechaNac = ref(props.usuario.fecha_nac || "");
const correo = ref(props.usuario.correo || "");
const contrasena = ref(props.usuario.contrasena || "");
const celular = ref(props.usuario.celular || "");
const telefonoFijo = ref(props.usuario.telefono_fijo || "");

function cerrar() {
  emit("cerrar");
}

function guardarCambios() {
  if (!rol.value || !documento.value || !nombre.value || !apellidos.value) {
    alert("Completa los campos obligatorios.");
    return;
  }

  const rolInfo = roles.find((r) => r.idRol === Number(rol.value));

  const actualizado = {
    ...props.usuario,
    documento: documento.value,
    nombre: `${nombre.value} ${apellidos.value}`.trim(),
    apellidos: apellidos.value,
    fecha_nac: fechaNac.value,
    correo: correo.value,
    contrasena: contrasena.value,
    celular: celular.value,
    telefono_fijo: telefonoFijo.value,
    fecha_contrato: fechaContrato.value,
    idRol: Number(rol.value),
    rolNombre: rolInfo ? rolInfo.nombre : props.usuario.rol,
    rol: rolInfo ? rolInfo.nombre : props.usuario.rol,
  };

  console.log("📝 USUARIO ACTUALIZADO:", actualizado);

  emit("actualizar", actualizado);
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
  width: min(700px, 96vw);
  max-height: 90vh;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 14px 20px;
  background: #f3e1c4;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 18px 22px;
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
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px 24px;
}

.campo label {
  font-size: 0.8rem;
  margin-bottom: 4px;
  color: #6d5e4a;
}

.campo input,
.campo select {
  width: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #d0c0a4;
  background: #fffdf7;
  font-size: 0.9rem;
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
</style>
