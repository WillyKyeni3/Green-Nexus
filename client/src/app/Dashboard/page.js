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
import Card from '../components/common/Card';

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

const DashboardPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greenScore, setGreenScore] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
// ADD THIS ENTIRE FUNCTION:
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        
        // REPLACE WITH YOUR ACTUAL API ENDPOINT
        const response = await fetch('/api/activities'); 
        const data = await response.json();
        
        if (data.activities) {
          setActivities(data.activities);
          
          // Calculate Green Score
          const score = calculateGreenScore(data.activities);
          setGreenScore(score);
          
          // Get monthly carbon data for chart
          const monthly = calculateMonthlyData(data.activities);
          setMonthlyData(monthly);
          
          // Get recent activities (last 5)
          const recent = data.activities
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
          setRecentActivities(recent);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  
  // Calculate Green Score (0-100) based on carbon footprint
  const calculateGreenScore = (activities) => {
    if (!activities || activities.length === 0) return 0;
    
    // Calculate total carbon footprint
    const totalCarbon = activities.reduce(
      (sum, activity) => sum + (activity.carbonFootprint || 0), 
      0
    );
    
    // Calculate average per day (lower is better)
    const daysTracked = Math.max(
      Math.ceil(
        (new Date() - new Date(activities[0].date)) / (1000 * 60 * 60 * 24)
      ),
      1
    );
    const avgPerDay = totalCarbon / daysTracked;
    
    // Convert to score (example: 10 kg/day = 0, 0 kg/day = 100)
    // Adjust these numbers based on your app's logic
    const score = Math.max(0, Math.min(100, 100 - (avgPerDay * 10)));
    
    return Math.round(score);
  };

  // Calculate monthly carbon data for chart
  const calculateMonthlyData = (activities) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTotals = {};
    
    activities.forEach(activity => {
      const date = new Date(activity.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthLabel = monthNames[date.getMonth()];
      
      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = { label: monthLabel, total: 0 };
      }
      
      monthlyTotals[monthKey].total += activity.carbonFootprint || 0;
    });
    
    // Get last 6 months
    const sortedMonths = Object.entries(monthlyTotals)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6);
    
    return sortedMonths.map(([key, data]) => ({
      label: data.label,
      value: Math.round(data.total * 10) / 10
    }));
  };

  // Get icon for activity category
  const getActivityIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'transportation':
      case 'transport':
        return <CarIcon size={18} className="mr-3 text-gray-500" />;
      case 'food':
        return <CoffeeIcon size={18} className="mr-3 text-gray-500" />;
      case 'shopping':
        return <ShoppingBagIcon size={18} className="mr-3 text-gray-500" />;
      default:
        return <CoffeeIcon size={18} className="mr-3 text-gray-500" />;
    }
  };

  // Format date for display
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
        label: 'Carbon Footprint (kg CO₂)',
        data: monthlyData.length > 0
          ? monthlyData.map(m => m.value)
          : [320, 280, 300, 250, 220, 190],
        borderColor: '#34C759',
        backgroundColor: 'rgba(52, 199, 89, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Avg. User Footprint (kg CO₂)',
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
        beginAtZero: false,
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
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-primary-dark">
              Carbon Footprint Trends
            </h3>
            <div className="bg-primary-light text-primary-dark px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <TrendingDownIcon size={16} className="mr-1" />
              -15% this month
            </div>
          </div>
          <div className="h-72">
            <Line data={chartData} options={chartOptions} />
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-primary-dark mb-4">
            Green Score
          </h3>
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-4">
              <div className="w-full h-full rounded-full bg-primary-light flex items-center justify-center">
                <div className="text-5xl font-bold text-primary-dark">85</div>
              </div>
              <div className="absolute top-0 right-0 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center">
                <TrendingUpIcon size={20} />
              </div>
            </div>
            <p className="text-gray-600 text-center mb-4">
              Your score is better than 75% of users in your area.
            </p>
            <div className="w-full bg-neutral-gray rounded-full h-2 mb-1">
              <div
                className="bg-primary h-2 rounded-full"
                style={{
                  width: '85%',
                }}
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
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center mr-3">
              <CoffeeIcon size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-medium text-primary-dark">
              Recent Activities
            </h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center justify-between p-3 bg-soft-beige rounded-lg">
              <div className="flex items-center">
                <CarIcon size={18} className="mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Commute to Work</p>
                  <p className="text-sm text-gray-500">
                    Public Transit - 8.5 miles
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-primary-dark">1.2 kg CO₂</p>
                <p className="text-xs text-gray-500">Today</p>
              </div>
            </li>
            <li className="flex items-center justify-between p-3 bg-soft-beige rounded-lg">
              <div className="flex items-center">
                <ShoppingBagIcon size={18} className="mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Grocery Shopping</p>
                  <p className="text-sm text-gray-500">Local Market</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-primary-dark">3.5 kg CO₂</p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
            </li>
            <li className="flex items-center justify-between p-3 bg-soft-beige rounded-lg">
              <div className="flex items-center">
                <CoffeeIcon size={18} className="mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Coffee Shop</p>
                  <p className="text-sm text-gray-500">Brought Reusable Cup</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-primary-dark">0.3 kg CO₂</p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
            </li>
          </ul>
        </Card>
        <Card>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center mr-3">
              <TrendingUpIcon size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-medium text-primary-dark">
              AI Insights
            </h3>
          </div>
          <div className="p-4 bg-primary-light rounded-lg border border-primary/20 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3">
                <span className="font-bold text-primary">AI</span>
              </div>
              <div>
                <p className="font-medium mb-1">
                  Your Green Score rose by 10 points!
                </p>
                <p className="text-sm text-gray-600">
                  Great job reducing your transportation emissions by switching
                  to public transit.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-soft-beige rounded-lg mb-4">
            <h4 className="font-medium mb-2">Improvement Opportunities</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center mr-2">
                  <span className="text-xs font-bold text-primary-dark">1</span>
                </div>
                <p className="text-sm">
                  Switch to biking for trips under 3 miles
                </p>
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center mr-2">
                  <span className="text-xs font-bold text-primary-dark">2</span>
                </div>
                <p className="text-sm">
                  Reduce meat consumption by 1 meal per week
                </p>
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center mr-2">
                  <span className="text-xs font-bold text-primary-dark">3</span>
                </div>
                <p className="text-sm">Try shopping at local farmers market</p>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

