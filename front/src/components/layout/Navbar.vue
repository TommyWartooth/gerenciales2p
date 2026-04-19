<template>
  <header>
    <nav class="navbar">
      <div class="navbar__inner">

        <!-- LOGO -->
        <a href="#inicio" class="navbar__logo" @click.prevent="scrollTo('inicio')">
          <img src="/icono.png" alt="Logo" class="navbar__logo-img" />
        </a>

        <!-- LINKS -->
        <ul class="navbar__links" :class="{ 'navbar__links--open': menuOpen }">
          <li><a @click="scrollTo('inicio')">Inicio</a></li>
          <li><a @click="scrollTo('carta')">Carta</a></li>
          <li><a @click="scrollTo('nosotros')">Sobre Nosotros</a></li>
          <li><a @click="scrollTo('contacto')">Contacto</a></li>
        </ul>

        <!-- AUTH -->
        <div class="navbar__auth">
          <div class="user-menu" ref="userMenu">
            <button class="user-btn" @click="toggleUserMenu">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </button>

            <div v-if="mostrarUserMenu" class="user-dropdown">
              <template v-if="!estaAutenticado">
                <a @click="abrirLogin">Iniciar sesión</a>
                <a @click="abrirRegistro">Registrarse</a>
              </template>
              <template v-else>
                <span class="user-name">Hola, {{ nombreUsuario }}</span>
                <a @click="cerrarSesion">Cerrar sesión</a>
              </template>
            </div>
          </div>

        <a href="#carta" class="navbar__cta" @click.prevent="scrollTo('carta')">Pedir Ahora</a>
        </div>

        <!-- BURGER -->
        <button class="navbar__burger" @click="toggleMenu" :class="{ open: menuOpen }" aria-label="Menú">
          <span></span><span></span><span></span>
        </button>

      </div>
    </nav>

    <!-- MODAL LOGIN -->
    <div v-if="mostrarLogin" class="modal-backdrop" @click.self="mostrarLogin = false">
      <div class="modal-contenedor">
        <button class="modal-cerrar" @click="mostrarLogin = false">✕</button>
        <h2 class="modal-titulo">Iniciar Sesión</h2>
        <form @submit.prevent="login">
          <input v-model="documento" type="text"     class="modal-input" placeholder="Documento"   required />
          <input v-model="password"  type="password" class="modal-input" placeholder="Contraseña"  required />
          <button type="submit" class="modal-btn">Entrar</button>
        </form>
        <p class="modal-link">
          ¿No tienes cuenta? <a @click.prevent="abrirRegistro">Registrarse</a>
        </p>
      </div>
    </div>

    <!-- MODAL REGISTRO -->
    <div v-if="mostrarRegistro" class="modal-backdrop" @click.self="mostrarRegistro = false">
      <div class="modal-contenedor modal-contenedor--grande">
        <button class="modal-cerrar" @click="mostrarRegistro = false">✕</button>
        <h2 class="modal-titulo">Crear cuenta</h2>

        <form @submit.prevent="registrar" class="form-registro">
          <div class="form-grid">
            <input v-model="regNombre"      type="text"  class="modal-input" placeholder="Nombres"             required />
            <input v-model="regApellido"    type="text"  class="modal-input" placeholder="Apellidos"           required />
            <input v-model="regEmail"       type="email" class="modal-input" placeholder="Correo electrónico"  required />
            <input v-model="regDocumento"   type="text"  class="modal-input" placeholder="Documento"           required />
            <input v-model="regCelular"     type="tel"   class="modal-input" placeholder="Celular"             required />
            <input v-model="regTelFijo"     type="tel"   class="modal-input" placeholder="Teléfono fijo"       required />
            <input v-model="regNit"         type="text"  class="modal-input" placeholder="NIT (opcional)" />
            <input v-model="regRazonSocial" type="text"  class="modal-input" placeholder="Razón Social (opcional)" />
            <div class="modal-input-fecha">
              <label>Fecha de nacimiento</label>
              <input v-model="regFechaNac" type="date" class="modal-input" required />
            </div>
            <input v-model="regPass" type="password" class="modal-input" placeholder="Contraseña" required />
          </div>

          <!-- Foto -->
          <div class="foto-perfil-box">
            <p class="foto-label">Foto de perfil</p>
            <img :src="regFotoPreview || '/imagenes/fotouser.png'" class="foto-preview" alt="Foto de perfil" />
            <label class="input-file-label">
              Seleccionar imagen
              <input type="file" accept="image/*" @change="onFotoSeleccionada" hidden />
            </label>
          </div>

          <label class="checkbox-label">
            <input v-model="aceptaTerminos" type="checkbox" required />
            Acepto los <a href="#" target="_blank">Términos y condiciones</a>
          </label>

          <button type="submit" class="modal-btn">Registrarse</button>
        </form>

        <p class="modal-link">
          ¿Ya tienes cuenta? <a @click.prevent="abrirLogin">Iniciar sesión</a>
        </p>
      </div>
    </div>

  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// ── Nav ──────────────────────────────────────────────
const menuOpen = ref(false)
const toggleMenu = () => (menuOpen.value = !menuOpen.value)
const scrollTo = (id) => {
  menuOpen.value = false
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

// ── Auth (estado local — conectar al store cuando esté el back) ──
const estaAutenticado = ref(false)
const nombreUsuario   = ref('')

// ── User dropdown ─────────────────────────────────────
const mostrarUserMenu = ref(false)
const userMenu = ref(null)
const toggleUserMenu = () => (mostrarUserMenu.value = !mostrarUserMenu.value)

const handleClickOutside = (e) => {
  if (userMenu.value && !userMenu.value.contains(e.target)) {
    mostrarUserMenu.value = false
  }
}
onMounted(()       => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

// ── Modales ───────────────────────────────────────────
const mostrarLogin    = ref(false)
const mostrarRegistro = ref(false)

const abrirLogin = () => {
  mostrarLogin.value    = true
  mostrarRegistro.value = false
  mostrarUserMenu.value = false
}
const abrirRegistro = () => {
  mostrarRegistro.value = true
  mostrarLogin.value    = false
  mostrarUserMenu.value = false
}

//como UI d momento
const documento = ref('')
const password  = ref('')

const login = () => {
  //conectar al back
  estaAutenticado.value = true
  nombreUsuario.value   = documento.value || 'Usuario'
  mostrarLogin.value    = false
  documento.value = ''
  password.value  = ''
}

const cerrarSesion = () => {
  estaAutenticado.value = false
  nombreUsuario.value   = ''
  mostrarUserMenu.value = false
}

const regNombre      = ref('')
const regApellido    = ref('')
const regEmail       = ref('')
const regDocumento   = ref('')
const regFechaNac    = ref('')
const regCelular     = ref('')
const regTelFijo     = ref('')
const regPass        = ref('')
const regNit         = ref('')
const regRazonSocial = ref('')
const regFoto        = ref(null)
const regFotoPreview = ref(null)
const aceptaTerminos = ref(false)

const onFotoSeleccionada = (e) => {
  const archivo = e.target.files[0]
  if (!archivo) return
  regFoto.value        = archivo.name
  regFotoPreview.value = URL.createObjectURL(archivo)
}

const registrar = () => {
  if (!aceptaTerminos.value) { alert('Debes aceptar los términos y condiciones'); return }
  //conectar con backend
  alert('¡Cuenta creada! (modo demo — conectar al back pronto)')
  mostrarRegistro.value = false
  mostrarLogin.value    = true
}
</script>

<style scoped>
/* ── Navbar ── */
.navbar {
  background-color: var(--black);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(235,205,149,0.15);
}

.navbar__inner {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 4rem;
  height: 80px;
  gap: 3rem;
}

.navbar__logo { display: flex; align-items: center; }
.navbar__logo-img { height: 56px; width: auto; object-fit: contain; }

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
  font-family: 'Jost', sans-serif;
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
  content: '';
  position: absolute;
  bottom: -2px; left: 0;
  width: 0; height: 1px;
  background: var(--gold);
  transition: width 0.3s;
}
.navbar__links a:hover { color: var(--gold); }
.navbar__links a:hover::after { width: 100%; }

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
.navbar__auth-link:hover { color: var(--gold); }

/* ── User menu ── */
.user-menu { position: relative; }

.user-btn {
  background: none;
  border: 1px solid rgba(235,205,149,0.25);
  color: var(--gold-dim);
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.user-btn:hover { border-color: var(--gold); color: var(--gold); }
.user-btn svg { width: 18px; height: 18px; }

.user-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: var(--black-soft);
  border: 1px solid rgba(235,205,149,0.15);
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
  transition: color 0.2s, background 0.2s;
  text-decoration: none;
}
.user-dropdown a:hover { color: var(--gold); background: rgba(235,205,149,0.05); }

.user-name {
  display: block;
  padding: 0.6rem 1.2rem;
  font-size: 0.8rem;
  color: var(--gold);
  font-style: italic;
  border-bottom: 1px solid rgba(235,205,149,0.1);
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
.navbar__burger span { display: block; width: 24px; height: 1.5px; background: var(--gold); transition: all 0.3s; }
.navbar__burger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.navbar__burger.open span:nth-child(2) { opacity: 0; }
.navbar__burger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

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
  .navbar__inner { padding: 0 1.5rem; }
  .navbar__burger { display: flex; }

  .navbar__links {
    display: none;
    position: absolute;
    top: 80px; left: 0; right: 0;
    background: var(--black-soft);
    flex-direction: column;
    align-items: center;
    padding: 2rem 0;
    gap: 1.6rem;
    border-bottom: 1px solid rgba(235,205,149,0.12);
  }
  .navbar__links--open { display: flex; }
}

/* ── Modales ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(17,15,13,0.88);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 1.5rem;
}

.modal-contenedor {
  background: var(--black-soft);
  border: 1px solid rgba(235,205,149,0.2);
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 420px;
  position: relative;
}
.modal-contenedor--grande { max-width: 680px; }

.modal-cerrar {
  position: absolute;
  top: 1rem; right: 1rem;
  background: none;
  border: none;
  color: var(--muted);
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s;
}
.modal-cerrar:hover { color: var(--gold); }

.modal-titulo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  font-style: italic;
  color: var(--white);
  margin-bottom: 1.5rem;
  text-align: center;
}

.modal-input {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 2px;
  color: var(--white);
  font-family: 'Jost', sans-serif;
  font-size: 0.88rem;
  padding: 0.65rem 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  margin-bottom: 0.9rem;
  display: block;
}
.modal-input:focus { border-color: var(--gold-dim); }

.modal-btn {
  width: 100%;
  padding: 0.8rem;
  background: var(--wine);
  color: var(--gold);
  border: 1px solid var(--gold-dim);
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.2s;
}
.modal-btn:hover { background: var(--wine-light); color: var(--white); }

.modal-link {
  text-align: center;
  font-size: 0.8rem;
  color: var(--muted);
  margin-top: 1.2rem;
}
.modal-link a { color: var(--gold-dim); cursor: pointer; text-decoration: none; }
.modal-link a:hover { color: var(--gold); }

/* Registro */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 1rem;
}
.modal-input-fecha label { font-size: 0.72rem; color: var(--muted); margin-bottom: 0.3rem; display: block; }

.checkbox-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: var(--muted);
  margin-bottom: 0.8rem;
}
.checkbox-label a { color: var(--gold-dim); }
.checkbox-label input { accent-color: var(--wine); }

.foto-perfil-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  margin: 1.2rem 0;
  padding: 1.5rem;
  border: 1px solid rgba(235,205,149,0.12);
  background: rgba(255,255,255,0.02);
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
  border: 1px solid rgba(235,205,149,0.2);
  padding: 0.4rem 1.2rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: all 0.2s;
}
.input-file-label:hover {
  border-color: var(--gold);
  color: var(--gold);
  background: rgba(235,205,149,0.05);
}

@media (max-width: 600px) {
  .form-grid { grid-template-columns: 1fr; }
}
</style>