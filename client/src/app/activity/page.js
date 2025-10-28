'use client';
import React, { useState, useEffect } from 'react';
import {
  BellIcon,
  ChevronDownIcon,
  Loader,
  AlertCircle,
} from 'lucide-react';
import Card from '../components/common/Card';

const ActivityPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form state
  const [activityType, setActivityType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Food');
  const [notes, setNotes] = useState('');
  
  // Data state
  const [activities, setActivities] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [categories, setCategories] = useState(['Transport', 'Food', 'Purchases']);
  
  const userId = 1; // Replace with actual user ID from auth context

  // Fetch activity types on mount
  useEffect(() => {
    fetchActivityTypes();
    fetchActivities();
    fetchWeeklyStats();
  }, []);

  // Fetch available activity types
  const fetchActivityTypes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/activities/types`);
      if (!response.ok) throw new Error('Failed to fetch activity types');
      
      const data = await response.json();
      setActivityTypes(data.activity_types || []);
      console.log('✅ Activity types loaded:', data.activity_types);
    } catch (err) {
      console.error('Error fetching activity types:', err);
      // Fallback to default types
      setActivityTypes(['Cycling', 'Public Transit', 'Vegetarian Meal', 'Recycling', 'Walking']);
    }
  };

  // Fetch user activities
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/activities/${userId}?limit=10`);
      if (!response.ok) throw new Error('Failed to fetch activities');
      
      const data = await response.json();
      
      // Format activities for display
      const formattedActivities = data.map((activity) => ({
        id: activity.id,
        activity: activity.activity_type,
        date: new Date(activity.created_at).toLocaleDateString(),
        impact: `${activity.carbon_saved.toFixed(2)} kg CO₂`,
        quantity: `${activity.quantity} ${activity.unit}`,
      }));
      
      setActivities(formattedActivities);
      console.log('✅ Activities loaded:', formattedActivities.length);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  // Fetch weekly statistics
  const fetchWeeklyStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/activities/weekly-stats/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch weekly stats');
      
      const data = await response.json();
      setWeeklyStats(data);
      console.log('✅ Weekly stats loaded:', data);
    } catch (err) {
      console.error('Error fetching weekly stats:', err);
    }
  };

  // Get unit based on activity type
  const getUnitForActivityType = (type) => {
    const unitMap = {
      'Cycling': 'km',
      'Public Transit': 'km',
      'Walking': 'km',
      'Vegetarian Meal': 'meals',
      'Recycling': 'kg',
      'Energy Conservation': 'kWh',
      'Water Conservation': 'liters',
    };
    return unitMap[type] || '';
  };

  // Handle activity type change
  const handleActivityTypeChange = (e) => {
    const type = e.target.value;
    setActivityType(type);
    // Auto-set unit based on activity type
    const autoUnit = getUnitForActivityType(type);
    setUnit(autoUnit);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!activityType || !quantity || !unit) {
      setError('Please fill in all required fields');
      return;
    }

    if (isNaN(quantity) || parseFloat(quantity) <= 0) {
      setError('Quantity must be a positive number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      console.log('📤 Submitting activity:', {
        user_id: userId,
        activity_type: activityType,
        quantity: parseFloat(quantity),
        unit,
        category: selectedCategory,
        notes,
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/activities/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          activity_type: activityType,
          quantity: parseFloat(quantity),
          unit,
          category: selectedCategory,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to log activity');
      }

      console.log('✅ Activity logged successfully:', data);
      
      // Show success message
      setSuccess(`🎉 Activity logged! You saved ${data.carbon_saved.toFixed(2)} kg CO₂`);

      // Reset form
      setActivityType('');
      setQuantity('');
      setUnit('');
      setNotes('');

      // Refresh activities and stats
      setTimeout(() => {
        fetchActivities();
        fetchWeeklyStats();
        setSuccess(null);
      }, 2000);

    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message || 'Failed to log activity');
    } finally {
      setLoading(false);
    }
  };

  // Delete activity
  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/activities/${userId}/${activityId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete activity');

      console.log('✅ Activity deleted successfully');
      setSuccess('Activity deleted');
      
      // Refresh activities
      setTimeout(() => {
        fetchActivities();
        fetchWeeklyStats();
        setSuccess(null);
      }, 1500);

    } catch (err) {
      console.error('❌ Error deleting activity:', err);
      setError('Failed to delete activity');
    } finally {
      setLoading(false);
    }
  };

  // Get chart heights based on day activity
  const getChartHeights = () => {
    if (!weeklyStats?.daily_stats) return [40, 50, 45, 60, 55, 65, 70];
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.map(day => {
      const dayData = weeklyStats.daily_stats[day];
      return dayData ? Math.min(dayData.count * 20 + 40, 150) : 40;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      
        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-medium text-gray-900 mb-2">Log Your Activities</h1>
              <p className="text-green-600 text-sm">Track your daily activities to understand your environmental impact and improve your Green Score.</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-4 bg-red-501 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle width={20} height={20} className="text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <span className="text-green-800">{success}</span>
              </div>
            )}

            <div className="flex gap-6">
              {/* Left Column - Activity Form & Recent Activities */}
              <div className="flex-1 space-y-6">
                {/* Tab Navigation */}
                <div className="flex gap-8 border-b border-gray-200">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`pb-3 border-b-4 transition-colors ${
                        selectedCategory === cat
                          ? 'border-primary text-green-600 font-medium'
                          : 'border-gray-200 text-gray-900 hover:text-primary'
                      } text-sm font-medium`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Log Activity Form */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Log Activity</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Activity Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Activity Type *
                        </label>
                        <select
                          value={activityType}
                          onChange={handleActivityTypeChange}
                          className="w-full h-12 px-4 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-300 transition-colors"
                          disabled={loading}
                        >
                          <option value="">Select Activity Type</option>
                          {activityTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity/Distance */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Quantity/Distance *
                        </label>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          placeholder="Enter Quantity/Distance"
                          step="0.01"
                          min="0"
                          className="w-full h-12 px-4 rounded-lg border border-gray-200 text-gray-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-300 transition-colors"
                          disabled={loading}
                        />
                      </div>

                      {/* Unit */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Unit *
                        </label>
                        <input
                          type="text"
                          value={unit}
                          readOnly
                          className="w-full h-12 px-4 rounded-lg border border-gray-200 text-gray-600 bg-gray-50 focus:outline-none"
                          placeholder="Auto-set based on activity"
                        />
                        <p className="text-xs text-gray-500 mt-1">Unit is automatically set based on activity type</p>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Notes (Optional)
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add any notes about this activity..."
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-300 transition-colors resize-none"
                          rows="3"
                          disabled={loading}
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end pt-4 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setActivityType('');
                            setQuantity('');
                            setUnit('');
                            setNotes('');
                          }}
                          className="px-6 h-10 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50"
                          disabled={loading}
                        >
                          Clear
                        </button>
                        <button
                          type="submit"
                          className="px-6 h-10 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader width={16} height={16} className="animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            'Submit Activity'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </Card>

                {/* Recent Activities Table */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
                    
                    {activities.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No activities logged yet. Start by submitting your first activity!</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Activity</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Quantity</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Impact</th>
                              <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activities.map((activity, idx) => (
                              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{activity.activity}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{activity.quantity}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{activity.date}</td>
                                <td className="px-4 py-3 text-sm text-green-600 font-medium">{activity.impact}</td>
                                <td className="px-4 py-3 text-center">
                                  <button
                                    onClick={() => handleDeleteActivity(activity.id)}
                                    className="text-red-600 hover:text-red-700 hover:underline text-sm font-medium transition-colors disabled:opacity-50"
                                    disabled={loading}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Right Column - Weekly Activity Chart */}
              <div className="w-96">
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Weekly Activity</h3>
                    
                    {/* Bar Chart */}
                    <div className="flex items-end justify-between gap-2 h-48 mb-6">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                        const heights = getChartHeights();
                        return (
                          <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                            <div 
                              className="w-full bg-gray-100 rounded-t hover:bg-primary transition-all cursor-pointer"
                              style={{height: `${heights[idx]}px`}}
                              title={`${day}: ${weeklyStats?.daily_stats?.[['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][idx]]?.count || 0} activities`}
                            ></div>
                            <span className="text-xs font-medium text-green-600">{day}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Stats */}
                    <div className="space-y-3 border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Total CO₂ Saved:</span>
                        </p>
                        <p className="text-primary font-bold text-lg">
                          {weeklyStats?.total_carbon_saved?.toFixed(2) || '0.00'} kg
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Activities Logged:</span>
                        </p>
                        <p className="text-primary font-bold text-lg">
                          {weeklyStats?.total_activities || '0'}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Period:</span>
                        </p>
                        <p className="text-gray-900 font-medium text-sm">
                          Last 7 days
                        </p>
                      </div>
                    </div>

                    {/* Refresh Button */}
                    <button
                      onClick={() => {
                        fetchActivities();
                        fetchWeeklyStats();
                      }}
                      className="w-full mt-4 px-4 py-2 bg-primary-light text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium text-sm"
                      disabled={loading}
                    >
                      {loading ? 'Refreshing...' : 'Refresh Stats'}
                    </button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
  
  );
};

export default ActivityPage;