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
    <div className="h-screen flex bg-white">
      {/* ---------------- LEFT SIDEBAR ---------------- */}
      <div className="w-[360px] border-r border-gray-300 flex flex-col">
        {/* Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b">
          <h2 className="font-semibold text-lg">Messages</h2>
          <span className="text-sm text-gray-500 cursor-pointer">Requests</span>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((chat) => {
            const user = getOtherUser(chat);
            if (!user) return null;

            const isActive = selectedChat === chat._id;

            return (
              <div
                key={chat._id}
                onClick={() => {
                  setSelectedChat(chat._id);
                  // update URL without unmounting this component (keeps the list visible)
                  try {
                    window.history.pushState({}, "", `/chat/${chat._id}`);
                  } catch (e) {}
                }}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer
                  ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}`}
              >
                <img
                  src={user.avatar || "/default-avatar.jpg"}
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{user.fullName}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {getLastMessage(chat)}
                  </p>
                </div>

                <span className="text-xs text-gray-400">1h</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- RIGHT EMPTY STATE ---------------- */}
      <div className="flex-1">
        {selectedChat ? (
          <ChatPage roomIdProp={selectedChat} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 border-2 border-black rounded-full flex items-center justify-center mb-4">
              ✈️
            </div>
            <h3 className="text-xl font-semibold">Your messages</h3>
            <p className="text-gray-500 mt-1">
              Send a message to start a chat.
            </p>
            <button className="mt-4 px-5 py-2 bg-blue-500 text-white rounded-lg font-medium">
              Send message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inbox;
