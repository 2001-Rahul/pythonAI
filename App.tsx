import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Role } from './types';
import { geminiService } from './services/geminiService';
import { ChatBubble } from './components/ChatBubble';
import { ChatInput } from './components/ChatInput';
import { Sparkles, Trash2 } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    // Only set if empty to avoid double-adding in StrictMode
    setMessages((prev) => {
      if (prev.length > 0) return prev;
      return [{
        id: 'init-1',
        role: Role.Model,
        text: "Hello! I'm powered by Gemini 2.5 Flash. How can I help you today?",
        timestamp: Date.now()
      }];
    });
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMsgId = Date.now().toString();
    const userMsg: Message = {
      id: userMsgId,
      role: Role.User,
      text: text,
      timestamp: Date.now()
    };

    // Optimistically add user message
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Create placeholder for bot message
    const botMsgId = (Date.now() + 1).toString();
    const botMsgPlaceholder: Message = {
      id: botMsgId,
      role: Role.Model,
      text: "", // Starts empty
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsgPlaceholder]);

    try {
      const stream = geminiService.sendMessageStream(text);
      let fullText = "";

      for await (const chunk of stream) {
        fullText += chunk;
        
        // Update the last message (bot message) with accumulated text
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId 
            ? { ...msg, text: fullText } 
            : msg
        ));
      }
    } catch (error) {
      console.error("Stream error", error);
      setMessages(prev => prev.map(msg => 
        msg.id === botMsgId 
          ? { ...msg, text: "Sorry, I encountered an error processing your request.", isError: true } 
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      geminiService.startNewChat();
      setMessages([{
        id: Date.now().toString(),
        role: Role.Model,
        text: "Chat cleared. How can I help you now?",
        timestamp: Date.now()
      }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex-none bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-20">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 leading-tight">Gemini Chat</h1>
            <p className="text-xs text-gray-500">Powered by Google AI</p>
          </div>
        </div>
        <button 
          onClick={handleReset}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          title="Clear Chat"
        >
          <Trash2 size={20} />
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="flex-none">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
