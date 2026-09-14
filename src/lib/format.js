export function peso(amount) {
  return "₱" + Math.round(amount).toLocaleString("en-PH");
}

export function formatDate(value) {
  const d = new Date(value + "T00:00:00");
  return d.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
