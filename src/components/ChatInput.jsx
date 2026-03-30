import { useState } from "react";
import "../styles/ChatInput.css";
import { useAutoResize } from "../hooks/useAutoResize";

export default function ChatInput({ onSend, disabled }) {
  const [input, setInput] = useState("");
  const { ref, resize, reset } = useAutoResize();

  const handleSend = () => {
    const text = input.trim();
    if (!text || disabled) return;
    onSend(text);
    setInput("");
    reset();
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
          ↑
        </button>
      </div>
      <div className="input-footer">
        Powered by NVIDIA · Falcon3-7B · Enter to send, Shift+Enter for newline
      </div>
    </div>
  );
}
