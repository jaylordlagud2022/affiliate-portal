import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Connect to your backend server
const socket = io("http://192.168.254.100:4000"); // replace with actual IP/domain

interface Message {
  sender: string;
  name: string;
  avatar: string;
  message: string;
  timestamp: string;
}

export default function ChatPopup({
  userEmail,
  userName,
  userAvatar,
}: {
  userEmail: string;
  userName: string;
  userAvatar?: string;
}) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [receiver, setReceiver] = useState("support@example.com");

  useEffect(() => {
    socket.emit("register", {
      email: userEmail,
      name: userName,
      avatar: userAvatar || "https://i.pravatar.cc/40",
    });

    socket.on("receive_message", (msg: Message) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [userEmail, userName, userAvatar]);

  const sendMessage = () => {
    if (message.trim()) {
      const msg = { from: userEmail, to: receiver, message };
      socket.emit("send_message", msg);
      setChat((prev) => [
        ...prev,
        {
          ...msg,
          name: userName,
          avatar: userAvatar || "https://i.pravatar.cc/40",
          timestamp: new Date().toISOString(),
        },
      ]);
      setMessage("");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 300,
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 10,
        background: "#fff",
      }}
    >
      {/* Receiver input */}
      <input
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        placeholder="Receiver email"
        style={{
          width: "100%",
          marginBottom: 5,
          padding: "5px",
          borderRadius: 4,
          border: "1px solid #ddd",
        }}
      />

      {/* Chat history */}
      <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 10 }}>
        {chat.map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <img
              src={c.avatar}
              alt={c.name}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                marginRight: 8,
              }}
            />
            <div>
              <strong>{c.name}:</strong> {c.message}
            </div>
          </div>
        ))}
      </div>

      {/* Message input */}
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
        style={{
          width: "100%",
          padding: "5px",
          borderRadius: 4,
          border: "1px solid #ddd",
        }}
      />
      <button
        onClick={sendMessage}
        style={{
          marginTop: 5,
          width: "100%",
          padding: "6px",
          borderRadius: 4,
          border: "none",
          background: "#007bff",
          color: "white",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
}
