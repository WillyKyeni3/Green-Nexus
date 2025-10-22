'use client';

import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, LogOut } from 'lucide-react';

export default function EditProfile() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: 'Alex chart',
    email: 'alexchart@gmail.com',
    password: '••••••••••••'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignOut = () => {
    // Handle sign out logic here
    console.log('Signing out...');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b">
        <button className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-12">Edit profile</h1>

        {/* Profile Picture */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const img = document.getElementById('profile-img');
                    if (img) img.src = e.target?.result;
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <label htmlFor="profile-upload" className="cursor-pointer group">
              <img
                id="profile-img"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all">
                <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Change
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-8">
          {/* Username Field */}
          <div className="border-b border-gray-300 pb-2">
            <label className="block text-sm font-medium mb-2">username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full text-lg outline-none"
            />
          </div>

          {/* Email Field */}
          <div className="border-b border-gray-300 pb-2">
            <label className="block text-sm font-medium mb-2">email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full text-lg outline-none"
            />
          </div>

          {/* Password Field */}
          <div className="border-b border-gray-300 pb-2">
            <label className="block text-sm font-medium mb-2">password</label>
            <div className="flex items-center gap-2">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full text-lg outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="flex justify-end mt-12">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-8 py-3 bg-green-100 hover:bg-green-200 rounded-lg text-base font-medium transition-colors"
          >
            Sign out
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}