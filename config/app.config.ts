export const appConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  defaultTimeout: 5000,
  maxFileSize: 1024 * 1024 * 5, // 5MB
  mermaidLiveUrl: 'https://mermaid.live/edit',
  apiEndpoint: '/api/uml'
};