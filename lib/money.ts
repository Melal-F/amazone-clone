export function money(n: number) {
  return Math.round(n * 100) / 100;
}

export function formatMoney(n: number) {
  return money(n).toFixed(2);
}

export function shippingCost(subtotal: number, method: "standard" | "expedited") {
  if (subtotal <= 0) return 0;
  if (method === "expedited") return 12.99;
  return subtotal >= 35 ? 0 : 6.99;
}

export function taxAmount(subtotal: number) {
  return money(subtotal * 0.085);
}

export function orderTotal(subtotal: number, method: "standard" | "expedited") {
  return money(subtotal + shippingCost(subtotal, method) + taxAmount(subtotal));
}

/** Stable label from the study date so server and client match. */
export function arrival(days: number) {
  const d = new Date(Date.UTC(2026, 9, 6 + days));
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
