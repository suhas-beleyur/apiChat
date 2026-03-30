import "../styles/Message.css";
import { formatMessage } from "../utils/formatMessage";

function TypingDots() {
  return (
    <div className="typing-dots">
      <span /><span /><span />
    </div>
  );
}

export function Message({ role, content }) {
  return (
    <div className={`message-row ${role}`}>
      <div className="message-avatar">{role === "assistant" ? "C" : "U"}</div>
      <div className="message-bubble">{formatMessage(content)}</div>
    </div>
  );
}

export function StreamingMessage({ text }) {
  return (
    <div className="message-row assistant">
      <div className="message-avatar">C</div>
      <div className="message-bubble">
        {text ? formatMessage(text) : <TypingDots />}
      </div>
    </div>
  );
}
