'use client';
import React, { useState } from 'react';
import {
  MessageCircleIcon,
} from 'lucide-react';
import Card from '../components/common/Card';

const MarketplacePage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello Alex ... Ready to discover sustainable products? Ask away! 🌿' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const userMsg = { role: 'user', content: message };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: `AI Error: ${error.message}. Check backend is running.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
  
        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 overflow-auto w-full lg:w-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Title Card */}
            <Card>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center mr-3">
                  <MessageCircleIcon size={20} className="text-primary" />
                </div>
                <h3 className="text-lg font-medium text-primary-dark">
                  AI Marketplace
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Chat with AI for eco-friendly product recommendations and insights
              </p>
            </Card>

            {/* Chat Messages Container */}
            <Card className="max-h-[500px] overflow-y-auto">
              <div className="space-y-4 p-6">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-2xl px-4 py-3 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white rounded-br-none' 
                          : 'bg-neutral-gray text-primary-dark rounded-bl-none border border-gray-200'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      ) : (
                        <div className="text-sm leading-relaxed whitespace-pre-wrap space-y-3">
                          {msg.content.split('\n\n').map((paragraph, idx) => {
                            // Check if this paragraph is a section header (all caps)
                            const isHeader = paragraph.trim() === paragraph.trim().toUpperCase() && 
                                           paragraph.trim().length > 0 && 
                                           !paragraph.includes('🌿');
                            
                            return (
                              <div key={idx}>
                                {isHeader ? (
                                  <div className="font-bold text-gray-700 mt-2">{paragraph}</div>
                                ) : (
                                  <div className="text-gray-700">{paragraph}</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-neutral-gray text-gray-600 px-4 py-3 rounded-lg rounded-bl-none border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <span className="animate-pulse">●</span>
                        <span className="animate-pulse">●</span>
                        <span className="animate-pulse">●</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Input Area */}
            <Card className="p-6">
              <div className="flex gap-3 items-end">
                <input
                  type="text"
                  placeholder="Ask about sustainable products..."
                  className="flex-1 bg-white rounded-lg border border-gray-200 px-4 py-3 text-sm text-primary-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !message.trim()}
                  className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  title="Send message"
                >
                  <MessageCircleIcon size={18} />
                </button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    
  );
};

export default MarketplacePage;