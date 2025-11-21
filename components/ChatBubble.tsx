import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Role } from '../types';
import { User, Bot, AlertCircle } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.User;
  const isError = message.isError;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-indigo-600 text-white' : isError ? 'bg-red-100 text-red-600' : 'bg-emerald-600 text-white'
        }`}>
          {isUser ? <User size={16} /> : isError ? <AlertCircle size={16} /> : <Bot size={16} />}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed overflow-hidden ${
              isUser
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : isError
                ? 'bg-red-50 text-red-800 border border-red-100 rounded-tl-none'
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.text}</p>
            ) : (
              <div className="markdown-body prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-code:text-xs prose-pre:bg-gray-800 prose-pre:text-gray-100">
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            )}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};
