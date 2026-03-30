export const SUGGESTIONS = [
  { icon: "⚡", title: "Write code",     sub: "Generate scripts & functions" },
  { icon: "🔍", title: "Debug errors",   sub: "Analyze & fix your code"      },
  { icon: "📝", title: "Explain concepts", sub: "Break down complex topics"  },
  { icon: "🚀", title: "Optimize",       sub: "Improve performance & speed"  },
];

export const MOCK_HISTORY = [
  "React hook optimization tips",
  "Python FastAPI tutorial",
  "TypeScript generics explained",
  "Fix CORS error in Node.js",
];

export const MODEL_NAME = "tiiuae/falcon3-7b-instruct";

// Use Vite's dev proxy (/api/nvidia → https://integrate.api.nvidia.com)
// This avoids CORS errors when calling the API directly from the browser.
export const API_BASE = "/api/chat";
