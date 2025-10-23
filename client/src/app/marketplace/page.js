"use client";
import React, { useState } from 'react';

export default function MarketplacePage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello Alex ...' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    // Add user message to history
    const userMsg = { role: 'user', content: message };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setIsLoading(true);

    try {
      // Send to Next.js API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) throw new Error('API error');
      
      const data = await response.json();
      // Add AI response
      setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, something went wrong. Try again!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header (unchanged) */}
      <div className="h-24 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">GN</span>
            </div>
            <span className="text-emerald-800 text-2xl font-semibold">GreenNexus</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-gray-700 text-xl font-medium">Welcome back Alex</div>
            <div className="flex items-center space-x-3 bg-green-100 px-6 py-2 rounded-full">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">GS</span>
              </div>
              <span className="text-emerald-800 text-sm font-medium">Green Score: 85</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-emerald-800 text-sm font-medium">AG</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex space-x-12">
        {/* Sidebar (unchanged) */}
        <div className="w-56 bg-white rounded-lg shadow-sm h-[1041px]">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-4 p-3 bg-white rounded-lg">
              <div className="w-5 h-5 flex flex-col space-y-1">
                <div className="w-[5px] h-2 bg-black rounded-full" />
                <div className="w-3.5 h-4 bg-black rounded-full" />
              </div>
              <span className="text-black text-sm font-light">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4 p-3">
              <div className="w-5 h-5 flex flex-col space-y-1">
                <div className="w-[1px] h-2 bg-gray-600 rounded-full" />
                <div className="w-[1px] h-3.5 bg-gray-600 rounded-full" />
                <div className="w-[1px] h-5 bg-gray-600 rounded-full" />
              </div>
              <span className="text-gray-600 text-sm font-medium">Activity Tracker</span>
            </div>
            <div className="flex items-center space-x-4 p-3">
              <div className="w-5 h-5 p-0.5">
                <div className="w-3.5 h-3.5 bg-gray-600 rounded-full" />
                <div className="w-2.5 h-2 bg-gray-600 rounded-full absolute -top-1 -left-1" />
              </div>
              <span className="text-gray-600 text-sm font-medium">Waste Scanner</span>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-green-100 rounded-lg">
              <div className="w-5 h-5 p-0.5">
                <div className="w-3 h-5 bg-gray-600 rounded-full" />
                <div className="w-3 h-[1px] bg-gray-600 rounded-full -mt-1" />
                <div className="w-1.5 h-1 bg-gray-600 rounded-full mt-1" />
              </div>
              <span className="text-emerald-800 text-sm font-medium">AI Marketplace</span>
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6 border-t border-gray-200 pt-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-5 h-5 flex flex-col space-y-0.5">
                  <div className="w-3 h-[5px] bg-green-500 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                </div>
              </div>
              <div>
                <div className="text-black text-sm font-medium">Alex Green</div>
                <div className="text-gray-500 text-xs font-medium">Eco Enthusiast</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-medium text-emerald-800">Ai Market Place</h1>
            <p className="text-3xl text-gray-600 font-normal leading-7 max-w-2xl">
              Ask Ai for eco friendly product insights & detailed analysis
            </p>
          </div>

          {/* Chat Messages */}
          <div className="space-y-6 max-h-96 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md p-4 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-500 p-4 rounded-lg border border-gray-200">
                  <span className="animate-pulse">AI is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-black/10 p-8">
            <div className="flex space-x-4 items-end">
              <input
                type="text"
                placeholder="Enter your message here...."
                className="flex-1 bg-gray-500/10 rounded-lg border border-black/40 p-8 h-16 text-gray-500 text-3xl font-normal focus:outline-none placeholder-gray-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition disabled:opacity-50"
              >
                <div className="w-7 h-6 bg-white rounded-md flex items-center justify-center">
                  <span className="text-green-500 text-lg">➤</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}