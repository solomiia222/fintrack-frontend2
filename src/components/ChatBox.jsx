import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { sendChatMessage } from "../api/api";

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await sendChatMessage(input);

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: res.response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ AI unavailable" },
      ]);
    }
  };

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="chat-wrapper">
      <div className="chat-window" ref={chatRef}>
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            {m.role === "bot" ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {m.text}
              </ReactMarkdown>
            ) : (
              <p>{m.text}</p>
            )}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your financial coach..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;