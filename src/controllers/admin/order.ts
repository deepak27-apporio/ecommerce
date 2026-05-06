import { NextFunction, Request, Response } from "express";
import { tryCatch } from "../../middlewares/errorHandler.js";
import { prisma } from "../../utils/client.js";
import { StatusCodes } from "../../utils/apiResponse.js";

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
          { id: { contains: search, mode: "insensitive" } },
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
