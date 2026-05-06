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
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));

    let finalAddressId: number;

    if (addressId) {
      const existingAddress = await prisma.address.findFirst({
        where: { id: addressId, userId },
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
    } else if (address) {
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
    } else {
      return next(
        new ErrorHandler("Address is required", StatusCodes.BAD_REQUEST),
      );
    }

    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    );
    const totalAmount = subtotal + (tax || 0) + (shipping || 0);

    const order = await prisma.order.create({
      data: {
        userId,
        addressId: finalAddressId,
        totalAmount,
        tax: tax || 0,
        shipping: shipping || 0,
        subtotal,
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
      data: { razorpayOrderId: razorpayOrder.id },
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      order: updatedOrder,
      razorpayOrder,
    });
  },
);

export const verifyPayment = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      method,
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      const failedOrder = await prisma.order.findUnique({
        where: { razorpayOrderId: razorpay_order_id },
      });

      if (failedOrder) {
        await prisma.payment.create({
          data: {
            orderId: failedOrder.id,
            razorpayPaymentId: razorpay_payment_id,
            razorpayOrderId: razorpay_order_id,
            razorpaySignature: razorpay_signature,
            amount: failedOrder.totalAmount,
            currency: "INR",
            status: "FAILED",
            method: method || null,
          },
        });

        await prisma.order.update({
          where: { id: failedOrder.id },
          data: { status: "PROCESSING" },
        });
      }

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid signature. Payment failed.",
      });
    }

    const order = await prisma.order.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!order) {
      return next(new ErrorHandler("Order not found", StatusCodes.NOT_FOUND));
    }

    const existingPayment = await prisma.payment.findUnique({
      where: { razorpayPaymentId: razorpay_payment_id },
    });

    if (existingPayment) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Payment already verified",
      });
    }

    await prisma.$transaction([
      prisma.payment.create({
        data: {
          orderId: order.id,
          razorpayPaymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          razorpaySignature: razorpay_signature,
          amount: order.totalAmount,
          currency: "INR",
          status: "SUCCESS",
          method: method || null,
        },
      }),

      prisma.order.update({
        where: { id: order.id },
        data: { status: "PROCESSING" },
      }),
    ]);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Payment verified successfully",
    });
  },
);

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

export const getAllOrders = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: true, address: true },
      orderBy: { createdAt: "desc" }
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      orders,
    });
  },
);
