'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, LogOut, Lock } from 'lucide-react';

export default function EditProfile() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [profileImage, setProfileImage] = useState('/profile.jpeg');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '••••••••••••'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    // Get logged-in user data from localStorage
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    if (loggedInUser) {
      try {
        const userData = JSON.parse(loggedInUser);
        setFormData({
          username: userData.username || 'Alex chart',
          email: userData.email || 'alexchart@gmail.com',
          password: userData.password || 'mySecurePassword123'
        });
        setProfileImage(userData.profileImage || '/profile.jpeg');
      } catch (error) {
        console.error('Error loading user data:', error);
        // Set default values if there's an error
        setFormData({
          username: 'Alex chart',
          email: 'alexchart@gmail.com',
          password: 'mySecurePassword123'
        });
      }
    } else {
      // If no user is logged in, use default demo data
      // In production, you would redirect to login page
      setFormData({
        username: 'Alex chart',
        email: 'alexchart@gmail.com',
        password: 'mySecurePassword123'
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setPasswordError('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result;
        setProfileImage(imageUrl);
        
        // Update user data in localStorage
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        loggedInUser.profileImage = imageUrl;
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // Update user data in localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    loggedInUser.username = formData.username;
    loggedInUser.email = formData.email;
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleChangePassword = () => {
    setPasswordError('');
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    // Verify current password
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser.password !== passwordData.currentPassword) {
      setPasswordError('Current password is incorrect');
      return;
    }

    // Update password
    loggedInUser.password = passwordData.newPassword;
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

    setSuccessMessage('Password changed successfully!');
    setShowChangePasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const handleSignOut = () => {
    // Clear logged-in user data
    localStorage.removeItem('loggedInUser');
    // Redirect to landing page
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b">
        <button 
          onClick={handleBackToDashboard}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="ml-4 text-lg font-medium">Back to Dashboard</span>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="max-w-2xl mx-auto px-6 mt-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        </div>
      )}

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
              onChange={handleImageUpload}
            />
            <label htmlFor="profile-upload" className="cursor-pointer group">
              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover group-hover:opacity-80 transition-opacity border-4 border-gray-200"
              />
              <div className="absolute inset-0 flex items-center justify-center  bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all">
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Change Photo
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-8">
          {/* Username Field */}
          <div className="border-b border-gray-300 pb-2">
            <label className="block text-sm font-medium mb-2">Username</label>
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
            <label className="block text-sm font-medium mb-2">Email</label>
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
            <label className="block text-sm font-medium mb-2">Password</label>
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
              <button
                type="button"
                onClick={() => setShowChangePasswordModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                <Lock className="w-4 h-4" />
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={handleSaveProfile}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-base font-medium transition-colors"
          >
            Save Changes
          </button>
          
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-8 py-3 bg-green-100 hover:bg-green-200 rounded-lg text-base font-medium transition-colors"
          >
            Sign out
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
            
            {passwordError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {passwordError}
              </div>
            )}

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full outline-none"
                    placeholder="Enter current password"
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

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full outline-none"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="p-1"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full outline-none"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="p-1"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  setPasswordError('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}