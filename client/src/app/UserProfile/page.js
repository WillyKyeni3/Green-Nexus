'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, LogOut, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function EditProfile() {
  const { user, logout } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [profileImage, setProfileImage] = useState('/profile.jpeg');
  const [formData, setFormData] = useState({
    name: '',
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
  }, [user]);

  const loadUserData = () => {
    // Get logged-in user data from AuthContext or localStorage
    let userData = user;
    
    if (!userData) {
      // Fallback to localStorage if AuthContext hasn't loaded yet
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          userData = JSON.parse(storedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
    
    if (userData) {
      setFormData({
        name: userData.name || userData.username || 'User',
        email: userData.email || '',
        password: '••••••••••••'
      });
      
      // Load profile image from localStorage if exists
      const savedImage = localStorage.getItem(`profileImage_${userData.id}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
      
      // Store user_id for Dashboard activities
      if (userData.id) {
        localStorage.setItem('user_id', userData.id.toString());
      }
    } else {
      // If no user is logged in, redirect to login
      window.location.href = '/login';
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
        
        // Save profile image to localStorage with user-specific key
        const userData = user || JSON.parse(localStorage.getItem('user'));
        if (userData?.id) {
          localStorage.setItem(`profileImage_${userData.id}`, imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const userData = user || JSON.parse(localStorage.getItem('user'));
      
      if (!token || !userData?.id) {
        setPasswordError('Authentication required');
        return;
      }

      // Call your backend API to update profile
      const response = await fetch(`http://localhost:5000/api/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify({
          ...userData,
          name: formData.name,
          email: formData.email
        }));
        
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const error = await response.json();
        setPasswordError(error.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Fallback: Update localStorage only if backend fails
      const userData = user || JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({
        ...userData,
        name: formData.name,
        email: formData.email
      }));
      
      setSuccessMessage('Profile updated locally!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleChangePassword = async () => {
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

    try {
      const token = localStorage.getItem('access_token');
      const userData = user || JSON.parse(localStorage.getItem('user'));
      
      if (!token || !userData?.id) {
        setPasswordError('Authentication required');
        return;
      }

      // Call your backend API to change password
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword
        })
      });

      if (response.ok) {
        setSuccessMessage('Password changed successfully!');
        setShowChangePasswordModal(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const error = await response.json();
        setPasswordError(error.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('Network error. Please try again.');
    }
  };

  const handleBackToDashboard = () => {
    window.location.href = '/Dashboard';
  };

  const handleSignOut = () => {
    // Use the logout function from AuthContext
    logout();
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
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all">
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Change Photo
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-8">
          {/* Name Field */}
          <div className="border-b border-gray-300 pb-2">
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
                readOnly
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