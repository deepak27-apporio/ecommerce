import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { prisma } from "../utils/client.js";

const server = new McpServer({ name: "ecommerce", version: "1.0.0" });

server.tool(
  "search_products",
  "Search products by name, category or description",
  {
    query: z.string(),
    category: z.string().optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    limit: z.number().optional().default(10),
  },
  async ({ query, category, minPrice, maxPrice, limit }) => {
    const keywords = query
      .toLowerCase()
      .split(" ")
      .filter((w) => w.length > 2);

    const andConditions: any[] = [
      { isActive: true },
      {
        OR: keywords.flatMap((keyword) => [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
          { category: { contains: keyword, mode: "insensitive" } },
        ]),
      },
    ];

    if (category) andConditions.push({ category: { equals: category, mode: "insensitive" } });
    if (minPrice) andConditions.push({ price: { gte: minPrice } });
    if (maxPrice) andConditions.push({ price: { lte: maxPrice } });

    const products = await prisma.product.findMany({
      where: { AND: andConditions },
      include: { attachments: true },
      take: limit,
    });

    return {
      content: [{ type: "text", text: JSON.stringify(products) }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);