import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Send,
  X,
  Minus,
  RotateCcw,
  Sparkles,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { chatApi, ChatMessagePayload } from '../../services/chatApi';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

const INITIAL_WELCOME =
  "Hey there! Welcome to Foodied 🍕\nI'm your AI food assistant. Ask me about our menu, ingredients, customization options, or anything related to your food order!";

const QUICK_QUESTIONS = [
  'What should I try today?',
  'Show me popular pizzas.',
  'Do you have vegetarian options?',
  'How can I customize my meal?',
];

/* ── Custom Pizza Slice Graphic Icon ── */
export const PizzaSliceIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Crust Arc */}
    <path
      d="M8.5 12.5C18.5 6 29.5 6 39.5 12.5C40.8 13.3 40.5 15.3 39 15.8L24.8 41.5C24.4 42.2 23.6 42.2 23.2 41.5L9 15.8C7.5 15.3 7.2 13.3 8.5 12.5Z"
      fill="url(#pizzaCrustGrad)"
      stroke="#D97706"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Cheesy Top Layer */}
    <path
      d="M10.8 15C19 10 29 10 37.2 15L24 39L10.8 15Z"
      fill="url(#pizzaCheeseGrad)"
    />
    {/* Melted Cheese Drip Edge */}
    <path
      d="M11 15C14 17 17 14 20 16C23 18 25 15 28 17C31 19 34 16 37 15"
      stroke="#F59E0B"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Pepperoni 1 */}
    <circle cx="21" cy="20" r="3.2" fill="#DC2626" stroke="#991B1B" strokeWidth="0.8" />
    <circle cx="20.5" cy="19.5" r="1.2" fill="#F87171" opacity="0.6" />
    {/* Pepperoni 2 */}
    <circle cx="29" cy="23" r="3" fill="#DC2626" stroke="#991B1B" strokeWidth="0.8" />
    <circle cx="28.5" cy="22.5" r="1" fill="#F87171" opacity="0.6" />
    {/* Pepperoni 3 */}
    <circle cx="23.5" cy="30" r="2.8" fill="#DC2626" stroke="#991B1B" strokeWidth="0.8" />
    {/* Basil Leaf Garnish */}
    <path
      d="M26 16C28 15 30 17 29 19C27 19 25 18 26 16Z"
      fill="#65A30D"
    />
    <path
      d="M16 23C18 22 19 24 18 26C16 26 15 25 16 23Z"
      fill="#84CC16"
    />
    <defs>
      <linearGradient id="pizzaCrustGrad" x1="8" y1="8" x2="40" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FBBF24" />
        <stop offset="0.6" stopColor="#F59E0B" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="pizzaCheeseGrad" x1="10" y1="12" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEF08A" />
        <stop offset="0.5" stopColor="#FDE047" />
        <stop offset="1" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
  </svg>
);

/* ── Formatted Message Text Renderer ── */
export const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed text-xs sm:text-[13px]">
      {lines.map((line, lineIdx) => {
        if (!line.trim()) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        // Render bold segments (**text**)
        const parts = line.split(/(\*\*[^*]+\*\*)/g);

        return (
          <p key={lineIdx} className="m-0">
            {parts.map((part, partIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={partIdx} className="font-extrabold text-[#111111]">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={partIdx}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
};

export const PizzaChatbot: React.FC = () => {
  const location = useLocation();

  // Hide chatbot on all Admin Dashboard routes
  const isAdmin = location.pathname.startsWith('/admin');

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      role: 'model',
      text: INITIAL_WELCOME,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Auto-focus input on desktop when opened
      if (window.innerWidth >= 640) {
        inputRef.current?.focus();
      }
    }
  }, [isOpen, messages, isLoading]);

  if (isAdmin) {
    return null;
  }

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || inputValue).trim();
    if (!textToSend || isLoading) return;

    setInputValue('');
    setHasError(false);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Build history payload for Gemini backend (excluding initial greeting to save tokens)
      const historyPayload: ChatMessagePayload[] = updatedMessages
        .filter((m) => m.id !== 'msg-welcome')
        .slice(-8)
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      // Call backend Gemini service
      const reply = await chatApi.sendMessage(textToSend, historyPayload);

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('Chatbot request failed:', err);
      setHasError(true);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        text:
          "Oops! Our kitchen assistant ran into a momentary timeout. Please check your connection and tap Retry below!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'model',
        text: INITIAL_WELCOME,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setHasError(false);
  };

  const handleQuickQuestion = (question: string) => {
    handleSend(question);
  };

  return (
    <>
      {/* ── Keyframe Animations for Floating Pizza ── */}
      <style>{`
        @keyframes pizzaFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-6px) rotate(2deg);
          }
        }
        .animate-pizza-float {
          animation: pizzaFloat 3.2s ease-in-out infinite;
        }
      `}</style>

      {/* ── Floating Pizza Chatbot Launcher Button ── */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 select-none animate-in fade-in duration-300">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Foodied AI Chatbot"
            title="Chat with Foodied AI Assistant"
            className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#7CB342] via-[#8BC34A] to-[#A4D670] shadow-[0_10px_28px_rgba(139,195,74,0.45)] hover:shadow-[0_16px_36px_rgba(139,195,74,0.6)] flex items-center justify-center text-white cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/90"
          >
            {/* Pizza Slice Icon with gentle float */}
            <div className="animate-pizza-float transition-transform duration-300 group-hover:rotate-12">
              <PizzaSliceIcon className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-md" />
            </div>

            {/* Glowing Online Status Indicator Badge */}
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-xs" />
            </span>

            {/* Hover Tooltip (Desktop) */}
            <span className="hidden sm:group-hover:inline-flex items-center gap-1.5 absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900/90 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg transition-opacity pointer-events-none">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask Foodied AI</span>
            </span>
          </button>
        </div>
      )}

      {/* ── Chatbot Window UI ── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Foodied AI Assistant Chat"
          className="fixed z-50 flex flex-col bg-white overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.22)] border border-[#8BC34A]/25 transition-all duration-200
            /* Mobile Viewport Dimensions: Full-width comfortable card */
            inset-x-3 bottom-3 top-14 rounded-3xl
            /* Tablet & Desktop Viewport: Elegant floating card above launcher */
            sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[410px] sm:h-[590px] sm:max-h-[calc(100vh-80px)] sm:rounded-[28px]
            animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header Strip: Branding, Title, Online Status & Controls */}
          <div className="bg-gradient-to-r from-[#558B2F] via-[#7CB342] to-[#8BC34A] text-white p-3.5 sm:p-4 px-4 sm:px-5 flex items-center justify-between shadow-xs select-none shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              {/* Pizza Avatar Icon */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-inner shrink-0">
                <PizzaSliceIcon className="w-6 h-6 sm:w-6.5 sm:h-6.5 drop-shadow-sm" />
              </div>

              {/* Title & Subtitle */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight leading-tight truncate">
                    Foodied AI Assistant
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full text-emerald-100 border border-white/20 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    <span>Online</span>
                  </span>
                </div>
                <p className="text-[11px] text-white/90 truncate mt-0.5 font-medium">
                  Here to help with your food journey.
                </p>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                type="button"
                onClick={handleClearChat}
                title="Clear conversation"
                aria-label="Clear conversation"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                aria-label="Minimize chat"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body: Messages & Quick Suggestions */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-[#FAFDF7] via-white to-[#FAFDF7]">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
                >
                  <div className="flex items-end gap-2 max-w-[90%]">
                    {/* AI Avatar */}
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full bg-[#E5F0DA] border border-[#C5E1A5] flex items-center justify-center shrink-0 mb-1">
                        <PizzaSliceIcon className="w-4 h-4" />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-2.5 sm:py-3 rounded-2xl ${
                        isUser
                          ? 'bg-gradient-to-r from-[#7CB342] to-[#8BC34A] text-white rounded-br-xs shadow-xs'
                          : 'bg-white border border-[#E5F0DA] text-[#1A1A1A] rounded-tl-xs shadow-[0_2px_8px_rgba(0,0,0,0.03)]'
                      }`}
                    >
                      <FormattedMessage text={msg.text} />
                    </div>
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* AI Typing / Loading State */}
            {isLoading && (
              <div className="flex items-end gap-2 max-w-[85%] animate-in fade-in duration-200">
                <div className="w-7 h-7 rounded-full bg-[#E5F0DA] border border-[#C5E1A5] flex items-center justify-center shrink-0 mb-1">
                  <PizzaSliceIcon className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white border border-[#E5F0DA] px-4 py-2.5 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#558B2F]">
                    Chef is thinking
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8BC34A] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8BC34A] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8BC34A] animate-bounce" />
                  </div>
                </div>
              </div>
            )}

            {/* Error Retry Notice */}
            {hasError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Connection issue. Would you like to retry?</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
                    if (lastUserMsg) handleSend(lastUserMsg.text);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* Suggested Quick Questions (Shown initially or after clearing) */}
            {messages.length <= 2 && (
              <div className="pt-2 space-y-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Suggested Questions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_QUESTIONS.map((question, qIdx) => (
                    <button
                      key={qIdx}
                      type="button"
                      onClick={() => handleQuickQuestion(question)}
                      disabled={isLoading}
                      className="text-left text-xs bg-white hover:bg-[#F4F9EE] hover:text-[#558B2F] border border-gray-200 hover:border-[#8BC34A] text-gray-700 font-medium px-3 py-1.5 rounded-full shadow-2xs transition active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-4 bg-white border-t border-gray-100 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 bg-[#F8F9FA] rounded-full p-1.5 pl-4 border border-gray-200 focus-within:border-[#8BC34A] focus-within:ring-2 focus-within:ring-[#8BC34A]/20 transition-all"
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about pizzas, ingredients, toppings..."
                disabled={isLoading}
                className="flex-1 bg-transparent resize-none text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none max-h-24 py-1 leading-normal"
              />

              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send message"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white flex items-center justify-center transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#8BC34A]/25 shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4 -translate-x-0.2" />
              </button>
            </form>
            <p className="text-[10px] text-gray-400 text-center mt-1.5">
              Powered by Google Gemini • Press Enter to send
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PizzaChatbot;

