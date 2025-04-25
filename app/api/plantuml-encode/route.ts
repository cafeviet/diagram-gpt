import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    
    if (!code) {
      return NextResponse.json({ error: "No PlantUML code provided" }, { status: 400 });
    }
    
    // Đảm bảo mã PlantUML có @startuml và @enduml
    let processedCode = code;
    if (!processedCode.includes('@startuml')) {
      processedCode = '@startuml\n' + processedCode;
    }
    if (!processedCode.includes('@enduml')) {
      processedCode = processedCode + '\n@enduml';
    }
    
    // Mã hóa PlantUML bằng cách đơn giản: sử dụng URL với tham số text
    const encodedContent = encodeURIComponent(processedCode);
    // const plantumlEncoder = require('plantuml-encoder');
    // const encodeAI = plantumlEncoder.encode(processedCode);
    const url = `https://www.plantuml.com/plantuml/png?text=${encodedContent}`;
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error encoding PlantUML:", error);
    return NextResponse.json({ error: "Failed to encode PlantUML" }, { status: 500 });
  }
}