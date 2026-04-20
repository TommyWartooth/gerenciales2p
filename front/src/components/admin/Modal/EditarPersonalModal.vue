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
  background: rgba(0, 0, 0, 0.8); /* Fondo más oscuro para resaltar el vino */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  backdrop-filter: blur(4px); /* Efecto desenfoque muy moderno */
}

.modal {
  background: var(--black-soft); /* Fondo oscuro ejecutivo */
  width: min(700px, 96vw);
  max-height: 90vh;
  border-radius: 12px; /* Un poco más recto para ser más serio */
  border: 1px solid var(--wine-light);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 16px 24px;
  background: var(--wine-dark); /* Cabecera vino oscuro */
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--gold-dim);
}

.modal-header h3 {
  margin: 0;
  color: var(--gold); /* Título en Oro */
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: var(--black-soft);
}

/* --- INPUTS Y LABELS --- */
.campo label {
  font-size: 0.85rem;
  margin-bottom: 6px;
  color: var(--gold-dim); /* Labels en Oro tenue */
  display: block;
  font-family: 'Jost', sans-serif;
}

.campo input,
.campo select,
.campo input[type="date"] {
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid var(--wine);
  background: var(--black); /* Inputs negros para contraste */
  font-size: 0.95rem;
  color: var(--white) !important;
  transition: border 0.3s ease;
}

.campo input:focus {
  outline: none;
  border-color: var(--gold);
}

/* Fix específico para el calendario en navegadores webkit */
.campo input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.8) sepia(1) saturate(5) hue-rotate(350deg); /* Icono del calendario en oro */
  cursor: pointer;
}

/* --- FOOTER Y BOTONES --- */
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--wine);
  background: var(--wine-dark);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-secundario {
  padding: 8px 18px;
  border-radius: 4px;
  border: 1px solid var(--muted);
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secundario:hover {
  border-color: var(--white);
  color: var(--white);
}

.btn-primario {
  padding: 8px 18px;
  border-radius: 4px;
  border: 1px solid var(--gold);
  background: var(--wine-light);
  color: var(--gold);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primario:hover {
  background: var(--gold);
  color: var(--wine-dark);
}

/* Grid para formularios */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}
</style>
