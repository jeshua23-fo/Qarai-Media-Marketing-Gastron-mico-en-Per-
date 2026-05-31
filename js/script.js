/* ═══════════════════════════════════════════════════
   QARAI MEDIA – script.js
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────
     1. HERO – Animación inicial al cargar
  ───────────────────────────────────── */
  const hero = document.querySelector('.hero');
  setTimeout(() => { if (hero) hero.classList.add('loaded'); }, 100);

  // Animar elementos del hero en secuencia
  const heroEyebrow = document.querySelector('.hero-eyebrow');
  const heroTitleLines = document.querySelectorAll('.hero-title .title-line');
  const heroButtons  = document.querySelector('.hero-buttons');
  const heroTagline  = document.querySelector('.hero-tagline');

  const heroSequence = [
    { el: heroEyebrow, delay: 300 },
    { el: heroTitleLines[0], delay: 600 },
    { el: heroTitleLines[1], delay: 800 },
    { el: heroButtons,  delay: 1100 },
    { el: heroTagline,  delay: 1400 },
  ];

  heroSequence.forEach(({ el, delay }) => {
    if (!el) return;
    setTimeout(() => {
      el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
      el.style.opacity    = '1';
      el.style.transform  = 'translateY(0)';
    }, delay);
  });

  /* ─────────────────────────────────────
     2. HEADER – scroll sticky
  ───────────────────────────────────── */
  const header = document.getElementById('header');

  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    handleReveal();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ─────────────────────────────────────
     3. HAMBURGER – menú móvil
  ───────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  // Cerrar al hacer clic en un link del menú móvil
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });

  /* ─────────────────────────────────────
     4. SMOOTH SCROLL – para todos los anchors
  ───────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─────────────────────────────────────
     5. SCROLL REVEAL – IntersectionObserver
  ───────────────────────────────────── */
  const revealElements = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .phone-card, .phones-quote'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  function handleReveal() {
    // Fallback por si IntersectionObserver no está disponible
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('visible'));
    }
  }

  /* ─────────────────────────────────────
     6. PARALLAX SUAVE en el hero
  ───────────────────────────────────── */
  const heroImg = document.querySelector('.hero-img');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;
        if (heroImg && scrollY < window.innerHeight) {
          heroImg.style.transform = `scale(1) translateY(${scrollY * 0.25}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ─────────────────────────────────────
     7. ACTIVE NAV LINK según sección visible
  ───────────────────────────────────── */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => sectionObserver.observe(section));

  // Estilos para el link activo
  const activeStyle = document.createElement('style');
  activeStyle.textContent = `
    .nav-link.active { color: var(--gold) !important; }
    .nav-link.active::after { width: 100% !important; }
  `;
  document.head.appendChild(activeStyle);

  /* ─────────────────────────────────────
     8. FORMULARIO DE RESERVA
  ───────────────────────────────────── */
  const reservaForm = document.getElementById('reservaForm');

  reservaForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = reservaForm.querySelector('button[type="submit"]');
    btn.textContent = 'ENVIANDO...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // Simula envío (reemplazar con lógica real)
    setTimeout(() => {
      reservaForm.innerHTML = `
        <div class="form-success">
          <h3>¡Gracias por contactarnos!</h3>
          <p>Hemos recibido tu solicitud. Nuestro equipo se pondrá en contacto contigo en las próximas 24 horas.</p>
        </div>
      `;
    }, 1400);
  });

  /* ─────────────────────────────────────
     9. HOVER 3D en feature cards
  ───────────────────────────────────── */
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;
      card.style.transform = `translateX(6px) perspective(600px) rotateY(${x}deg) rotateX(${y}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─────────────────────────────────────
     10. PHONE CARDS – animación de entrada escalonada extra
  ───────────────────────────────────── */
  const phoneCards = document.querySelectorAll('.phone-card');

  const phoneObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Ya manejado por el revealObserver principal
        phoneObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  phoneCards.forEach(card => phoneObserver.observe(card));

  /* ─────────────────────────────────────
     11. CURSOR DOT personalizado (desktop)
  ───────────────────────────────────── */
  /* ─────────────────────────────────────
     12. VIDEO PLAY ON CLICK
  ───────────────────────────────────── */
  document.querySelectorAll('.play-btn').forEach(playBtn => {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const video = playBtn.closest('.phone-screen').querySelector('video');
      if (video) {
        if (video.paused) {
          video.play();
          playBtn.style.opacity = '0';
        } else {
          video.pause();
          playBtn.style.opacity = '1';
        }
      }
    });
  });

  // Mostrar el botón de play cuando el video se pausa
  document.querySelectorAll('.phone-screen video').forEach(video => {
    video.addEventListener('pause', () => {
      const playBtn = video.closest('.phone-screen').querySelector('.play-btn');
      if (playBtn) playBtn.style.opacity = '1';
    });
  });

  /* ─────────────────────────────────────
     13. CARRUSEL DE CREADORES
  ───────────────────────────────────── */
  const carouselCards = Array.from(document.querySelectorAll('.phones-grid .phone-card'));
  const prevButton = document.querySelector('.carousel-btn.prev');
  const nextButton = document.querySelector('.carousel-btn.next');
  const indicators = Array.from(document.querySelectorAll('.carousel-indicators .indicator'));
  let currentSlide = 0;

  function updateCarousel(index) {
    const total = carouselCards.length;
    currentSlide = (index + total) % total;

    carouselCards.forEach((card, idx) => {
      const isActive = idx === currentSlide;
      const isPrev = idx === (currentSlide - 1 + total) % total;
      const isNext = idx === (currentSlide + 1) % total;

      card.classList.toggle('active', isActive);
      card.classList.toggle('prev', isPrev);
      card.classList.toggle('next', isNext);

      const video = card.querySelector('video');
      if (!isActive && video) {
        video.pause();
        const playBtn = card.querySelector('.play-btn');
        if (playBtn) playBtn.style.opacity = '1';
      }
    });

    indicators.forEach((indicator, idx) => {
      indicator.classList.toggle('active', idx === currentSlide);
    });
  }

  prevButton?.addEventListener('click', () => updateCarousel(currentSlide - 1));
  nextButton?.addEventListener('click', () => updateCarousel(currentSlide + 1));
  indicators.forEach((indicator, idx) => {
    indicator.addEventListener('click', () => updateCarousel(idx));
  });

  updateCarousel(0);

  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.id = 'qarai-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 8px; height: 8px;
      background: var(--gold, #C9933A);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.15s ease, opacity 0.3s;
      transform: translate(-50%, -50%);
      top: 0; left: 0;
    `;

    const cursorRing = document.createElement('div');
    cursorRing.id = 'qarai-cursor-ring';
    cursorRing.style.cssText = `
      position: fixed;
      width: 32px; height: 32px;
      border: 1.5px solid rgba(201,147,58,0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transition: transform 0.35s ease, opacity 0.3s, width 0.3s, height 0.3s;
      transform: translate(-50%, -50%);
      top: 0; left: 0;
    `;

    document.body.appendChild(cursor);
    document.body.appendChild(cursorRing);

    let mx = 0, my = 0;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
      cursorRing.style.left = mx + 'px';
      cursorRing.style.top  = my + 'px';
    });

    // Expandir cursor al hover sobre links / botones
    document.querySelectorAll('a, button, .feature-card, .phone-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.style.width  = '52px';
        cursorRing.style.height = '52px';
        cursorRing.style.borderColor = 'rgba(201,147,58,0.85)';
        cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.style.width  = '32px';
        cursorRing.style.height = '32px';
        cursorRing.style.borderColor = 'rgba(201,147,58,0.5)';
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });
  }

});