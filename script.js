/* =============================================
   PARTICLE CANVAS – standalone script
   ============================================= */

// ── Navbar ──────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger ───────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Active nav link on scroll ────────────────
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));

// ── Typewriter ──────────────────────────────
const phrases = [
  'web apps with React',
  'backends with Python',
  'beautiful UIs',
  'with PHP & MySQL',
  'full-stack solutions',
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const dynamicEl = document.getElementById('dynamic-text');

function typeWriter() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    dynamicEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeWriter, 2000);
      return;
    }
  } else {
    dynamicEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeWriter, deleting ? 60 : 90);
}
typeWriter();

// ── Particle Canvas ─────────────────────────
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');
let particles = [];
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const COLORS = ['#6d28d9', '#0891b2', '#7c3aed', '#c084fc'];

function randomBetween(a, b) { return a + Math.random() * (b - a); }

function createParticle() {
  return {
    x: randomBetween(0, W),
    y: randomBetween(0, H),
    r: randomBetween(1, 3),
    dx: randomBetween(-0.4, 0.4),
    dy: randomBetween(-0.4, 0.4),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: randomBetween(0.2, 0.7),
  };
}

for (let i = 0; i < 80; i++) particles.push(createParticle());

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;

    // draw lines to nearby particles
    particles.forEach(q => {
      const dist = Math.hypot(p.x - q.x, p.y - q.y);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = (1 - dist / 120) * 0.12;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });

    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > W) p.dx *= -1;
    if (p.y < 0 || p.y > H) p.dy *= -1;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── Reveal on scroll ───────────────────────
function addRevealClass() {
  document.querySelectorAll(
    '.section-header, .skill-card, .project-card, .timeline-item, .achievement-card, .contact-card, .about-deco-panel, .about-right'
  ).forEach(el => el.classList.add('reveal'));
}
addRevealClass();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate CGPA bars when visible
      const bar = entry.target.querySelector('.cgpa-bar');
      if (bar) bar.classList.add('animate');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Smooth section reveal for timeline ─────
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target.querySelector('.cgpa-bar');
      if (bar) bar.classList.add('animate');
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.timeline-item').forEach(el => timelineObserver.observe(el));

// ── Deco stat bar animations ─────────────────
const decoBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.deco-stat-bar').forEach(bar => bar.classList.add('animated'));
    }
  });
}, { threshold: 0.3 });
const decoPanel = document.querySelector('.about-deco-panel');
if (decoPanel) decoBarObserver.observe(decoPanel);
