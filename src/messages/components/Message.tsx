// src/messages/Message.tsx
import "./Message.css";

export function Message({
  text,
  username,
  sendTime,
}: {
  text: string;
  username: string;
  sendTime: string;
}) {
    let currUser = sessionStorage.getItem("username");
    let isOwnMessage = currUser === username;
  return (
    <div className={`message ${isOwnMessage ? "message--own" : "message--other"}`}>
      <div className="message__header">
        <span className="message__username">{username}</span>
        <span className="message__time">{sendTime}</span>
      </div>
      <div className="message__text">{text}</div>
    </div>
  );
}
