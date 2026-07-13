/* =========================================================
   CONFIG — GANTI SESUAI ACARA KAMU
   ========================================================= */
const EVENT_DATE = new Date('2026-07-14T18:00:00+07:00'); // tanggal & jam acara
const WA_NUMBER = '6281234567890'; // nomor WA panitia (format 62xxxxxxxxxx, tanpa +)

/* =========================================================
   UTIL
   ========================================================= */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const rand = (min, max) => Math.random() * (max - min) + min;

/* =========================================================
   BALLOONS — ambient floating background
   ========================================================= */
function spawnBalloon() {
  const layer = $('#balloon-layer');
  if (!layer) return;
  const colors = ['#FF9FC2', '#FFC2D9', '#FFC857', '#BFF2E6', '#FF6FA5'];
  const b = document.createElement('div');
  b.className = 'balloon';
  b.style.left = rand(2, 92) + 'vw';
  b.style.background = colors[Math.floor(rand(0, colors.length))];
  const size = rand(34, 58);
  b.style.width = size + 'px';
  b.style.height = size * 1.25 + 'px';
  const duration = rand(9, 16);
  const drift = rand(-60, 60);
  b.style.setProperty('--drift', drift + 'px');
  b.animate(
    [
      { transform: 'translate(0,0) rotate(0deg)', opacity: 0 },
      { transform: `translate(${drift * 0.3}px,-40vh) rotate(${drift > 0 ? 6 : -6}deg)`, opacity: 0.9, offset: 0.15 },
      { transform: `translate(${drift}px,-115vh) rotate(${drift > 0 ? -6 : 6}deg)`, opacity: 0 },
    ],
    { duration: duration * 1000, easing: 'ease-in-out' }
  );
  layer.appendChild(b);
  setTimeout(() => b.remove(), duration * 1000);
}
setInterval(spawnBalloon, 1800);
for (let i = 0; i < 3; i++) setTimeout(spawnBalloon, i * 600);

function spawnHeart() {
  const layer = $('.floating-hearts');
  if (!layer || document.hidden) return;
  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  heart.textContent = Math.random() > .35 ? '♥' : '✦';
  const duration = rand(6000, 11000);
  heart.style.left = rand(3, 96) + 'vw'; heart.style.bottom = '-30px'; heart.style.fontSize = rand(10, 23) + 'px';
  layer.appendChild(heart);
  heart.animate([{ transform:'translate(0,0) rotate(0deg) scale(.6)', opacity:0 }, { opacity:.58, offset:.15 }, { transform:`translate(${rand(-45,45)}px,-105vh) rotate(${rand(-60,60)}deg) scale(1.15)`, opacity:0 }], { duration, easing:'ease-out' });
  setTimeout(() => heart.remove(), duration);
}
setInterval(spawnHeart, 1450);

/* =========================================================
   CONFETTI BURST
   ========================================================= */
function confettiBurst(originX, originY, count = 60) {
  const layer = $('#confetti-layer');
  if (!layer) return;
  const colors = ['#FF6FA5', '#FFC2D9', '#FFC857', '#BFF2E6', '#F4478C', '#fff'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const size = rand(6, 12);
    piece.style.width = size + 'px';
    piece.style.height = size * rand(0.4, 1) + 'px';
    piece.style.background = colors[Math.floor(rand(0, colors.length))];
    piece.style.left = originX + 'px';
    piece.style.top = originY + 'px';
    const angle = rand(0, Math.PI * 2);
    const distance = rand(120, 420);
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - rand(80, 200);
    const rotate = rand(180, 720) * (Math.random() > 0.5 ? 1 : -1);
    const duration = rand(1400, 2400);
    piece.animate(
      [
        { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${dx * 0.6}px, ${dy}px) rotate(${rotate * 0.6}deg)`, opacity: 1, offset: 0.5 },
        { transform: `translate(${dx}px, ${dy + 420}px) rotate(${rotate}deg)`, opacity: 0 },
      ],
      { duration, easing: 'cubic-bezier(.2,.6,.3,1)' }
    );
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), duration);
  }
}

/* =========================================================
   GATE — tiup lilin untuk membuka undangan
   ========================================================= */
const gate = $('#gate');
const cakeBtn = $('#cakeBtn');
const inviteMain = $('#invite');
const bgMusic = $('#bgMusic');
const musicToggle = $('#musicToggle');

let opened = false;
function openInvitation(e) {
  if (opened) return;
  opened = true;
  cakeBtn.classList.add('blown');

  // little smoke puffs from the candle
  const rect = cakeBtn.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height * 0.22;
  for (let i = 0; i < 6; i++) {
    const puff = document.createElement('div');
    puff.className = 'puff';
    puff.style.left = originX + rand(-10, 10) + 'px';
    puff.style.top = originY + 'px';
    puff.style.setProperty('--dx', rand(-30, 30) + 'px');
    puff.style.animationDelay = i * 40 + 'ms';
    document.body.appendChild(puff);
    setTimeout(() => puff.remove(), 1100 + i * 40);
  }

  confettiBurst(window.innerWidth / 2, window.innerHeight / 2, 90);

  // try to start music (user gesture makes this reliable)
  if (bgMusic) {
    bgMusic.volume = 0.55;
    bgMusic.play().then(() => {
      musicToggle.classList.add('playing');
    }).catch(() => { /* file belum ada / autoplay diblokir, biarkan tombol musik manual */ });
  }

  setTimeout(() => {
    gate.classList.add('gate-hidden');
    setTimeout(() => {
      gate.setAttribute('hidden', '');
      inviteMain.removeAttribute('hidden');
      document.body.style.overflow = '';
      initReveal();
      initTimelineFill();
    }, 650);
  }, 500);
}
cakeBtn.addEventListener('click', openInvitation);
document.body.style.overflow = 'hidden';

/* =========================================================
   COUNTDOWN
   ========================================================= */
function updateCountdown() {
  const now = new Date();
  let diff = EVENT_DATE - now;
  if (diff < 0) diff = 0;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  const pad = (n) => String(n).padStart(2, '0');
  const dEl = $('#cd-days'), hEl = $('#cd-hours'), mEl = $('#cd-mins'), sEl = $('#cd-secs');
  if (dEl) dEl.textContent = pad(days);
  if (hEl) hEl.textContent = pad(hours);
  if (mEl) mEl.textContent = pad(mins);
  if (sEl) sEl.textContent = pad(secs);
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* =========================================================
   SCROLL REVEAL
   ========================================================= */
function initReveal() {
  const targets = $$('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );
  targets.forEach((t) => io.observe(t));
}

/* =========================================================
   TIMELINE FILL ON SCROLL
   ========================================================= */
function initTimelineFill() {
  const fill = $('.timeline-fill');
  const timeline = $('.timeline');
  if (!fill || !timeline) return;
  function onScroll() {
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height + vh * 0.5;
    const passed = Math.min(Math.max(vh * 0.75 - rect.top, 0), total);
    const pct = Math.min((passed / total) * 100, 100);
    fill.style.height = pct + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* =========================================================
   MUSIC TOGGLE (manual)
   ========================================================= */
musicToggle.addEventListener('click', () => {
  if (!bgMusic) return;
  if (bgMusic.paused) {
    bgMusic.play().then(() => musicToggle.classList.add('playing')).catch(() => {});
  } else {
    bgMusic.pause();
    musicToggle.classList.remove('playing');
  }
});

/* =========================================================
   GALLERY LIGHTBOX
   ========================================================= */
const lightbox = $('#lightbox');
const lightboxImg = $('#lightboxImg');
$$('.polaroid img').forEach((img) => {
  img.addEventListener('error', () => img.closest('.polaroid').classList.add('is-missing'), { once: true });
  img.addEventListener('click', () => {
    if (img.closest('.polaroid').classList.contains('is-missing')) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    $('#lightboxCaption').textContent = img.closest('figure').querySelector('figcaption').textContent;
    lightbox.removeAttribute('hidden');
  });
});
$('#lightboxClose').addEventListener('click', () => lightbox.setAttribute('hidden', ''));
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.setAttribute('hidden', '');
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.setAttribute('hidden', ''); });

$$('.polaroid').forEach((card) => {
  const base = card.classList.contains('p1') ? -4 : card.classList.contains('p2') ? 3 : card.classList.contains('p3') ? 2 : -3;
  card.addEventListener('pointermove', (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(700px) rotate(${base + x * 5}deg) rotateX(${-y * 7}deg) rotateY(${x * 8}deg) translateY(-7px) scale(1.035)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

/* =========================================================
   RSVP → WhatsApp
   ========================================================= */
const rsvpForm = $('#rsvpForm');
if (rsvpForm) {
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#rsvpName').value.trim();
    const status = $('#rsvpStatus').value;
    const count = $('#rsvpCount').value;
    const msg = $('#rsvpMsg').value.trim();

    let text = `Halo! Ini konfirmasi kehadiran untuk ulang tahun Kirana ✨\n\n`;
    text += `Nama: ${name}\n`;
    text += `Status: ${status}\n`;
    text += `Jumlah orang: ${count}\n`;
    if (msg) text += `Ucapan: ${msg}\n`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  });
}

/* =========================================================
   SPARKLES on gate (ambient)
   ========================================================= */
(function gateSparkles() {
  const layer = $('.gate-sparkles');
  if (!layer) return;
  function spawn() {
    const s = document.createElement('div');
    const size = rand(3, 7);
    Object.assign(s.style, {
      position: 'absolute',
      left: rand(5, 95) + '%',
      top: rand(5, 95) + '%',
      width: size + 'px',
      height: size + 'px',
      borderRadius: '50%',
      background: Math.random() > 0.5 ? '#FFC857' : '#FF9FC2',
      opacity: '0',
      pointerEvents: 'none',
    });
    layer.appendChild(s);
    s.animate(
      [
        { opacity: 0, transform: 'scale(0.4)' },
        { opacity: 0.9, transform: 'scale(1.3)', offset: 0.5 },
        { opacity: 0, transform: 'scale(0.4)' },
      ],
      { duration: rand(1800, 3000), easing: 'ease-in-out' }
    );
    setTimeout(() => s.remove(), 3000);
  }
  setInterval(spawn, 350);
})();
