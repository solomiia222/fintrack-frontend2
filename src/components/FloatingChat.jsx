import { useState } from "react";
import ChatBox from "./ChatBox";
import "./FloatingChat.css";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="chat-popup">
          <div className="chat-header">
            <div>
              <h3>FinTrack AI</h3>
              <span>Your financial assistant</span>
            </div>

            <button
              className="close-btn"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <ChatBox />
        </div>
      )}

      <button
        className="floating-chat-button"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>
    </>
  );
}