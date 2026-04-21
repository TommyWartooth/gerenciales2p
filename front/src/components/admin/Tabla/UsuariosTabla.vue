<template>
  <div class="tabla-wrap">
    <table class="admin-table">
      <thead>
        <tr>
          <th>Documento (CI)</th>
          <th>Nombre</th>
          <th>NIT</th>
          <th>Razón Social</th>
          <th>Correo</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="c in clientes" :key="c.documento">
          <td>{{ c.documento }}</td>
          <td>{{ c.nombre }} {{ c.apellidos }}</td>
          <td>{{ c.nit || 'S/N' }}</td>
          <td>{{ c.razon_social || 'N/A' }}</td>
          <td>{{ c.correo }}</td>
        </tr>

        <tr v-if="!clientes || clientes.length === 0">
          <td colspan="5" class="tabla-vacia">No se encontraron clientes o cargando...</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const clientes = ref([]);

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

const cargarClientes = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/usuarios/clientes', {
      headers: getHeaders()
    });
    
    if (res.ok) {
      clientes.value = await res.json();
    } else {
      console.error("No tienes permisos o hubo un error al cargar clientes");
    }
  } catch (error) {
    console.error("Error de red:", error);
  }
};

// Carga los clientes automáticamente cuando la tabla se muestra
onMounted(() => {
  cargarClientes();
});
</script>

<style scoped>
@import "../../../assets/admin.css"; /* Asegúrate de que esta ruta sea válida para este archivo */
</style>
<style scoped>
.table-wrapper {
  margin-top: 8px;
  background: #fdf8ec;
  border-radius: 10px;
  border: 1px solid #d0c0a4;
  overflow: hidden;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.admin-table th,
.admin-table td {
  padding: 6px 10px;
  border-bottom: 1px solid #e0d2b8;
  text-align: center;
}

.admin-table thead {
  background: #f2e6cf;
}

.admin-table tbody tr:nth-child(odd) {
  background: #fbf6ec;
}

.admin-table tbody tr:hover {
  background: #f1ede5;
}

/* Estado */
.badge-estado {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.8rem;
}

.badge-estado.activo {
  background: #e0f3e2;
  color: #256635;
}

.badge-estado.inactivo {
  background: #f9e0de;
  color: #8a2e2a;
}

/* Botones de acción */
.btn-accion {
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #d0c0a4;
  background: #f7f1e3;
  cursor: pointer;
  font-size: 0.8rem;
  margin: 0 2px;
}

.btn-accion:hover {
  background: #e7f0e9;
}

.btn-eliminar {
  background: #f9e0de;
}

.btn-eliminar:hover {
  background: #f4c7c3;
}
</style>
