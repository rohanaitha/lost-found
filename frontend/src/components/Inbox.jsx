import React, { useEffect, useState } from "react";
import axios from "axios";
import BACKEND_URL from "../config";
import { useNavigate } from "react-router-dom";

function Inbox() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("currentUserId");

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("jwt_token");
        const res = await axios.get(`${BACKEND_URL}/inbox`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Inbox data:", res.data);
        console.log("Current user ID:", currentUserId);
        setConversations(res.data || []);
      } catch (err) {
        console.error("Error fetching inbox:", err);
        setError("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, []);

  const getOtherUser = (chat) => {
    if (!chat.memberDetails || chat.memberDetails.length === 0) return null;
    return (
      chat.memberDetails.find((member) => member.userId !== currentUserId) ||
      chat.memberDetails[0]
    );
  };

  const getLastMessage = (chat) => {
    if (!chat.messages || chat.messages.length === 0) return "No messages";
    return chat.messages[chat.messages.length - 1].text;
  };

  const handleChatClick = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading conversations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
      </div>

      {conversations.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">No conversations yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {conversations.map((chat) => {
            const otherUser = getOtherUser(chat);
            if (!otherUser) return null;

            return (
              <div
                key={chat._id}
                onClick={() => handleChatClick(chat._id)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={otherUser?.avatar || "/default-avatar.jpg"}
                    alt={otherUser?.fullName || "User"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-gray-800 truncate">
                      {otherUser?.fullName || "Unknown User"}
                    </h2>
                    <p className="text-sm text-gray-500 truncate">
                      {getLastMessage(chat)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Inbox;
