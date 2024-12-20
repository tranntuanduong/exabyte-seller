export const formatPrice = (price: number) => {
  return price.toLocaleString("vi", {
    style: "currency",
    currency: "VND",
  });
};
