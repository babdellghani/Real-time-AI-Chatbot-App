import { useState } from "react";
import styles from "./App.module.css";
import Chat from "./components/Chat/Chat";
import Loader from "./components/Loader/Loader";
import Controls from "./components/Controls/Controls";
import { Assistant as OpenAi } from "./assistants/openAi";
import { Assistant as Gemini } from "./assistants/geminiAi";
function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [AssistantAi, setAssistantAi] = useState("OpenAI");

  const assistant = AssistantAi === "OpenAI" ? new OpenAi() : new Gemini();

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // Chat Stream
  const updateLastMessageContent = (content) => {
    setMessages((prevMessages) =>
      prevMessages.map((message, index) =>
        index === prevMessages.length - 1
          ? { ...message, content: `${message.content}${content}` }
          : message
      )
    );
  };

  const handleSend = async (content) => {
    addMessage({ role: "user", content });
    setIsLoading(true);
    try {
      const result = AssistantAi === "OpenAI" ? assistant.chatStream(content, messages) : assistant.chatStream(content);
      let isFirstResponse = false;

      for await (const response of result) {
        if (!isFirstResponse) {
          isFirstResponse = true;
          addMessage({ role: "assistant", content: "" });
          setIsLoading(false);
          setIsStreaming(true);
        }

        updateLastMessageContent(response);
      }

      setIsStreaming(false);
    } catch {
      addMessage({
        role: "system",
        content: "Sorry, I didn't get that. Please try again",
      });
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className={styles.App}>
      {isLoading && <Loader />}
      <header className={styles.Header}>
        <img className={styles.Logo} src="./chat-bot.png" alt="Chatbot" />
        <h2 className={styles.Title}>AI ChatBot</h2>
        <div className={styles.Select}>
          <label htmlFor="assistant">Assistant:</label>
          <select
            id="assistant"
            value={AssistantAi}
            onChange={(e) => setAssistantAi(e.target.value)}
          >
            <option value="OpenAI">OpenAI</option>
            <option value="Gemini">Gemini</option>
          </select>
        </div>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
      </div>
      <Controls isLoading={isLoading || isStreaming} onSend={handleSend} />
    </div>
  );
}

export default App;
