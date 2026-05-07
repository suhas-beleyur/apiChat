import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import { useChatStore } from "./hooks/useChatStore";

export default function App() {
  const {
    sessions,
    activeId,
    messages,
    loading,
    streamText,
    sendMessage,
    startNewChat,
    loadSession,
    clearHistory,
  } = useChatStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when a session is loaded (mobile UX)
  const handleLoadSession = (id) => {
    loadSession(id);
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    startNewChat();
    setSidebarOpen(false);
  };

  return (
    <div className="app">
      {/* Hamburger toggle for mobile */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen((o) => !o)}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        )}
      </button>

      {/* Backdrop overlay for mobile sidebar */}
      <div
        className={`sidebar-overlay${sidebarOpen ? " visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onNewChat={handleNewChat}
        onLoadSession={handleLoadSession}
        isOpen={sidebarOpen}
      />
      <ChatArea
        messages={messages}
        loading={loading}
        streamText={streamText}
        onSend={sendMessage}
        onClearHistory={clearHistory}
        activeId={activeId}
      />
    </div>
  );
}
