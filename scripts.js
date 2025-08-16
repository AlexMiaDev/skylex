
/* Mobile nav toggle */
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('navMenu');
if (toggle && menu){
  toggle.addEventListener('click', ()=>{
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

/* Lazy video loading */
const lazyVideos = document.querySelectorAll('video.lazy-thumb');
if ('IntersectionObserver' in window){
  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting){
        const v = entry.target;
        const s = v.querySelector('source[data-src]');
        if (s && !s.src){ s.src = s.dataset.src; v.load(); }
        io.unobserve(v);
      }
    });
  }, { rootMargin: '400px' });
  lazyVideos.forEach(v=>io.observe(v));
}

/* Hover-to-play for desktop; tap-to-toggle for touch */
function enablePreview(video){
  let touched = false;
  video.addEventListener('mouseenter', ()=>{ if (!touched) { video.play(); }});
  video.addEventListener('mouseleave', ()=>{ if (!touched) { video.pause(); video.currentTime = 0; }});
  video.addEventListener('click', ()=>{
    touched = true;
    if (video.paused) video.play(); else { video.pause(); }
  });
}
document.querySelectorAll('.lazy-thumb').forEach(enablePreview);

/* Contact form validation + mailto fallback */
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const agree = document.getElementById('agree').checked;

    if (!name || !emailRx.test(email) || !message || !agree){
      statusEl.textContent = 'Please complete all fields correctly.';
      return;
    }
    const subject = encodeURIComponent('FPV Inquiry from ' + name);
    const body = encodeURIComponent(message + '\n\nReply to: ' + email);
    window.location.href = `mailto:Siniurin@gmail.com?subject=${subject}&body=${body}`;
    statusEl.textContent = 'Opening your email client…';
  });
}

/* Current year */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Mobile floating CTA show/hide on scroll up */
let lastY = window.scrollY;
const fcta = document.querySelector('.floating-cta');
if (fcta){
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    if (y < lastY) fcta.style.opacity = '1';
    else fcta.style.opacity = '0.85';
    lastY = y;
  }, { passive: true });
}

/* Scroll reveal animations */
const toReveal = document.querySelectorAll('.reveal, .underline-anim');
if ('IntersectionObserver' in window){
  const r = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting){
        e.target.classList.add('in-view');
        r.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  toReveal.forEach(el=>r.observe(el));
} else {
  toReveal.forEach(el=>el.classList.add('in-view'));
}

/* Parallax effect on hero video (respect reduced motion) */
const heroVideo = document.querySelector('.hero-video');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (heroVideo && !reduceMotion){
  let ticking = false;
  function onScroll(){
    if (!ticking){
      window.requestAnimationFrame(()=>{
        const y = window.scrollY;
        // translate a tiny bit for subtle parallax
        heroVideo.style.transform = `translateY(${y * 0.1}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
}






// Minimal hero autoplay helper (no format changes)
document.addEventListener('DOMContentLoaded', ()=>{
  const v = document.querySelector('.hero-video');
  if (!v) return;
  v.muted = true;
  v.playsInline = true;
  // iOS compatibility attribute
  v.setAttribute('webkit-playsinline', '');
  const tryPlay = () => { if (v.paused) v.play().catch(()=>{}); };
  if (v.readyState >= 2) tryPlay();
  else v.addEventListener('canplay', tryPlay, { once: true });
});


// ===== Scrollspy for active nav links =====
document.addEventListener('DOMContentLoaded', ()=>{
  const links = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
  const map = new Map();
  links.forEach(a=>{
    const id = a.getAttribute('href').slice(1);
    const sec = document.getElementById(id);
    if (sec) map.set(sec, a);
  });
  if (map.size === 0) return;

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      const a = map.get(e.target);
      if (!a) return;
      if (e.isIntersecting){
        links.forEach(l=>l.classList.remove('active'));
        a.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

  map.forEach((_, sec)=>io.observe(sec));
});


// ===== Theme toggle (system-aware with persistence) =====
(function(){
  const root = document.documentElement;
  const storageKey = 'site-theme';
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const btn = document.getElementById('themeToggle');

  function applyTheme(theme){
    if (theme === 'dark'){
      root.setAttribute('data-theme', 'dark');
      if (btn) btn.textContent = '☀️';
    } else if (theme === 'light'){
      root.setAttribute('data-theme', 'light');
      if (btn) btn.textContent = '🌙';
    } else {
      // follow system
      root.removeAttribute('data-theme');
      if (btn) btn.textContent = mq.matches ? '☀️' : '🌙';
    }
  }

  // Initial
  const saved = localStorage.getItem(storageKey); // 'dark' | 'light' | null
  applyTheme(saved);

  // React to system changes if user hasn't chosen
  mq.addEventListener('change', ()=>{
    if (!localStorage.getItem(storageKey)) applyTheme(null);
  });

  // Toggle click
  if (btn){
    btn.addEventListener('click', ()=>{
      const current = root.getAttribute('data-theme'); // null|'dark'|'light'
      let next;
      if (!current){
        next = mq.matches ? 'light' : 'dark'; // toggle from system
      } else if (current === 'dark'){
        next = 'light';
      } else {
        next = 'dark';
      }
      localStorage.setItem(storageKey, next);
      applyTheme(next);
    });
  }
})();
