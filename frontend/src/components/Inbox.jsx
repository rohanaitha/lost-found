import React, { useEffect, useState } from "react";
import axios from "axios";
import BACKEND_URL from "../config";
import { useNavigate } from "react-router-dom";
import ChatPage from "./ChatPage";

function Inbox() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const navigate = useNavigate();

  const currentUserId = localStorage.getItem("currentUserId");

  useEffect(() => {
    const fetchInbox = async () => {
      const token = localStorage.getItem("jwt_token");
      const res = await axios.get(`${BACKEND_URL}/inbox`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(res.data || []);
    };
    fetchInbox();
  }, []);

  const getOtherUser = (chat) =>
    chat.memberDetails?.find((m) => m.userId !== currentUserId);

  const getLastMessage = (chat) =>
    chat.messages?.length
      ? chat.messages[chat.messages.length - 1].text
      : "Start a conversation";

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* ---------------- LEFT SIDEBAR ---------------- */}
      <div className="w-[380px] bg-white/80 backdrop-blur-xl border-r border-gray-200 flex flex-col shadow-xl">
        {/* Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b bg-white/70 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/home")}
              className="p-2 hover:bg-gray-200 rounded-full transition"
              title="Back to Home"
            >
              ←
            </button>
            <h2 className="font-bold text-xl tracking-tight">Messages</h2>
          </div>
          <span className="text-sm text-blue-500 font-medium cursor-pointer hover:underline">
            Requests
          </span>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-300">
          {conversations.map((chat) => {
            const user = getOtherUser(chat);
            if (!user) return null;

            const isActive = selectedChat === chat._id;

            return (
              <div
                key={chat._id}
                onClick={() => {
                  setSelectedChat(chat._id);
                  window.history.pushState({}, "", `/chat/${chat._id}`);
                }}
                className={`
                relative flex items-center gap-4 px-5 py-4 cursor-pointer
                transition-all duration-300 group
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-transparent"
                    : "hover:bg-gray-50"
                }
              `}
              >
                {/* Active Indicator */}
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r-lg" />
                )}

                {/* Avatar */}
                <div className="relative">
                  <img
                    src={user.avatar || "/default-avatar.jpg"}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-300 transition"
                  />
                  <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                </div>

                {/* Name + message */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {user.fullName}
                  </p>
                  <p className="text-sm text-gray-500 truncate group-hover:text-gray-700">
                    {getLastMessage(chat)}
                  </p>
                </div>

                {/* Time */}
                <span className="text-xs text-gray-400 group-hover:text-gray-600">
                  1h
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- RIGHT CHAT / EMPTY ---------------- */}
      <div className="flex-1 bg-gradient-to-br from-white to-gray-50">
        {selectedChat ? (
          <ChatPage
            roomIdProp={selectedChat}
            onBack={() => setSelectedChat(null)}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            {/* Icon */}
            <div
              className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 
                          flex items-center justify-center shadow-xl mb-6 animate-pulse"
            >
              <span className="text-4xl text-white">✈️</span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900">Your messages</h3>
            <p className="text-gray-500 mt-2 max-w-sm">
              Send private photos and messages to a friend or group.
            </p>

            <button
              className="
              mt-6 px-6 py-3 rounded-full font-semibold text-white
              bg-gradient-to-r from-blue-500 to-indigo-600
              shadow-lg shadow-blue-500/30
              hover:scale-105 hover:shadow-xl
              active:scale-95
              transition-all duration-300
            "
            >
              Send message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inbox;
