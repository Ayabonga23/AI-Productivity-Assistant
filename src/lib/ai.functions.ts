import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const InputSchema = z.object({
  system: z.string().min(1).max(4000),
  prompt: z.string().min(1).max(20000),
});

export const aiGenerate = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      throw new Error("AI service is not configured.");
    }
    const gateway = createLovableAiGatewayProvider(key);
    try {
      const { text } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system: data.system,
        prompt: data.prompt,
      });
      return { text };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "AI request failed";
      if (message.includes("429")) throw new Error("Rate limit reached. Please try again shortly.");
      if (message.includes("402"))
        throw new Error("AI credits exhausted. Add credits in your workspace billing settings.");
      throw new Error(message);
    }
  });
