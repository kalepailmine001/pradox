// Mobile nav toggle
const navToggleButton = document.querySelector('.nav-toggle');
const navList = document.getElementById('primary-menu');
if (navToggleButton && navList) {
  navToggleButton.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    navToggleButton.setAttribute('aria-expanded', String(isOpen));
  });
}

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Scroll reveal
const revealElements = document.querySelectorAll('.reveal');
const onIntersect = (entries, observer) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  }
};
const observer = new IntersectionObserver(onIntersect, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
revealElements.forEach(el => observer.observe(el));

// Lightbox logic
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const btnClose = document.querySelector('.lightbox-close');
const btnPrev = document.querySelector('.lightbox-prev');
const btnNext = document.querySelector('.lightbox-next');

let activeIndex = -1;

function openLightbox(index) {
  const figure = galleryItems[index];
  if (!figure) return;
  const img = figure.querySelector('img');
  const caption = figure.querySelector('figcaption');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = caption ? caption.textContent : '';
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  activeIndex = index;
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

function showPrev() {
  if (activeIndex < 0) return;
  const nextIndex = (activeIndex - 1 + galleryItems.length) % galleryItems.length;
  openLightbox(nextIndex);
}

function showNext() {
  if (activeIndex < 0) return;
  const nextIndex = (activeIndex + 1) % galleryItems.length;
  openLightbox(nextIndex);
}

galleryItems.forEach((figure, index) => {
  figure.addEventListener('click', () => openLightbox(index));
});

btnClose && btnClose.addEventListener('click', closeLightbox);
btnPrev && btnPrev.addEventListener('click', showPrev);
btnNext && btnNext.addEventListener('click', showNext);

// Close on overlay click
lightbox && lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
window.addEventListener('keydown', (e) => {
  if (lightbox && lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

// Smooth scroll with header offset
const header = document.querySelector('.site-header');
const headerOffset = header ? header.offsetHeight : 64;
function smoothScrollTo(target) {
  const rect = target.getBoundingClientRect();
  const offsetTop = rect.top + window.scrollY - headerOffset - 8;
  window.scrollTo({ top: Math.max(offsetTop, 0), behavior: 'smooth' });
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href');
  const target = id && document.querySelector(id);
  if (!target) return;
  e.preventDefault();
  // close mobile menu if open
  if (navList && navList.classList.contains('open')) {
    navList.classList.remove('open');
    navToggleButton && navToggleButton.setAttribute('aria-expanded', 'false');
  }
  smoothScrollTo(target);
});

// Ripple click animation on interactive elements
function attachRipple(e, host) {
  const rect = host.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
  host.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

const rippleSelectors = '.btn, .nav-list a, .nav-toggle, .lightbox button, .contact-form button';
document.addEventListener('click', (e) => {
  const host = e.target.closest(rippleSelectors);
  if (!host) return;
  attachRipple(e, host);
});


