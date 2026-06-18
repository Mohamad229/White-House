export function normalizeSyrianPhoneNumber(value: string) {
  let digits = String(value || "").replace(/[^\d]/g, "");

  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("9630")) digits = `963${digits.slice(4)}`;
  if (digits.startsWith("0")) digits = `963${digits.slice(1)}`;
  if (digits.length === 9 && digits.startsWith("9")) digits = `963${digits}`;

  return digits ? `+${digits}` : "";
}

export function isValidWhatsAppPhone(value: string) {
  return /^\+9639\d{8}$/.test(normalizeSyrianPhoneNumber(value));
}

export function whatsappHrefForPhone(value: string) {
  const normalized = normalizeSyrianPhoneNumber(value);
  const digits = normalized.replace(/[^\d]/g, "");

  return digits ? `https://wa.me/${digits}` : "";
}
