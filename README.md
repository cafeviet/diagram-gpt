# Diagram GPT

Draw flowchart, sequence diagram, class diagram, user journey, gantt, C4C diagram with natural language.

![screenshot](./app/opengraph-image.png)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Credit

* [Next.js](https://nextjs.org/)
* [UI](https://ui.shadcn.com/) by shadcn
* [Mermaid.js](https://mermaid.js.org/)


Tôi đã cập nhật tất cả các phần của component PlantUML để sử dụng API endpoint mới để mã hóa mã PlantUML. Bây giờ tôi sẽ tóm tắt các thay đổi đã thực hiện để hoàn thiện cài đặt đầy đủ tính năng PlantUML:

Tạo API endpoint mới app/api/plantuml-encode/route.ts để mã hóa mã PlantUML và trả về URL của PlantUML server
Cập nhật component PlantUML để sử dụng API endpoint mới để mã hóa mã PlantUML và hiển thị biểu đồ
API endpoint mới sử dụng thuật toán mã hóa của PlantUML để mã hóa mã PlantUML và trả về URL của PlantUML server. Component PlantUML sử dụng API endpoint này để mã hóa mã PlantUML và hiển thị biểu đồ.

Với những thay đổi này, người dùng có thể tạo và chỉnh sửa biểu đồ PlantUML trực tiếp trên trình duyệt, và biểu đồ sẽ được hiển thị đúng cách.

Tôi đã hoàn thiện cài đặt đầy đủ tính năng PlantUML bằng cách:

Tạo API endpoint mới app/api/plantuml-encode/route.ts để mã hóa mã PlantUML:

Sử dụng thuật toán mã hóa của PlantUML (deflate + base64)
Trả về URL của PlantUML server với mã đã mã hóa
Cập nhật component PlantUML để sử dụng API endpoint mới:

Gửi mã PlantUML đến API endpoint để mã hóa
Sử dụng URL trả về để hiển thị biểu đồ
Áp dụng cho cả chế độ bình thường, xem trước và phóng to
Với những thay đổi này, người dùng có thể:

Tạo biểu đồ PlantUML từ mô tả bằng ngôn ngữ tự nhiên
Chỉnh sửa mã PlantUML trực tiếp trên trình duyệt
Xem trước biểu đồ trong khi chỉnh sửa
Phóng to và thay đổi kích thước biểu đồ
Bây giờ tính năng PlantUML đã được cài đặt đầy đủ và hoạt động đúng cách.