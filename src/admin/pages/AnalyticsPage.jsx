import React, { useEffect, useState } from 'react';
import { BarChart2, CalendarCheck, Users, Trophy, Banknote } from 'lucide-react';
const BACKEND_API = import.meta.env.VITE_BACKEND_API;
const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${BACKEND_API}/api/admin/analytics`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const cards = [
    {
      title: 'Total Revenue',
      value: `₹${data?.totalRevenue || 0}`,
      icon: <Banknote className="w-6 h-6 text-green-600" />,
      bg: 'bg-green-50',
    },
    {
      title: 'Total Bookings',
      value: data?.totalBookings || 0,
      icon: <CalendarCheck className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      title: 'Total Users',
      value: data?.totalUsers || 0,
      icon: <Users className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-50',
    },
    {
      title: 'Total Courts',
      value: data?.totalCourts || 0,
      icon: <Trophy className="w-6 h-6 text-orange-600" />,
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6 pt-6">
      <h1 className="text-2xl font-medium text-spring-leaves-800 flex items-center gap-2">
        <BarChart2 className="w-6 h-6" /> Analytics Overview
      </h1>

      {loading ? (
        <div className="w-full flex justify-center items-center py-24">
          <div className="h-10 w-10 border-4 border-spring-leaves-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div key={card.title} className={`rounded-xl p-5 ${card.bg} shadow`}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-600">{card.title}</div>
                {card.icon}
              </div>
              <div className="mt-2 text-2xl font-bold text-gray-900">{card.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
