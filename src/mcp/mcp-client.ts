import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createMcpClient = async () => {
  const serverPath = path.resolve(__dirname, "./mcp-server.js");

  const transport = new StdioClientTransport({
    command: "node",
    args: [serverPath],
    env: Object.fromEntries(
      Object.entries(process.env).filter(([, v]) => v !== undefined)
    ) as Record<string, string>,
  });

  const client = new Client({ name: "ecommerce-client", version: "1.0.0" }, {});
  await client.connect(transport);
  return client;
};

export const getMcpTools = async (client: Client) => {
  const { tools } = await client.listTools();
  return tools.map((tool) => ({
    type: "function" as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    },
  }));
};