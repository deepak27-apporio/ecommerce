import { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/client.js";
import ErrorHandler from "../../utils/errorClass.js";
import { storage } from "../../utils/storage.js";
import { tryCatch } from "../../middlewares/errorHandler.js";
import { StatusCodes } from "../../utils/apiResponse.js";
// import Anthropic from "@anthropic-ai/sdk";

export const addProduct = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, category, stock } = req.body;

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return next(
        new ErrorHandler(
          "At least one image is required",
          StatusCodes.BAD_REQUEST,
        ),
      );
    }

    if (files.length > 5) {
      return next(
        new ErrorHandler("Max 5 images allowed", StatusCodes.BAD_REQUEST),
      );
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
      return next(
        new ErrorHandler("Invalid product ID", StatusCodes.BAD_REQUEST),
      );
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
      order = "desc",
      category = "",
      minPrice,
      maxPrice,
    } = req.query;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const sortOrder = order === "asc" ? "asc" : "desc";

    const allowedSortFields = ["createdAt", "name", "price"];
    const sortField = allowedSortFields.includes(sortBy as string)
      ? (sortBy as string)
      : "createdAt";

    const andConditions: any[] = [];

    if (typeof search === "string" && search.trim() !== "") {
      andConditions.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { category: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (typeof category === "string" && category.trim() !== "") {
      const categories = category
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      andConditions.push({
        category: {
          in: categories,
          mode: "insensitive",
        },
      });
    }

    const priceFilter: any = {};
    if (minPrice !== undefined && !isNaN(Number(minPrice))) {
      priceFilter.gte = Number(minPrice);
    }
    if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
      priceFilter.lte = Number(maxPrice);
    }
    if (Object.keys(priceFilter).length > 0) {
      andConditions.push({ price: priceFilter });
    }

    const filter = andConditions.length > 0 ? { AND: andConditions } : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filter,
        include: { attachments: true },
        orderBy: { [sortField]: sortOrder },
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where: filter }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(StatusCodes.OK).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  },
);

// const anthropic = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY!,
// });

// export const aiSearchProducts = tryCatch(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { query } = req.body;

//     if (!query?.trim()) {
//       return next(new ErrorHandler("Query required", StatusCodes.BAD_REQUEST));
//     }

//     // ✅ Claude se filters nikalo
//     const message = await anthropic.messages.create({
//       model: "claude-sonnet-4-20250514",
//       max_tokens: 300,
//       messages: [{
//         role: "user",
//         content: `You are a search filter extractor for an ecommerce store.
// Extract filters from: "${query}"

// Available categories: electronics, headphones, jeans, shoes, clothing, mobiles, laptops

// Return ONLY valid JSON, no extra text:
// {
//   "search": "keyword or empty string",
//   "category": "category name or empty string",
//   "minPrice": null or number,
//   "maxPrice": null or number,
//   "sortBy": "createdAt",
//   "order": "desc"
// }`,
//       }],
//     });

//     // ✅ Parse Claude response
//     let filters: any = { search: query };
//     try {
//       const text = message.content[0].type === "text"
//         ? message.content[0].text : "{}";
//       filters = JSON.parse(text.replace(/```json|```/g, "").trim());
//     } catch {
//       filters = { search: query };
//     }

//     // ✅ Tumhara existing logic same use karo
//     const limitNum = 20;
//     const allowedSortFields = ["createdAt", "name", "price"];
//     const sortField = allowedSortFields.includes(filters.sortBy)
//       ? filters.sortBy : "createdAt";
//     const sortOrder = filters.order === "asc" ? "asc" : "desc";

//     const andConditions: any[] = [];

//     if (filters.search?.trim()) {
//       andConditions.push({
//         OR: [
//           { name: { contains: filters.search, mode: "insensitive" } },
//           { description: { contains: filters.search, mode: "insensitive" } },
//           { category: { contains: filters.search, mode: "insensitive" } },
//         ],
//       });
//     }

//     if (filters.category?.trim()) {
//       const categories = filters.category
//         .split(",").map((c: string) => c.trim()).filter(Boolean);
//       andConditions.push({
//         OR: categories.map((cat: string) => ({
//           category: { equals: cat, mode: "insensitive" },
//         })),
//       });
//     }

//     const priceFilter: any = {};
//     if (filters.minPrice != null && !isNaN(Number(filters.minPrice))) {
//       priceFilter.gte = Number(filters.minPrice);
//     }
//     if (filters.maxPrice != null && !isNaN(Number(filters.maxPrice))) {
//       priceFilter.lte = Number(filters.maxPrice);
//     }
//     if (Object.keys(priceFilter).length > 0) {
//       andConditions.push({ price: priceFilter });
//     }

//     const where = andConditions.length > 0 ? { AND: andConditions } : {};

//     const [products, total] = await Promise.all([
//       prisma.product.findMany({
//         where,
//         include: { attachments: true },
//         orderBy: { [sortField]: sortOrder },
//         take: limitNum,
//       }),
//       prisma.product.count({ where }),
//     ]);

//     return res.status(StatusCodes.OK).json({
//       success: true,
//       data: products,
//       filters, // ← frontend ko dikhao kya samjha Claude ne
//       pagination: {
//         total,
//         page: 1,
//         limit: limitNum,
//         totalPages: Math.ceil(total / limitNum),
//         hasNextPage: false,
//         hasPrevPage: false,
//       },
//     });
//   }
// );
