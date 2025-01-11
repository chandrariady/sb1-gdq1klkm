import { useState, useEffect } from 'react';
import { DashboardStats } from '../../types/roles';
import { supabase } from '../../lib/supabase';

export function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalSessions: 0,
    completionRate: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: users } = await supabase
          .from('profiles')
          .select('role', { count: 'exact' });

        const { data: sessions } = await supabase
          .from('mentorship_matches')
          .select('*', { count: 'exact' });

        setStats({
          totalUsers: users?.length || 0,
          totalSessions: sessions?.length || 0,
          activeUsers: 0,
          completionRate: 0,
          revenue: 0
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Active Users</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">{stats.activeUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Sessions</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">{stats.totalSessions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Revenue</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">${stats.revenue}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">User Management</h3>
          <div className="mt-4 space-y-4">
            <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500">
              Manage Users
            </button>
            <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500">
              Role Assignments
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">System Configuration</h3>
          <div className="mt-4 space-y-4">
            <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500">
              Platform Settings
            </button>
            <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500">
              API Integrations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}