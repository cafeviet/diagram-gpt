import { atom } from "jotai";

import type { OpenAIModel, DeepSeekModel } from "@/types/type";

export const apiKeyAtom = atom("");
export const modelAtom = atom<OpenAIModel>("gpt-3.5-turbo");
export const deepSeekModelAtom = atom<DeepSeekModel>("deepseek-chat");

export const openRouterAtom = atom(false);
export const deepSeekAtom = atom(false);
