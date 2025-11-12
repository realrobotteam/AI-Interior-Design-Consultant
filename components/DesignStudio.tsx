
import React, { useState, useCallback } from 'react';
import ImageComparator from './ImageComparator';
import StyleCarousel from './StyleCarousel';
import ChatInterface from './ChatInterface';
import { reimagineImage, findShoppableLinks } from '../services/geminiService';
import { DESIGN_STYLES } from '../constants';
import type { DesignStyle, ChatMessage } from '../types';

interface DesignStudioProps {
  originalImage: string;
}

const LoadingSpinner: React.FC<{ message: string }> = ({ message }) => (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-20 rounded-lg">
        <svg className="animate-spin h-10 w-10 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-white text-lg font-semibold">{message}</p>
    </div>
);

const DesignStudio: React.FC<DesignStudioProps> = ({ originalImage }) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleStyleSelect = useCallback(async (style: DesignStyle) => {
    setIsLoading(true);
    setLoadingMessage(`Applying ${style.name} style...`);
    setError(null);
    try {
      const newImage = await reimagineImage(originalImage, style.prompt);
      setGeneratedImage(newImage);
      setChatHistory([]); // Reset chat on new style
    } catch (err) {
      console.error(err);
      setError('Sorry, something went wrong while generating the design. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);

  const handleChatMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    const imageToRefine = generatedImage || originalImage;

    // Heuristic to detect shopping query
    const isShoppingQuery = /\b(buy|shop|find|link|purchase|price)\b/i.test(message);

    if (isShoppingQuery) {
      setLoadingMessage('Finding shoppable links...');
      try {
        const { text, links } = await findShoppableLinks(message);
        const modelMessage: ChatMessage = { id: Date.now().toString() + 'm', role: 'model', text, links };
        setChatHistory(prev => [...prev, modelMessage]);
      } catch (err) {
        console.error(err);
        setError('Sorry, could not find any links. Please try a different search.');
        const errorMessage: ChatMessage = { id: Date.now().toString() + 'e', role: 'model', text: 'I had trouble finding links for that. Could you try rephrasing your request?' };
        setChatHistory(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setLoadingMessage('Refining your design...');
      try {
        const newImage = await reimagineImage(imageToRefine, message);
        setGeneratedImage(newImage);
        const modelMessage: ChatMessage = { id: Date.now().toString() + 'm', role: 'model', text: "Here's the updated design based on your request!" };
        setChatHistory(prev => [...prev, modelMessage]);
      } catch (err) {
        console.error(err);
        setError('Sorry, there was an error applying your changes. Please try again.');
        const errorMessage: ChatMessage = { id: Date.now().toString() + 'e', role: 'model', text: 'I had trouble with that request. Could you try describing the change differently?' };
        setChatHistory(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [originalImage, generatedImage]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="relative aspect-video w-full bg-gray-200 rounded-lg shadow-lg overflow-hidden">
          {isLoading && <LoadingSpinner message={loadingMessage} />}
          <ImageComparator
            originalImage={originalImage}
            generatedImage={generatedImage}
          />
        </div>
        <StyleCarousel styles={DESIGN_STYLES} onStyleSelect={handleStyleSelect} disabled={isLoading} />
        {error && <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">{error}</div>}
      </div>
      <div className="lg:col-span-1">
        <ChatInterface
          chatHistory={chatHistory}
          onSendMessage={handleChatMessage}
          disabled={!generatedImage || isLoading}
        />
      </div>
    </div>
  );
};

export default DesignStudio;
