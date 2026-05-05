export const transformImage = (url: string, width = 200) => {
  const newUrl = url?.replace("upload/", `upload/dpr_auto/w_${width}/`);
  return newUrl;
};

export const getFullImageUrl = (url: string) => {
  const base = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";
  return `${base}${url}`;
}

export const calculateTotalPrices = (items: any[]) => {
  const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const shipping = subtotal > 500 ? 0 : 12;
    const tax = subtotal * 0.08;
    return {
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
    };
}