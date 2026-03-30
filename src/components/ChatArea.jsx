import { useEffect, useRef, useState } from "react";
import "../styles/ChatArea.css";
import { Message, StreamingMessage } from "./Message";
import Welcome from "./Welcome";
import ChatInput from "./ChatInput";

export default function ChatArea({ messages, loading, streamText, onSend, onClearHistory, activeId }) {
  const bottomRef   = useRef(null);
  const settingsRef = useRef(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText, loading]);

  useEffect(() => {
    const handler = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClearHistory = () => {
    setSettingsOpen(false);
    onClearHistory?.();
  };

  const isEmpty = messages.length === 0 && !loading;

  return (
    <main className="chat-area">
      <div className="chat-header">
        <span className="chat-title">Codeer — AI Assistant</span>
        <div className="header-actions">
          <div className="settings-wrap" ref={settingsRef}>
            <button
              className={`icon-btn${settingsOpen ? " active-btn" : ""}`}
              title="Settings"
              onClick={() => setSettingsOpen((o) => !o)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>

            {settingsOpen && (
              <div className="settings-dropdown">
                <button className="settings-item danger" onClick={handleClearHistory}>
                  🗑 Clear all history
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isEmpty ? (
        <Welcome onSuggestion={onSend} />
      ) : (
        <div className="messages-container">
          {messages.map((m, i) => (
            <Message key={i} role={m.role} content={m.content} />
          ))}

          {(loading || streamText) && (
            <StreamingMessage text={streamText} />
          )}

          <div ref={bottomRef} />
        </div>
      )}

      <ChatInput onSend={onSend} disabled={loading} focusTrigger={activeId} />
    </main>
  );
}
