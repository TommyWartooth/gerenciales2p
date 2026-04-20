// src/stores/auth.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const usuario = ref(JSON.parse(localStorage.getItem("usuario") || "null"));
  const rol = ref(localStorage.getItem("rol") || null);
  const token = ref(localStorage.getItem("token") || null);
  const isAuthenticated = computed(() => !!usuario.value);

  async function login({ documento, contrasela }) {
    // ← contrasela
    const resp = await fetch("http://localhost:3000/api/usuarios/login", {
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

  return { usuario, rol, token, isAuthenticated, login, logout };
});
