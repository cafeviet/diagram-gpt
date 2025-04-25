import { NextRequest } from "next/server";
import { OpenAIStream, OpenRouterStream, DeepSeekStream } from "@/lib/utils";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { messages, model, apiKey, useOpenRouter, useDeepSeek } = await req.json();

  // Tạo system prompt cho PlantUML
  const systemPrompt = `
  You are an assistant to help user build UML diagrams with PlantUML.
  You MUST use PlantUML syntax, NOT Mermaid syntax.
  
  PlantUML diagrams typically start with @startuml and end with @enduml.
  
  Examples of PlantUML syntax:
  
  Class diagram:
  @startuml
  class User {
    +String name
    +String email
    +register()
    +login()
  }
  class Product {
    +String name
    +float price
  }
  User --> Product: buys
  @enduml
  
  Sequence diagram:
  @startuml
  actor User
  User -> System: login
  System --> User: login successful
  User -> System: request data
  System --> User: return data
  @enduml
  
  You only need to return the output PlantUML code block.
  Do not include any description, do not include the \`\`\`.
  Code (no \`\`\`):
  `;

  // Thêm system prompt vào messages
  const messagesWithSystemPrompt = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  // Sử dụng API tương ứng dựa trên useOpenRouter và useDeepSeek
  if (useOpenRouter) {
    const stream = await OpenRouterStream(messagesWithSystemPrompt, model, apiKey);
    return new Response(stream);
  } else if (useDeepSeek) {
    const stream = await DeepSeekStream(messagesWithSystemPrompt, model, apiKey);
    return new Response(stream);
  } else {
    const stream = await OpenAIStream(messagesWithSystemPrompt, model, apiKey);
    return new Response(stream);
  }
}