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
const slideTransitions = [
  { enter: 'translateX(12%) translateZ(-140px) rotateY(-16deg) scale(0.92)', exit: 'translateX(-10%) translateZ(-100px) rotateY(12deg) scale(0.94)' },
  { enter: 'translateX(-12%) translateZ(-140px) rotateY(16deg) scale(0.92)', exit: 'translateX(10%) translateZ(-100px) rotateY(-12deg) scale(0.94)' },
  { enter: 'translateY(12%) translateZ(-120px) rotateX(14deg)', exit: 'translateY(-10%) translateZ(-100px) rotateX(-12deg)' },
  { enter: 'translateZ(-180px) scale(0.88)', exit: 'translateZ(60px) scale(1.06)' },
  { enter: 'translateZ(-100px) rotateZ(-4deg) scale(0.94)', exit: 'translateZ(-80px) rotateZ(4deg) scale(0.96)' },
];
let lastTransition = -1;
function chooseTransition() {
  // Choose a different effect each time, without changing the photo order.
  const choices = slideTransitions.map((_, index) => index)
    .filter(index => index !== lastTransition);
  lastTransition = choices[Math.floor(Math.random() * choices.length)];
  return slideTransitions[lastTransition];
}
function scheduleSlide(delay = 3500) {
  clearTimeout(autoplayTimer);
  if (sliderPhotos.length > 1 && !manuallyPaused && !reducedMotion.matches &&
      !document.hidden && !viewer.open && !slider.matches(':hover, :focus-within')) {
    autoplayTimer = setTimeout(async () => {
      const started = performance.now();
      await showSlide(slideIndex + 1);
      scheduleSlide(Math.max(0, 3500 - (performance.now() - started)));
    }, typeof delay === 'number' ? delay : 3500);
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
      const effect = chooseTransition();
      const timing = { duration: 850, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' };
      await Promise.all([
        nextImage.animate([
          { opacity: 0, transform: effect.enter },
          { opacity: 1, transform: 'none' },
        ], timing).finished,
        sliderImage.animate([
          { opacity: 1, transform: 'none' },
          { opacity: 0, transform: effect.exit },
        ], timing).finished,
      ]);
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
