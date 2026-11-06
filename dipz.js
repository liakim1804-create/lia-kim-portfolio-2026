document.documentElement.classList.add('js');

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const id = link.getAttribute('href');
    event.preventDefault();
    if (id === '#top') return window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ---------- DipZ web design: 1280 고정 스테이지를 그리드 폭에 맞춰 비례 축소 ---------- */
(() => {
  const stage = document.getElementById('dz-stage');
  if (!stage) return;
  const fit = stage.parentElement;
  const DESIGN = 1280;
  const apply = () => {
    const s = fit.clientWidth / DESIGN;
    stage.style.transform = `scale(${s})`;
    fit.style.height = `${stage.offsetHeight * s}px`;
  };
  apply();
  window.addEventListener('resize', apply, { passive: true });
  window.addEventListener('load', apply);
  if ('ResizeObserver' in window) new ResizeObserver(apply).observe(stage);
})();
