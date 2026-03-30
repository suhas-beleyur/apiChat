export function formatMessage(text) {
  const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);

  return parts.map((part, i) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const code = part.slice(3, -3).replace(/^[a-z]*\n/, "");
      return (
        <pre key={i}>
          <code>{code}</code>
        </pre>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }

    return <span key={i}>{part}</span>;
  });
}
