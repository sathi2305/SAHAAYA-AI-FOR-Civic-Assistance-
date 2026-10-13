import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Trash2, 
  HelpCircle, 
  ChevronRight, 
  Copy, 
  Check, 
  Loader2, 
  Code2, 
  ShieldCheck, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types';

export const ProjectChatbotWidget: React.FC = () => {
  const { language, activeAiStatus, startNewIssueWithDetails, addToast } = useApp();
  const isTamil = language === 'ta';

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const initialGreeting: ChatMessage = {
    id: 'intro-1',
    sender: 'assistant',
    text: isTamil
      ? `வணக்கம்! நான் **SAHAAYA AI திட்ட உதவியாளர்**.\n\nஇந்த திட்டத்தின் தொழில்நுட்ப கட்டமைப்பு, Gemini 3.8 Flash மாதிரி, 5-படிநிலை புகார் வழிகாட்டி, Recharts சமூக தாக்கம் வரைபடங்கள் அல்லது பொதுச் சேவை தீர்வுகள் குறித்து என்னிடம் எதையும் கேளுங்கள்!`
      : `Hello! I am the **SAHAAYA AI Project Assistant**, trained with full knowledge of this civic tech platform.\n\nYou can ask me anything about:\n• **Project Architecture & Tech Stack** (React 19, TypeScript, Express, Gemini 3.8 Flash)\n• **How AI Triage Works** (Hazard assessment, missing info, department allocation)\n• **Community Impact Analytics** (Recharts 10-month historical trend analysis)\n• **Civic Issues** (Reporting road damage, water leaks, streetlights, drainage)`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestions: isTamil
      ? [
          'திட்டத்தின் தொழில்நுட்ப கட்டமைப்பு என்ன?',
          'AI எவ்வாறு புகாரை ஆய்வு செய்கிறது?',
          'சமூக தாக்கம் வரைபடம் பற்றி கூறு'
        ]
      : [
          'What is the tech stack of SAHAAYA AI?',
          'How does the AI Triage engine work?',
          'Explain the Community Impact analytics',
          'What keyboard shortcuts exist?'
        ]
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (overridePrompt?: string) => {
    const textToSend = overridePrompt || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: messages.slice(-6),
          language
        })
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: ChatMessage = {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: data.suggestions
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error('Chat response error');
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'assistant',
        text: isTamil
          ? 'மன்னிக்கவும், AI சேவையை தொடர்புகொள்வதில் தாமதம் ஏற்பட்டது. SAHAAYA AI இயங்குதளம் Gemini 3.8 Flash மற்றும் Node.js Express அடிப்படையில் செயல்படுகிறது.'
          : 'I had trouble connecting to the live endpoint. SAHAAYA AI is an AI-powered civic assistance platform built with React 19, TypeScript, Express, Recharts, Leaflet, and Google Gemini 3.8 Flash.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('success', 'Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#071B38]/95 border border-[#00C8FF]/40 text-xs font-semibold text-[#00C8FF] shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-right-4">
            <span className="w-2 h-2 rounded-full bg-[#16D6B0] animate-pulse" />
            <span>Project LLM Bot</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#246BFD] via-[#7028FF] to-[#00C8FF] p-0.5 shadow-[0_0_25px_rgba(0,200,255,0.45)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group flex items-center justify-center"
            aria-label="Open SAHAAYA AI Project Chatbot"
          >
            <div className="w-full h-full bg-[#06142B] rounded-[14px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-[#00C8FF] group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#16D6B0] border-2 border-[#020817] animate-ping" />
          </button>
        </div>
      )}

      {/* FLOATING CHAT MODAL */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-[#071B38] border border-[#164A80] rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,200,255,0.2)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 font-sans">
          {/* HEADER */}
          <div className="px-4 py-3 bg-[#06142B] border-b border-[#164A80]/70 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#246BFD] to-[#00C8FF] flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs text-white">SAHAAYA AI Copilot</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00C8FF]/15 text-[#00C8FF] border border-[#00C8FF]/30 font-semibold font-mono">
                    LLM Trained
                  </span>
                </div>
                <span className="text-[10px] text-[#8EA9CF] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16D6B0] animate-pulse" />
                  Gemini 3.8 Flash • Project Grounded
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([initialGreeting])}
                className="p-1.5 rounded-lg text-[#8EA9CF] hover:text-white hover:bg-[#0A2040] transition"
                title="Reset conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#8EA9CF] hover:text-white hover:bg-[#0A2040] transition"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MESSAGES STREAM */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map(msg => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[90%] ${isUser ? 'ml-auto' : 'mr-auto'}`}
                >
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-[#246BFD] to-[#7028FF] text-white rounded-br-xs'
                        : 'bg-[#0A2040] border border-[#164A80]/80 text-[#EAF3FF] rounded-bl-xs space-y-2'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {!isUser && (
                      <div className="flex items-center justify-between pt-2 border-t border-[#164A80]/50 text-[10px] text-[#8EA9CF]">
                        <span>SAHAAYA Project Knowledge Base</span>
                        <button
                          onClick={() => copyMessage(msg.id, msg.text)}
                          className="flex items-center gap-1 text-[#00C8FF] hover:underline"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-[#16D6B0]" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-[#8EA9CF] mt-1 px-1">
                    {msg.timestamp}
                  </span>

                  {/* Suggestions Chips */}
                  {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(sug)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-[#06142B] border border-[#164A80] hover:border-[#00C8FF] text-[#00C8FF] hover:bg-[#0A2040] transition text-left"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#0A2040] border border-[#164A80] text-xs text-[#00C8FF] w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>SAHAAYA AI is generating response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT COMPOSER */}
          <div className="p-3 bg-[#06142B] border-t border-[#164A80]/70 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isTamil ? "திட்டம் அல்லது நகராட்சி பற்றி கேட்கவும்..." : "Ask about the project, tech stack, or civic help..."}
                disabled={isLoading}
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#0A2040] border border-[#164A80] text-xs text-white placeholder-[#8EA9CF]/60 focus:outline-none focus:border-[#00C8FF] transition"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2 rounded-xl bg-gradient-to-r from-[#00C8FF] to-[#246BFD] disabled:opacity-40 text-black font-bold shadow-md transition shrink-0 cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5 text-black" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
