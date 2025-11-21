import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSendMessage(input.trim());
    setInput('');
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white/80 backdrop-blur-md border-t border-gray-200/50 sticky bottom-0 z-10">
      <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-white border border-gray-300 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="w-full max-h-[120px] py-3 pl-4 pr-12 bg-transparent border-none focus:ring-0 resize-none text-gray-800 placeholder-gray-400 leading-relaxed scrollbar-hide"
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`absolute right-2 bottom-2 p-2 rounded-lg transition-all duration-200 ${
            input.trim() && !isLoading
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
      <div className="text-center mt-2">
         <p className="text-xs text-gray-400">Powered by Gemini 2.5 Flash</p>
      </div>
    </div>
  );
};
