export default function currency(n) {
  if (n === null) return "";
  return new Intl.NumberFormat("vn-VN", {
    style: "currency",
    currency: "VND",
  }).format(n);
}
