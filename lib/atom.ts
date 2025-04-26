import { atom } from "jotai";
import { loadable } from "jotai/utils";
 
import type { OpenAIModel, DeepSeekModel } from "@/types/type";

const getInitialValue = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    try {
      return JSON.parse(item);
    } catch {
      return item as T;
    }
  } catch {
    return defaultValue;
  }
};

export const apiKeyAtom = atom<string>(
  getInitialValue("apiKey", "")
);

export const modelAtom = atom<OpenAIModel>(
  getInitialValue("model", "gpt-3.5-turbo")
);

export const deepSeekModelAtom = atom<DeepSeekModel>(
  getInitialValue("deepSeekModel", "deepseek-chat")
);

export const openRouterAtom = atom<boolean>(
  getInitialValue("openRouter", false)
);

export const deepSeekAtom = atom<boolean>(
  getInitialValue("deepSeek", false)
);

export const hideAICodeAtom = atom<boolean>(
  getInitialValue("hideAICode", false)
);

export const hideMermaidFrameAtom = atom<boolean>(
  getInitialValue("hideMermaidFrame", false)
);
