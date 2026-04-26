<template>
  <div class="perfil-container">
    <div class="perfil-card">
      <div class="perfil-header">
        <h2 class="perfil-titulo">Mi Perfil</h2>
        <p class="perfil-subtitulo">Gestiona tu información personal y de contacto</p>
      </div>

      <form @submit.prevent="guardarCambios" class="form-perfil">
        <div class="foto-section">
          <div class="avatar-wrapper">
            <img 
              :src="perfilEditado.fotoperfil ? (perfilEditado.fotoperfil.startsWith('data:') ? perfilEditado.fotoperfil : `http://127.0.0.1:3000${perfilEditado.fotoperfil}`) : '/placeholder-user.png'" 
              alt="Foto Perfil" 
              class="avatar-img"
            />
            <label class="btn-cambiar-foto">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-9 3c0 4.97 4.03 9 9 9s9-4.03 9-9-4.03-9-9-9-9 4.03-9 9zm12 0c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/>
              </svg>
              <input type="file" @change="handleFotoUpload" accept="image/*" class="input-hidden" />
            </label>
          </div>
          <span class="foto-hint">Haz clic en el icono para cambiar tu foto</span>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label>Nombres</label>
            <input v-model="perfilEditado.nombre" type="text" placeholder="Tus nombres" required />
          </div>

          <div class="form-group">
            <label>Apellidos</label>
            <input v-model="perfilEditado.apellidos" type="text" placeholder="Tus apellidos" required />
          </div>

          <div class="form-group">
            <label>Número de Celular</label>
            <input v-model="perfilEditado.celular" type="text" placeholder="Ej: 78945612" required />
          </div>

          <div class="form-group">
            <label>Teléfono Fijo</label>
            <input v-model="perfilEditado.telefono_fijo" type="text" placeholder="Opcional" />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-guardar" :disabled="cargando">
            {{ cargando ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const cargando = ref(false);

const perfilEditado = ref({
  nombre: '',
  apellidos: '',
  celular: '',
  telefono_fijo: '',
  fotoperfil: ''
});

onMounted(() => {
  if (auth.usuario) {
    perfilEditado.value = { ...auth.usuario };
  }
});

const handleFotoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => perfilEditado.value.fotoperfil = e.target.result;
    reader.readAsDataURL(file);
  }
};

const guardarCambios = async () => {
  cargando.value = true;
  try {
    await auth.actualizarPerfil(perfilEditado.value);
    alert('¡Perfil actualizado con éxito!');
  } catch (error) {
    alert('Error al actualizar: ' + error.message);
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
.perfil-container {
  padding: 6rem 2rem;
  background-color: var(--black);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.perfil-card {
  background-color: var(--black-soft);
  border: 1px solid rgba(235, 205, 149, 0.15);
  padding: 3rem;
  width: 100%;
  max-width: 650px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.perfil-header {
  text-align: center;
  margin-bottom: 3rem;
}

.perfil-titulo {
  font-family: "Cormorant Garamond", serif;
  font-size: 2.5rem;
  font-style: italic;
  color: var(--white);
  margin-bottom: 0.5rem;
}

.perfil-subtitulo {
  font-family: "Jost", sans-serif;
  color: var(--muted);
  font-size: 0.9rem;
  letter-spacing: 0.05em;
}

.form-perfil {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Sección de Foto */
.foto-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--gold-dim);
  padding: 4px;
  background: rgba(235, 205, 149, 0.05);
}

.btn-cambiar-foto {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--wine);
  color: var(--gold);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid var(--gold-dim);
  transition: all 0.3s ease;
}

.btn-cambiar-foto:hover {
  background: var(--wine-light);
  transform: scale(1.1);
}

.input-hidden {
  display: none;
}

.foto-hint {
  font-size: 0.75rem;
  color: var(--gold-dim);
  font-style: italic;
}

/* Grid de Formulario */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-family: "Jost", sans-serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--gold-dim);
  font-weight: 600;
}

.form-group input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(235, 205, 149, 0.2);
  padding: 0.9rem;
  color: var(--white);
  font-family: "Jost", sans-serif;
  font-size: 0.9rem;
  border-radius: 2px;
  outline: none;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-color: var(--gold);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 10px rgba(235, 205, 149, 0.1);
}

/* Acciones */
.form-actions {
  margin-top: 1rem;
}

.btn-guardar {
  width: 100%;
  padding: 1rem;
  background-color: var(--wine);
  color: var(--gold);
  border: 1px solid var(--gold-dim);
  font-family: "Jost", sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-guardar:hover:not(:disabled) {
  background-color: var(--wine-light);
  color: var(--white);
  border-color: var(--gold);
  transform: translateY(-2px);
}

.btn-guardar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .perfil-card {
    padding: 2rem 1.5rem;
  }
}
</style>