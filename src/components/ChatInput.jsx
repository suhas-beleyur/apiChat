import { useState, useEffect } from "react";
import "../styles/ChatInput.css";
import { useAutoResize } from "../hooks/useAutoResize";

export default function ChatInput({ onSend, disabled, focusTrigger }) {
  const [input, setInput] = useState("");
  const { ref, resize, reset } = useAutoResize();

  // Auto-focus on mount, after sending, and when focusTrigger changes
  useEffect(() => {
    if (!disabled) ref.current?.focus();
  }, [focusTrigger, disabled]);

  // Also re-focus when loading finishes (after AI replies)
  useEffect(() => {
    if (!disabled) ref.current?.focus();
  }, [disabled]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || disabled) return;
    onSend(text);
    setInput("");
    reset();
    // Focus back after clearing
    setTimeout(() => ref.current?.focus(), 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-area">
      <div className="input-box">
        <textarea
          ref={ref}
          rows={1}
          placeholder="Ask Codeer anything..."
          value={input}
          onChange={(e) => { setInput(e.target.value); resize(); }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!input.trim() || disabled}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
          </svg>
        </button>
      </div>
      <div className="input-footer">
        Powered by NVIDIA · Falcon3-7B · Enter to send, Shift+Enter for newline
      </div>
    </div>
  );
}
