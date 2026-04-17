/* ============================================================
   VARSHA PORTFOLIO — script.js
   Animations, Particles, Cursor, Interactions
============================================================ */

// ── Custom Cursor ──────────────────────────────────────────
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover effect on interactive elements
document.querySelectorAll('a, button, .btn, .project-card, .skill-category, .contact-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});


// ── Particle Canvas ────────────────────────────────────────
const canvas  = document.getElementById('particleCanvas');
const ctx     = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x    = Math.random() * canvas.width;
    this.y    = Math.random() * canvas.height;
    this.vx   = (Math.random() - 0.5) * 0.35;
    this.vy   = (Math.random() - 0.5) * 0.35;
    this.r    = Math.random() * 1.8 + 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '124,58,237' : '6,182,212';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 12000);
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();
window.addEventListener('resize', initParticles);

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        const alpha = (1 - dist / 130) * 0.12;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}

function loopParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  animFrame = requestAnimationFrame(loopParticles);
}
loopParticles();


// ── Navbar Scroll ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});


// ── Mobile Hamburger ───────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});


// ── Scroll Reveal ──────────────────────────────────────────
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, parseInt(delay));
      // Also trigger skill bars if inside skills section
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        const w = fill.dataset.w;
        if (w) fill.style.width = w + '%';
      });
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => observer.observe(el));


// ── Skill Bars via separate observer ──────────────────────
const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        const w = fill.dataset.w;
        if (w) fill.style.width = w + '%';
      });
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-category').forEach(el => skillBarObserver.observe(el));


// ── Counter Animation ──────────────────────────────────────
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const tick = () => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      return;
    }
    el.textContent = Math.floor(start);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(num => {
        const target = parseInt(num.dataset.target);
        animateCounter(num, target);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);


// ── Contact Form ──────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
      btn.disabled = false;
      formSuccess.classList.add('visible');
      contactForm.reset();
      setTimeout(() => formSuccess.classList.remove('visible'), 5000);
    }, 1600);
  });
}


// ── Smooth Active Nav Link ─────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const allLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      allLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--accent-2)';
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });

sections.forEach(s => sectionObserver.observe(s));


// ── Tilt Effect on Project Cards ───────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const rotX  = ((e.clientY - cy) / (rect.height / 2)) * -6;
    const rotY  = ((e.clientX - cx) / (rect.width  / 2)) *  6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


// ── Avatar ring mouse parallax ─────────────────────────────
const avatarWrap = document.querySelector('.avatar-wrap');
if (avatarWrap) {
  document.addEventListener('mousemove', (e) => {
    const rect = avatarWrap.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width  / 2)) / window.innerWidth  * 12;
    const dy = (e.clientY - (rect.top  + rect.height / 2)) / window.innerHeight * 12;
    avatarWrap.style.transform = `translate(${dx}px, ${dy}px)`;
  });
}


// ── Typewriter for hero subtitle ───────────────────────────
const roles = [
  'AI/ML Engineer',
  'Web Developer',
  'Data Visualizer',
  'UI/UX Designer',
  'Python Developer',
];

function createTypewriter(selector) {
  const el = document.querySelector(selector);
  if (!el) return;

  const original = el.innerHTML;
  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;

  // Insert a dynamic span after 'where '
  const span = document.createElement('span');
  span.id = 'typewriter-role';
  span.style.cssText = 'color: var(--accent); border-right: 2px solid var(--accent); padding-right: 2px;';
  el.innerHTML = 'Building intelligent systems & beautiful interfaces — <br>I am a <span id="typewriter-role" style="color:var(--accent);border-right:2px solid var(--accent);padding-right:2px;"></span>';

  const tw = document.getElementById('typewriter-role');

  function type() {
    const current = roles[roleIdx];
    if (deleting) {
      tw.textContent = current.substring(0, charIdx--);
    } else {
      tw.textContent = current.substring(0, charIdx++);
    }

    let delay = deleting ? 55 : 90;
    if (!deleting && charIdx === current.length + 1) { delay = 2000; deleting = true; }
    if (deleting && charIdx < 0) {
      deleting = false; charIdx = 0;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }
    setTimeout(type, delay);
  }
  type();
}

// Small delay to let fonts load
setTimeout(() => createTypewriter('.hero-subtitle'), 600);


// ── Page Load Entrance ────────────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 80);
});