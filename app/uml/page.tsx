"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";

import { apiKeyAtom, modelAtom, openRouterAtom, deepSeekAtom, deepSeekModelAtom } from "@/lib/atom";
import { appConfig } from "@/config/app.config";
import { uiConfig } from "@/config/ui.config";
import { PlantUML } from "@/components/PlantUML";
import { ChatInput } from "@/components/ChatInput";
import { CodeBlock } from "@/components/CodeBlock";
import { ChatMessage } from "@/components/ChatMessage";
import type { Message, RequestBody } from "@/types/type";
import { parsePlantUMLCodeFromMessage } from "@/lib/utils";
import type { OpenAIModel, DeepSeekModel } from "@/types/type";

export default function UMLPage() {
  const [apiKey, setApiKey] = useAtom(apiKeyAtom);
  const [model, setModel] = useAtom(modelAtom);
  const [deepSeekModel, setDeepSeekModel] = useAtom(deepSeekModelAtom);
  const [openRouter, setOpenRouter] = useAtom(openRouterAtom);
  const [deepSeek, setDeepSeek] = useAtom(deepSeekAtom);
  const [draftMessage, setDraftMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [draftOutputCode, setDraftOutputCode] = useState<string>("");
  const [outputCode, setOutputCode] = useState<string>("");
  const [isLocalEdit, setIsLocalEdit] = useState<boolean>(false);
  const [hideAICode, setHideAICode] = useState<boolean>(false);
  const [hideUMLFrame, setHideUMLFrame] = useState<boolean>(false);

  useEffect(() => {
    const apiKey = localStorage.getItem("apiKey");
    const model = localStorage.getItem("model");
    const deepSeekModel = localStorage.getItem("deepSeekModel");
    const openRouter = localStorage.getItem("openRouter");
    const deepSeek = localStorage.getItem("deepSeek");
    const hideAICode = localStorage.getItem("hideAICodeUML");
    const hideUMLFrame = localStorage.getItem("hideUMLFrame");

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
    if (hideAICode) {
      setHideAICode(hideAICode === "true");
    }
    if (hideUMLFrame) {
      setHideUMLFrame(hideUMLFrame === "true");
    }
  }, []);
  
  const toggleHideAICode = () => {
    const newValue = !hideAICode;
    setHideAICode(newValue);
    localStorage.setItem("hideAICodeUML", newValue.toString());
  };
  
  const toggleHideUMLFrame = () => {
    const newValue = !hideUMLFrame;
    setHideUMLFrame(newValue);
    localStorage.setItem("hideUMLFrame", newValue.toString());
  };

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

    const response = await fetch(appConfig.apiEndpoint, {
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
    const parsedCode = parsePlantUMLCodeFromMessage(code);
    console.log("Parsed PlantUML code:", parsedCode);
    setOutputCode(parsedCode);
    setIsLocalEdit(false);
  };

  return (
    <main className={`container flex-1 w-full flex flex-wrap ${hideAICode ? 'justify-center' : ''}`}>
      {!hideAICode && (
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
      )}
      <div className={`border w-full p-2 flex flex-col ${hideAICode ? 'md:w-full' : 'md:w-1/2'} ${hideUMLFrame ? 'hidden' : ''}`}>
        <div className="flex justify-between items-center p-2 border-b">
          <h2 className="text-lg font-semibold">PlantUML Diagram</h2>
          <div className="flex items-center">
            <button
              className="mr-2 px-2 py-1 rounded text-xs hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: uiConfig.theme.background.light,
                color: uiConfig.theme.secondaryColor
              }}
              onClick={toggleHideAICode}
              title={hideAICode ? "Hiển thị phần AI code" : "Ẩn phần AI code"}
            >
              {hideAICode ? uiConfig.language.showAICode : uiConfig.language.hideAICode}
            </button>
            <span className={`px-2 py-1 rounded text-xs mr-2 ${isLocalEdit ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
              {isLocalEdit ? uiConfig.language.localEditMode : uiConfig.language.aiGenerated}
            </span>
          </div>
        </div>
        
        <CodeBlock code={draftOutputCode} />

        <div className="flex-1 flex justify-center border relative">
          <PlantUML
            chart={outputCode}
            onChartChange={(newChart) => {
              setOutputCode(newChart);
              setIsLocalEdit(true);
            }}
            isHidden={hideUMLFrame}
          />
        </div>
      </div>
      
      {/* Nút điều khiển hiển thị UML frame */}
      <div className="fixed bottom-4 right-4 z-10">
        <button
          className="text-white px-3 py-2 rounded-full shadow-lg flex items-center hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: uiConfig.theme.accentColor
          }}
          onClick={toggleHideUMLFrame}
          title={hideUMLFrame ? "Hiển thị biểu đồ UML" : "Ẩn biểu đồ UML"}
        >
          {hideUMLFrame ? uiConfig.language.showDiagram : uiConfig.language.hideDiagram}
        </button>
      </div>
    </main>
  );
}