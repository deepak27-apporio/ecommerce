import { api } from "./axios";

export const createOrder = async (orderData: any) => {
  try {
    const response = await api.post("/order/create", orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const openRazorpay = (orderData: any) => {
  try {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.razorpayOrder.amount,
      currency: "INR",
      name: "My App",
      description: "Order Payment",
      order_id: orderData.razorpayOrder.id,

      handler: async function (response: any) {
        console.log("Payment Success", response);

        await api.post("/order/verify-payment", response);

        window.location.href = `/success/${orderData.order.id}`;
      },

      prefill: {
        name: "Deepak",
        email: "deepak@gmail.com",
      },

      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (error) {
    throw error;
  }
};

export const getOrderDetails = async (orderId: number) => {
  try {
    const response = await api.get(`/order/${orderId}`);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
