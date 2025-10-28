// client/src/components/layout/TopBar.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BellIcon, ChevronDownIcon } from 'lucide-react';

const TopBar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [greenScore, setGreenScore] = useState(0);
  const [userName, setUserName] = useState('User');
  const [userInitials, setUserInitials] = useState('U');

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
        
        // Get initials (first letter of first and last name)
        const nameParts = name.split(' ');
        if (nameParts.length >= 2) {
          setUserInitials(nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase());
        } else {
          setUserInitials(name.substring(0, 2).toUpperCase());
        }

        // Get green score
        setGreenScore(userData.green_score || 85);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  };

  const handleBackTouserprofile = () => {
    window.location.href = '/UserProfile';
  };

  const handleBackTologout = () => {
    // Clear user data
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    window.location.href = '/';
  };

  return (
    <header className="bg-white border-b border-neutral-gray py-5 px-6 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-medium text-gray-700">
          Welcome back, {userName}!
        </h2>
      </div>
      <div className="flex items-center space-x-5">
        <div className="flex items-center bg-primary-light px-4 py-2 rounded-full">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mr-2">
            <span className="text-xs font-bold text-white">GS</span>
          </div>
          <span className="font-medium text-primary-dark">
            Green Score: {greenScore}
          </span>
        </div>
        <div className="relative">
          <button
            className="relative p-2 rounded-full hover:bg-neutral-gray/30"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <BellIcon size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-10 border border-neutral-gray">
              <div className="px-4 py-2 border-b border-neutral-gray">
                <h3 className="font-medium">Notifications</h3>
              </div>
              <div className="px-4 py-2 hover:bg-primary-light/30 cursor-pointer">
                <p className="text-sm font-medium">
                  Your Green Score increased!
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
              <div className="px-4 py-2 hover:bg-primary-light/30 cursor-pointer">
                <p className="text-sm font-medium">
                  New eco-friendly product available
                </p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="font-medium text-white text-sm">{userInitials}</span>
            </div>
            <ChevronDownIcon size={16} />
          </button>
          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-neutral-gray">
              <Link
                onClick={handleBackTouserprofile}
                href="/UserProfile"
                className="block px-4 py-2 text-sm hover:bg-primary-light/30"
              >
                Profile
              </Link>
              <button
                onClick={handleBackTologout}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-primary-light/30"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;