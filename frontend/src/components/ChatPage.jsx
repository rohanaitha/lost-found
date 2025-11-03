import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";
import axios from "axios";
import BACKEND_URL from "../config";

function ChatPage() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem("currentUserId");

  // Load existing messages when entering the chat
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/chat/${roomId}`);
        setMessages(response.data || []);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };
    loadMessages();
  }, [roomId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    };

    try {
      // Send via socket for real-time
      socket.emit("sendMessage", { roomId, message: messageData });

      // Store in database
      await axios.post(`${BACKEND_URL}/chat/${roomId}/message`, messageData);

      // Add to local messages
      setMessages((prev) => [...prev, messageData]);
      setNewMsg("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white shadow px-4 py-3">
        <h2 className="text-xl font-semibold">Chat Room</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-[70%] break-words
                ${
                  msg.sender === currentUserId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t p-4 flex gap-2">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
