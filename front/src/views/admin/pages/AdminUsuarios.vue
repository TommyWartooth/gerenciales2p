<template>
  <div class="admin-page">

    <div class="admin-page__toolbar">
      <input v-model="busqueda" class="admin-input-search" placeholder="Buscar personal..." />
      <button class="btn-admin-primary" @click="mostrarNuevo = true">+ Nuevo personal</button>
    </div>

    <div class="tabla-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Documento</th>
            <th>Nombre completo</th>
            <th>Rol</th>
            <th>Fecha contrato</th>
            <th>Celular</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in usuariosFiltrados" :key="u.documento">
            <td>{{ u.documento }}</td>
            <td>{{ u.nombre }} {{ u.apellidos }}</td>
            <td>{{ u.rolNombre }}</td>
            <td>{{ u.fecha_contrato }}</td>
            <td>{{ u.celular }}</td>
            <td class="acciones">
              <button class="btn-edit" @click="abrirEditar(u)">✏️ Editar</button>
              <button class="btn-delete" @click="eliminar(u)">🗑 Eliminar</button>
            </td>
          </tr>
          <tr v-if="!usuariosFiltrados.length">
            <td colspan="6" class="tabla-vacia">No se encontró personal.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Nuevo Personal -->
    <div v-if="mostrarNuevo" class="modal-backdrop" @click.self="mostrarNuevo = false">
      <div class="modal">
        <header class="modal-header">
          <h3>Nuevo personal</h3>
          <button class="modal-cerrar" @click="mostrarNuevo = false">✕</button>
        </header>
        <section class="modal-body">
          <div class="grid-2">
            <div class="campo">
              <label>Rol</label>
              <select v-model="form.idRol">
                <option disabled value="">Selecciona un rol</option>
                <option v-for="r in roles" :key="r.idRol" :value="r.idRol">{{ r.nombre }}</option>
              </select>
            </div>
            <div class="campo">
              <label>Fecha de contrato</label>
              <input type="date" v-model="form.fecha_contrato" />
            </div>
          </div>
          <div class="grid-2">
            <div class="campo">
              <label>Documento (CI)</label>
              <input v-model="form.documento" type="text" required />
            </div>
            <div class="campo">
              <label>Nombres</label>
              <input v-model="form.nombre" type="text" required />
            </div>
          </div>
          <div class="grid-2">
            <div class="campo">
              <label>Apellidos</label>
              <input v-model="form.apellidos" type="text" required />
            </div>
            <div class="campo">
              <label>Fecha de nacimiento</label>
              <input type="date" v-model="form.fecha_nac" />
            </div>
          </div>
          <div class="grid-2">
            <div class="campo">
              <label>Correo</label>
              <input v-model="form.correo" type="email" />
            </div>
            <div class="campo">
              <label>Contraseña</label>
              <input v-model="form.contrasena" type="password" />
            </div>
          </div>
          <div class="grid-2">
            <div class="campo">
              <label>Celular</label>
              <input v-model="form.celular" type="tel" />
            </div>
            <div class="campo">
              <label>Teléfono fijo</label>
              <input v-model="form.telefono_fijo" type="tel" />
            </div>
          </div>
        </section>
        <footer class="modal-footer">
          <button class="btn-admin-secondary" @click="mostrarNuevo = false">Cancelar</button>
          <button class="btn-admin-primary" @click="guardarNuevo">Guardar</button>
        </footer>
      </div>
    </div>

    <!-- Modal Editar Personal -->
    <div v-if="usuarioEditando" class="modal-backdrop" @click.self="usuarioEditando = null">
      <div class="modal">
        <header class="modal-header">
          <h3>Editar personal</h3>
          <button class="modal-cerrar" @click="usuarioEditando = null">✕</button>
        </header>
        <section class="modal-body">
          <div class="grid-2">
            <div class="campo">
              <label>Rol</label>
              <select v-model="formEditar.idRol">
                <option v-for="r in roles" :key="r.idRol" :value="r.idRol">{{ r.nombre }}</option>
              </select>
            </div>
            <div class="campo">
              <label>Fecha de contrato</label>
              <input type="date" v-model="formEditar.fecha_contrato" />
            </div>
          </div>
          <div class="grid-2">
            <div class="campo">
              <label>Documento</label>
              <input v-model="formEditar.documento" type="text" />
            </div>
            <div class="campo">
              <label>Nombres</label>
              <input v-model="formEditar.nombre" type="text" />
            </div>
          </div>
          <div class="grid-2">
            <div class="campo">
              <label>Apellidos</label>
              <input v-model="formEditar.apellidos" type="text" />
            </div>
            <div class="campo">
              <label>Correo</label>
              <input v-model="formEditar.correo" type="email" />
            </div>
          </div>
          <div class="grid-2">
            <div class="campo">
              <label>Celular</label>
              <input v-model="formEditar.celular" type="tel" />
            </div>
            <div class="campo">
              <label>Teléfono fijo</label>
              <input v-model="formEditar.telefono_fijo" type="tel" />
            </div>
          </div>
        </section>
        <footer class="modal-footer">
          <button class="btn-admin-secondary" @click="usuarioEditando = null">Cancelar</button>
          <button class="btn-admin-primary" @click="guardarEditar">Actualizar</button>
        </footer>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import "../../../assets/admin.css";

const emit = defineEmits(['set-titulo'])
onMounted(() => emit('set-titulo', 'Personal'))

const busqueda     = ref('')
const mostrarNuevo = ref(false)
const usuarioEditando = ref(null)

const roles = [
  { idRol: 1, nombre: 'Administrador' },
  { idRol: 2, nombre: 'Recepcionista' },
  { idRol: 3, nombre: 'Cocinero' },
]

const usuarios = ref([
  { documento: '10000001', nombre: 'María',  apellidos: 'López',   rolNombre: 'Administrador', idRol: 1, fecha_contrato: '2022-03-01', celular: '70011111', correo: 'maria@taitita.com' },
  { documento: '10000002', nombre: 'Pedro',  apellidos: 'Gutiérrez', rolNombre: 'Recepcionista', idRol: 2, fecha_contrato: '2023-06-15', celular: '70022222', correo: 'pedro@taitita.com' },
  { documento: '10000003', nombre: 'Rosa',   apellidos: 'Choque',  rolNombre: 'Cocinero',      idRol: 3, fecha_contrato: '2023-01-10', celular: '70033333', correo: 'rosa@taitita.com' },
])

const usuariosFiltrados = computed(() =>
  usuarios.value.filter(u =>
    `${u.nombre} ${u.apellidos} ${u.documento}`.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

const form = reactive({ documento: '', nombre: '', apellidos: '', fecha_nac: '', correo: '', contrasena: '', celular: '', telefono_fijo: '', idRol: '', fecha_contrato: '' })
const formEditar = reactive({})

const guardarNuevo = () => {
  if (!form.documento || !form.nombre || !form.apellidos || !form.idRol) { alert('Completa los campos obligatorios'); return }
  const rolInfo = roles.find(r => r.idRol === Number(form.idRol))
  usuarios.value.push({ ...form, rolNombre: rolInfo?.nombre || '' })
  mostrarNuevo.value = false
  Object.assign(form, { documento: '', nombre: '', apellidos: '', fecha_nac: '', correo: '', contrasena: '', celular: '', telefono_fijo: '', idRol: '', fecha_contrato: '' })
}

const abrirEditar = (u) => {
  usuarioEditando.value = u
  Object.assign(formEditar, { ...u })
}

const guardarEditar = () => {
  const idx = usuarios.value.findIndex(u => u.documento === usuarioEditando.value.documento)
  if (idx !== -1) {
    const rolInfo = roles.find(r => r.idRol === Number(formEditar.idRol))
    usuarios.value[idx] = { ...formEditar, rolNombre: rolInfo?.nombre || formEditar.rolNombre }
  }
  usuarioEditando.value = null
}

const eliminar = (u) => {
  if (confirm(`¿Eliminar a ${u.nombre} ${u.apellidos}?`))
    usuarios.value = usuarios.value.filter(x => x.documento !== u.documento)
}
</script>

<style scoped>
@import "../../../assets/admin.css";
</style>