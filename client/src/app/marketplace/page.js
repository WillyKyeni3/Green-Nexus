'use client';
import React, { useState } from 'react';
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
    <div className="space-y-6">
      {/* Header - Exactly like Dashboard */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 h-16 flex items-center justify-between">
          {/* Logo - Same as Dashboard */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">GN</span>
            </div>
            <span className="text-primary-dark text-xl font-semibold hidden sm:inline">GreenNexus</span>
          </div>
          
          {/* Welcome + Green Score - Same as Dashboard */}
          <div className="flex items-center space-x-6">
            <div className="text-gray-700 text-sm sm:text-base font-medium hidden sm:block">Welcome back Alex</div>
            
            <div className="bg-primary-light text-primary-dark px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-2 border border-primary/20">
              <TrendingUpIcon size={14} className="text-primary flex-shrink-0" />
              <span className="hidden sm:inline">Green Score: 85</span>
              <span className="sm:hidden">85</span>
            </div>
            
            {/* Profile - Same as Dashboard */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                <UserIcon size={16} className="text-primary" />
              </div>
              <span className="text-sm text-gray-600 hidden sm:inline">AG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container - Matches Dashboard Layout */}
      <div className="px-4 flex gap-6">
        {/* Sidebar - Exactly like Dashboard */}
        <aside className="w-56 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
            {/* Navigation */}
            <nav className="p-4 space-y-1">
              {/* Dashboard */}
              <a 
                href="/dashboard" 
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-primary-light hover:text-primary transition-colors"
              >
                <HomeIcon size={18} className="flex-shrink-0" />
                <span className="text-sm font-medium">Dashboard</span>
              </a>

              {/* Activity Tracker */}
              <a 
                href="/activity" 
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-primary-light hover:text-primary transition-colors"
              >
                <ActivityIcon size={18} className="flex-shrink-0" />
                <span className="text-sm font-medium">Activity Tracker</span>
              </a>

              {/* Waste Scanner */}
              <a 
                href="/waste-scanner" 
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-primary-light hover:text-primary transition-colors"
              >
                <RecycleIcon size={18} className="flex-shrink-0" />
                <span className="text-sm font-medium">Waste Scanner</span>
              </a>

              {/* AI Marketplace - ACTIVE */}
              <a 
                href="/marketplace" 
                className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary-light text-primary border border-primary/20 font-medium"
              >
                <MessageCircleIcon size={18} className="flex-shrink-0" />
                <span className="text-sm font-medium">AI Marketplace</span>
              </a>
            </nav>

            {/* Divider */}
            <div className="border-t border-gray-200 mx-4"></div>

            {/* User Profile Footer */}
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon size={16} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-primary-dark truncate">Alex Green</p>
                  <p className="text-xs text-gray-600 truncate">Eco Enthusiast</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - Matches Dashboard Grid Layout */}
        <main className="flex-1 min-w-0">
          <div className="space-y-6">
            {/* Title Card */}
            <Card className="p-6 border-b-2 border-primary/10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-primary-dark">
                    AI Marketplace
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Chat with AI for eco-friendly product recommendations
                  </p>
                </div>
                <div className="bg-primary-light text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 border border-primary/20">
                  <MessageCircleIcon size={16} />
                  <span>Active</span>
                </div>
              </div>
            </Card>

            {/* Chat Messages Container - Card Style */}
            <Card className="p-6 max-h-[500px] overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white rounded-br-none' 
                          : 'bg-neutral-gray text-primary-dark rounded-bl-none border border-gray-200'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
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

            {/* Input Area - Card Style */}
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
    </div>
  );
};

export default MarketplacePage;