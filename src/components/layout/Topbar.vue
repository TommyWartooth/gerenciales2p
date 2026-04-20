<template>
  <div class="fondomenu">
    <div class="topbar">
      <div class="topbar__inner">
        <address class="topbar__item">
          <i class="fas fa-map-marker-alt icono-oro"></i>
          <a href="https://maps.google.com/?q=La+Paz+Bolivia" target="_blank" class="topbar__link">
            La Paz, Bolivia
          </a>
        </address>

        <div class="topbar__item">
          <i class="fas fa-clock icono-oro"></i>
          <span class="span">Diario: 12:00pm – 21:00pm</span>
        </div>

        <div class="topbar__spacer"></div>

        <a href="tel:+59163249751" class="topbar__item topbar__link">
          <i class="fas fa-phone icono-oro"></i>
          <span>(+591) 63249751</span>
        </a>

        <a href="mailto:taitita96@gmail.com" class="topbar__item topbar__link">
          <i class="fas fa-envelope icono-oro"></i>
          <span>taitita96@gmail.com</span>
        </a>
      </div>
    </div>

  </div>
</template>

<style scoped>
.topbar {
  background-color: transparent;
  border-bottom: transparent;
  font-size: 0.76rem;
  color: var(--gold-dim);
  font-style: italic;
  font-family: 'Jost', sans-serif;
}

.topbar__inner {
  width: 100%;
  margin: 0 auto;
  padding: 0.4rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.topbar__spacer { flex: 1; }

.topbar__item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.topbar__item svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  fill: var(--gold);
}

.topbar__link {
  color: var(--gold-dim);
  text-decoration: none;
  transition: color 0.2s;
}

.topbar__link:hover { color: var(--gold); }
</style>