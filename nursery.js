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
