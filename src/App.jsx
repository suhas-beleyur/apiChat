import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import { useChatStore } from "./hooks/useChatStore";

export default function App() {
  const {
    sessions,
    activeId,
    messages,
    loading,
    streamText,
    sendMessage,
    startNewChat,
    loadSession,
  } = useChatStore();

  return (
    <div className="app">
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onNewChat={startNewChat}
        onLoadSession={loadSession}
      />
      <ChatArea
        messages={messages}
        loading={loading}
        streamText={streamText}
        onSend={sendMessage}
      />
    </div>
  );
}
