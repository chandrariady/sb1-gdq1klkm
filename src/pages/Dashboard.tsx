import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { SuperAdminDashboard } from '../components/dashboard/SuperAdminDashboard';
import { MentorDashboard } from '../components/dashboard/MentorDashboard';
import { MenteeDashboard } from '../components/dashboard/MenteeDashboard';
import { UserRole } from '../types/roles';

export function Dashboard() {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setRole(data?.role as UserRole || null);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold">Welcome to Mining Mentors</h1>
        <p className="mt-4 text-gray-600">Please sign in to access your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {role === 'superadmin' && <SuperAdminDashboard />}
      {role === 'mentor' && <MentorDashboard />}
      {role === 'mentee' && <MenteeDashboard />}
      
      {!role && (
        <div className="text-center py-8">
          <p className="text-gray-600">Role not assigned. Please contact an administrator.</p>
        </div>
      )}
    </div>
  );
}