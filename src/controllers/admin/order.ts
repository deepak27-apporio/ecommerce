import { NextFunction, Request, Response } from "express";
import { tryCatch } from "../../middlewares/errorHandler.js";
import { prisma } from "../../utils/client.js";
import { StatusCodes } from "../../utils/apiResponse.js";
import ErrorHandler from "../../utils/errorClass.js";

export const getAllOrders = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      page = "1",
      limit = "10",
      search = "",
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query as Record<string, string>;

    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {
      ...(status && { status }),
      ...(search && {
        OR: [
          ...(!isNaN(parseInt(search)) ? [{ id: parseInt(search) }] : []),
          { razorpayOrderId: { contains: search, mode: "insensitive" } },
          { user: { name: { contains: search, mode: "insensitive" } } },
          { user: { email: { contains: search, mode: "insensitive" } } },
          { address: { phone: { contains: search, mode: "insensitive" } } },
        ],
      }),
    };

    const [totalOrders, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: {
          items: true,
          address: true,
          payment: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limitNumber,
      }),
    ]);

    const totalPages = Math.ceil(totalOrders / limitNumber);

    return res.status(StatusCodes.OK).json({
      success: true,
      orders,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    });
  },
);

export const updateOrderStatus = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;
    console.log("Updating order", id, "to status", status);

    const order = await prisma.order.findUnique({ where: { id:Number(id) } });

    if (!order)
      return next(new ErrorHandler("Order not found", StatusCodes.NOT_FOUND));

    if (order.status.toLocaleLowerCase() === "cancelled")
      return next(
        new ErrorHandler(
          "Cannot update a cancelled order",
          StatusCodes.BAD_REQUEST,
        ),
      );

    const updatedOrder = await prisma.order.update({
      where: { id:Number(id) },
      data: { status: status.toUpperCase() },
      include: {
        items: true,
        address: true,
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return res.status(StatusCodes.OK).json({
      success: true,
      order: updatedOrder,
    });
  },
);
