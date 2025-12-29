import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";
import axios from "axios";
import BACKEND_URL from "../config";

function ChatPage({ roomIdProp, onBack }) {
  const params = useParams();
  const roomId = roomIdProp || params?.roomId;
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [chatUser, setChatUser] = useState(null);
  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem("currentUserId");

  // 📨 Load messages + chat user info
  useEffect(() => {
    if (!roomId) return;
    const loadChat = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/chat/${roomId}`);
        console.log("Chat response:", res.data);
        setMessages(res.data.messages || []);

        // Find the other user (not current user) from members
        const otherUser = res.data.members?.find(
          (m) => m.userId !== currentUserId
        );
        console.log("Other user:", otherUser);
        console.log("Current user ID:", currentUserId);
        setChatUser(otherUser || null);
      } catch (err) {
        console.error("Error loading chat:", err);
      }
    };
    loadChat();
  }, [roomId, currentUserId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket setup
  useEffect(() => {
    if (!roomId) return;

    socket.emit("joinRoom", roomId);

    const onReceive = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receiveMessage", onReceive);

    return () => {
      socket.off("receiveMessage", onReceive);
      try {
        socket.emit("leaveRoom", roomId);
      } catch (e) {
        // ignore
      }
    };
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* ───────── HEADER ───────── */}
      <div className="bg-white/80 backdrop-blur-md border-b px-6 py-4 flex items-center gap-4 shadow-sm">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-200 rounded-full transition"
            title="Back to Inbox"
          >
            ←
          </button>
        )}
        <img
          src={chatUser?.avatar || "/default-avatar.jpg"}
          alt="User Avatar"
          className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-400/30"
        />

        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900">
            {chatUser?.fullName || "Chat"}
          </h2>
        </div>

        <button className="p-2 rounded-full hover:bg-gray-100 transition">
          ⋮
        </button>
      </div>

      {/* ───────── MESSAGES ───────── */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
        {messages.map((msg, i) => {
          const isMe = msg.sender === currentUserId;

          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                relative group px-4 py-2 rounded-2xl max-w-[65%] text-sm break-words
                transition-all duration-300
                ${
                  isMe
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-none shadow-blue-500/30"
                    : "bg-white text-gray-900 rounded-bl-none shadow"
                }
                hover:scale-[1.02]
              `}
              >
                {msg.text}

                {/* Time */}
                <div
                  className={`
                  text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition
                  ${isMe ? "text-blue-100" : "text-gray-400"}
                `}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ───────── INPUT BAR ───────── */}
      <div className="bg-white/90 backdrop-blur-md border-t px-5 py-4 flex items-center gap-3 shadow-lg">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="
          flex-1 px-5 py-3 rounded-full border
          focus:outline-none focus:ring-2 focus:ring-blue-400
          transition shadow-sm
        "
        />

        <button
          onClick={sendMessage}
          className="
          px-6 py-3 rounded-full font-semibold text-white
          bg-gradient-to-r from-blue-500 to-indigo-600
          shadow-lg shadow-blue-500/30
          hover:scale-105 hover:shadow-xl
          active:scale-95
          transition-all duration-300
        "
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
