# Kiến trúc hệ thống Diagram GPT

## Tổng quan
Hệ thống Diagram GPT là ứng dụng web cho phép tạo và hiển thị các loại diagram (UML, flow chart...) từ mô tả bằng ngôn ngữ tự nhiên. Hệ thống hỗ trợ 2 loại diagram chính:
1. PlantUML
2. Mermaid.js

## Kiến trúc tổng thể
```
Frontend (Next.js) → API Routes → AI Service (OpenAI/OpenRouter/DeepSeek) → Hiển thị kết quả
```

## Chi tiết các thành phần

### 1. API Routes
- `/api/uml/route.ts`: Xử lý yêu cầu tạo PlantUML
  - Nhận input từ user (messages, model, apiKey)
  - Tạo system prompt chuẩn cho PlantUML
  - Gọi API AI tương ứng (OpenAI/OpenRouter/DeepSeek)
  - Trả về stream response

### 2. Frontend Components
#### PlantUML Component
- Kết nối với server PlantUML localhost:8080
- Tính năng:
  - Hiển thị diagram từ mã PlantUML
  - Hỗ trợ nhiều theme (default, plain, dark...)
  - Chỉnh sửa trực tiếp
  - Phóng to/thu nhỏ
  - Copy diagram

#### Mermaid Component
- Sử dụng thư viện mermaid.js
- Tính năng:
  - Render diagram trực tiếp trên client
  - Hỗ trợ nhiều theme (default, neutral, dark...)
  - Chỉnh sửa trực tiếp
  - Phóng to/thu nhỏ
  - Copy diagram SVG

### 3. Luồng dữ liệu
1. User nhập yêu cầu → Gửi đến API route
2. API route xử lý và gọi AI service
3. Kết quả trả về (PlantUML/Mermaid code)
4. Frontend hiển thị diagram tương ứng

## Công nghệ sử dụng
- Next.js 13 (App Router)
- React
- Tailwind CSS
- Mermaid.js
- PlantUML
- OpenAI API/OpenRouter/DeepSeek