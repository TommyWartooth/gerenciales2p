<template>
  <div class="overlay" @click.self="cerrar">
    <div class="modal">
      <header class="modal-header">
        <h3>Crear nuevo plato</h3>
        <button class="btn-cerrar" @click="cerrar">✕</button>
      </header>

      <section class="modal-body">
        <div class="grid-2">
          <div class="campo">
            <label>Nombre</label>
            <input v-model="nombre" type="text" required />
          </div>

          <div class="campo">
            <label>Costo unitario (S/.)</label>
            <input
              v-model.number="costoUnitario"
              type="number"
              step="0.01"
              required
            />
          </div>
        </div>

        <div class="grid-2">
          <div class="campo">
            <label>Categoría</label>
            <select v-model.number="idcategoria" required>
              <option value="" disabled>Selecciona una categoría</option>
              <option
                v-for="c in categorias"
                :key="c.idcategoria"
                :value="c.idcategoria"
              >
                {{ c.nombre }}
              </option>
            </select>
          </div>

          <div class="campo">
            <label>Disponibilidad</label>
            <div class="switch-row">
              <span>{{
                disponibilidad ? "Disponible" : "No disponibilidad"
              }}</span>
              <label class="switch">
                <input type="checkbox" v-model="disponibilidad" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="campo">
          <label>Descripción</label>
          <textarea v-model="descripcion" rows="3"></textarea>
        </div>

        <!-- IMAGEN -->
        <div class="campo">
          <label>Imagen del plato</label>
          <div class="imagen-input-row">
            <input
              type="file"
              accept="image/*"
              @change="onArchivoSeleccionado"
            />
          </div>

          <!-- Vista previa -->
          <div v-if="previewUrl" class="imagen-preview">
            <img :src="previewUrl" alt="Vista previa del plato" />
          </div>

          <!-- Mostrar ruta generada -->
          <p v-if="imagen" class="ruta-texto">
            Ruta guardada: <code>{{ imagen }}</code>
          </p>
        </div>
      </section>

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

const props = defineProps({
  categorias: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["cerrar", "guardar"]);

// Campos
const nombre = ref("");
const costoUnitario = ref(null);
const descripcion = ref("");
const disponibilidad = ref(true);
const idcategoria = ref("");

// Imagen (solo guardamos la ruta relativa como string)
const imagen = ref(""); // ejemplo: "/imagenes/platos/ceviche.jpg"
const previewUrl = ref(null);

function cerrar() {
  emit("cerrar");
}

function onArchivoSeleccionado(event) {
  const file = event.target.files[0];

  if (!file) {
    imagen.value = "";
    previewUrl.value = null;
    return;
  }

  // Nombre del archivo
  const fileName = file.name;

  // Ruta relativa que guardarás en tu BD o mock
  imagen.value = `/imagenes/platos/${fileName}`;

  // Preview temporal
  previewUrl.value = URL.createObjectURL(file);
}

function guardar() {
  if (!nombre.value || !costoUnitario.value || !idcategoria.value) {
    alert("Completa todos los campos obligatorios.");
    return;
  }

  emit("guardar", {
    nombre: nombre.value,
    costo_unitario: Number(costoUnitario.value),
    descripcion: descripcion.value,
    disponibilidad: disponibilidad.value,
    idcategoria: Number(idcategoria.value),

    // tipo (texto)
    tipo: props.categorias.find((c) => c.idcategoria === idcategoria.value)
      ?.nombre,

    // ruta relativa de la imagen
    imagen: imagen.value || null,
  });
}
</script>

<style scoped>
/* Overlay oscuro de fondo */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 40;
}

/* Contenedor principal del modal */
.modal {
  background: #fffaf0;
  width: min(650px, 96vw);
  max-height: 90vh;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.modal-header {
  padding: 14px 20px;
  background: #f3e1c4;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #3b2f22;
}

.btn-cerrar {
  border: none;
  background: transparent;
  font-size: 1.1rem;
  cursor: pointer;
  color: #6d5e4a;
}

/* Cuerpo */
.modal-body {
  padding: 18px 22px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* Grid de 2 columnas responsivo */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px 24px;
}

/* Campos */
.campo {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.campo label {
  font-size: 0.8rem;
  margin-bottom: 2px;
  color: #6d5e4a;
}

.campo input,
.campo select,
.campo textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #d0c0a4;
  background: #fffdf7;
  font-size: 0.9rem;
}

/* Switch disponibilidad */
.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 4px;
}

.switch-row span {
  font-size: 0.85rem;
  color: #3b2f22;
}

/* Toggle switch */
.switch {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #c9b79a;
  border-radius: 22px;
  transition: 0.2s;
}

.slider::before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: #ffffff;
  border-radius: 50%;
  transition: 0.2s;
}

.switch input:checked + .slider {
  background-color: #2f7a47;
}

.switch input:checked + .slider::before {
  transform: translateX(18px);
}

/* Footer */
.modal-footer {
  padding: 10px 18px;
  border-top: 1px solid #e2d2b7;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* Botones */
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

.btn-secundario:hover {
  background: #f3ebdd;
}

.btn-primario {
  background: #f7e3b4;
}

.btn-primario:hover {
  background: #f4d894;
}
/* Contenedor general de la sección de imagen */
.campo {
  margin-bottom: 1.2rem;
}

/* Caja para el input */
.imagen-input-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border: 2px dashed #8da1b5;
  border-radius: 10px;
  background: #f3f6fa;
  cursor: pointer;
  transition: 0.25s ease;
}

.imagen-input-row:hover {
  border-color: #4e6e8e;
  background: #eef3f7;
}

/* Mejorar el input de archivo */
.imagen-input-row input[type="file"] {
  cursor: pointer;
  font-size: 0.9rem;
}

/* Caja del preview */
.imagen-preview {
  margin-top: 0.75rem;
  max-width: 240px;
  max-height: 190px;
  border-radius: 12px;
  overflow: hidden;

  background: #ffffff;
  border: 2px solid #d9e1e8;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);

  transition: transform 0.2s ease;
}

.imagen-preview:hover {
  transform: scale(1.02);
}

/* Imagen ajustada */
.imagen-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Ruta del archivo */
.ruta-texto {
  margin-top: 0.6rem;
  font-size: 0.86rem;
  color: #445668;
  background: #f1f5f9;
  padding: 0.45rem 0.55rem;
  border-radius: 6px;
  border: 1px solid #cdd6df;
  display: inline-block;
}
</style>
