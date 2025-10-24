'use client';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  HomeIcon,
  ActivityIcon,
  RecycleIcon,
  MessageCircleIcon,
  UserIcon,
  TrendingUpIcon,
} from 'lucide-react';
import Card from '../components/common/Card';

const MarketplacePage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello Alex ... Ready to discover sustainable products? Ask away! 🌿' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header - Matches Dashboard */}
      <div className="h-16 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">GN</span>
            </div>
            <span className="text-emerald-800 text-xl font-semibold">GreenNexus</span>
          </div>
          
          {/* Welcome + Green Score */}
          <div className="flex items-center space-x-6">
            <div className="text-gray-700 text-base font-medium">Welcome back Alex</div>
            
            <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                <TrendingUpIcon size={14} className="text-white" />
              </div>
              <span className="text-emerald-800 text-sm font-medium">Green Score: 85</span>
            </div>
            
            {/* Profile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <UserIcon size={16} className="text-emerald-800" />
              </div>
              <span className="text-sm text-gray-600">AG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Matches Dashboard Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex space-x-6">
        {/* Sidebar - Matches Dashboard Nav Style */}
        <div className="w-56 bg-white rounded-lg shadow-sm border border-gray-200">
          <nav className="p-4 space-y-2">
            {/* Dashboard */}
            <a href="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
              <div className="w-5 h-5 text-gray-600">
                <HomeIcon size={16} />
              </div>
              <span className="text-sm font-medium text-gray-700">Dashboard</span>
            </a>

            {/* Activity Tracker */}
            <a href="/activity" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
              <div className="w-5 h-5 text-gray-600">
                <ActivityIcon size={16} />
              </div>
              <span className="text-sm font-medium text-gray-700">Activity Tracker</span>
            </a>

            {/* Waste Scanner */}
            <a href="/waste-scanner" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
              <div className="w-5 h-5 text-gray-600">
                <RecycleIcon size={16} />
              </div>
              <span className="text-sm font-medium text-gray-700">Waste Scanner</span>
            </a>

            {/* AI Marketplace - ACTIVE */}
            <a href="/marketplace" className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="w-5 h-5 text-emerald-600">
                <MessageCircleIcon size={16} />
              </div>
              <span className="text-sm font-medium text-emerald-800">AI Marketplace</span>
            </a>
          </nav>

          {/* User Profile Footer - Matches Dashboard */}
          <div className="absolute bottom-4 left-4 right-4 border-t border-gray-200 pt-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
                <UserIcon size={16} className="text-emerald-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">Alex Green</div>
                <div className="text-xs text-gray-500">Eco Enthusiast</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Using Card Like Dashboard */}
        <div className="flex-1 space-y-6">
          <Card className="p-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-emerald-800">AI Marketplace</h1>
              <p className="text-xl text-gray-600">
                Ask AI for eco-friendly product insights & detailed analysis
              </p>
            </div>
          </Card>

          {/* Chat Messages - Card Style */}
          <Card className="p-6 max-h-96 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md p-4 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                }`}>
                  <ReactMarkdown className="text-sm prose prose-sm max-w-none">
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-500 p-4 rounded-lg border border-gray-200 shadow-sm">
                  <span className="animate-pulse">AI is thinking... 🌿</span>
                </div>
              </div>
            )}
          </Card>

          {/* Input Area - Card Style */}
          <Card className="p-6">
            <div className="flex space-x-4 items-end">
              <input
                type="text"
                placeholder="Enter your message here..."
                className="flex-1 bg-gray-50 rounded-lg border border-gray-200 p-4 h-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !message.trim()}
                className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-600 transition disabled:opacity-50"
              >
                <MessageCircleIcon size={20} className="text-white" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;