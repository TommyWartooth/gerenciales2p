// src/stores/auth.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const usuario = ref(JSON.parse(localStorage.getItem("usuario") || "null"));
  const rol = ref(localStorage.getItem("rol") || null);
  const tipo = ref(localStorage.getItem("tipo") || null);

  const isAuthenticated = computed(() => !!usuario.value);

  // ------------ LOGIN ------------
  async function login({ documento, contrasena }) {
    const resp = await fetch("http://localhost:3000/api/login", {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documento, contrasena }),
    });

    const data = await resp.json(); 

    if (!resp.ok || !data.ok) {
      // servicio lanza errores con message
      throw new Error(data.message || data.error || "Error al iniciar sesión");
    }

    // data viene de loginUsuario:
    // { ok: true, usuario: {...}, tipo, rol }
    usuario.value = data.usuario;
    rol.value = data.rol;
    tipo.value = data.tipo;

    localStorage.setItem("usuario", JSON.stringify(usuario.value));
    if (rol.value) localStorage.setItem("rol", rol.value);
    if (tipo.value) localStorage.setItem("tipo", tipo.value);

    return data; 
  }

  // LOGOUT SOLO FRONT 
  function logout() {
    usuario.value = null;
    rol.value = null;
    tipo.value = null;

    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    localStorage.removeItem("tipo");
  }

  return {
    usuario,
    rol,
    tipo,
    isAuthenticated,
    login,
    logout,
  };
});