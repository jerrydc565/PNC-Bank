import React, { useState, useEffect, useRef } from "react";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Check if user is logged in
  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("email");
  const firstName = localStorage.getItem("firstName");
  const secondName = localStorage.getItem("secondName");
  const userName = `${firstName || ""} ${secondName || ""}`.trim();

  // Don't render chat widget if user is not logged in
  if (!userId || !userEmail) {
    return null;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chatMessages_${userId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [userId]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (userId && messages.length > 0) {
      localStorage.setItem(`chatMessages_${userId}`, JSON.stringify(messages));
    }
  }, [messages, userId]);

  // Listen for new messages from admin
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith("chatMessages_")) {
        const userId = localStorage.getItem("userId");
        const savedMessages = localStorage.getItem(`chatMessages_${userId}`);
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("chatMessageReceived", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("chatMessageReceived", handleStorageChange);
    };
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("email");

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      userId: userId,
      userEmail: userEmail,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage("");

    // Also save to a global chat queue for admin to see
    const chatQueue = JSON.parse(
      localStorage.getItem("adminChatQueue") || "[]"
    );
    const existingChatIndex = chatQueue.findIndex(
      (chat) => chat.userId === userId
    );

    if (existingChatIndex !== -1) {
      // Update existing chat
      chatQueue[existingChatIndex].messages = updatedMessages;
      chatQueue[existingChatIndex].lastMessage = inputMessage;
      chatQueue[existingChatIndex].lastMessageTime = new Date().toISOString();
      chatQueue[existingChatIndex].unreadCount =
        (chatQueue[existingChatIndex].unreadCount || 0) + 1;
      chatQueue[existingChatIndex].userName = userName || userEmail;
    } else {
      // Add new chat to queue
      chatQueue.push({
        userId: userId,
        userEmail: userEmail,
        userName: userName || userEmail,
        messages: updatedMessages,
        lastMessage: inputMessage,
        lastMessageTime: new Date().toISOString(),
        unreadCount: 1,
      });
    }

    localStorage.setItem("adminChatQueue", JSON.stringify(chatQueue));
    window.dispatchEvent(new Event("newChatMessage"));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#c64c00] hover:bg-[#a33d00] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
        aria-label="Chat with us"
      >
        {isOpen ? (
          <i className="fas fa-times text-xl"></i>
        ) : (
          <i className="fas fa-comment-dots text-xl"></i>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#c64c00] to-[#a33d00] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <i className="fas fa-headset text-[#c64c00] text-lg"></i>
              </div>
              <div>
                <h3 className="font-semibold text-lg">PNC Support</h3>
                <p className="text-xs text-white/90">We're here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              <i className="fas fa-minus"></i>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <i className="fas fa-comments text-4xl mb-3 text-gray-300"></i>
                <p className="text-sm">No messages yet</p>
                <p className="text-xs">
                  Send a message to start chatting with support
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-[#c64c00] text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "user"
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
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-[#c64c00] focus:ring-1 focus:ring-[#c64c00] text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === ""}
                className="w-10 h-10 bg-[#c64c00] hover:bg-[#a33d00] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
