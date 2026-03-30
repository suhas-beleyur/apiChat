import { useEffect, useRef } from "react";
import "../styles/ChatArea.css";
import { Message, StreamingMessage } from "./Message";
import Welcome from "./Welcome";
import ChatInput from "./ChatInput";

export default function ChatArea({ messages, loading, streamText, onSend }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText, loading]);

  const isEmpty = messages.length === 0 && !loading;

  return (
    <main className="chat-area">
      {/* Header */}
      <div className="chat-header">
        <span className="chat-title">Codeer — AI Assistant</span>
        <div className="header-actions">
          <button className="icon-btn" title="Share">⬆</button>
          <button className="icon-btn" title="Settings">⚙</button>
        </div>
      </div>

      {/* Body */}
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

      {/* Input */}
      <ChatInput onSend={onSend} disabled={loading} />
    </main>
  );
}
