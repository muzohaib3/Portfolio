/* ═══════════════════════════════════════════════════════════
   PORTFOLIO MOTION ENGINE — Muhammad Zohaib Hassan
═══════════════════════════════════════════════════════════ */

'use strict';

// ─── CUSTOM CURSOR ──────────────────────────────────────────
(function initCursor() {
  const cursor    = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor-dot');
  if (!cursor || !cursorDot) return;

  // Only enable on pointer devices
  if (!window.matchMedia('(hover: hover)').matches) return;

  let mouseX = 0, mouseY = 0;
  let dotX   = 0, dotY   = 0;
  let ringX  = 0, ringY  = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    // Dot follows immediately
    dotX  += (mouseX - dotX)  * 0.9;
    dotY  += (mouseY - dotY)  * 0.9;
    // Ring lags behind for a trailing effect
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    cursor.style.transform    = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

    raf = requestAnimationFrame(animateCursor);
  }
  raf = requestAnimationFrame(animateCursor);

  // Hover interaction for interactive elements
  const interactiveSelectors = 'a, button, .btn, .skill-card, .project-card, .stat-item, .social-icon, .info-item, .nav-link, .float-icon, .education-card';

  document.querySelectorAll(interactiveSelectors).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('clicking'));

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity    = '0';
    cursorDot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity    = '1';
    cursorDot.style.opacity = '1';
  });
})();

// ─── SCROLL PROGRESS BAR ────────────────────────────────────
(function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop  = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollH    = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct        = scrollH > 0 ? (scrollTop / scrollH) * 100 : 0;
    bar.style.width  = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();

// ─── NAVBAR SCROLL STATE ─────────────────────────────────────
(function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
})();

// ─── MOBILE MENU TOGGLE ──────────────────────────────────────
(function initMobileMenu() {
  const toggle  = document.getElementById('mobile-menu');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggle || !navMenu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
})();

// ─── ACTIVE NAVIGATION LINK ──────────────────────────────────
(function setActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();

// ─── THEME TOGGLE ────────────────────────────────────────────
(function initTheme() {
  const themeBtn = document.getElementById('theme-btn');
  const html     = document.documentElement;
  const saved    = localStorage.getItem('theme') || 'dark';

  html.setAttribute('data-theme', saved);
  updateIcon(saved);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const curr = html.getAttribute('data-theme');
      const next = curr === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateIcon(next);
    });
  }

  function updateIcon(theme) {
    if (themeBtn) {
      themeBtn.innerHTML = theme === 'dark'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    }
  }
})();

// ─── ANIMATED NUMBER COUNTER ─────────────────────────────────
(function initCounters() {
  const statItems = document.querySelectorAll('.stat-item[data-target]');
  if (!statItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el      = entry.target;
      const target  = el.dataset.target;       // e.g. "3+", "100%"
      const suffix  = target.replace(/[0-9]/g, ''); // "+", "%", ""
      const num     = parseInt(target, 10);
      const h3      = el.querySelector('h3');
      if (!h3) return;

      let start     = 0;
      const dur     = 1600;
      const step    = 16;
      const steps   = dur / step;
      const inc     = num / steps;
      let current   = 0;

      const timer = setInterval(() => {
        current += inc;
        if (current >= num) {
          current = num;
          clearInterval(timer);
        }
        h3.textContent = Math.floor(current) + suffix;
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statItems.forEach(el => observer.observe(el));
})();

// ─── SCROLL REVEAL ANIMATION ─────────────────────────────────
(function initScrollReveal() {
  const opts = {
    threshold:  0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseFloat(el.dataset.delay || '0') * 1000;

      setTimeout(() => {
        el.classList.add('visible');
      }, delay);

      revealObserver.unobserve(el);
    });
  }, opts);

  // Stagger children within grid/list containers
  document.querySelectorAll('.skill-card, .project-card, .education-card').forEach((el, i) => {
    el.dataset.delay = (i % 4) * 0.1; // stagger up to 4 columns
    revealObserver.observe(el);
  });

  // Timeline items
  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.dataset.delay = i * 0.12;
    revealObserver.observe(el);
  });

  // Contact panel
  document.querySelectorAll('.contact-info, .contact-form-wrapper').forEach(el => {
    revealObserver.observe(el);
  });

  // Summary paragraphs
  document.querySelectorAll('.summary-content p').forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;
    revealObserver.observe(el);
  });
})();

// ─── SKILL BARS ANIMATION ────────────────────────────────────
(function initSkillBars() {
  const skillCards = document.querySelectorAll('.skill-card');
  if (!skillCards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fills = entry.target.querySelectorAll('.skill-fill');
      fills.forEach(fill => {
        const target = fill.dataset.width || fill.style.width;
        fill.style.width = '0%';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            fill.style.width = target;
          });
        });
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  skillCards.forEach(card => {
    // Store widths in data attributes before zeroing them
    card.querySelectorAll('.skill-fill').forEach(fill => {
      fill.dataset.width = fill.style.width;
      fill.style.width   = '0%';
    });
    observer.observe(card);
  });
})();

// ─── TIMELINE LINE DRAW ANIMATION ───────────────────────────
(function initTimelineDraw() {
  const lineFill = document.querySelector('.timeline-line-fill');
  const timeline = document.querySelector('.timeline');
  if (!lineFill || !timeline) return;

  function updateLine() {
    const tlRect     = timeline.getBoundingClientRect();
    const viewH      = window.innerHeight;
    const tlTop      = tlRect.top;
    const tlHeight   = tlRect.height;

    // How much of the timeline has scrolled past the viewport top
    const scrolled   = Math.max(0, viewH * 0.6 - tlTop);
    const pct        = Math.min(100, (scrolled / tlHeight) * 100);
    lineFill.style.height = pct + '%';
  }

  window.addEventListener('scroll', updateLine, { passive: true });
  updateLine();
})();

// ─── PROJECT CARD 3D TILT ────────────────────────────────────
(function initCardTilt() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const dx     = (x - cx) / cx;  // -1 to 1
      const dy     = (y - cy) / cy;  // -1 to 1

      const tiltX  =  dy * -6;   // degrees
      const tiltY  =  dx *  6;
      const shine  = (dx + dy) * 5;

      card.style.transform         = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px)`;
      card.style.boxShadow         = `${-dx * 12}px ${-dy * 12}px 40px rgba(96,165,250,0.2)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
})();

// ─── TYPING ANIMATION ────────────────────────────────────────
(function initTyping() {
  const el = document.querySelector('.typing-text');
  if (!el) return;

  const text  = el.textContent.trim();
  el.textContent = '';
  let i = 0;

  function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, 55);
    }
  }

  // Start after a brief delay to let page settle
  setTimeout(type, 700);
})();

// ─── SMOOTH SCROLL FOR ANCHORS ───────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ─── SCROLL-TO-TOP BUTTON ────────────────────────────────────
(function initScrollTop() {
  const btn = document.createElement('button');
  btn.id          = 'scroll-top';
  btn.innerHTML   = '<i class="fas fa-arrow-up"></i>';
  btn.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #60a5fa, #818cf8);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: none;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    z-index: 998;
    box-shadow: 0 8px 24px rgba(96,165,250,0.4);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s ease,
                opacity 0.3s ease;
    opacity: 0;
  `;

  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.style.display = 'flex';
      requestAnimationFrame(() => { btn.style.opacity = '1'; });
    } else {
      btn.style.opacity = '0';
      setTimeout(() => { if (window.scrollY <= 400) btn.style.display = 'none'; }, 300);
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.transform  = 'translateY(-5px) scale(1.05)';
    btn.style.boxShadow  = '0 16px 40px rgba(96,165,250,0.5)';
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform  = '';
    btn.style.boxShadow  = '0 8px 24px rgba(96,165,250,0.4)';
  });
})();

// ─── CONTACT FORM VALIDATION ─────────────────────────────────
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous errors
    form.querySelectorAll('.error-message').forEach(msg => msg.classList.remove('show'));

    const name    = form.querySelector('#name')?.value.trim()    || '';
    const email   = form.querySelector('#email')?.value.trim()   || '';
    const subject = form.querySelector('#subject')?.value.trim() || '';
    const message = form.querySelector('#message')?.value.trim() || '';

    let valid = true;

    function showError(id, msg) {
      const el = document.getElementById(id);
      if (el) { el.textContent = msg; el.classList.add('show'); }
      valid = false;
    }

    if (name.length < 2)      showError('name-error',    'Name must be at least 2 characters');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) showError('email-error', 'Please enter a valid email');
    if (subject.length < 3)   showError('subject-error', 'Subject must be at least 3 characters');
    if (message.length < 10)  showError('message-error', 'Message must be at least 10 characters');

    if (valid) {
      showSuccessModal();
      form.reset();
    }
  });
})();

// ─── SUCCESS MODAL ───────────────────────────────────────────
function showSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (modal) modal.classList.add('show');
}

function closeModal() {
  const modal = document.getElementById('success-modal');
  if (modal) modal.classList.remove('show');
}

window.addEventListener('click', (e) => {
  const modal = document.getElementById('success-modal');
  if (e.target === modal) closeModal();
});

// ─── LAZY IMAGE LOADING ──────────────────────────────────────
if ('IntersectionObserver' in window) {
  const imgObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        obs.unobserve(img);
      }
    });
  });
  document.querySelectorAll('img[data-src]').forEach(img => imgObs.observe(img));
}

// ─── SUMMARY PARAGRAPH REVEAL ───────────────────────────────
(function revealSummary() {
  const summaryPs = document.querySelectorAll('.summary-content p');
  if (!summaryPs.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  summaryPs.forEach(p => obs.observe(p));
})();

console.log('%c✦ Portfolio loaded — Muhammad Zohaib Hassan', 'color:#60a5fa;font-weight:700;font-size:14px;');
