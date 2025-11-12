
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';

interface ChatInterfaceProps {
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const SendIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatHistory, onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-[70vh] max-h-[800px]">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Design Chat</h3>
        <p className="text-sm text-gray-500">Refine your design or find items to buy.</p>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {chatHistory.length === 0 && !disabled && (
          <div className="text-center text-gray-500 p-6">
            <p>Once a style is generated, you can ask for changes like:</p>
            <ul className="mt-2 text-sm list-disc list-inside">
                <li>"Make the sofa green"</li>
                <li>"Add more plants"</li>
                <li>"Where can I buy that lamp?"</li>
            </ul>
          </div>
        )}
         {disabled && chatHistory.length === 0 && (
          <div className="text-center text-gray-500 p-6">
            <p>Generate a design to start chatting.</p>
          </div>
        )}
        <div className="space-y-4">
          {chatHistory.map((chat) => (
            <div key={chat.id} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs md:max-w-md lg:max-w-xs xl:max-w-md px-4 py-2 rounded-2xl ${
                  chat.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm">{chat.text}</p>
                {chat.links && chat.links.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-300">
                    <h4 className="font-semibold text-xs mb-1">Sources:</h4>
                    <ul className="space-y-1">
                      {chat.links.map((link, index) => (
                        <li key={index}>
                          <a href={link.uri} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline text-xs break-all">
                            {link.title || link.uri}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={disabled ? 'Generate a design first...' : 'Type your message...'}
              disabled={disabled}
              className="w-full pr-12 pl-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={disabled || !message.trim()}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <SendIcon/>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
