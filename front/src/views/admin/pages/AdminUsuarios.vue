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
            <td>{{ u.nombre_rol || u.rolNombre }}</td>
            <td>{{ u.fecha_contrato ? new Date(u.fecha_contrato).toLocaleDateString() : 'N/A' }}</td>
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
          </div>
          <div class="grid-2">
            <div class="campo">
              <label>Documento (No editable)</label>
              <input v-model="formEditar.documento" type="text" disabled />
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
          <div class="grid-2">
             <div class="campo" style="grid-column: span 2;">
              <label>Nueva Contraseña (Opcional)</label>
              <input v-model="formEditar.nueva_contrasena" type="password" placeholder="Dejar en blanco si no cambia" />
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

const busqueda = ref('')
const mostrarNuevo = ref(false)
const usuarioEditando = ref(null)
const usuarios = ref([]) // Ya no está hardcodeado, inicia vacío

// Idealmente, esto también vendría de tu BD en un futuro.
const roles = [
  { idRol: 1, nombre: 'Administrador' },
  { idRol: 2, nombre: 'Recepcionista' },
  { idRol: 3, nombre: 'Cocinero' },
]

// Helper para obtener los headers con el token
const getHeaders = () => {
  const token = localStorage.getItem('token'); // Asegúrate de que así lo guardas en tu Login
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

// 1. OBTENER PERSONAL
const cargarPersonal = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/usuarios/personal', { headers: getHeaders() });
    if (res.ok) {
      usuarios.value = await res.json();
    } else {
      console.error("Error al cargar personal");
    }
  } catch (error) {
    console.error("Error de conexión:", error);
  }
}

onMounted(() => {
  emit('set-titulo', 'Personal')
  cargarPersonal() // Cargamos los datos apenas carga el componente
})

const usuariosFiltrados = computed(() =>
  usuarios.value.filter(u =>
    `${u.nombre} ${u.apellidos} ${u.documento}`.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

const form = reactive({ documento: '', nombre: '', apellidos: '', fecha_nac: '', correo: '', contrasena: '', celular: '', telefono_fijo: '', idRol: '' })
const formEditar = reactive({})

// 2. CREAR PERSONAL
const guardarNuevo = async () => {
  if (!form.documento || !form.nombre || !form.apellidos || !form.idRol) { 
    alert('Completa los campos obligatorios'); 
    return; 
  }

  try {
    // Mapeamos los datos al formato que espera tu backend (contrasela, idrol)
    const bodyData = {
      ...form,
      contrasela: form.contrasena, 
      idrol: form.idRol
    };

    const res = await fetch('http://localhost:3000/api/usuarios/registro-personal', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bodyData)
    });

    const data = await res.json();
    if (res.ok) {
      mostrarNuevo.value = false;
      Object.assign(form, { documento: '', nombre: '', apellidos: '', fecha_nac: '', correo: '', contrasena: '', celular: '', telefono_fijo: '', idRol: '' });
      await cargarPersonal(); // Recargamos la tabla
    } else {
      alert(`Error: ${data.msg}`);
    }
  } catch (error) {
    console.error(error);
    alert('Hubo un error de conexión');
  }
}

const abrirEditar = (u) => {
  usuarioEditando.value = u
  Object.assign(formEditar, { 
    ...u, 
    idRol: u.idrol, // Mapeamos el idrol de la BD a nuestra variable
    nueva_contrasena: '' 
  })
}

// 3. EDITAR PERSONAL
const guardarEditar = async () => {
  try {
    const bodyData = {
      nombre: formEditar.nombre,
      apellidos: formEditar.apellidos,
      correo: formEditar.correo,
      celular: formEditar.celular,
      telefono_fijo: formEditar.telefono_fijo,
      idrol: formEditar.idRol
    };

    if (formEditar.nueva_contrasena) {
      bodyData.contrasela = formEditar.nueva_contrasena;
    }

    const res = await fetch(`http://localhost:3000/api/usuarios/personal/${formEditar.documento}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(bodyData)
    });

    const data = await res.json();
    if (res.ok) {
      usuarioEditando.value = null;
      await cargarPersonal();
    } else {
      alert(`Error: ${data.msg}`);
    }
  } catch (error) {
    console.error(error);
  }
}

// 4. ELIMINAR PERSONAL
const eliminar = async (u) => {
  if (confirm(`¿Eliminar a ${u.nombre} ${u.apellidos}?`)) {
    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/personal/${u.documento}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        await cargarPersonal();
      } else {
        const data = await res.json();
        alert(`Error: ${data.msg}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
</script>
<style scoped>
@import "../../../assets/admin.css";
</style>
