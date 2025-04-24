export type OpenAIModel = "gpt-3.5-turbo" | "gpt-4";
export type DeepSeekModel = "deepseek-chat" | "deepseek-coder" | "deepseek-llm-7b" | "deepseek-llm-67b";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface RequestBody {
  messages: Message[];
  model: OpenAIModel | DeepSeekModel;
  apiKey: string;
  useOpenRouter?: boolean;
  useDeepSeek?: boolean;
}

export type Theme = "default" | "neutral" | "dark" | "forest" | "base";
