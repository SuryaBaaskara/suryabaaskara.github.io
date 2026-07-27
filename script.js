// ============================================================
// NAV: scroll state + active link + mobile drawer
// ============================================================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navDrawer = document.getElementById('navDrawer');

window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 10);
}, { passive: true });

navToggle.addEventListener('click', () => {
  navDrawer.classList.toggle('is-open');
});

navDrawer.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navDrawer.classList.remove('is-open'));
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ============================================================
// LENS TOGGLE — shared behaviour for skills + projects filters
// ============================================================
function setupLens({ lensId, thumbId, onChange }) {
  const lens = document.getElementById(lensId);
  const thumb = document.getElementById(thumbId);
  if (!lens || !thumb) return;
  const buttons = Array.from(lens.querySelectorAll('button'));

  const colors = { all: 'var(--text-dim)', uiux: 'var(--uiux)', iot: 'var(--iot)', game: 'var(--game)', design:'var(--design)',};

  function moveThumb(btn) {
    thumb.style.width = btn.offsetWidth + 'px';
    thumb.style.transform = `translateX(${btn.offsetLeft - 5}px)`;
    const target = btn.dataset.target;
    if (colors[target]) thumb.style.background = colors[target];
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      moveThumb(btn);
      onChange(btn.dataset.target);
    });
  });

  // init
  requestAnimationFrame(() => moveThumb(lens.querySelector('button.is-active')));
  window.addEventListener('resize', () => moveThumb(lens.querySelector('button.is-active')));
}

// Skills lens
setupLens({
  lensId: 'skillsLens',
  thumbId: 'skillsLensThumb',
  onChange: (target) => {
    document.querySelectorAll('.skill-panel').forEach(panel => {
      panel.classList.toggle('is-active', panel.dataset.panel === target);
    });
  }
});

/// Projects lens (filter) + expand/collapse
const projectCards = document.querySelectorAll('.project-card');
const projectCount = document.getElementById('projectCount');
const projectExpandBtn = document.getElementById('projectExpandBtn');

const MAX_VISIBLE = 4;
let isExpanded = false;
let currentFilter = 'all';

function renderProjects() {
  let matched = [];
  projectCards.forEach(card => {
    const match = currentFilter === 'all' || card.dataset.discipline === currentFilter;
    card.dataset.match = match ? '1' : '0';
    if (match) matched.push(card);
  });

  matched.forEach((card, i) => {
    const show = isExpanded || i < MAX_VISIBLE;
    card.style.display = show ? '' : 'none';
  });

  // sembunyikan card yang gak match filter sama sekali
  projectCards.forEach(card => {
    if (card.dataset.match === '0') card.style.display = 'none';
  });

  projectCount.textContent = `${matched.length} project`;

  // tampilkan tombol expand cuma kalau ada lebih dari MAX_VISIBLE
  if (projectExpandBtn) {
    if (matched.length > MAX_VISIBLE) {
      projectExpandBtn.style.display = '';
      projectExpandBtn.textContent = isExpanded ? 'Collapse' : `Expand (${matched.length})`;
    } else {
      projectExpandBtn.style.display = 'none';
    }
  }
}

setupLens({
  lensId: 'projectsLens',
  thumbId: 'projectsLensThumb',
  onChange: (target) => {
    currentFilter = target;
    isExpanded = false; // reset tiap ganti filter
    renderProjects();
  }
});

if (projectExpandBtn) {
  projectExpandBtn.addEventListener('click', () => {
    isExpanded = !isExpanded;
    renderProjects();
  });
}

renderProjects(); // initial render

// ============================================================
// CONTACT FORM (demo only — no backend wired up)
// ============================================================
