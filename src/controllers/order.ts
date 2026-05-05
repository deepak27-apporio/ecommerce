import { Request, Response, NextFunction } from "express";
import { tryCatch } from "../middlewares/errorHandler.js";
import ErrorHandler from "../utils/errorClass.js";
import { prisma } from "../utils/client.js";
import { StatusCodes } from "../utils/apiResponse.js";
import { razorpay } from "../utils/razorpay.js";
import crypto from "crypto";

export const CreateOrder = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { addressId, address, items, tax, shipping } = req.body;
    console.log("dataset", req.body);
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
    }

    let finalAddressId;

    if (addressId) {
      const existingAddress = await prisma.address.findFirst({
        where: {
          id: addressId,
          userId, // security check
        },
      });

      if (!existingAddress) {
        return next(
          new ErrorHandler(
            "Address not found for this user",
            StatusCodes.NOT_FOUND,
          ),
        );
      }

      finalAddressId = existingAddress.id;
    }

    if (address) {
      const newAddress = await prisma.address.create({
        data: {
          userId,
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          postalCode: address.pincode,
        },
      });

      finalAddressId = newAddress.id;
    }

    const totalAmount =
      items.reduce((sum, item) => sum + item.price * item.quantity, 0) +
      (tax || 0) +
      (shipping || 0);
    const order = await prisma.order.create({
      data: {
        userId,
        addressId: finalAddressId,
        totalAmount,
        tax: tax || 0,
        shipping: shipping || 0,
        subtotal: items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            productImages: item.attachments[0]?.url || "",
            productCategory: item.productCategory,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `order_${order.id}`,
    });

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        razorpayOrderId: razorpayOrder.id,
      },
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      order: updatedOrder,
      razorpayOrder,
    });
  },
);

export const verifyPayment = tryCatch(async (req: Request, res: Response) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const secret = process.env.RAZORPAY_KEY_SECRET;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    await prisma.order.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        status: "PAID",
      },
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Payment verified",
    });
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Invalid signature",
    });
  }
});

export const getOrderDetailById = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const orderId = Number(id);
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, address: true },
    });

    if (!order) {
      return next(new ErrorHandler("Order not found", StatusCodes.NOT_FOUND));
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      order,
    });
  },
);
