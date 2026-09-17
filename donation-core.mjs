export function normalizeAmount(value) {
  const input = String(value).trim();
  if (!/^\d{1,6}(?:\.\d{1,2})?$/.test(input)) throw new Error("amount");
  const [whole, fraction = ""] = input.split(".");
  const paise = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (paise < 100 || paise > 10000000) throw new Error("amount");
  return `${Math.floor(paise / 100)}.${String(paise % 100).padStart(2, "0")}`;
}
export function validateDonor(values) {
  const name = String(values.name || "").trim();
  const email = String(values.email || "").trim();
  const city = String(values.city || "").trim();
  if (name.length < 2 || name.length > 80 || /[\u0000-\u001f<>]/.test(name))
    throw new Error("name");
  if (
    email &&
    (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  )
    throw new Error("email");
  if (city.length > 80 || /[\u0000-\u001f<>]/.test(city))
    throw new Error("city");
  return { name, email, city, amount: normalizeAmount(values.amount) };
}
export function buildPayment(amount, config, reference) {
  const normalized = normalizeAmount(amount);
  if (!/^[a-zA-Z0-9]{8,35}$/.test(reference)) throw new Error("reference");
  if (!config.enabled) {
    return {
      live: false,
      amount: normalized,
      reference,
      payload: `DEMO ONLY - NOT A PAYMENT\nAatmiyata Kalyan\nAmount: INR ${normalized}\nReference: ${reference}`,
    };
  }
  // A syntactically valid ID still needs verification by the NGO's bank.
  if (
    !/^[a-zA-Z0-9._-]{2,256}@[a-zA-Z][a-zA-Z0-9.-]{1,63}$/.test(config.upiId) ||
    !config.payeeName?.trim()
  )
    throw new Error("config");
  const fields = {
    pa: config.upiId,
    pn: config.payeeName.trim(),
    am: normalized,
    cu: "INR",
    tr: reference,
    tn: "Donation to Aatmiyata Kalyan",
  };
  const query = Object.entries(fields)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
  return {
    live: true,
    amount: normalized,
    reference,
    payload: `upi://pay?${query}`,
  };
}
