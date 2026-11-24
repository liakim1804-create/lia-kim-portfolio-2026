const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 6116;

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

/* ---------- works 필터: ALL / SERVICE DESIGN / VISUAL DESIGN ---------- */
(() => {
  const buttons = [...document.querySelectorAll('.works-filter button')];
  const cards = [...document.querySelectorAll('.wcard2')];
  const order = ['project-dipz', 'project-momen', 'project-parallax', 'project-polaroid'];
  cards.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  buttons.forEach((btn) => btn.addEventListener('click', () => {
    buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
    const f = btn.dataset.filter;
    const grid = document.querySelector('.works-grid');
    const show = cards.filter((c) => f === 'all' || c.dataset.cat === f);
    cards.forEach((c) => { c.hidden = !show.includes(c); });
    /* 새로고침처럼: 보이는 카드에 슬롯(크기·위치)을 처음부터 다시 배정 */
    const slots = ['slot-a', 'slot-b', 'slot-c', 'slot-d'];
    cards.forEach((c) => c.classList.remove(...slots));
    show.forEach((c, i) => c.classList.add(slots[i % slots.length]));
    grid.classList.remove('is-refresh'); void grid.offsetWidth; grid.classList.add('is-refresh');
  }));
})();

/* ---------- works 카드 스크롤 등장 (한 장씩 순서대로) ---------- */
(() => {
  const grid = document.querySelector('.works-grid');
  if (!grid) return;
  const cards = [...document.querySelectorAll('.wcard2')];
  grid.classList.add('is-armed');
  let queued = 0;
  const check = () => {
    const vh = window.innerHeight;
    const ready = cards
      .filter((c) => !c.classList.contains('in') && !c.dataset.q && !c.hidden)
      .filter((c) => { const r = c.getBoundingClientRect(); return r.top < vh * 0.88 && r.bottom > 0; })
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top || a.getBoundingClientRect().left - b.getBoundingClientRect().left);
    ready.forEach((c, i) => {
      c.dataset.q = '1';
      setTimeout(() => c.classList.add('in'), 120 + i * 280);
    });
  };
  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('resize', check);
  window.addEventListener('load', check);
  /* 필터로 다시 보여질 때도 한 장씩 */
  document.querySelectorAll('.works-filter button').forEach((b) => b.addEventListener('click', () => {
    cards.forEach((c) => { c.classList.remove('in'); delete c.dataset.q; });
    setTimeout(check, 30);
  }));
  check();
})();
