'use client';
import React, { useState } from 'react';
import {
  BellIcon,
  ChevronDownIcon,
} from 'lucide-react';
import Card from '../components/common/Card';

const ActivityPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activityType, setActivityType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [activities, setActivities] = useState([
    { activity: 'Public Transit', date: 'Today', impact: '2.5 kg CO₂' },
    { activity: 'Recycling', date: 'Yesterday', impact: '1.2 kg CO₂' },
    { activity: 'Cycling', date: '2 days ago', impact: '0.8 kg CO₂' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activityType && quantity && unit) {
      const newActivity = {
        activity: activityType,
        date: 'Today',
        impact: `${quantity} ${unit}`,
      };
      setActivities([newActivity, ...activities]);
      setActivityType('');
      setQuantity('');
      setUnit('');
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
        {/* SIDEBAR - Collapsible on Hover */}
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

              {/* Activity Tracker - ACTIVE */}
              <li>
                <a 
                  className="flex items-center p-3 rounded-lg bg-primary-light text-primary font-medium group relative" 
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

              {/* Marketplace */}
              <li>
                <a 
                  className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-primary-light/50 transition-colors group relative" 
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
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-medium text-gray-900 mb-2">Log Your Activities</h1>
              <p className="text-green-600 text-sm">Track your daily activities to understand your environmental impact and improve your Green Score.</p>
            </div>

            <div className="flex gap-6">
              {/* Left Column - Activity Form & Recent Activities */}
              <div className="flex-1 space-y-6">
                {/* Tab Navigation */}
                <div className="flex gap-8 border-b border-gray-200">
                  <button className="pb-3 border-b-4 border-gray-200 text-gray-900 text-sm font-medium hover:text-primary">
                    Transport
                  </button>
                  <button className="pb-3 border-b-4 border-primary text-green-600 text-sm font-medium">
                    Food
                  </button>
                  <button className="pb-3 border-b-4 border-gray-200 text-green-600 text-sm font-medium hover:text-primary">
                    Purchases
                  </button>
                </div>

                {/* Log Activity Form */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Log Activity</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Activity Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Activity Type
                        </label>
                        <select
                          value={activityType}
                          onChange={(e) => setActivityType(e.target.value)}
                          className="w-full h-12 px-4 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Select Activity Type</option>
                          <option value="Walking">Walking</option>
                          <option value="Cycling">Cycling</option>
                          <option value="Public Transit">Public Transit</option>
                          <option value="Vegetarian Meal">Vegetarian Meal</option>
                          <option value="Recycling">Recycling</option>
                        </select>
                      </div>

                      {/* Quantity/Distance */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Quantity/Distance
                        </label>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          placeholder="Enter Quantity/Distance"
                          className="w-full h-12 px-4 rounded-lg border border-gray-200 text-gray-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      {/* Unit */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Unit
                        </label>
                        <select
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
                          className="w-full h-12 px-4 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Select Unit</option>
                          <option value="km">Kilometers</option>
                          <option value="miles">Miles</option>
                          <option value="minutes">Minutes</option>
                          <option value="meals">Meals</option>
                          <option value="kg">Kilograms</option>
                        </select>
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end pt-4">
                        <button
                          type="submit"
                          className="px-6 h-10 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                        >
                          Submit Activity
                        </button>
                      </div>
                    </form>
                  </div>
                </Card>

                {/* Recent Activities Table */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Activity</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Impact</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activities.map((activity, idx) => (
                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">{activity.activity}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{activity.date}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{activity.impact}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - Weekly Activity Chart */}
              <div className="w-96">
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Weekly Activity</h3>
                    
                    {/* Bar Chart */}
                    <div className="flex items-end justify-between gap-2 h-48">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                        const heights = [60, 75, 45, 80, 50, 65, 70];
                        return (
                          <div key={idx} className="flex flex-col items-center gap-2">
                            <div className="w-8 bg-gray-100 rounded-t transition-all hover:bg-primary" style={{height: `${heights[idx]}px`}}></div>
                            <span className="text-xs font-medium text-green-600">{day}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 space-y-2 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium text-gray-900">Total CO₂ Saved:</span> 12.5 kg
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium text-gray-900">Activities Logged:</span> 15
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActivityPage;