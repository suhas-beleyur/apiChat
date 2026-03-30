import "../styles/Welcome.css";
import { SUGGESTIONS } from "../constants";

export default function Welcome({ onSuggestion }) {
  return (
    <div className="welcome">
      <div className="welcome-logo">C</div>
      <h1>Hello, I'm Codeer</h1>
      <p>
        Your AI-powered coding assistant. Ask me anything — from writing code
        to debugging errors and explaining concepts.
      </p>

      <div className="suggestion-grid">
        {SUGGESTIONS.map((s, i) => (
          <div
            key={i}
            className="suggestion-card"
            onClick={() => onSuggestion(`${s.title} — give me an example`)}
          >
            <div className="card-icon">{s.icon}</div>
            <div className="card-title">{s.title}</div>
            <div className="card-sub">{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
