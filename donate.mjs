import { donationConfig } from "./donation-config.mjs";
import { validateDonor, buildPayment } from "./donation-core.mjs";
const $ = (selector) => document.querySelector(selector);
const form = $("#donation-form");
let currentDonation = null;
const errors = {
  name: "Please enter your full name (2–80 characters).",
  email: "Please enter a valid email address or leave it blank.",
  city: "Please enter a city or village of up to 80 characters.",
  amount:
    "Please enter an amount from ₹1 to ₹1,00,000 with no more than two decimal places.",
  config:
    "Payments are temporarily unavailable. Please contact the team at the Vihar.",
  qr: "The QR could not be generated. Please refresh the page and try again.",
};
const fieldIds = {
  name: "donor-name",
  email: "donor-email",
  city: "donor-city",
  amount: "donation-amount",
};
let errorKey = "";
const t = (text) => translate(text);
function clearError() {
  errorKey = "";
  $("#form-error").hidden = true;
  form
    .querySelectorAll("[aria-invalid]")
    .forEach((el) => el.removeAttribute("aria-invalid"));
}
function showError(key) {
  errorKey = errors[key] ? key : "qr";
  $("#form-error").textContent = t(errors[errorKey]);
  $("#form-error").hidden = false;
  const field = document.getElementById(fieldIds[key]);
  if (field) {
    field.setAttribute("aria-invalid", "true");
    field.focus();
  }
}
function renderSummary() {
  if (!currentDonation) return;
  const { donor, payment } = currentDonation;
  $("#payment-amount").textContent = new Intl.NumberFormat(
    document.documentElement.lang === "mr" ? "mr-IN" : "en-IN",
    { style: "currency", currency: "INR" },
  ).format(payment.amount);
  $("#payment-instructions").textContent = t(
    payment.live
      ? "Scan this QR with your UPI app, or open a UPI app on this phone."
      : "This sample QR contains your selected amount for preview only. It is not a payment request.",
  );
  $("#qr-status").textContent = t(
    payment.live ? "Ready to pay via UPI" : "SAMPLE QR · NO PAYMENT",
  );
  $("#qr-code").setAttribute(
    "aria-label",
    `${t(payment.live ? "UPI payment QR" : "Sample donation QR")} — INR ${payment.amount}`,
  );
  $("#summary-name").textContent = donor.name;
  $("#summary-recipient").textContent = payment.live
    ? donationConfig.payeeName
    : t("Aatmiyata Kalyan");
  $("#summary-reference").textContent = payment.reference;
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearError();
  try {
    const donor = validateDonor(Object.fromEntries(new FormData(form)));
    const random = new Uint8Array(12);
    crypto.getRandomValues(random);
    const reference =
      "AK" +
      Array.from(random, (n) => n.toString(16).padStart(2, "0")).join("");
    const payment = buildPayment(donor.amount, donationConfig, reference);
    const qr = qrcode(0, "M");
    qr.addData(payment.payload);
    qr.make();
    $("#qr-code").innerHTML = qr.createSvgTag({
      cellSize: 5,
      margin: 20,
      scalable: true,
    });
    $("#qr-code svg").setAttribute("aria-hidden", "true");
    currentDonation = { donor, payment };
    renderSummary();
    $("#upi-row").hidden = !payment.live;
    $("#summary-upi").textContent = payment.live ? donationConfig.upiId : "";
    $("#open-upi").hidden = !payment.live;
    if (payment.live) $("#open-upi").href = payment.payload;
    else $("#open-upi").removeAttribute("href");
    $("#verification-note").hidden = !payment.live;
    form.hidden = true;
    $("#payment-step").hidden = false;
    $("#step-one").removeAttribute("aria-current");
    $("#step-two").setAttribute("aria-current", "step");
    $("#payment-title").focus();
  } catch (error) {
    showError(error.message);
  }
});
$("#edit-donation").addEventListener("click", () => {
  currentDonation = null;
  $("#qr-code").replaceChildren();
  $("#open-upi").removeAttribute("href");
  $("#payment-step").hidden = true;
  form.hidden = false;
  $("#step-two").removeAttribute("aria-current");
  $("#step-one").setAttribute("aria-current", "step");
  $("#donation-amount").focus();
});
function syncAmounts() {
  document
    .querySelectorAll("[data-amount]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(
          Number(button.dataset.amount) === Number(form.elements.amount.value),
        ),
      ),
    );
}
document.querySelectorAll("[data-amount]").forEach((button) =>
  button.addEventListener("click", () => {
    form.elements.amount.value = button.dataset.amount;
    clearError();
    syncAmounts();
  }),
);
form.addEventListener("input", () => {
  clearError();
  syncAmounts();
});
document.addEventListener("languagechange", () => {
  renderSummary();
  if (errorKey) $("#form-error").textContent = t(errors[errorKey]);
});
$("#demo-notice").hidden = donationConfig.enabled === true;
const menu = $(".menu-toggle"),
  nav = $("nav");
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
  updateMenuLabel();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    menu.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
    updateMenuLabel();
  }
});
$("#year").textContent = new Date().getFullYear();

$("#continue-donation").disabled = false;
