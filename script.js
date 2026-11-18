const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 4738;

function fitCanvas() {
  const viewport = document.querySelector('.viewport');
  const site = document.querySelector('.site');
  const scale = Math.min(window.innerWidth / DESIGN_WIDTH, 1);

  document.documentElement.style.setProperty('--site-scale', String(scale));
  viewport.style.height = `${DESIGN_HEIGHT * scale}px`;

  if (window.innerWidth >= DESIGN_WIDTH) {
    site.style.removeProperty('transform');
    site.style.removeProperty('left');
  } else {
    site.style.removeProperty('transform');
    site.style.removeProperty('left');
  }
}

fitCanvas();
window.addEventListener('resize', fitCanvas, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    event.preventDefault();
    // 고정 메뉴바 높이만큼 띄워서 섹션 제목이 가려지거나 잘리지 않게
    const offset = 0; // 스크롤하면 메뉴바가 숨겨지므로 가려질 일이 없음
    const top = link.getAttribute('href') === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  });
});

const revealTargets = document.querySelectorAll(`
  #about > .section-number,
  #about > .about-title,
  #about > .about-intro,
  #about > .profile-placeholder,
  #about > .about-facts,
  #works > .section-number,
  #works > .works-title,
  #works > .project,
  #contact > .section-number,
  #contact > .contact-name,
  #contact > .contact-title,
  #contact > .contact-list,
  #contact > .copyright
`);

revealTargets.forEach((target) => target.classList.add('scroll-reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  },
  {
    threshold: 0.08,
    rootMargin: '0px 0px -6% 0px',
  },
);

revealTargets.forEach((target) => revealObserver.observe(target));

/* ---------- 메뉴바: 스크롤하면 숨김, 맨 위에서만 표시 ---------- */
(() => {
  const bar = document.querySelector('.bar');
  if (!bar) return;
  const update = () => bar.classList.toggle('is-hidden', window.scrollY > 40);
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
