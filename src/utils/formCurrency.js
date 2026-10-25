export function formatCurrency(amount, currency = "ج.م") {
  if (amount === undefined || amount === null || isNaN(amount)) return `0 ${currency}`;
  const num = Number(amount);
  return `${num.toLocaleString("EG")} ${currency}`;
}

