import { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/client.js";
import ErrorHandler from "../../utils/errorClass.js";
import { storage } from "../../utils/storage.js";
import { tryCatch } from "../../middlewares/errorHandler.js";
import { StatusCodes } from "../../utils/apiResponse.js";

export const addProduct = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, category, stock } = req.body;

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return next(new ErrorHandler("At least one image is required", StatusCodes.BAD_REQUEST));
    }

    if (files.length > 5) {
      return next(new ErrorHandler("Max 5 images allowed", StatusCodes.BAD_REQUEST));
    }

    const uploadFiles = files.map((file) => ({
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
    }));

    const uploadedResults = await storage.uploadFiles(uploadFiles);

    const attachments = uploadedResults.map((file, index) => ({
      fileId: file.fileId,
      url: file.url,
      provider: file.provider,
      mimeType: files[index].mimetype,
      size: files[index].size,
    }));

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,

        attachments: {
          create: attachments,
        },
      },
      include: {
        attachments: true,
      },
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  },
);

export const updateProduct = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return next(new ErrorHandler("Invalid product ID", StatusCodes.BAD_REQUEST));
    }

    const { name, description, price, category, stock } = req.body;
    const files = req.files as Express.Multer.File[];
    const replaceImages = req.query.replace === "true";

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { attachments: true },
    });

    if (!product) {
      return next(new ErrorHandler("Product not found", StatusCodes.NOT_FOUND));
    }

    let attachmentsData;

    if (files && files.length > 0) {
      const uploadFiles = files.map((file) => ({
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
      }));

      const uploaded = await storage.uploadFiles(uploadFiles);

      const newAttachments = uploaded.map((file, index) => ({
        fileId: file.fileId,
        url: file.url,
        provider: file.provider,
        mimeType: files[index].mimetype,
        size: files[index].size,
      }));

      if (replaceImages) {
        await Promise.all(
          product.attachments.map((img) => storage.deleteFile(img.fileId)),
        );

        attachmentsData = {
          deleteMany: {},
          create: newAttachments,
        };
      } else {
        attachmentsData = {
          create: newAttachments,
        };
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: Number(price) }),
        ...(category && { category }),
        ...(stock && { stock: Number(stock) }),
        ...(attachmentsData && { attachments: attachmentsData }),
      },
      include: { attachments: true },
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  },
);

export const deleteProduct = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { attachments: true },
    });

    if (!product) {
      return next(new ErrorHandler("Product not found", StatusCodes.NOT_FOUND));
    }

    for (const file of product.attachments) {
      await storage.deleteFile(file.url);
    }

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Product deleted successfully",
    });
  },
);

export const getProduct = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { attachments: true },
    });
    if (!product) {
      return next(new ErrorHandler("Product not found", StatusCodes.NOT_FOUND));
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  },
);

export const getAllProducts = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      page = "1",
      limit = "10",
      search = "",
      sortBy = "createdAt",
    } = req.query;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};
    if (typeof search === "string" && search.trim() !== "") {
      filter.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    const allowedSortFields = ["createdAt", "name", "price"];
    const sortField = allowedSortFields.includes(sortBy as string)
      ? (sortBy as string)
      : "createdAt";

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filter,
        include: { attachments: true },
        orderBy: { [sortField]: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where: filter }),
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    });
  },
);
