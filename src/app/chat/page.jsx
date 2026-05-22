"use client";

import { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/chat/Sidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import { apiClient } from "@/lib/apiClient";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const ENABLE_CHAT_STREAMING = process.env.NEXT_PUBLIC_ENABLE_CHAT_STREAMING === "true";

export default function ChatPage() {
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [userId, setUserId] = useState(null); 
  const [userEmail, setUserEmail] = useState("");
  const [modeLabel, setModeLabel] = useState("Coastal Explorer");



  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {

    const storedUserId = localStorage.getItem("user_id");

    setUserId(storedUserId || "test-user");
    setUserEmail(localStorage.getItem("user_email") || "test@example.com");

    // Fetch conversations from Backend
    fetchConversations(storedUserId || "test-user");

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
      const response = await apiClient(`/see_conversation?user_id=${uid}`);
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
      const response = await apiClient(`/see_message?conversation_id=${activeConversationId}`);
      if (response.ok) {
        const data = await response.json();

        // Transform the messages to ensure content is always a string for the frontend
        const formattedMessages = (data.messages || []).map((m) => {
          let finalContent = m.content;

          if (typeof m.content === "object" && m.content !== null) {
            finalContent = m.content.reply || m.content.answer || JSON.stringify(m.content);
          } else if (typeof m.content === "string") {
            try {
              // Sometimes the backend stores it as a raw JSON string
              const parsed = JSON.parse(m.content);
              if (parsed.reply) finalContent = parsed.reply;
              else if (parsed.answer) finalContent = parsed.answer;
            } catch (e) {
              // It's just a regular string, which is fine!
            }
          }

          return { ...m, content: finalContent };
        });

        setMessages(formattedMessages);
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

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage, { role: "assistant", content: "" }]);
    setIsLoading(true);

    try {
      const response = await apiClient(`/query`, {
        method: "POST",
        body: JSON.stringify({
          user_id: userId,
          conversation_id: activeConversationId,
          question: text,
        }),
      });

      if (!response.ok) {
        throw new Error("Query request failed");
      }

      if (!ENABLE_CHAT_STREAMING) {
        const fallback = await response.json();
        const aiResponse =
          fallback.reply || fallback.answer || "No response found.";

        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: aiResponse },
        ]);

        return;
      }

      const reader = response.body?.getReader();

      if (!reader) {
        const fallback = await response.json();
        const aiResponse =
          fallback.reply || fallback.answer || "No response found.";

        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: aiResponse },
        ]);

        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      // Small delay helper
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      // Process streaming response in real-time with delays
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const chunks = buffer.split("\n\n");
        buffer = chunks.pop();

        for (const chunk of chunks) {
          const trimmed = chunk.trim();

          if (!trimmed.startsWith("data:")) continue;

          const payload = trimmed.slice(5).trim();

          if (!payload || payload === "[DONE]") continue;

          try {
            const event = JSON.parse(payload);
            let contentToAdd = "";

            if (event.type === "chunk" && event.content) {
              contentToAdd = event.content;
            } else if (event.final_reply) {
              contentToAdd = event.final_reply;
            }

            if (contentToAdd) {
              // Split into words to apply typewriter effect
              const words = contentToAdd.split(/(\s+)/); // Preserve whitespace

              for (const word of words) {
                // Update message with this word - use flushSync to force immediate render
                flushSync(() => {
                  setMessages((prev) => {
                    const updated = [...prev];
                    const lastMessage = updated[updated.length - 1];

                    if (lastMessage && lastMessage.role === "assistant") {
                      updated[updated.length - 1] = {
                        ...lastMessage,
                        content: lastMessage.content + word,
                      };
                    }

                    return updated;
                  });
                });

                // Delay after each word
                await sleep(300);
              }
            }
          } catch (err) {
            console.error("Parse error:", err);
          }
        }
      }
    } catch (err) {
      console.error("Error in handleSendMessage:", err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "Sorry, an error occurred while processing your request." },
      ]);
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
      const response = await apiClient(`/create_conversation`, {
        method: "POST",
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
      await apiClient(`/delete_conversation`, {
        method: "DELETE",
        body: JSON.stringify({ conversation_id: id }),
      });
      await fetchConversations(userId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignOut = async () => {
    try {
      await apiClient(`/signout`, { method: "POST" });
    } catch (err) {
      console.warn("Sign out failed, clearing session anyway.", err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_email");
      router.push("/login");
    }
  };

  const activeTitle = conversations.find(c => c.id === activeConversationId)?.title;

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
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
          onSignOut={handleSignOut}
        />

        {/* Messages Layout */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 w-full relative z-0">
          <div className="max-w-3xl mx-auto py-8">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center h-[50vh] text-zinc-500 space-y-4"
              >
                <div className="h-16 w-16 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl h-8 w-8 text-center flex items-center justify-center bg-gradient-to-br from-orange-400 to-amber-500 rounded-full text-white pt-1">AI</span>
                </div>
                <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">How can I help plan your trip?</h2>
                <p className="text-sm">Start by detailing where you want to go, or ask for suggestions!</p>
              </motion.div>
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
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-11/12 max-w-md shadow-xl border border-zinc-200 dark:border-zinc-800"
              >
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
