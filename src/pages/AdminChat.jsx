import React, { useState, useEffect, useRef } from "react";

function AdminChat() {
  const [chatQueue, setChatQueue] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  // Load chat queue on mount and listen for updates
  useEffect(() => {
    loadChatQueue();

    const handleNewMessage = () => {
      loadChatQueue();
    };

    window.addEventListener("newChatMessage", handleNewMessage);
    window.addEventListener("storage", handleNewMessage);

    // Poll for updates every 2 seconds
    const interval = setInterval(loadChatQueue, 2000);

    return () => {
      window.removeEventListener("newChatMessage", handleNewMessage);
      window.removeEventListener("storage", handleNewMessage);
      clearInterval(interval);
    };
  }, []);

  const loadChatQueue = async () => {
    try {
      const response = await fetch("https://pnc-bank-backend-2.onrender.com/api/chat/sessions");
      const sessions = await response.json();

      console.log("📥 Loading chat queue:", sessions.length, "chats");
      console.log(
        "Chat users:",
        sessions.map((c) => c.userName || c.userEmail)
      );

      // Convert backend format to frontend format
      const formattedSessions = sessions.map((session) => ({
        userId: session.userId,
        userEmail: session.userEmail,
        userName: session.userName,
        lastMessage: session.lastMessage,
        lastMessageTime: session.lastMessageTime,
        unreadCount: session.unreadCount,
        messages: [], // Messages will be loaded when chat is selected
      }));

      setChatQueue(formattedSessions);

      // Update selected chat if it exists
      if (selectedChat) {
        loadChatMessages(selectedChat.userId);
      }
    } catch (error) {
      console.error("Error loading chat sessions:", error);
    }
  };

  const loadChatMessages = async (userId) => {
    try {
      const response = await fetch(
        `https://pnc-bank-backend-2.onrender.com/api/chat/messages/${userId}`
      );
      const messages = await response.json();

      const formattedMessages = messages.map((msg) => ({
        id: msg.id,
        text: msg.messageText,
        sender: msg.sender,
        timestamp: msg.timestamp,
        read: msg.isRead,
      }));

      if (selectedChat && selectedChat.userId === userId) {
        setSelectedChat((prev) => ({ ...prev, messages: formattedMessages }));
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const selectChat = async (chat) => {
    // Load messages for this chat
    await loadChatMessages(chat.userId);

    // Mark as read in backend
    try {
      await fetch(`https://pnc-bank-backend-2.onrender.com/api/chat/markRead/${chat.userId}`, {
        method: "POST",
      });

      // Update local state
      const updatedQueue = chatQueue.map((c) =>
        c.userId === chat.userId ? { ...c, unreadCount: 0 } : c
      );
      setChatQueue(updatedQueue);

      // Set selected chat after messages are loaded
      setSelectedChat({ ...chat, unreadCount: 0 });
    } catch (error) {
      console.error("Error marking as read:", error);
      setSelectedChat(chat);
    }
  };

  const sendReply = async () => {
    if (replyMessage.trim() === "" || !selectedChat) return;

    try {
      // Send message to backend
      const response = await fetch("https://pnc-bank-backend-2.onrender.com/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedChat.userId,
          sender: "admin",
          message: replyMessage,
          userName: selectedChat.userName,
          userEmail: selectedChat.userEmail,
        }),
      });

      if (response.ok) {
        const savedMessage = await response.json();

        const adminMessage = {
          id: savedMessage.id,
          text: savedMessage.messageText,
          sender: "admin",
          timestamp: savedMessage.timestamp,
          read: false,
        };

        // Update the selected chat's messages locally
        const updatedMessages = [
          ...(selectedChat.messages || []),
          adminMessage,
        ];
        setSelectedChat({ ...selectedChat, messages: updatedMessages });
        setReplyMessage("");

        // Trigger event to notify user
        window.dispatchEvent(new Event("chatMessageReceived"));

        // Reload queue to update last message
        loadChatQueue();
      }
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendReply();
    }
  };

  const deleteChat = async (userId) => {
    try {
      await fetch(`https://pnc-bank-backend-2.onrender.com/api/chat/session/${userId}`, {
        method: "DELETE",
      });

      // Update local state
      const queue = chatQueue.filter((chat) => chat.userId !== userId);
      setChatQueue(queue);

      if (selectedChat && selectedChat.userId === userId) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const totalUnread = chatQueue.reduce(
    (sum, chat) => sum + (chat.unreadCount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#f3f3f3] p-3 sm:p-5 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Customer Chat Support
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {totalUnread > 0 ? (
                <span className="text-[#c64c00] font-semibold">
                  {totalUnread} unread message{totalUnread !== 1 ? "s" : ""}
                </span>
              ) : (
                "All caught up!"
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-[calc(100vh-180px)]">
          {/* Chat List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <div className="p-4 bg-[#c64c00] text-white">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <i className="fas fa-inbox"></i>
                Active Chats ({chatQueue.length})
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {chatQueue.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6">
                  <i className="fas fa-comments text-5xl mb-3"></i>
                  <p className="text-center">No active chats</p>
                </div>
              ) : (
                chatQueue.map((chat) => (
                  <div
                    key={chat.userId}
                    onClick={() => selectChat(chat)}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedChat?.userId === chat.userId
                        ? "bg-blue-50 border-l-4 border-l-[#c64c00]"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-[#c64c00] rounded-full flex items-center justify-center text-white font-semibold">
                          {chat.userName?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-gray-800 truncate">
                            {chat.userName || "Unknown User"}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            {chat.userEmail}
                          </p>
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {chat.lastMessage}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-2">
                        <span className="text-xs text-gray-400">
                          {new Date(chat.lastMessageTime).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                        {chat.unreadCount > 0 && (
                          <span className="bg-[#c64c00] text-white text-xs rounded-full px-2 py-0.5 font-semibold">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 bg-linear-to-r from-[#c64c00] to-[#a33d00] text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#c64c00] font-bold text-lg">
                      {selectedChat.userName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {selectedChat.userName || "Unknown User"}
                      </h3>
                      <p className="text-sm text-white/90">
                        {selectedChat.userEmail}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteChat(selectedChat.userId)}
                    className="hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                    title="Delete chat"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                  {selectedChat.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "admin"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                          message.sender === "admin"
                            ? "bg-[#c64c00] text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                        }`}
                      >
                        <p className="text-sm break-words">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "admin"
                              ? "text-white/70"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Input */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="flex gap-3">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your reply..."
                      rows="2"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c64c00] focus:ring-1 focus:ring-[#c64c00] text-sm resize-none"
                    />
                    <button
                      onClick={sendReply}
                      disabled={replyMessage.trim() === ""}
                      className="px-6 bg-[#c64c00] hover:bg-[#a33d00] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-colors font-semibold"
                    >
                      <i className="fas fa-paper-plane mr-2"></i>
                      Send
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Press Enter to send • Shift+Enter for new line
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <i className="fas fa-comment-dots text-6xl mb-4"></i>
                <p className="text-lg font-semibold">No chat selected</p>
                <p className="text-sm">
                  Select a conversation from the left to start chatting
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminChat;
