import { useState } from "react";
import { sendChatMessage } from "../api/api";

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await sendChatMessage(input);

      const botMsg = {
        role: "bot",
        text: res.response
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error: AI unavailable" }
      ]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={m.role}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your financial coach..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;