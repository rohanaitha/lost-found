import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";
import axios from "axios";
import BACKEND_URL from "../config";

function ChatPage() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [chatUser, setChatUser] = useState(null);
  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem("currentUserId");

  // 📨 Load messages + chat user info
  useEffect(() => {
    const loadChat = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/chat/${roomId}`);
        setMessages(res.data || []);
        setChatUser(res.data.chatUser || null);
      } catch (err) {
        console.error("Error loading chat:", err);
      }
    };
    loadChat();
  }, [roomId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket setup
  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("receiveMessage");
  }, [roomId]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    const messageData = {
      sender: currentUserId,
      text: newMsg.trim(),
      createdAt: new Date(),
    };

    try {
      socket.emit("sendMessage", { roomId, message: messageData });
      await axios.post(`${BACKEND_URL}/chat/${roomId}/message`, messageData);
      setMessages((prev) => [...prev, messageData]);
      setNewMsg("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#fafafa]">
      {/* 🧩 Header */}
      <div className="bg-white shadow px-5 py-3 flex items-center gap-3 border-b">
        <img
          src={chatUser?.profilePic || "/default-avatar.jpg"}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold">
            {chatUser?.username || "Chat"}
          </h2>
          <p className="text-xs text-gray-500">Active now</p>
        </div>
      </div>

      {/* 💬 Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl text-sm max-w-[70%] break-words shadow-sm ${
                msg.sender === currentUserId
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              {msg.text}
              <div className="text-[10px] text-gray-400 mt-1 text-right">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ✍️ Input */}
      <div className="bg-white border-t px-4 py-3 flex items-center gap-2">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
