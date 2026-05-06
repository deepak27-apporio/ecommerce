import { ORDER_STEPS } from "../types/Constants";

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

export const getStepIndex = (status: string) => {
  const index = ORDER_STEPS.findIndex((step) => step.key === status);
  return index === -1 ? 0 : index;
};

// Format date helper
export const formatDate = (baseDate: string, addDaysCount: number) => {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + addDaysCount);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};