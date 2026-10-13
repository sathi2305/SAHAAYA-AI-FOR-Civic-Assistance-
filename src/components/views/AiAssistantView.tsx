import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  FileText, 
  ArrowRight, 
  Loader2, 
  Info,
  CheckCircle2,
  Copy,
  PlusCircle,
  HelpCircle,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types';

export const AiAssistantView: React.FC = () => {
  const { 
    t, 
    language, 
    activeAiStatus, 
    startNewIssueWithDetails, 
    addToast 
  } = useApp();

  const isTamil = language === 'ta';

  const defaultMessages: ChatMessage[] = [
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: isTamil
        ? `வணக்கம்! நான் **SAHAAYA AI திட்ட உதவியாளர் மற்றும் நகராட்சி ஆலோசகர்**.\n\nஇந்த திட்டத்தின் தொழில்நுட்ப கட்டமைப்பு, Gemini 3.8 Flash AI மாதிரி, புகார் ஆய்வு (Triage Engine) மற்றும் நகராட்சி மனுக்கள் குறித்து என்னிடம் எந்த கேள்வியும் கேட்கலாம்!`
        : `Hello! I am **SAHAAYA AI**, trained with full knowledge of this civic tech platform and municipal processes.\n\nYou can ask me queries about:\n• **The SAHAAYA AI Project** (Architecture, tech stack, Gemini 3.8 Flash model, offline engine)\n• **How AI Triage Works** (Urgency classification, missing info detection, department routing)\n• **Community Impact Analytics** (Recharts 10-month historical trend analysis)\n• **Civic Issues** (How to document road damage, water leaks, garbage, streetlights, drainage)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: isTamil
        ? [
            'திட்டத்தின் தொழில்நுட்ப கட்டமைப்பு என்ன?',
            'AI எவ்வாறு புகாரை ஆய்வு செய்கிறது?',
            'என் தெருவில் குடிநீர் குழாய் உடைந்துள்ளது',
            'சமூக தாக்கம் வரைபடம் பற்றி கூறு'
          ]
        : [
            'What is the tech stack of SAHAAYA AI?',
            'How does the AI Triage engine work?',
            'Explain the Community Impact analytics',
            'How to report a broken water pipe?'
          ]
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessages);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
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
        const assistantMsg: ChatMessage = {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: data.suggestions
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error('Chat response error');
      }
    } catch {
      // Local fallback
      const errorMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'assistant',
        text: isTamil
          ? 'மன்னிக்கவும், AI சேவையை தொடர்புகொள்வதில் தாமதம் ஏற்பட்டது. எனினும் எங்கள் படிவத்தில் நேரடியாக புகாரை பதிவு செய்யலாம்.'
          : 'I had trouble connecting to the real-time AI stream. You can still launch our multi-step wizard to file your complaint directly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages(defaultMessages);
    addToast('info', 'Chat history cleared.');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('success', 'Copied text to clipboard.');
  };

  const turnIntoReport = (text: string) => {
    startNewIssueWithDetails({
      title: 'Citizen Grievance from AI Consultation',
      description: text.substring(0, 300)
    });
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] bg-[#071B38] border border-[#164A80] rounded-2xl shadow-2xl overflow-hidden">
      {/* CHAT HEADER */}
      <div className="px-5 py-3.5 bg-[#06142B] border-b border-[#164A80]/70 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#246BFD] to-[#7028FF] flex items-center justify-center shadow-[0_0_15px_rgba(36,107,253,0.3)]">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">
                {t.assistant.title}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00C8FF]/15 text-[#00C8FF] border border-[#00C8FF]/30 font-semibold">
                {activeAiStatus.configured ? 'Gemini 3.8 Flash' : 'Sahaaya Engine'}
              </span>
            </div>
            <p className="text-[11px] text-[#8EA9CF]">
              {t.assistant.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl text-[#8EA9CF] hover:text-white hover:bg-[#0A2040] border border-transparent hover:border-[#164A80] transition"
            title={t.assistant.clearChat}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MESSAGES STREAM */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-2xl ${isUser ? 'ml-auto' : 'mr-auto'}`}
            >
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed shadow-lg ${
                  isUser
                    ? 'bg-gradient-to-r from-[#246BFD] to-[#7028FF] text-white rounded-br-sm'
                    : 'bg-[#0A2040] border border-[#164A80]/80 text-[#EAF3FF] rounded-bl-sm space-y-3'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Assistant actions toolbar */}
                {!isUser && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#164A80]/60 text-[11px]">
                    <button
                      onClick={() => copyToClipboard(msg.text)}
                      className="px-2 py-1 rounded-md bg-[#071B38] hover:bg-[#164A80] text-[#8EA9CF] hover:text-white transition flex items-center gap-1 font-medium"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>

                    <button
                      onClick={() => turnIntoReport(msg.text)}
                      className="px-2 py-1 rounded-md bg-[#246BFD]/20 hover:bg-[#246BFD]/30 border border-[#246BFD]/40 text-[#00C8FF] transition flex items-center gap-1 font-medium"
                    >
                      <FileText className="w-3 h-3" />
                      <span>{t.assistant.convertToReport}</span>
                    </button>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-[#8EA9CF] mt-1 px-1">
                {msg.timestamp}
              </span>

              {/* Suggestions chips */}
              {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(sug)}
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
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#0A2040] border border-[#164A80] text-xs text-[#00C8FF] w-fit">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>SAHAAYA AI is reasoning...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT COMPOSER */}
      <div className="p-4 bg-[#06142B] border-t border-[#164A80]/70 shrink-0">
        {/* Quick Topic Starter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-1 scrollbar-none text-[11px]">
          <span className="text-[#8EA9CF] text-[10px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#00C8FF]" />
            <span>Topics:</span>
          </span>
          {[
            'What is SAHAAYA AI?',
            'What is the tech stack?',
            'How does AI triage work?',
            'Explain Community Impact',
            'What keyboard shortcuts exist?'
          ].map((topic, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(topic)}
              className="px-2.5 py-0.5 rounded-full bg-[#0A2040] hover:bg-[#164A80] text-[#00C8FF] border border-[#164A80] hover:border-[#00C8FF] whitespace-nowrap transition cursor-pointer"
            >
              {topic}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2.5"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.assistant.inputPlaceholder}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#0A2040] border border-[#164A80] text-xs sm:text-sm text-white placeholder-[#8EA9CF]/60 focus:outline-none focus:border-[#00C8FF] transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#00C8FF] to-[#246BFD] disabled:opacity-40 text-black font-bold shadow-[0_0_15px_rgba(0,200,255,0.3)] transition shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 text-black" />
          </button>
        </form>
        <p className="text-[10px] text-[#8EA9CF] text-center mt-2">
          {t.assistant.demoNotice}
        </p>
      </div>
    </div>
  );
};
