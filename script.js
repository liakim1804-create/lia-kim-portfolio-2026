const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 5648;

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
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
