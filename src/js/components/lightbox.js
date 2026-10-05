/** Full-screen image viewer. openLightbox(['a.jpg','b.jpg'], startIndex) */
import { icon } from '../../data/icons.js';
import { stopScroll, startScroll } from '../core/smooth-scroll.js';

let el;
let images = [];
let index = 0;

function build() {
  el = document.createElement('div');
  el.className = 'lightbox';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', 'Image viewer');
  el.innerHTML = `
    <img class="lightbox__img" alt="" />
    <button class="icon-btn icon-btn--nav lightbox__close" type="button" aria-label="Close">${icon('close')}</button>
    <button class="icon-btn icon-btn--nav lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous">${icon('arrow-left')}</button>
    <button class="icon-btn icon-btn--nav lightbox__nav lightbox__nav--next" type="button" aria-label="Next">${icon('arrow-right')}</button>
    <p class="lightbox__count"></p>`;
  document.body.append(el);

  el.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
  el.querySelector('.lightbox__nav--prev').addEventListener('click', () => show(index - 1));
  el.querySelector('.lightbox__nav--next').addEventListener('click', () => show(index + 1));
  el.addEventListener('click', (event) => event.target === el && closeLightbox());
  document.addEventListener('keydown', (event) => {
    if (!el.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });
}

function show(i) {
  index = (i + images.length) % images.length;
  el.querySelector('.lightbox__img').src = images[index];
  el.querySelector('.lightbox__count').textContent = `${index + 1} / ${images.length}`;
  el.querySelectorAll('.lightbox__nav').forEach((btn) => (btn.hidden = images.length < 2));
}

export function openLightbox(srcs, start = 0) {
  if (!el) build();
  images = srcs;
  show(start);
  el.classList.add('is-open');
  stopScroll();
  el.querySelector('.lightbox__close').focus();
}

export function closeLightbox() {
  el?.classList.remove('is-open');
  startScroll();
}
