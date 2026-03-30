import { useState } from "react";
import "../styles/ApiKeyModal.css";

export default function ApiKeyModal({ currentKey, onSave, onClose }) {
  const [value, setValue] = useState(currentKey || "");
  const [show, setShow]   = useState(false);

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSave(trimmed);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-icon">🔑</span>
          <h2>NVIDIA API Key</h2>
        </div>

        <p className="modal-desc">
          Enter your NVIDIA NIM API key to use Codeer. You can get one for free at{" "}
          <a href="https://build.nvidia.com" target="_blank" rel="noreferrer">
            build.nvidia.com
          </a>
          .
        </p>

        <div className="modal-input-wrap">
          <input
            type={show ? "text" : "password"}
            className="modal-input"
            placeholder="nvapi-xxxxxxxxxxxxxxxxxxxxxxxx"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
            spellCheck={false}
          />
          <button
            className="show-toggle"
            onClick={() => setShow((s) => !s)}
            title={show ? "Hide" : "Show"}
          >
            {show ? "🙈" : "👁"}
          </button>
        </div>

        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-btn save"
            onClick={handleSave}
            disabled={!value.trim()}
          >
            Save &amp; Connect
          </button>
        </div>
      </div>
    </div>
  );
}
