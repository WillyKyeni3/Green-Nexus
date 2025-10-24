'use client';
import React, { useState } from 'react';
import {
  MessageCircleIcon,
  BellIcon,
  ChevronDownIcon,
} from 'lucide-react';
import Card from '../components/common/Card';

const MarketplacePage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello Alex ... Ready to discover sustainable products? Ask away! 🌿' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* TOPBAR HEADER WITH LOGO */}
      <header className="bg-white border-b border-neutral-gray py-3 px-6 flex items-center justify-between sticky top-0 z-50">
        {/* Logo + Name on Left */}
        <h1 className="text-2xl font-bold text-primary-dark flex items-center">
          <img 
            src="/leaflogo.png" 
            alt="GreenNexus Logo" 
            className="h-10 w-10 object-contain rotate-[-55.7deg] mr-2"
          />
          GreenNexus
        </h1>

        {/* Welcome Message - Center */}
        <div>
          <h2 className="text-lg font-medium text-gray-700">Welcome back, Alex!</h2>
        </div>

        <div className="flex items-center space-x-5">
          {/* Green Score */}
          <div className="flex items-center bg-primary-light px-4 py-2 rounded-full">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mr-2">
              <span className="text-xs font-bold text-white">GS</span>
            </div>
            <span className="font-medium text-primary-dark">Green Score: 85</span>
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button className="relative p-2 rounded-full hover:bg-neutral-gray/30">
              <BellIcon width={20} height={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative">
            <button className="flex items-center space-x-2 focus:outline-none">
              <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
                <span className="font-medium text-primary-dark">AG</span>
              </div>
              <ChevronDownIcon width={16} height={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout with Collapsible Sidebar */}
      <div className="flex flex-1 relative">
        {/* SIDEBAR - Collapsible on Hover (Desktop) or Toggle (Mobile) */}
        <aside 
          className={`bg-white shadow-lg flex flex-col fixed lg:relative h-full transition-all duration-300 ease-in-out z-40 ${
            sidebarOpen ? 'w-64' : 'w-20'
          }`}
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
        >
          {/* Navigation */}
          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-2">
              {/* Dashboard */}
              <li>
                <a 
                  className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-primary-light/50 transition-colors group relative" 
                  href="/Dashboard"
                  title="Dashboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house mr-3 flex-shrink-0" aria-hidden="true">
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                  <span className={`whitespace-nowrap transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Dashboard</span>
                  {!sidebarOpen && <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">Dashboard</div>}
                </a>
              </li>

              {/* Activity Tracker */}
              <li>
                <a 
                  className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-primary-light/50 transition-colors group relative" 
                  href="/activity"
                  title="Activity Tracker"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-no-axes-column mr-3 flex-shrink-0" aria-hidden="true">
                    <path d="M5 21v-6"></path>
                    <path d="M12 21V3"></path>
                    <path d="M19 21V9"></path>
                  </svg>
                  <span className={`whitespace-nowrap transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Activity Tracker</span>
                  {!sidebarOpen && <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">Activity</div>}
                </a>
              </li>

              {/* Waste Scanner */}
              <li>
                <a 
                  className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-primary-light/50 transition-colors group relative" 
                  href="/waste-scanner"
                  title="Waste Scanner"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf mr-3 flex-shrink-0" aria-hidden="true">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                  </svg>
                  <span className={`whitespace-nowrap transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Waste Scanner</span>
                  {!sidebarOpen && <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">Waste</div>}
                </a>
              </li>

              {/* Marketplace - ACTIVE */}
              <li>
                <a 
                  className="flex items-center p-3 rounded-lg bg-primary-light text-primary font-medium group relative" 
                  href="/marketplace"
                  title="Marketplace"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag mr-3 flex-shrink-0" aria-hidden="true">
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                    <path d="M3.103 6.034h17.794"></path>
                    <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"></path>
                  </svg>
                  <span className={`whitespace-nowrap transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Marketplace</span>
                  {!sidebarOpen && <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">Marketplace</div>}
                </a>
              </li>

              {/* User Profile */}
              <li>
                <a 
                  className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-primary-light/50 transition-colors group relative" 
                  href="/UserProfile"
                  title="User Profile"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user mr-3 flex-shrink-0" aria-hidden="true">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span className={`whitespace-nowrap transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>User Profile</span>
                  {!sidebarOpen && <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">Profile</div>}
                </a>
              </li>
            </ul>
          </nav>

          {/* User Profile Footer */}
          <div className={`p-4 border-t border-neutral-gray transition-all duration-300 overflow-hidden ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user text-primary" aria-hidden="true">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium text-primary-dark">Alex Green</p>
                <p className="text-sm text-gray-500">Eco Enthusiast</p>
              </div>
            </div>
          </div>
        </aside>

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
    </div>
  );
};

export default MarketplacePage;