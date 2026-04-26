<template>
  <header>
    <nav class="navbar">
      <div class="navbar__inner">
        <router-link to="/" class="navbar__logo" @click="menuOpen = false">
          <img src="/icono.png" alt="Logo" class="navbar__logo-img" />
        </router-link>

        <ul class="navbar__links" :class="{ 'navbar__links--open': menuOpen }">
          <li>
            <router-link to="/" @click="menuOpen = false">Inicio</router-link>
          </li>
          <li>
            <router-link to="/carta" @click="menuOpen = false"
              >Carta</router-link
            >
          </li>
          <li>
            <router-link to="/nosotros" @click="menuOpen = false"
              >Sobre Nosotros</router-link
            >
          </li>
          <li>
            <router-link to="/contacto" @click="menuOpen = false"
              >Contacto</router-link
            >
          </li>
        </ul>

        <div class="navbar__auth">
          <div class="user-menu" ref="userMenu">
            <button
              class="user-btn"
              @click="toggleUserMenu"
              aria-label="Menu de usuario"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="24"
                height="24"
              >
                <path
                  d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
                />
              </svg>
            </button>

            <div v-if="mostrarUserMenu" class="user-dropdown">
              <template v-if="!estaAutenticado">
                <a href="#" @click.prevent="abrirLogin">Iniciar sesión</a>
                <a href="#" @click.prevent="abrirRegistro">Registrarse</a>
              </template>
              <template v-else>
                <span class="user-name">Hola, {{ nombreUsuario }}</span>
                <router-link
                  v-if="auth.usuario?.rol !== 'cliente'"
                  :to="getDashboardLink"
                  @click="mostrarUserMenu = false"
                >
                  Panel Control
                </router-link>
                <router-link to="/perfil" @click="mostrarUserMenu = false">
                  Mi Perfil
                </router-link>
                <a href="#" @click.prevent="handleCerrarSesion"
                  >Cerrar sesión</a
                >
              </template>
            </div>
          </div>

          <a
            class="navbar__cta"
            href="#"
            @click.prevent="
              estaAutenticado ? pedidoPanel.abrir() : abrirLogin()
            "
            >Pedir Ahora</a
          >
        </div>

        <button
          class="navbar__burger"
          @click="toggleMenu"
          :class="{ open: menuOpen }"
          aria-label="Menú"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>

    <div
      v-if="mostrarLogin"
      class="modal-backdrop"
      @click.self="mostrarLogin = false"
    >
      <div class="modal-contenedor">
        <button class="modal-cerrar" @click="mostrarLogin = false">✕</button>
        <h2 class="modal-titulo">Iniciar Sesión</h2>
        <form @submit.prevent="ejecutarLogin">
          <input
            v-model="formLogin.documento"
            type="text"
            class="modal-input"
            placeholder="Documento"
            required
          />
          <input
            v-model="formLogin.password"
            type="password"
            class="modal-input"
            placeholder="Contraseña"
            required
          />
          <button type="submit" class="modal-btn">Entrar</button>
        </form>
        <p class="modal-link">
          ¿No tienes cuenta?
          <a href="#" @click.prevent="abrirRegistro">Registrarse</a>
        </p>
      </div>
    </div>

    <div
      v-if="mostrarRegistro"
      class="modal-backdrop"
      @click.self="mostrarRegistro = false"
    >
      <div class="modal-contenedor modal-contenedor--grande">
        <button class="modal-cerrar" @click="mostrarRegistro = false">✕</button>
        <h2 class="modal-titulo">Crear cuenta</h2>
        <form @submit.prevent="ejecutarRegistro" class="form-registro">
          <div class="form-grid">
            <div class="form-columna">
              <input v-model="formReg.nombre" type="text" class="modal-input" placeholder="Nombres" required />
              <input v-model="formReg.apellidos" type="text" class="modal-input" placeholder="Apellidos" required />
              <input v-model="formReg.correo" type="email" class="modal-input" placeholder="Correo electrónico" required />
              
              <div class="modal-input-fecha">
                <label>Seleccione su fecha de nacimiento:</label>
                <input v-model="formReg.fecha_nac" type="date" class="modal-input" required />
              </div>

              <input v-model="formReg.celular" type="text" class="modal-input" placeholder="Número de celular" required />
              <input v-model="formReg.telefono_fijo" type="text" class="modal-input" placeholder="Número de teléfono fijo" />
              <input v-model="formReg.documento" type="text" class="modal-input" placeholder="Ingrese su documento" required />
              <input v-model="formReg.nit" type="text" class="modal-input" placeholder="NIT (opcional)" />
              <input v-model="formReg.razon_social" type="text" class="modal-input" placeholder="Razón Social (opcional)" />
              <input v-model="formReg.contrasela" type="password" class="modal-input" placeholder="Ingrese una contraseña" required />
            </div>

            <div class="foto-perfil-box">
              <span class="foto-label">Foto de perfil</span>
              <img :src="formReg.fotoperfil || '/placeholder-user.png'" alt="Perfil" class="foto-preview" />
              
              <label class="input-file-label">
                Seleccionar archivo
                <input type="file" @change="handleFotoUpload" accept="image/*" style="display: none;" />
              </label>

              <label class="checkbox-label" style="margin-top: auto;">
                <input type="checkbox" required />
                Acepto los <a href="#">Términos y condiciones</a>
              </label>
            </div>
          </div>
          
          <button type="submit" class="modal-btn">REGISTRAR</button>
        </form>
        <p class="modal-link">
          ¿Ya tienes cuenta?
          <a href="#" @click.prevent="abrirLogin">Iniciar sesión</a>
        </p>
      </div>
    </div>
  </header>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  reactive,
  nextTick,
} from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
import { pedidoPanel } from "../../stores/pedidoPanel";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const menuOpen = ref(false);
const mostrarUserMenu = ref(false);
const mostrarLogin = ref(false);
const mostrarRegistro = ref(false);
const userMenu = ref(null);

const formLogin = reactive({ documento: "", password: "" });
const formReg = reactive({
  nombre: "",
  apellidos: "", 
  correo: "",  
  fecha_nac: "",
  celular: "",
  telefono_fijo: "",
  documento: "",
  nit: "",
  razon_social: "",
  contrasela: "",
  fotoperfil: null
});

const handleFotoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      formReg.fotoperfil = e.target.result; // Guardamos el Base64
    };
    reader.readAsDataURL(file);
  }
};

const toggleMenu = () => (menuOpen.value = !menuOpen.value);

// --- AUTH ---
const estaAutenticado = computed(() => auth.isAuthenticated);
const nombreUsuario = computed(() => auth.usuario?.nombre || "Usuario");

const getDashboardLink = computed(() => {
  const rol = (auth.usuario?.rol || "").toLowerCase();
  if (rol === "administrador") return "/admin";
  if (rol === "recepcionista") return "/recepcionista";
  return "/";
});

const abrirLogin = () => {
  mostrarRegistro.value = false;
  mostrarLogin.value = true;
  mostrarUserMenu.value = false;
};

const abrirRegistro = () => {
  mostrarLogin.value = false;
  mostrarRegistro.value = true;
  mostrarUserMenu.value = false;
};

const ejecutarLogin = async () => {
  try {
    const data = await auth.login({
      documento: formLogin.documento,
      contrasela: formLogin.password,
    });

    mostrarLogin.value = false;
    const rol = (data.usuario.rol || "").toLowerCase();
    if (rol === "administrador") router.push("/admin");
    else if (rol === "recepcionista") router.push("/recepcionista");
    else router.push("/");

    formLogin.documento = "";
    formLogin.password = "";
  } catch (err) {
    alert(err.message || "Credenciales incorrectas");
  }
};

const handleCerrarSesion = () => {
  auth.logout();
  mostrarUserMenu.value = false;
  router.push("/");
};

const ejecutarRegistro = async () => {
  try {
    // Llamamos a la función que creaste en auth.js
    await auth.registrarCliente({ ...formReg }); 
    alert("¡Registro exitoso! Ya puedes iniciar sesión.");
    
    // Limpiamos el formulario
    Object.keys(formReg).forEach(key => formReg[key] = "");
    
    abrirLogin(); // Redirige al login modal
  } catch (err) {
    alert(err.message || "Error al registrarse");
  }
};

const toggleUserMenu = (e) => {
  e.stopPropagation();
  mostrarUserMenu.value = !mostrarUserMenu.value;
};

const handleClickOutside = (e) => {
  if (userMenu.value && !userMenu.value.contains(e.target)) {
    mostrarUserMenu.value = false;
  }
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside),
);
</script>
<style scoped>
/* ── Navbar ── */
.navbar {
  background-color: var(--black);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(235, 205, 149, 0.15);
}

.navbar__inner {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 4rem;
  height: 80px;
  gap: 3rem;
}

.navbar__logo {
  display: flex;
  align-items: center;
}
.navbar__logo-img {
  height: 56px;
  width: auto;
  object-fit: contain;
}

.navbar__links {
  display: flex;
  list-style: none;
  gap: 5rem;
  flex: 1;
  justify-content: center;
}

.navbar__links a {
  color: var(--white);
  text-decoration: none;
  font-family: "Jost", sans-serif;
  font-weight: 500;
  font-size: 0.88rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.2s;
  position: relative;
  padding-bottom: 3px;
}

.navbar__links a::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--gold);
  transition: width 0.3s;
}
.navbar__links a:hover {
  color: var(--gold);
}
.navbar__links a:hover::after {
  width: 100%;
}

.navbar__auth {
  display: flex;
  align-items: center;
  gap: 1.8rem;
  white-space: nowrap;
}

.navbar__auth-link {
  color: var(--muted);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: color 0.2s;
}
.navbar__auth-link:hover {
  color: var(--gold);
}

/* ── User menu ── */
.user-menu {
  position: relative;
}

.user-btn {
  background: none;
  border: 1px solid rgba(235, 205, 149, 0.25);
  color: var(--gold-dim);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.user-btn:hover {
  border-color: var(--gold);
  color: var(--gold);
}
.user-btn svg {
  width: 18px;
  height: 18px;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: var(--black-soft);
  border: 1px solid rgba(235, 205, 149, 0.15);
  min-width: 160px;
  padding: 0.5rem 0;
  z-index: 200;
}

.user-dropdown a {
  display: block;
  padding: 0.6rem 1.2rem;
  font-size: 0.83rem;
  color: var(--muted);
  cursor: pointer;
  transition:
    color 0.2s,
    background 0.2s;
  text-decoration: none;
}
.user-dropdown a:hover {
  color: var(--gold);
  background: rgba(235, 205, 149, 0.05);
}

.user-name {
  display: block;
  padding: 0.6rem 1.2rem;
  font-size: 0.8rem;
  color: var(--gold);
  font-style: italic;
  border-bottom: 1px solid rgba(235, 205, 149, 0.1);
  margin-bottom: 0.2rem;
}

/* ── Burger ── */
.navbar__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
}
.navbar__burger span {
  display: block;
  width: 24px;
  height: 1.5px;
  background: var(--gold);
  transition: all 0.3s;
}
.navbar__burger.open span:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);
}
.navbar__burger.open span:nth-child(2) {
  opacity: 0;
}
.navbar__burger.open span:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
}

.navbar__cta {
  background-color: var(--wine);
  color: var(--gold);
  padding: 0.55rem 1.6rem;
  border-radius: 3px;
  text-decoration: none;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: 1px solid var(--gold-dim);
  transition: all 0.2s;
  cursor: pointer;
}
.navbar__cta:hover {
  background-color: var(--wine-light);
  color: var(--white);
  border-color: var(--gold);
}

@media (max-width: 900px) {
  .navbar__inner {
    padding: 0 1.5rem;
  }
  .navbar__burger {
    display: flex;
  }

  .navbar__links {
    display: none;
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    background: var(--black-soft);
    flex-direction: column;
    align-items: center;
    padding: 2rem 0;
    gap: 1.6rem;
    border-bottom: 1px solid rgba(235, 205, 149, 0.12);
  }
  .navbar__links--open {
    display: flex;
  }
}

/* ── Modales ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(17, 15, 13, 0.88);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 1.5rem;
}

.modal-contenedor {
  background: var(--black-soft);
  border: 1px solid rgba(235, 205, 149, 0.2);
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 420px;
  position: relative;
}
.modal-contenedor--grande {
  max-width: 680px;
}

.modal-cerrar {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--muted);
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s;
}
.modal-cerrar:hover {
  color: var(--gold);
}

.modal-titulo {
  font-family: "Cormorant Garamond", serif;
  font-size: 1.8rem;
  font-style: italic;
  color: var(--white);
  margin-bottom: 1.5rem;
  text-align: center;
}

.modal-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  color: var(--white);
  font-family: "Jost", sans-serif;
  font-size: 0.88rem;
  padding: 0.65rem 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  margin-bottom: 0.9rem;
  display: block;
}
.modal-input:focus {
  border-color: var(--gold-dim);
}

.modal-btn {
  width: 100%;
  padding: 0.8rem;
  background: var(--wine);
  color: var(--gold);
  border: 1px solid var(--gold-dim);
  font-family: "Jost", sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.2s;
}
.modal-btn:hover {
  background: var(--wine-light);
  color: var(--white);
}

.modal-link {
  text-align: center;
  font-size: 0.8rem;
  color: var(--muted);
  margin-top: 1.2rem;
}
.modal-link a {
  color: var(--gold-dim);
  cursor: pointer;
  text-decoration: none;
}
.modal-link a:hover {
  color: var(--gold);
}

/* Registro */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 1rem;
}
.modal-input-fecha label {
  font-size: 0.72rem;
  color: var(--muted);
  margin-bottom: 0.3rem;
  display: block;
}

.foto-perfil-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  margin: 1.2rem 0;
  padding: 1.5rem;
  border: 1px solid rgba(235, 205, 149, 0.12);
  background: rgba(255, 255, 255, 0.02);
}

.foto-label {
  font-size: 0.7rem;
  color: var(--gold-dim);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.foto-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--gold-dim);
  opacity: 0.9;
}

.input-file-label {
  font-size: 0.72rem;
  color: var(--gold-dim);
  cursor: pointer;
  border: 1px solid rgba(235, 205, 149, 0.2);
  padding: 0.4rem 1.2rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: all 0.2s;
}
.input-file-label:hover {
  border-color: var(--gold);
  color: var(--gold);
  background: rgba(235, 205, 149, 0.05);
}

.checkbox-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: var(--muted);
  margin-bottom: 0.8rem;
}
.checkbox-label a {
  color: var(--gold-dim);
}
.checkbox-label input {
  accent-color: var(--wine);
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
