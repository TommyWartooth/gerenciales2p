<template>
  <footer id="contacto" class="footer">
    <div class="footer__inner">

      <div class="footer__brand">
        <div class="footer__logo-text">✦ El Taitita del Sabor</div>
        <p class="footer__tagline">El alma de Bolivia en cada plato</p>
        <div class="footer__social">
          <a href="#" aria-label="Facebook" class="footer__social-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="#" aria-label="Instagram" class="footer__social-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="https://wa.me/59163249751" aria-label="WhatsApp" class="footer__social-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
          </a>
        </div>
      </div>

      <div class="footer__col">
        <h4>Navegación</h4>
        <ul>
          <li><router-link to="/">Inicio</router-link></li>
          <li><a href="#carta">Carta</a></li>
          <li><router-link to="/nosotros">Sobre Nosotros</router-link></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
      </div>

      <div class="footer__col">
        <h4>Contacto</h4>
        <ul>
          <li> La Paz, Bolivia</li>
          <li> (+591) 63249751</li>
          <li> taitita96@gmail.com</li>
          <li> 12:00pm – 21:00pm</li>
        </ul>
      </div>

    </div>

    <div class="footer__bottom">
      <p>© {{ new Date().getFullYear() }} El taitita del Sabor — Cocina Gourmet Boliviana. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--wine-dark);
  border-top: 1px solid rgba(235,205,149,0.15);
  padding: 5rem 2rem 0;
}

.footer__inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  padding-bottom: 3.5rem;
}

.footer__logo-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem;
  color: var(--gold);
  font-weight: 700;
  letter-spacing: 0.2em;
  margin-bottom: 0.8rem;
}

.footer__tagline {
  font-size: 0.82rem;
  color: var(--gold-dim);
  font-style: italic;
  margin-bottom: 1.8rem;
  opacity: 0.8;
}

.footer__social {
  display: flex;
  gap: 0.7rem;
}

.footer__social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(235,205,149,0.25);
  color: var(--gold-dim);
  transition: all 0.2s;
}

.footer__social-link:hover {
  border-color: var(--gold);
  color: var(--gold);
  background: rgba(235,205,149,0.08);
}

.footer__social-link svg { width: 15px; height: 15px; }

.footer__col h4 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  font-style: italic;
  color: var(--gold);
  margin-bottom: 1.2rem;
  letter-spacing: 0.05em;
}

.footer__col ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.footer__col ul li,
.footer__col ul a {
  font-size: 0.83rem;
  color: var(--gold-dim);
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s, color 0.2s;
}

.footer__col ul a:hover {
  color: var(--gold);
  opacity: 1;
}

.footer__bottom {
  border-top: 1px solid rgba(235,205,149,0.1);
  text-align: center;
  padding: 1.2rem 0;
}

.footer__bottom p {
  font-size: 0.72rem;
  color: var(--gold-dim);
  opacity: 0.4;
  letter-spacing: 0.05em;
}

@media (max-width: 768px) {
  .footer__inner { grid-template-columns: 1fr 1fr; }
  .footer__brand { grid-column: 1 / -1; }
}

@media (max-width: 480px) {
  .footer__inner { grid-template-columns: 1fr; }
}
</style>