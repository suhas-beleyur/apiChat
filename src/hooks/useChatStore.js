import { useState, useRef, useEffect } from "react";
import { API_BASE, MODEL_NAME } from "../constants";

const API_KEY     = import.meta.env.VITE_NVIDIA_KEY?.trim() || "";
const STORAGE_KEY = "codeer_sessions";
const ACTIVE_KEY  = "codeer_active_id";

function loadSessions() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function loadActiveId() {
  return localStorage.getItem(ACTIVE_KEY) || null;
}

const SYSTEM_MSG = {
  role: "system",
  content: `You are Codeer, a friendly and humble AI coding assistant. 
Your personality:
- Warm, encouraging, and patient — never condescending
- Honest about uncertainty ("I'm not 100% sure, but here's what I think...")
- Celebrate the user's progress and effort
- Guide step-by-step when someone is stuck
- Keep answers focused and practical
- Use simple language, avoid unnecessary jargon
Always be approachable. The user is your teammate, not a student.`,
};

export function useChatStore() {
  const [sessions, setSessions]     = useState(loadSessions);
  const [activeId, setActiveId]     = useState(loadActiveId);
  const [loading, setLoading]       = useState(false);
  const [streamText, setStreamText] = useState("");

  const sessionsRef = useRef(sessions);
  const activeIdRef = useRef(activeId);
  sessionsRef.current = sessions;
  activeIdRef.current = activeId;

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions)); }
    catch {}
  }, [sessions]);

  useEffect(() => {
    if (activeId) localStorage.setItem(ACTIVE_KEY, activeId);
    else          localStorage.removeItem(ACTIVE_KEY);
  }, [activeId]);

  const activeSession = sessions.find((s) => s.id === activeId) ?? null;
  const messages      = activeSession?.messages ?? [];

  const updateSession = (id, updater) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updater(s) } : s))
    );
  };

  const startNewChat = () => {
    setActiveId(null);
    setStreamText("");
  };

  const loadSession = (id) => {
    setActiveId(id);
    setStreamText("");
  };

  const clearHistory = () => {
    setSessions([]);
    setActiveId(null);
    setStreamText("");
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_KEY);
  };

  const sendMessage = async (userText) => {
    const text = userText?.trim();
    if (!text || loading) return;

    if (!API_KEY) {
      const noKeyMsg = {
        role: "assistant",
        content: "⚠️ No API key found. Add VITE_NVIDIA_KEY to your .env and restart the server.",
      };
      const curId = activeIdRef.current;
      if (!curId) {
        const id = Date.now().toString();
        setSessions((prev) => [
          { id, title: text.slice(0, 50), messages: [{ role: "user", content: text }, noKeyMsg] },
          ...prev,
        ]);
        setActiveId(id);
      } else {
        updateSession(curId, (s) => ({
          messages: [...s.messages, { role: "user", content: text }, noKeyMsg],
        }));
      }
      return;
    }

    let sessionId = activeIdRef.current;
    const userMsg = { role: "user", content: text };

    if (!sessionId) {
      sessionId = Date.now().toString();
      setSessions((prev) => [
        { id: sessionId, title: text.slice(0, 50), messages: [userMsg] },
        ...prev,
      ]);
      setActiveId(sessionId);
    } else {
      updateSession(sessionId, (s) => ({
        messages: [...s.messages, userMsg],
      }));
    }

    setLoading(true);
    setStreamText("");

    try {
      const capturedSessionId = sessionId;

      const sessionAtSend = sessionsRef.current.find((s) => s.id === capturedSessionId);
      const historyForApi = sessionAtSend ? [...sessionAtSend.messages] : [userMsg];

      const apiMessages =
        historyForApi[historyForApi.length - 1]?.content === text &&
        historyForApi[historyForApi.length - 1]?.role === "user"
          ? historyForApi
          : [...historyForApi, userMsg];

      const response = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [SYSTEM_MSG, ...apiMessages],
          temperature: 0.3,
          top_p: 0.7,
          max_tokens: 1024,
          stream: true,
        }),
      });

      if (!response.ok) {
        let hint = `Server error ${response.status}.`;
        if (response.status === 401 || response.status === 403)
          hint = "⚠️ Invalid API key (401). Check VITE_NVIDIA_KEY in .env.";
        else if (response.status === 429)
          hint = "⚠️ Rate limit reached. Wait a moment and try again.";
        throw new Error(hint);
      }

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText  = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder
          .decode(value)
          .split("\n")
          .filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const delta  = parsed.choices?.[0]?.delta?.content || "";
            fullText    += delta;
            setStreamText(fullText);
          } catch {}
        }
      }

      updateSession(capturedSessionId, (s) => ({
        messages: [...s.messages, { role: "assistant", content: fullText }],
      }));
    } catch (err) {
      const capturedSessionId = sessionId;
      updateSession(capturedSessionId, (s) => ({
        messages: [
          ...s.messages,
          { role: "assistant", content: err.message || "⚠️ Error connecting to the model." },
        ],
      }));
    } finally {
      setStreamText("");
      setLoading(false);
    }
  };

  return {
    sessions,
    activeId,
    messages,
    loading,
    streamText,
    sendMessage,
    startNewChat,
    loadSession,
    clearHistory,
  };
}
