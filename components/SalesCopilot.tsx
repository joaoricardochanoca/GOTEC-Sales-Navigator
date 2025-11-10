
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { generateText } from '../services/geminiService';
import { SendIcon } from './icons/SendIcon';
import { GotecLogo } from './icons/GotecLogo';
import { UserIcon } from './icons/UserIcon';


const SalesCopilot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: "Hello! I am the GOTEC Sales Navigator (GSN). How can I assist you today? You can ask me for technical details, to draft an email, or to provide sales arguments." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await generateText(input);
      const aiMessage: ChatMessage = { sender: 'ai', text: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { sender: 'ai', text: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };
  
  const suggestions = [
      "Draft a first contact email for a company in the mold making sector.",
      "What are the 5 key differentiators for WEIDA milling machines?",
      "Explain the ROI of a HAMOO on-machine measurement system.",
      "Draft a follow-up email after a technical visit."
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'ai' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                  <GotecLogo className="w-8 h-8 text-white" simple={true} />
                </div>
              )}
              <div className={`max-w-lg p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-red-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                 <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
               {msg.sender === 'user' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                 <GotecLogo className="w-8 h-8 text-white" simple={true} />
              </div>
              <div className="max-w-lg p-4 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      
      {messages.length <= 1 && (
        <div className="p-6 pt-0">
            <p className="text-sm text-gray-400 mb-4">Try one of these suggestions:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestions.map((s, i) => (
                    <button key={i} onClick={() => handleSuggestionClick(s)} className="text-left text-sm p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                        {s}
                    </button>
                ))}
            </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center bg-gray-700 rounded-lg p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask GSN anything..."
            className="flex-1 bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none px-2"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="p-2 rounded-full bg-red-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-red-700 transition-colors">
            <SendIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesCopilot;