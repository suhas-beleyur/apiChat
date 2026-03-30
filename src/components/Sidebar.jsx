import "../styles/Sidebar.css";
import { MODEL_NAME } from "../constants";

export default function Sidebar({ sessions, activeId, onNewChat, onLoadSession }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">C</div>
        <span className="logo-text">Codeer</span>
      </div>

      {/* New Chat */}
      <button className="new-chat-btn" onClick={onNewChat}>
        <span>✦</span> New chat
      </button>

      {/* Real chat history */}
      {sessions.length > 0 && (
        <>
          <div className="sidebar-section-label">Recent</div>
          <div className="chat-history">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`history-item${session.id === activeId ? " active" : ""}`}
                onClick={() => onLoadSession(session.id)}
                title={session.title}
              >
                {session.title.length > 36
                  ? session.title.slice(0, 36) + "…"
                  : session.title}
              </div>
            ))}
          </div>
        </>
      )}

      {sessions.length === 0 && (
        <div className="no-history">No chats yet</div>
      )}

      {/* Model badge */}
      <div className="sidebar-footer">
        <div className="model-badge">
          <div className="model-dot" />
          {MODEL_NAME}
        </div>
      </div>
    </aside>
  );
}
