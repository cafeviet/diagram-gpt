"use client";

import { useAtom } from "jotai";
import { type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { apiKeyAtom, modelAtom, openRouterAtom, deepSeekAtom, deepSeekModelAtom } from "@/lib/atom";
import type { OpenAIModel, DeepSeekModel } from "@/types/type";

export const APIKeyInput = () => {
  const [apiKey, setApiKey] = useAtom(apiKeyAtom);
  const [model, setModel] = useAtom(modelAtom);
  const [deepSeekModel, setDeepSeekModel] = useAtom(deepSeekModelAtom);
  const [openRouter, setOpenRouter] = useAtom(openRouterAtom);
  const [deepSeek, setDeepSeek] = useAtom(deepSeekAtom);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setApiKey(e.target.value);

  const handleModelChange = (value: OpenAIModel) => {
    setModel(value);
  };

  const handleDeepSeekModelChange = (value: DeepSeekModel) => {
    setDeepSeekModel(value);
  };

  const handleSave = () => {
    localStorage.setItem("apiKey", apiKey);
    localStorage.setItem("model", model);
    localStorage.setItem("deepSeekModel", deepSeekModel);
    localStorage.setItem("openRouter", String(openRouter));
    localStorage.setItem("deepSeek", String(deepSeek));
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <div>
        <Label htmlFor="api-key">OpenAI API key</Label>
        <Input
          type="password"
          id="api-key"
          placeholder="OpenAI API Key"
          value={apiKey}
          onChange={handleChange}
          className="mt-2"
        />

        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="openrouter"
              checked={openRouter}
              onChange={(e) => {
                setOpenRouter(e.target.checked);
                if (e.target.checked) {
                  setDeepSeek(false);
                }
              }}
            />
            <label htmlFor="openrouter">Use OpenRouter</label>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="deepseek"
              checked={deepSeek}
              onChange={(e) => {
                setDeepSeek(e.target.checked);
                if (e.target.checked) {
                  setOpenRouter(false);
                }
              }}
            />
            <label htmlFor="deepseek">Use DeepSeek</label>
          </div>
        </div>
      </div>

      <div className="mb-2">
        {!deepSeek ? (
          <>
            <Label htmlFor="model">OpenAI model</Label>
            <Select value={model} onValueChange={handleModelChange}>
              <SelectTrigger className="w-[180px] mt-2">
                <SelectValue id="model" placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">gpt-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
              </SelectContent>
            </Select>
          </>
        ) : (
          <>
            <Label htmlFor="deepseek-model">DeepSeek model</Label>
            <Select value={deepSeekModel} onValueChange={handleDeepSeekModelChange}>
              <SelectTrigger className="w-[180px] mt-2">
                <SelectValue id="deepseek-model" placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deepseek-chat">deepseek-chat</SelectItem>
                <SelectItem value="deepseek-coder">deepseek-coder</SelectItem>
                <SelectItem value="deepseek-llm-7b">deepseek-llm-7b</SelectItem>
                <SelectItem value="deepseek-llm-67b">deepseek-llm-67b</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
      </div>
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};
