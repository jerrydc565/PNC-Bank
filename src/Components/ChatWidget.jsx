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
    if (!userId) return;

    // Load messages from database
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `https://pnc-bank-backend-2.onrender.com/api/chat/messages/${userId}`
        );
        const data = await response.json();

        // Convert backend format to frontend format
        const formattedMessages = data.map((msg) => ({
          id: msg.id,
          text: msg.messageText,
          sender: msg.sender,
          userId: msg.userId,
          userEmail: userEmail,
          timestamp: msg.timestamp,
          read: msg.isRead,
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    fetchMessages();
  }, [userId, userEmail]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    // Removed localStorage save - now using database
  }, [messages, userId]);

  // Listen for new messages from admin
  useEffect(() => {
    if (!userId) return;

    const handleNewMessage = async () => {
      try {
        const response = await fetch(
          `https://pnc-bank-backend-2.onrender.com/api/chat/messages/${userId}`
        );
        const data = await response.json();

        const formattedMessages = data.map((msg) => ({
          id: msg.id,
          text: msg.messageText,
          sender: msg.sender,
          userId: msg.userId,
          userEmail: userEmail,
          timestamp: msg.timestamp,
          read: msg.isRead,
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error refreshing messages:", error);
      }
    };

    window.addEventListener("chatMessageReceived", handleNewMessage);

    // Poll for new messages every 3 seconds
    const interval = setInterval(handleNewMessage, 3000);

    return () => {
      window.removeEventListener("chatMessageReceived", handleNewMessage);
      clearInterval(interval);
    };
  }, [userId, userEmail]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("email");

    try {
      // Send message to backend
      const response = await fetch(
        "https://pnc-bank-backend-2.onrender.com/api/chat/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: parseInt(userId),
            sender: "user",
            message: inputMessage,
            userName: userName || userEmail,
            userEmail: userEmail,
          }),
        }
      );

      if (response.ok) {
        const savedMessage = await response.json();

        // Add to local state for immediate display
        const userMessage = {
          id: savedMessage.id,
          text: savedMessage.messageText,
          sender: "user",
          userId: parseInt(userId),
          userEmail: userEmail,
          timestamp: savedMessage.timestamp,
          read: false,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputMessage("");

        // Notify admin of new message
        window.dispatchEvent(
          new CustomEvent("newChatMessage", {
            detail: {
              userId,
              userName: userName || userEmail,
              message: inputMessage,
            },
          })
        );
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
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
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-[#c64c00] hover:bg-[#a33d00] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
        aria-label="Chat with us"
      >
        {isOpen ? (
          <i className="fas fa-times text-lg sm:text-xl"></i>
        ) : (
          <i className="fas fa-comment-dots text-lg sm:text-xl"></i>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-x-4 bottom-20 sm:bottom-24 sm:right-6 sm:left-auto z-50 w-auto sm:w-96 h-[calc(100vh-120px)] sm:h-[500px] max-h-[600px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Chat Header */}
          <div className="bg-linear-to-r from-[#c64c00] to-[#a33d00] text-white p-3 sm:p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                <i className="fas fa-headset text-[#c64c00] text-base sm:text-lg"></i>
              </div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg">
                  PNC Support
                </h3>
                <p className="text-xs text-white/90">We're here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-colors shrink-0"
            >
              <i className="fas fa-minus text-sm sm:text-base"></i>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50 space-y-3 sm:space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4">
                <i className="fas fa-comments text-3xl sm:text-4xl mb-2 sm:mb-3 text-gray-300"></i>
                <p className="text-xs sm:text-sm text-center">
                  No messages yet
                </p>
                <p className="text-[10px] sm:text-xs text-center">
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
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2 sm:px-4 ${
                      message.sender === "user"
                        ? "bg-[#c64c00] text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p className="text-xs sm:text-sm break-words">
                      {message.text}
                    </p>
                    <p
                      className={`text-[10px] sm:text-xs mt-1 ${
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
          <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 sm:px-4 border border-gray-300 rounded-full focus:outline-none focus:border-[#c64c00] focus:ring-1 focus:ring-[#c64c00] text-xs sm:text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === ""}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-[#c64c00] hover:bg-[#a33d00] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors shrink-0"
              >
                <i className="fas fa-paper-plane text-xs sm:text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
