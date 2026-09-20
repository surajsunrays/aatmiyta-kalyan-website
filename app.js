const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  updateMenuLabel();
  nav.classList.toggle("open", open);
});
nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    updateMenuLabel();
  }),
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    updateMenuLabel();
  }
});
const details = {
  nursery: [
    "CARE FOR NATURE",
    "Growing together, one plant at a time.",
    "Our plant nursery is a living expression of care for the world around us. Aatmiyata Kalyan manages and maintains the nursery as part of its community activities. Speak with our team to learn about the plants and how you can lend a hand.",
  ],
  ambedkar: [
    "14 APRIL · ANNUAL OBSERVANCE",
    "Dr. Babasaheb Ambedkar Jayanti",
    "We come together to honour Dr. Babasaheb Ambedkar and his legacy of equality, education, and human dignity. This community celebration is an opportunity to reflect on the values that guide our shared work.",
  ],
  phule: [
    "11 APRIL · ANNUAL OBSERVANCE",
    "Mahatma Jyotiba Phule Jayanti",
    "We honour Mahatma Jyotiba Phule and his commitment to education and social equality. His life continues to inspire a community where learning, opportunity, and dignity belong to everyone.",
  ],
  buddha: [
    "ANNUAL OBSERVANCE · LUNAR CALENDAR",
    "Buddha Purnima",
    "Buddha Purnima is a time to honour Lord Buddha and reflect on the teachings of wisdom and compassion. Its calendar date varies each year. Join our community in keeping the spirit of Dhamma alive through kindness and mindful living.",
  ],
  ramabai: [
    "7 FEBRUARY · ANNUAL OBSERVANCE",
    "Mata Ramabai Jayanti",
    "Our community remembers Mata Ramabai with gratitude, honouring her resilience, compassion, and contributions. Her life offers an enduring reminder of the strength found in care and dedication.",
  ],
  dhamma: [
    "ANNUAL OBSERVANCE",
    "Dhamma Chakra Pravartan Din",
    "We commemorate the historic embrace of Buddhism by Dr. Babasaheb Ambedkar and his followers. It is an occasion to renew our commitment to the Buddhist path, equality, and dignity. Please confirm the local programme date with the Vihar.",
  ],
};
const dialog = document.querySelector("#detail-dialog");
document.querySelectorAll("[data-detail]").forEach((button) =>
  button.addEventListener("click", () => {
    const [label, title, description] = (
      currentLanguage === "mr" ? marathiDetails : details
    )[button.dataset.detail];
    document.querySelector("#dialog-label").textContent = label;
    document.querySelector("#dialog-title").textContent = title;
    document.querySelector("#dialog-description").textContent = description;
    dialog.showModal();
    document.body.classList.add("modal-open");
  }),
);
document
  .querySelector(".close-dialog")
  .addEventListener("click", () => dialog.close());
document
  .querySelector("#dialog-visit")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () =>
  document.body.classList.remove("modal-open"),
);
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
document.querySelector("#all-events").addEventListener("click", (e) => {
  const button = e.currentTarget;
  const expanded = button.getAttribute("aria-expanded") !== "true";
  document.querySelector(".more-events").hidden = !expanded;
  button.setAttribute("aria-expanded", String(expanded));
  updateEventsLabel();
});
document.querySelector("#year").textContent = new Date().getFullYear();
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        nav
          .querySelectorAll("a")
          .forEach((a) =>
            a.classList.toggle(
              "active",
              a.hash ===
                "#" +
                  (entry.target.id === "ambedkar-jayanti"
                    ? "events"
                    : entry.target.id),
            ),
          );
      }
    }
  },
  { rootMargin: "-15% 0px -60% 0px" },
);
document
  .querySelectorAll("section[id]")
  .forEach((section) => observer.observe(section));
