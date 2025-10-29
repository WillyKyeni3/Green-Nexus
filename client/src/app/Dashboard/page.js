'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  TrendingUpIcon,
  TrendingDownIcon,
  CoffeeIcon,
  CarIcon,
  ShoppingBagIcon,
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

// Simple Card component inline
const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [greenScore, setGreenScore] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get user data from localStorage
        const storedUser = localStorage.getItem('user');
        const storedUserId = localStorage.getItem('user_id');
        
        // Check if user is logged in
        if (!storedUser && !storedUserId) {
          console.log('No user logged in, redirecting to login');
          setError('Please log in to view your activities');
          setLoading(false);
          // Optionally redirect to login
          // window.location.href = '/login';
          return;
        }
        
        // Get user ID from either source
        let userId;
        if (storedUserId) {
          userId = parseInt(storedUserId);
        } else if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            userId = userData.id;
            // Store user_id for future use
            localStorage.setItem('user_id', userId.toString());
          } catch (e) {
            console.error('Error parsing user data:', e);
            setError('Error loading user data');
            setLoading(false);
            return;
          }
        }
        
        if (!userId) {
          setError('User ID not found. Please log in again.');
          setLoading(false);
          return;
        }
        
        console.log('Fetching activities for logged-in user:', userId); // Debug log
        
        const API_BASE = 'http://localhost:5000';
        const response = await fetch(`${API_BASE}/api/activities/${userId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched activities:', data); // Debug log
        console.log('Number of activities:', data.length); // Debug log
        
        if (Array.isArray(data) && data.length > 0) {
          // Calculate Green Score
          const score = calculateGreenScore(data);
          setGreenScore(score);
          console.log('Calculated green score:', score); // Debug log
          
          // Get monthly carbon data for chart
          const monthly = calculateMonthlyData(data);
          setMonthlyData(monthly);
          console.log('Monthly data:', monthly); // Debug log
          
          // Get recent activities (last 5)
          const recent = data
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);
          setRecentActivities(recent);
          console.log('Recent activities:', recent); // Debug log
        } else if (Array.isArray(data) && data.length === 0) {
          console.log('No activities found for this user');
          setRecentActivities([]);
          setGreenScore(0);
          setMonthlyData([]);
        } else {
          console.warn('Unexpected data format:', data);
          setError('Received unexpected data format from server');
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError(error.message || 'Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const calculateGreenScore = (activities) => {
    if (!activities || activities.length === 0) return 0;
    
    const totalCarbon = activities.reduce(
      (sum, activity) => sum + (parseFloat(activity.carbon_saved) || 0), 
      0
    );
    
    const daysTracked = Math.max(
      Math.ceil(
        (new Date() - new Date(activities[0].created_at)) / (1000 * 60 * 60 * 24)
      ),
      1
    );
    const avgPerDay = totalCarbon / daysTracked;
    const score = Math.max(0, Math.min(100, avgPerDay * 10));
    
    return Math.round(score);
  };

  const calculateMonthlyData = (activities) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTotals = {};
    
    activities.forEach(activity => {
      const date = new Date(activity.created_at);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthLabel = monthNames[date.getMonth()];
      
      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = { label: monthLabel, total: 0 };
      }
      monthlyTotals[monthKey].total += parseFloat(activity.carbon_saved) || 0;
    });
    
    const sortedMonths = Object.entries(monthlyTotals)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6);
    
    return sortedMonths.map(([key, data]) => ({
      label: data.label,
      value: Math.round(data.total * 10) / 10
    }));
  };

  const getActivityIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'transport':
      case 'transportation':
        return <CarIcon size={18} className="mr-3 text-gray-500" />;
      case 'food':
        return <CoffeeIcon size={18} className="mr-3 text-gray-500" />;
      case 'purchases':
      case 'shopping':
        return <ShoppingBagIcon size={18} className="mr-3 text-gray-500" />;
      default:
        return <CoffeeIcon size={18} className="mr-3 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const chartData = {
    labels: monthlyData.length > 0 
      ? monthlyData.map(m => m.label)
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Carbon Saved (kg CO₂)',
        data: monthlyData.length > 0
          ? monthlyData.map(m => m.value)
          : [0, 0, 0, 0, 0, 0],
        borderColor: '#34C759',
        backgroundColor: 'rgba(52, 199, 89, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Avg. User Carbon Saved (kg CO₂)',
        data: [350, 340, 330, 325, 320, 310],
        borderColor: '#4CA9FF',
        backgroundColor: 'rgba(76, 169, 255, 0.1)',
        tension: 0.4,
        borderDash: [5, 5],
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="space-y-6 p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800">
              Carbon Footprint Trends
            </h3>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <TrendingDownIcon size={16} className="mr-1" />
              Track your progress
            </div>
          </div>
          <div className="h-72">
            <Line data={chartData} options={chartOptions} />
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Green Score
          </h3>
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-4">
              <div className="w-full h-full rounded-full bg-green-100 flex items-center justify-center">
                <div className="text-5xl font-bold text-green-700">
                  {loading ? '...' : greenScore}
                </div>
              </div>
              <div className="absolute top-0 right-0 bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center">
                <TrendingUpIcon size={20} />
              </div>
            </div>
            <p className="text-gray-600 text-center mb-4">
              Your environmental impact score
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${greenScore}%` }}
              ></div>
            </div>
            <div className="flex justify-between w-full text-xs text-gray-500">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <CoffeeIcon size={20} className="text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">
              Recent Activities
            </h3>
          </div>
          <ul className="space-y-3">
            {loading ? (
              <li className="text-center py-4 text-gray-500">Loading activities...</li>
            ) : error ? (
              <li className="text-center py-4 text-red-500">
                Failed to load activities. Please try refreshing.
              </li>
            ) : recentActivities.length === 0 ? (
              <li className="text-center py-4 text-gray-500">
                No activities yet. Start tracking!
              </li>
            ) : (
              recentActivities.map((activity) => (
                <li 
                  key={activity.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    {getActivityIcon(activity.category)}
                    <div>
                      <p className="font-medium">{activity.activity_type}</p>
                      <p className="text-sm text-gray-500">
                        {activity.notes || `${activity.quantity} ${activity.unit}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">
                      {parseFloat(activity.carbon_saved).toFixed(2)} kg CO₂
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(activity.created_at)}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <TrendingUpIcon size={20} className="text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">
              AI Insights
            </h3>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3">
                <span className="font-bold text-green-600">AI</span>
              </div>
              <div>
                <p className="font-medium mb-1">
                  {recentActivities.length > 0 
                    ? `Great job! You've logged ${recentActivities.length} recent activities.`
                    : 'Start logging activities to get personalized insights!'
                  }
                </p>
                <p className="text-sm text-gray-600">
                  {recentActivities.length > 0
                    ? 'Keep up the good work reducing your carbon footprint.'
                    : 'Track your daily activities to see your environmental impact.'
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <h4 className="font-medium mb-2">Improvement Opportunities</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <span className="text-xs font-bold text-gray-800">1</span>
                </div>
                <p className="text-sm">
                  Switch to biking for trips under 3 miles
                </p>
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <span className="text-xs font-bold text-gray-800">2</span>
                </div>
                <p className="text-sm">
                  Reduce meat consumption by 1 meal per week
                </p>
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <span className="text-xs font-bold text-gray-800">3</span>
                </div>
                <p className="text-sm">Try shopping at local farmers market</p>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}