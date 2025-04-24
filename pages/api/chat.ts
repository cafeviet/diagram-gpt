import { OpenAIStream, OpenRouterStream, DeepSeekStream } from "@/lib/utils";
import { type RequestBody } from "@/types/type";

export const config = {
  runtime: "edge",
};

export default async function chat(req: Request) {
  try {
    const { messages, model, apiKey, useOpenRouter, useDeepSeek } = (await req.json()) as RequestBody;

    let stream;
    
    if (useDeepSeek) {
      stream = await DeepSeekStream(messages, model, apiKey);
    } else if (useOpenRouter) {
      stream = await OpenRouterStream(messages, model, apiKey);
    } else {
      stream = await OpenAIStream(messages, model, apiKey);
    }

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
