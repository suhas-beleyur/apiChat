import { useState } from "react";

function CopyCodeButton({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button className="copy-code-btn" onClick={handleCopy} title="Copy code">
      {copied ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      )}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-b${i}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${keyPrefix}-i${i}`}>{part.slice(1, -1)}</em>;
    }
    return <span key={`${keyPrefix}-t${i}`}>{part}</span>;
  });
}

export function formatMessage(text) {
  const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);

  return parts.map((part, i) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const inner = part.slice(3, -3);
      const langMatch = inner.match(/^([a-z]+)\n/);
      const lang = langMatch ? langMatch[1] : "";
      const code = inner.replace(/^[a-z]*\n/, "");

      return (
        <div key={i} className="code-block-wrap">
          <div className="code-block-header">
            <span className="code-lang">{lang || "code"}</span>
            <CopyCodeButton code={code} />
          </div>
          <pre><code>{code}</code></pre>
        </div>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }

    return (
      <span key={i} style={{ whiteSpace: "pre-wrap" }}>
        {renderInline(part, String(i))}
      </span>
    );
  });
}
