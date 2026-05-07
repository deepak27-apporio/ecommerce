import { NextFunction, Request, Response } from "express";
import { tryCatch } from "../../middlewares/errorHandler.js";
import { prisma } from "../../utils/client.js";
import { StatusCodes } from "../../utils/apiResponse.js";

export const getDashboardDetail = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const [
      totalRevenueData,
      totalOrders,
      totalProduct,
      totalUser,
      totalMale,
      totalFemale,
      categoryStock
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalAmount: true },
      }),
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.user.count({ where: { gender: "male" } }),
      prisma.user.count({ where: { gender: "female" } }),
      prisma.product.groupBy({          // ✅
        by: ["category"],
        _sum: { stock: true },
        _count: { id: true },
      })
    ]);
    const totalRevenue = parseFloat(
      (totalRevenueData._sum.totalAmount ?? 0).toFixed(2)
    );
    return res.status(StatusCodes.OK).json({
      totalRevenue,
      totalOrders,
      totalProduct,
      totalUser,
      totalMale,
      totalFemale,
      categoryStock: categoryStock.map((c) => ({
        category: c.category,
        totalStock: c._sum.stock ?? 0,
        totalProducts: c._count.id,
      })),
    });
  },
);
