/**
 * Behaviour for brand/content pages — each block self-detects:
 * demo forms, FAQ search + tabs, size finder + unit toggle, journal
 * filters, article loading by ?slug, manifesto scroll reveal.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { qs, qsa, on, prefersReducedMotion } from '../core/dom.js';
import { icon } from '../../data/icons.js';

gsap.registerPlugin(ScrollTrigger);

/** Forms with [data-demo-form] validate, then swap to a success message. */
function initDemoForms() {
  qsa('[data-demo-form]').forEach((form) => {
    form.noValidate = true;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      qsa('.input.is-invalid', form).forEach((el) => el.classList.remove('is-invalid'));
      const invalid = qsa('input, select, textarea', form).filter((el) => !el.checkValidity());
      if (invalid.length) {
        invalid.forEach((el) => el.closest('.input')?.classList.add('is-invalid'));
        invalid[0].focus();
        return;
      }
      form.innerHTML = `<div class="form-success">${icon('check-circle')}<h3>Message received</h3><p>${form.dataset.success}</p></div>`;
    });
  });
}

function initFaq() {
  const root = qs('[data-faq]');
  if (!root) return;
  const search = qs('[data-faq-search]');
  let cat = 'all';

  const filter = () => {
    const q = (search?.value ?? '').trim().toLowerCase();
    let any = false;
    qsa('[data-faq-group]', root).forEach((group) => {
      const inCat = cat === 'all' || group.dataset.faqGroup === cat;
      let groupHas = false;
      qsa('[data-faq-item]', group).forEach((item) => {
        const show = inCat && (!q || item.textContent.toLowerCase().includes(q));
        item.hidden = !show;
        if (show && q) item.open = true;
        groupHas ||= show;
      });
      group.hidden = !groupHas;
      any ||= groupHas;
    });
    qs('[data-faq-none]', root).hidden = any;
  };

  search?.addEventListener('input', filter);
  on(root, 'click', '[data-faq-cat]', (e, chip) => {
    cat = chip.dataset.faqCat;
    qsa('[data-faq-cat]', root).forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    filter();
  });
}

function initSizeFinder() {
  const finder = qs('[data-finder]');
  if (finder) {
    const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
    qs('[data-finder-form]', finder).addEventListener('submit', (e) => {
      e.preventDefault();
      const f = e.target;
      const h = Number(f.height.value);
      const w = Number(f.weight.value);
      // Simple heuristic from height/weight bands (replace with real fit data)
      let index = w < 58 ? 0 : w < 70 ? 1 : w < 82 ? 2 : w < 94 ? 3 : w < 106 ? 4 : 5;
      if (h > 185 && index < 5) index++;
      if (f.fit.value === 'regular') index = Math.max(0, index - 1);
      if (f.fit.value === 'baggy') index = Math.min(5, index + 1);
      const size = SIZES[index];
      qs('[data-finder-size]', finder).textContent = size;
      qs('[data-finder-note]', finder).textContent =
        f.fit.value === 'regular'
          ? 'For a closer fit, we sized you down one. Chest and shoulders will sit neatly.'
          : f.fit.value === 'baggy'
            ? 'Sized up for that extra-drapey streetwear look.'
            : 'Our signature oversized drape — dropped shoulders, relaxed body.';
      qs('[data-finder-result]', finder).hidden = false;
      qs('[data-finder-result] a', finder).href = `/shop.html?size=${size}`;
    });
  }

  const page = qs('.size-page');
  if (page) {
    qsa('[data-unit]', page).forEach((button) =>
      button.addEventListener('click', () => {
        const cm = button.dataset.unit === 'cm';
        qsa('[data-unit]', page).forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
        qsa('[data-inches]', page).forEach((cell) => (cell.textContent = cm ? Math.round(Number(cell.dataset.inches) * 2.54) : cell.dataset.inches));
      }),
    );
  }
}

function initJournal() {
  const chips = qsa('[data-journal-cat]');
  if (!chips.length) return;
  chips.forEach((chip) =>
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      const cat = chip.dataset.journalCat;
      qsa('[data-post]').forEach((post) => (post.hidden = cat !== 'all' && post.dataset.category !== cat));
    }),
  );
}

function initArticle() {
  const root = qs('[data-article]');
  if (!root) return;
  const slug = new URLSearchParams(location.search).get('slug');
  const posts = JSON.parse(root.dataset.posts);
  const post = posts.find((p) => p.slug === slug);
  if (!post || post === posts[0]) return;

  document.title = `${post.title} — Atire Journal`;
  qs('[data-a-cat]', root).textContent = post.category;
  qs('[data-a-date]', root).textContent = post.date;
  qs('[data-a-read]', root).textContent = post.read;
  qs('[data-a-title]', root).textContent = post.title;
  qs('[data-a-lede]', root).textContent = post.excerpt;
  qs('[data-a-image]', root).src = post.image;
  qs('.breadcrumb [aria-current]')?.replaceChildren(post.category);
  qs('[data-a-body]', root).innerHTML = `
    <p>${post.excerpt} It’s one of the questions we get asked most in our DMs, so we put the whole team on it.</p>
    <h2>The short version</h2>
    <p>Start simple, keep proportions balanced and let one piece do the talking. Everything else is personal taste — and that’s the fun part.</p>
    <blockquote>“The best fits look effortless because someone thought about them for a while.”</blockquote>
    <h2>What we’d do</h2>
    <p>Pick one statement piece, build around it with neutrals, and choose fabrics that feel as good as they look. Heavyweight cotton holds its shape all day, so it never looks tired by evening.</p>
    <p>Got a fit you’re proud of? Tag <strong>@atire.india</strong> — we feature our favourites every week.</p>`;
}

/** Manifesto: words brighten as you scroll through the paragraph. */
function initManifesto() {
  const el = qs('[data-manifesto]');
  if (!el) return;
  el.innerHTML = el.textContent
    .trim()
    .split(/\s+/)
    .map((w) => `<span>${w}</span>`)
    .join(' ');
  if (prefersReducedMotion()) return el.classList.add('is-static');
  gsap.fromTo(
    el.querySelectorAll('span'),
    { opacity: 0.15 },
    { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } },
  );
}

export function initContentPages() {
  initDemoForms();
  initFaq();
  initSizeFinder();
  initJournal();
  initArticle();
  initManifesto();
}
