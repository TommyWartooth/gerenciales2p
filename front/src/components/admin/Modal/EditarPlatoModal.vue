<template>
  <div class="overlay" @click.self="cerrar">
    <div class="modal">
      <header class="modal-header">
        <h3>Editar plato</h3>
        <button class="btn-cerrar" @click="cerrar">✕</button>
      </header>

      <section class="modal-body">
        <div class="grid-2">
          <div class="campo">
            <label>Nombre</label>
            <input v-model="nombre" type="text" required />
          </div>

          <div class="campo">
            <label>Costo unitario (bs)</label>
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
              <span>{{ disponibilidad ? "Disponible" : "No disponible" }}</span>
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

        <div class="campo">
          <label>Imagen del plato</label>

          <div class="imagen-input-row">
            <input
              type="file"
              accept="image/*"
              @change="onArchivoSeleccionado"
            />
          </div>

          <div v-if="previewUrl" class="imagen-preview">
            <img :src="previewUrl" alt="Vista previa del plato" />
          </div>

          <p v-if="imagenCalculada" class="ruta-texto">
            Ruta guardada: <code>{{ imagenCalculada }}</code>
          </p>
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
import { ref, computed } from "vue";

const props = defineProps({
  plato: {
    type: Object,
    required: true,
  },
  categorias: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["cerrar", "actualizar"]);

const id_plato = props.plato.id_plato ?? props.plato.idplato ?? props.plato.id;

// Campos base
const nombre = ref(props.plato.nombre || "");
const costoUnitario = ref(props.plato.costo_unitario ?? 0);
const descripcion = ref(props.plato.descripcion || "");
const disponibilidad = ref(
  props.plato.disponible === true ||
    props.plato.disponible === 1 ||
    props.plato.disponibilidad === true ||
    props.plato.disponibilidad === 1
);
const idcategoria = ref(props.plato.idcategoria ?? "");

// Variables para la imagen
const archivoNuevo = ref(""); 
const previewUrl = ref(props.plato.imagen || null);

const imagenCalculada = computed(() => {
  // ¡EL MISMO TRUCO AQUÍ!
  const categoriaSeleccionada = props.categorias.find((c) => 
    String(c.idcategoria) === String(idcategoria.value)
  );
  
  let carpeta = "platos";
  if (categoriaSeleccionada && categoriaSeleccionada.nombre) {
    carpeta = categoriaSeleccionada.nombre.toLowerCase().replace(/\s+/g, '-');
  }

  if (archivoNuevo.value) {
    return `/imagenes/${carpeta}/${archivoNuevo.value}`;
  }
  
  if (props.plato.imagen) {
    const nombreArchivoViejo = props.plato.imagen.split('/').pop();
    return `/imagenes/${carpeta}/${nombreArchivoViejo}`;
  }

  return "";
});
function cerrar() {
  emit("cerrar");
}

function onArchivoSeleccionado(event) {
  const file = event.target.files[0];

  if (!file) {
    archivoNuevo.value = "";
    previewUrl.value = props.plato.imagen || null;
    return;
  }

  // Limpieza del nombre de archivo
  let fileName = file.name;
  fileName = fileName.toLowerCase().replace(/ñ/g, 'n').replace(/\s+/g, '-');

  archivoNuevo.value = fileName;
  previewUrl.value = URL.createObjectURL(file);
}

function guardarCambios() {
  if (!nombre.value || !costoUnitario.value || !idcategoria.value) {
    alert("Completa los campos obligatorios.");
    return;
  }

  const actualizado = {
    ...props.plato,
    id_plato, 
    nombre: nombre.value,
    costo_unitario: Number(costoUnitario.value),
    descripcion: descripcion.value,
    disponibilidad: !!disponibilidad.value,
    idcategoria: Number(idcategoria.value),
    // Mandamos la imagen calculada
    imagen: imagenCalculada.value || null,
  };

  console.log("🍽 PLATO ACTUALIZADO:", actualizado);

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
  width: min(650px, 96vw);
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
  gap: 18px;
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
.campo select,
.campo textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #d0c0a4;
  background: #fffdf7;
  font-size: 0.9rem;
}

.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

/* switch estilo simple */
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

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.2s;
}

.switch input:checked + .slider {
  background-color: #2f7a47;
}

.switch input:checked + .slider:before {
  transform: translateX(18px);
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
