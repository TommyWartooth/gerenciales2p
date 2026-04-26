import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const usuario = ref(JSON.parse(localStorage.getItem("usuario") || "null"));
  const rol = ref(localStorage.getItem("rol") || null);
  const token = ref(localStorage.getItem("token") || null);
  const isAuthenticated = computed(() => !!usuario.value);

  async function login({ documento, contrasela }) {
    // ← contrasela
    const resp = await fetch("http://127.0.0.1:3000/api/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documento, contrasela }), // ← contrasela
    });

    const data = await resp.json();
    if (!resp.ok || !data.ok) {
      throw new Error(data.msg || "Error al iniciar sesión");
    }

    // tu back devuelve: { ok, token, usuario: { documento, nombre, rol } }
    usuario.value = data.usuario;
    rol.value = data.usuario.rol; // ← rol viene dentro de usuario
    token.value = data.token;

    localStorage.setItem("usuario", JSON.stringify(data.usuario));
    localStorage.setItem("rol", data.usuario.rol);
    localStorage.setItem("token", data.token);

    return data;
  }

  function logout() {
    usuario.value = null;
    rol.value = null;
    token.value = null;
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    localStorage.removeItem("token");
  }

  // ==========================================
  // --- NUEVAS FUNCIONES PARA LAS HISTORIAS ---
  // ==========================================

  // Historia 1: Registrar Cliente
  async function registrarCliente(datosRegistro) {
    const resp = await fetch("http://127.0.0.1:3000/api/usuarios/registro-cliente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosRegistro),
    });

    const data = await resp.json();
    
    // Si la respuesta no es 2xx, lanzamos el error para atraparlo en el componente
    if (!resp.ok) {
      throw new Error(data.msg || "Error en el registro");
    }
    
    return data;
  }

  // Historia 2: Actualizar Perfil de Cliente
  async function actualizarPerfil(datosActualizados) {
    const resp = await fetch("http://127.0.0.1:3000/api/usuarios/perfil", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Aquí pasamos el token directamente de nuestra constante reactiva `token`
        "Authorization": `Bearer ${token.value}` 
      },
      body: JSON.stringify(datosActualizados),
    });

    const data = await resp.json();
    
    if (!resp.ok) {
      throw new Error(data.msg || "Error al actualizar perfil");
    }

    // Actualizamos el estado local (usuario.value) para que los cambios 
    // se reflejen inmediatamente en toda la interfaz sin recargar la página.
    usuario.value = { ...usuario.value, ...datosActualizados };
    
    // Guardamos los datos actualizados en localStorage
    localStorage.setItem("usuario", JSON.stringify(usuario.value));

    return data;
  }

  // Exportar todas las variables y funciones
  return { 
    usuario, 
    rol, 
    token, 
    isAuthenticated, 
    login, 
    logout,
    registrarCliente,
    actualizarPerfil
  };
});