"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";

import { apiKeyAtom, modelAtom, openRouterAtom, deepSeekAtom, deepSeekModelAtom } from "@/lib/atom";
import { Mermaid } from "@/components/Mermaids";
import { ChatInput } from "@/components/ChatInput";
import { CodeBlock } from "@/components/CodeBlock";
import { ChatMessage } from "@/components/ChatMessage";
import type { Message, RequestBody } from "@/types/type";
import { parseCodeFromMessage } from "@/lib/utils";
import type { OpenAIModel, DeepSeekModel } from "@/types/type";

export default function Home() {
  const [apiKey, setApiKey] = useAtom(apiKeyAtom);
  const [model, setModel] = useAtom(modelAtom);
  const [deepSeekModel, setDeepSeekModel] = useAtom(deepSeekModelAtom);
  const [openRouter, setOpenRouter] = useAtom(openRouterAtom);
  const [deepSeek, setDeepSeek] = useAtom(deepSeekAtom);
  const [draftMessage, setDraftMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [draftOutputCode, setDraftOutputCode] = useState<string>("");
  const [outputCode, setOutputCode] = useState<string>("");

  useEffect(() => {
    const apiKey = localStorage.getItem("apiKey");
    const model = localStorage.getItem("model");
    const deepSeekModel = localStorage.getItem("deepSeekModel");
    const openRouter = localStorage.getItem("openRouter");
    const deepSeek = localStorage.getItem("deepSeek");

    if (apiKey) {
      setApiKey(apiKey);
    }
    if (model) {
      setModel(model as OpenAIModel);
    }
    if (deepSeekModel) {
      setDeepSeekModel(deepSeekModel as DeepSeekModel);
    }
    if (openRouter) {
      setOpenRouter(openRouter === "true");
    }
    if (deepSeek) {
      setDeepSeek(deepSeek === "true");
    }
  }, []);

  const handleSubmit = async () => {
    if (!apiKey) {
      alert("Please enter an API key.");
      return;
    }

    if (!draftMessage) {
      alert("Please enter a message.");
      return;
    }

    const newMessage: Message = {
      role: "user",
      content: draftMessage,
    };
    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setDraftMessage("");
    setDraftOutputCode("");

    const controller = new AbortController();
    const selectedModel = deepSeek ? deepSeekModel : model;
    const body: RequestBody = {
      messages: newMessages,
      model: selectedModel,
      apiKey,
      useOpenRouter: openRouter,
      useDeepSeek: deepSeek
    };

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      alert("Something went wrong.");
      return;
    }

    const data = response.body;

    if (!data) {
      alert("Something went wrong.");
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let code = "";
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      code += chunkValue;
      setDraftOutputCode((prevCode) => prevCode + chunkValue);
    }
    setOutputCode(parseCodeFromMessage(code));
  };

  return (
    <main className="container flex-1 w-full flex flex-wrap">
      <div className="flex border md:border-r-0 flex-col justify-between w-full md:w-1/2">
        <div className="">
          <div className="">
            {messages.map((message) => {
              return (
                <ChatMessage key={message.content} message={message.content} />
              );
            })}
          </div>
        </div>
        <div className="w-full p-2">
          <ChatInput
            messageCotent={draftMessage}
            onChange={setDraftMessage}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
      <div className="border w-full md:w-1/2 p-2 flex flex-col">
        <CodeBlock code={draftOutputCode} />

        <div className="flex-1 flex justify-center border relative">
          <Mermaid chart={outputCode} />
        </div>
      </div>
    </main>
  );
}
