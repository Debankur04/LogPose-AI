"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/chat/Sidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";

export default function ChatPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // New Chat Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUserId = localStorage.getItem("user_id");
    if (!storedUserId) {
      router.push("/login");
      return;
    }
    setUserId(storedUserId);

    // Fetch conversations from Backend
    fetchConversations(storedUserId);

    // Auto close sidebar on mobile
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [router]);

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages();
    } else {
        setMessages([]);
    }
  }, [activeConversationId]);

  useEffect(() => {
    // Auto scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async (uid) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/see_conversation?user_id=${uid}`);
      if (response.ok) {
        const data = await response.json();
        const convos = data.conversations || [];
        setConversations(convos);
        
        // Auto select first convo if no active convo is matched
        if (convos.length > 0) {
          setActiveConversationId(prev => {
             // Keep existing valid ID, otherwise grab topmost
             if (!prev || !convos.find(c => c.id === prev)) {
               return convos[0].id;
             }
             return prev;
          });
        }
      }
    } catch (e) {
      console.error("Error fetching conversations", e);
    }
  };

  const fetchMessages = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/see_message?conversation_id=${activeConversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        setMessages([]); 
      }
    } catch (e) {
      console.error("Error fetching messages", e);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    if (!activeConversationId) {
        alert("Please create or select a conversation first.");
        return;
    }

    const currentConvoId = activeConversationId;
    
    // Optimistic UI update
    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          conversation_id: currentConvoId,
          question: text,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
      }
    } catch (error) {
       setMessages((prev) => [...prev, { role: "assistant", content: "Network error. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setIsModalOpen(true);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const confirmNewChat = async () => {
    if (!newChatTitle.trim()) return;
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/create_conversation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, title: newChatTitle.trim() }),
      });
      if (response.ok) {
        const data = await response.json();
        const newConvoId = data.conversation_id;
        
        // refetch fully to hook into application state
        await fetchConversations(userId);
        setActiveConversationId(newConvoId);
        setNewChatTitle("");
        setIsModalOpen(false);
      } else {
        alert("Failed to create conversation");
      }
    } catch (e) {
      console.error(e);
      alert("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async (id) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      await fetch(`${apiUrl}/delete_conversation`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: id }),
      });
      await fetchConversations(userId);
    } catch (e) {
      console.error(e);
    }
  };

  const activeTitle = conversations.find(c => c.id === activeConversationId)?.title;

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-zinc-950">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => {
          setActiveConversationId(id);
          if (window.innerWidth < 768) setIsSidebarOpen(false); // Auto close on mobile
        }}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />
      
      <main className="flex-1 flex flex-col h-full min-w-0 relative">
        <ChatHeader 
          activeTitle={activeTitle} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen} 
        />
        
        {/* Messages Layout */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 w-full relative z-0">
          <div className="max-w-3xl mx-auto py-8">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-zinc-500 space-y-4">
                <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center">
                   <span className="text-2xl h-8 w-8 text-center flex items-center justify-center bg-green-500 rounded-full text-white pt-1">AI</span>
                </div>
                <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">How can I help plan your trip?</h2>
                <p className="text-sm">Start by detailing where you want to go, or ask for suggestions!</p>
              </div>
            ) : (
              messages.map((m, idx) => (
                <MessageBubble key={idx} role={m.role} content={m.content} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Layout */}
        <div className="w-full bg-linear-to-t from-white via-white dark:from-zinc-950 dark:via-zinc-950 to-transparent pb-4 pt-10 relative z-10">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>

        {/* New Chat Modal */}
        {isModalOpen && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm shadow-2xl">
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-11/12 max-w-md shadow-xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">New Conversation</h3>
              <input
                type="text"
                placeholder="E.g., Summer Trip to Japan..."
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-md px-4 py-2 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-2 focus:ring-zinc-500 mb-4"
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newChatTitle.trim()) {
                    confirmNewChat();
                  }
                }}
              />
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => {
                      setIsModalOpen(false);
                      setNewChatTitle("");
                  }} 
                  className="px-4 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmNewChat}
                  disabled={!newChatTitle.trim() || isLoading}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
