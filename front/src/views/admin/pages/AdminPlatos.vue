<template>
  <div class="admin-page">
    <div class="admin-page__toolbar">
      <input v-model="busqueda" class="admin-input-search" placeholder="Buscar plato..." />
      <select v-model="filtroCategoria" class="admin-input-search">
        <option :value="0">Todas las categorías</option>
        <option v-for="c in categorias" :key="c.idcategoria" :value="c.idcategoria">
          {{ c.nombre }}
        </option>
      </select>
      <button class="btn-admin-primary" @click="mostrarNuevo = true">+ Nuevo plato</button>
    </div>

    <div class="tabla-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio (Bs.)</th>
            <th>Disponibilidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in platosFiltrados" :key="p.id_plato">
            <td>{{ p.id_plato }}</td>
            <td>{{ p.nombre }}</td>
            <td>{{ p.costo_unitario.toFixed(2) }}</td>
            <td>
              <span class="badge" :class="p.disponibilidad ? 'disponible' : 'nodisponible'">
                {{ p.disponibilidad ? 'Disponible' : 'No disponible' }}
              </span>
            </td>
            <td class="acciones">
              <button class="btn-edit" @click="abrirEditar(p)">✏️ Editar</button>
              <button 
                class="btn-delete" 
                @click="eliminar(p)" 
                :disabled="!p.puede_borrarse"
                :title="!p.puede_borrarse ? 'No se puede eliminar: el plato tiene pedidos registrados' : 'Eliminar'"
              >
                🗑 Eliminar
              </button>
            </td>
          </tr>
          <tr v-if="!platosFiltrados.length">
            <td colspan="5" class="tabla-vacia">No se encontraron platos.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="mostrarNuevo" class="modal-backdrop" @click.self="mostrarNuevo = false">
      <div class="modal">
        <header class="modal-header">
          <h3>Nuevo plato</h3>
          <button class="modal-cerrar" @click="mostrarNuevo = false">✕</button>
        </header>
        <section class="modal-body">
          <div class="grid-2">
            <div class="campo">
              <label>Nombre</label>
              <input v-model="form.nombre" type="text" required />
            </div>
            <div class="campo">
              <label>Precio (Bs.)</label>
              <input v-model.number="form.costo_unitario" type="number" step="0.01" />
            </div>
          </div>
          <div class="grid-2">
            <div class="campo">
              <label>Categoría</label>
              <select v-model.number="form.idcategoria">
                <option value="" disabled>Selecciona</option>
                <option v-for="c in categorias" :key="c.idcategoria" :value="c.idcategoria">
                  {{ c.nombre }}
                </option>
              </select>
            </div>
            <div class="campo">
              <label>Disponibilidad</label>
              <div class="switch-row">
                <span>{{ form.disponibilidad ? 'Disponible' : 'No disponible' }}</span>
                <label class="switch">
                  <input type="checkbox" v-model="form.disponibilidad" />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
          <div class="campo">
            <label>Descripción</label>
            <textarea v-model="form.descripcion" rows="3"></textarea>
          </div>
          <div class="campo">
            <label>Imagen</label>
            <div class="imagen-input-row">
              <input type="file" accept="image/*" @change="onFoto" />
            </div>
            <div v-if="form.previewUrl" class="imagen-preview">
              <img :src="form.previewUrl" alt="preview" />
            </div>
          </div>
        </section>
        <footer class="modal-footer">
          <button class="btn-admin-secondary" @click="mostrarNuevo = false">Cancelar</button>
          <button class="btn-admin-primary" @click="guardarNuevo">Guardar</button>
        </footer>
      </div>
    </div>

    <div v-if="platoEditando" class="modal-backdrop" @click.self="platoEditando = null">
      <div class="modal">
        <header class="modal-header">
          <h3>Editar plato</h3>
          <button class="modal-cerrar" @click="platoEditando = null">✕</button>
        </header>
        <section class="modal-body">
          <div class="grid-2">
            <div class="campo">
              <label>Nombre</label>
              <input v-model="formEditar.nombre" type="text" />
            </div>
            <div class="campo">
              <label>Precio (Bs.)</label>
              <input v-model.number="formEditar.costo_unitario" type="number" step="0.01" />
            </div>
          </div>
          <div class="grid-2">
            <div class="campo">
              <label>Categoría</label>
              <select v-model.number="formEditar.idcategoria">
                <option v-for="c in categorias" :key="c.idcategoria" :value="c.idcategoria">
                  {{ c.nombre }}
                </option>
              </select>
            </div>
            <div class="campo">
              <label>Disponibilidad</label>
              <div class="switch-row">
                <span>{{ formEditar.disponibilidad ? 'Disponible' : 'No disponible' }}</span>
                <label class="switch">
                  <input type="checkbox" v-model="formEditar.disponibilidad" />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
          <div class="campo">
            <label>Descripción</label>
            <textarea v-model="formEditar.descripcion" rows="3"></textarea>
          </div>
          <div class="campo">
            <label>Imagen</label>
            <div class="imagen-input-row">
              <input type="file" accept="image/*" @change="onFotoEditar" />
            </div>
            <div v-if="formEditar.previewUrl || formEditar.imagen" class="imagen-preview">
              <img :src="formEditar.previewUrl || formEditar.imagen" alt="preview" />
            </div>
          </div>
        </section>
        <footer class="modal-footer">
          <button class="btn-admin-secondary" @click="platoEditando = null">Cancelar</button>
          <button class="btn-admin-primary" @click="guardarEditar">Actualizar</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import '../../../assets/admin.css'

const emit = defineEmits(['set-titulo'])

const busqueda = ref('')
const filtroCategoria = ref(0)
const mostrarNuevo = ref(false)
const platoEditando = ref(null)
const platos = ref([])

const categorias = ref([
  { idcategoria: 1, nombre: "Bebidas" },
  { idcategoria: 2, nombre: "Entradas" },
  { idcategoria: 3, nombre: "Platos fuertes" },
  { idcategoria: 4, nombre: "Postres" },
])

// PLATOS
async function cargarPlatos() {
  try {
    const token = localStorage.getItem('token')
    const resp = await fetch("http://localhost:3000/api/platos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })

    if (resp.status === 401) {
      console.warn("El token no sirve o expiró.")
      return
    }

    const data = await resp.json()
    const listaDePlatos = Array.isArray(data) ? data : (data.platos || data.data || [])

    platos.value = listaDePlatos.map((p) => ({
      id_plato: p.id_plato || p.idplato || p.id,
      nombre: p.nombre,
      costo_unitario: Number(p.costo_unitario),
      descripcion: p.descripcion,
      disponibilidad: p.disponibilidad,
      idcategoria: p.idcategoria,
      imagen: p.imagen,
      puede_borrarse: p.puede_borrarse 
    }))
  } catch (err) {
    console.error("Error fatal:", err)
  }
}

onMounted(() => {
  emit('set-titulo', 'Platos')
  cargarPlatos()
})

// REACTIVOS
const form = reactive({
  nombre: '',
  costo_unitario: null,
  descripcion: '',
  disponibilidad: true,
  idcategoria: '',
  imagen: '',
  previewUrl: null
})

const formEditar = reactive({
  id_plato: null,
  nombre: '',
  costo_unitario: null,
  descripcion: '',
  disponibilidad: true,
  idcategoria: '',
  imagen: '',
  previewUrl: null
})


const guardarNuevo = async () => {
  if (!form.nombre || !form.costo_unitario || !form.idcategoria) {
    alert('Completa los campos obligatorios')
    return
  }

  // ARMAMOS LA RUTA DINÁMICA JUSTO ANTES DE GUARDAR
  if (form.imagen && !form.imagen.startsWith('/imagenes/')) {
    const nombreArchivo = form.imagen.split('/').pop();
    const cat = categorias.value.find(c => String(c.idcategoria) === String(form.idcategoria));
    let carpeta = (cat && cat.nombre) ? cat.nombre.toLowerCase().replace(/ñ/g, 'n').replace(/\s+/g, '-') : 'platos';
    
    // Si la carpeta es "platos-fuertes", usamos "platos" que es la carpeta real en el servidor
    if (carpeta === 'platos-fuertes') carpeta = 'platos';
    
    form.imagen = `/imagenes/${carpeta}/${nombreArchivo}`;
  }

  try {
    const token = localStorage.getItem('token')
    const resp = await fetch("http://localhost:3000/api/platos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(form),
    })
    if (!resp.ok) {
      if (resp.status === 401) throw new Error("Sesión expirada o sin permisos")
      throw new Error("Error al crear plato")
    }
    await cargarPlatos()
    mostrarNuevo.value = false
    Object.assign(form, { nombre: '', costo_unitario: null, descripcion: '', disponibilidad: true, idcategoria: '', imagen: '', previewUrl: null })
    alert("Plato creado con éxito")
  } catch (error) {
    alert("No se pudo guardar: " + error.message)
  }
}


const abrirEditar = (p) => {
  platoEditando.value = p
  Object.assign(formEditar, { ...p, previewUrl: null })
}

const guardarEditar = async () => {
  // ARMAMOS LA RUTA DINÁMICA PARA EDITAR (Solo si subió foto nueva)
  if (formEditar.imagen && formEditar.previewUrl) { 
    const nombreArchivo = formEditar.imagen.split('/').pop();
    const cat = categorias.value.find(c => String(c.idcategoria) === String(formEditar.idcategoria));
    let carpeta = (cat && cat.nombre) ? cat.nombre.toLowerCase().replace(/ñ/g, 'n').replace(/\s+/g, '-') : 'platos';
    
    // Si la carpeta es "platos-fuertes", usamos "platos" que es la carpeta real en el servidor
    if (carpeta === 'platos-fuertes') carpeta = 'platos';
    
    formEditar.imagen = `/imagenes/${carpeta}/${nombreArchivo}`;
  }

  try {
    const id = formEditar.id_plato
    const token = localStorage.getItem('token')
    const resp = await fetch(`http://localhost:3000/api/platos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(formEditar),
    })
    if (!resp.ok) {
      if (resp.status === 401) throw new Error("Sesión expirada o sin permisos")
      throw new Error("Error al actualizar")
    }
    await cargarPlatos()
    platoEditando.value = null
    alert("Plato actualizado correctamente")
  } catch (error) {
    alert("Error: " + error.message)
  }
}

const eliminar = async (p) => {
  if (!confirm(`¿Seguro que deseas eliminar "${p.nombre}"?`)) return
  try {
    const id = p.id_plato
    const token = localStorage.getItem('token')
    const resp = await fetch(`http://localhost:3000/api/platos/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (!resp.ok) {
      if (resp.status === 401) throw new Error("Sesión expirada o sin permisos")
      throw new Error("No se pudo eliminar de la BD")
    }
    await cargarPlatos()
    alert("Plato eliminado")
  } catch (error) {
    alert("Error al eliminar: " + error.message)
  }
}

const platosFiltrados = computed(() =>
  (platos.value || []).filter(p => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
    const coincideCategoria = filtroCategoria.value === 0 || p.idcategoria === filtroCategoria.value
    return coincideNombre && coincideCategoria
  })
)

// LIMPIAMOS EL NOMBRE DEL ARCHIVO Y CREAMOS PREVIEW
const onFoto = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const nombreLimpio = file.name.toLowerCase().replace(/ñ/g, 'n').replace(/\s+/g, '-');
  form.imagen = nombreLimpio; 
  form.previewUrl = URL.createObjectURL(file)
}

const onFotoEditar = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const nombreLimpio = file.name.toLowerCase().replace(/ñ/g, 'n').replace(/\s+/g, '-');
  formEditar.imagen = nombreLimpio; 
  formEditar.previewUrl = URL.createObjectURL(file)
}
</script>
<style scoped>
.imagen-input-row {
  padding: 0.8rem 1rem;
  border: 2px dashed rgba(235,205,149,0.2);
  border-radius: 4px;
  background: rgba(255,255,255,0.02);
  cursor: pointer;
}
.imagen-preview {
  margin-top: 0.8rem;
  max-width: 200px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(235,205,149,0.2);
}
.imagen-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.btn-delete:disabled {
  background-color: #d1d5db !important; 
  color: #9ca3af !important;           
  cursor: not-allowed;                
  border-color: #e5e7eb !important;
  box-shadow: none !important;         
  transform: none !important;         
  opacity: 0.7;
}

.btn-delete:disabled:hover {
  background-color: #d1d5db !important;
  filter: none !important;
}
</style>