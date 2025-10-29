// client/src/app/components/layout/Sidebar.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  HomeIcon,
  LeafyGreenIcon,
  BarChart2Icon,
  ScanQrCodeIcon,
  ShoppingBagIcon,
  UserIcon,
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState('User');
  const [userInitial, setUserInitial] = useState('U');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const name = userData.name || userData.username || 'User';
        setUserName(name);
        
        // Get first letter of name
        setUserInitial(name.charAt(0).toUpperCase());
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  };

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <aside
      className={`bg-white shadow-lg flex flex-col fixed lg:relative h-full transition-all duration-300 ease-in-out z-40 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
      onMouseEnter={() => setSidebarOpen(true)}
      onMouseLeave={() => setSidebarOpen(false)}
    >
      {/* Logo/Header — Icon always visible, text collapses */}
      <div className="p-4 border-b border-neutral-gray flex items-center transition-all duration-300">
        {/* Always show icon */}
        <div className="flex items-center justify-center w-12 h-12">
          <LeafyGreenIcon className="mr-2 text-primary-dark" size={24} />
        </div>
        {/* Text appears only when open */}
        <span
          className={`text-2xl font-bold text-primary-dark transition-all duration-300 whitespace-nowrap overflow-hidden ${
            sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
          }`}
        >
          GreenNexus
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <Link
              href="/Dashboard"
              className={`flex items-center p-3 rounded-lg text-gray-600 hover:bg-primary-light/50 transition-colors group relative ${
                isActive('/Dashboard') ? 'bg-primary-light text-primary-dark font-medium' : ''
              }`}
              title="Dashboard"
            >
              <HomeIcon className="mr-3 flex-shrink-0" size={20} />
              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                }`}
              >
                Dashboard
              </span>
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  Dashboard
                </div>
              )}
            </Link>
          </li>

          {/* Activity Tracker */}
          <li>
            <Link
              href="/activity"
              className={`flex items-center p-3 rounded-lg text-gray-600 hover:bg-primary-light/50 transition-colors group relative ${
                isActive('/activity') ? 'bg-primary-light text-primary-dark font-medium' : ''
              }`}
              title="Activity Tracker"
            >
              <BarChart2Icon className="mr-3 flex-shrink-0" size={20} />
              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                }`}
              >
                Activity Tracker
              </span>
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  Activity
                </div>
              )}
            </Link>
          </li>

          {/* Waste Scanner */}
          <li>
            <Link
              href="/waste-scanner"
              className={`flex items-center p-3 rounded-lg text-gray-600 hover:bg-primary-light/50 transition-colors group relative ${
                isActive('/waste-scanner') ? 'bg-primary-light text-primary-dark font-medium' : ''
              }`}
              title="Waste Scanner"
            >
              <ScanQrCodeIcon className="mr-3 flex-shrink-0" size={20} />
              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                }`}
              >
                Waste Scanner
              </span>
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  Waste
                </div>
              )}
            </Link>
          </li>

          {/* Marketplace */}
          <li>
            <Link
              href="/marketplace"
              className={`flex items-center p-3 rounded-lg text-gray-600 hover:bg-primary-light/50 transition-colors group relative ${
                isActive('/marketplace') ? 'bg-primary-light text-primary-dark font-medium' : ''
              }`}
              title="Marketplace"
            >
              <ShoppingBagIcon className="mr-3 flex-shrink-0" size={20} />
              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                }`}
              >
                Marketplace
              </span>
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  Marketplace
                </div>
              )}
            </Link>
          </li>
        </ul>
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-neutral-gray transition-all duration-300">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">{userInitial}</span>
          </div>
          <div
            className={`ml-3 transition-all duration-300 overflow-hidden whitespace-nowrap ${
              sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
            }`}
          >
            <p className="font-medium text-primary-dark">{userName}</p>
            <p className="text-sm text-gray-500">Eco Enthusiast</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;