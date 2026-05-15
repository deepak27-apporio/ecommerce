import OpenAI, { AzureOpenAI } from "openai";
import { createMcpClient, getMcpTools } from "../mcp/mcp-client.js";

const openai = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: "2024-12-01-preview",
  endpoint: "https://shipmozo.cognitiveservices.azure.com/",
});

export const aiSearch = async (userQuery: string) => {
  const mcpClient = await createMcpClient();
  const tools = await getMcpTools(mcpClient);

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are an ecommerce search assistant.
      Search products using available tools.
      Always respond with raw JSON only (no markdown, no code blocks): { "products": [], "message": "" }
      For prices, assume Indian Rupees (Rs).`,
    },
    { role: "user", content: userQuery },
  ];

  let response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    tools,
    tool_choice: "auto",
  });

  while (response.choices[0].finish_reason === "tool_calls") {
    const assistantMessage = response.choices[0].message;
    messages.push(assistantMessage);
    // console.log("response",response)
    const toolResults = await Promise.all(
      (assistantMessage.tool_calls ?? []).map(async (toolCall) => {
        const fn = (toolCall as any).function as {
          name: string;
          arguments: string;
        };
        const args = JSON.parse(fn.arguments);

        const result = await mcpClient.callTool({
          name: fn.name,
          arguments: args,
        });

        return {
          role: "tool" as const,
          tool_call_id: toolCall.id,
          content: JSON.stringify(result.content),
        };
      }),
    );

    messages.push(...toolResults);

    response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      tools,
      tool_choice: "auto",
    });
  }

  await mcpClient.close();
  const raw = response.choices[0].message
    .content!.trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  return JSON.parse(raw);
};
