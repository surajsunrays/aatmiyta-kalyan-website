const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector("#navigation");
function closeMenu() {
  menu.setAttribute("aria-expanded", "false");
  nav.classList.remove("open");
  updateMenuLabel();
}
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
  updateMenuLabel();
});
nav
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
document.querySelector("#year").textContent = new Date().getFullYear();
const viewer = document.querySelector("#photo-dialog");
document.querySelectorAll("[data-gallery]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const photo = viewer.querySelector("img");
    const thumbnail = link.querySelector("img");
    photo.src = link.href;
    photo.alt = thumbnail.alt;
    photo.setAttribute("width", thumbnail.getAttribute("width"));
    photo.setAttribute("height", thumbnail.getAttribute("height"));
    viewer.showModal();
    document.body.classList.add("modal-open");
  });
});
viewer
  .querySelector(".close-dialog")
  .addEventListener("click", () => viewer.close());
viewer.addEventListener("click", (event) => {
  if (event.target === viewer) viewer.close();
});
viewer.addEventListener("close", () =>
  document.body.classList.remove("modal-open"),
);

// Reuse the gallery's photo order so new gallery photos also appear in the slider.
const slider = document.querySelector('.nursery-slider');
const sliderPhotos = [...document.querySelectorAll('[data-gallery] img')]
  .filter(photo => photo.getAttribute('src').startsWith('gallery/'));
let sliderImage = document.querySelector('#slider-image');
const sliderStage = slider.querySelector('.slider-stage');
let slideIndex = 0;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let changingSlide = false;
let autoplayTimer;
let manuallyPaused = false;
function scheduleSlide() {
  clearTimeout(autoplayTimer);
  if (sliderPhotos.length > 1 && !manuallyPaused && !reducedMotion.matches &&
      !document.hidden && !viewer.open && !slider.matches(':hover, :focus-within')) {
    autoplayTimer = setTimeout(async () => {
      await showSlide(slideIndex + 1);
      scheduleSlide();
    }, 4500);
  }
}
async function showSlide(index) {
  if (changingSlide || !sliderPhotos.length) return;
  changingSlide = true;
  const nextIndex = (index + sliderPhotos.length) % sliderPhotos.length;
  const source = sliderPhotos[nextIndex];
  const nextImage = new Image();
  nextImage.src = source.src;
  nextImage.alt = source.alt;
  nextImage.width = Number(source.getAttribute('width'));
  nextImage.height = Number(source.getAttribute('height'));
  try {
    await nextImage.decode();
    nextImage.setAttribute('aria-hidden', 'true');
    sliderStage.append(nextImage);
    if (!reducedMotion.matches) {
      await nextImage.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 700, easing: 'ease-in-out',
      }).finished;
    }
    sliderImage.remove();
    nextImage.id = 'slider-image';
    nextImage.removeAttribute('aria-hidden');
    sliderImage = nextImage;
    slideIndex = nextIndex;
  } catch {
    nextImage.remove();
    // Skip unavailable photos on the next advance while keeping the current image visible.
    slideIndex = nextIndex;
  } finally {
    changingSlide = false;
  }
}
if (sliderPhotos.length) {
  slider.addEventListener('mouseenter', () => clearTimeout(autoplayTimer));
  slider.addEventListener('mouseleave', scheduleSlide);
  slider.addEventListener('focusin', () => clearTimeout(autoplayTimer));
  slider.addEventListener('focusout', () => setTimeout(scheduleSlide, 0));
  sliderStage.addEventListener('click', () => {
    manuallyPaused = !manuallyPaused;
    scheduleSlide();
  });
  sliderStage.addEventListener('keydown', event => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      manuallyPaused = !manuallyPaused;
      scheduleSlide();
    }
  });
  document.addEventListener('visibilitychange', scheduleSlide);
  reducedMotion.addEventListener('change', scheduleSlide);
  viewer.addEventListener('close', scheduleSlide);
  new MutationObserver(scheduleSlide).observe(viewer, { attributes: true, attributeFilter: ['open'] });
  scheduleSlide();
  slider.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(slideIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let touchStart = null;
  sliderStage.addEventListener('touchstart', event => {
    touchStart = event.touches.length === 1 ? event.touches[0] : null;
  }, { passive: true });
  sliderStage.addEventListener('touchend', event => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.clientX;
    const dy = event.changedTouches[0].clientY - touchStart.clientY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      showSlide(slideIndex + (dx < 0 ? 1 : -1));
    }
    touchStart = null;
  }, { passive: true });
  sliderStage.addEventListener('touchcancel', () => { touchStart = null; });
}
