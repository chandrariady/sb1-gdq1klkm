import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Progress {
  completedModules: number;
  totalModules: number;
}

interface UserProgress {
  status: string;
}

export function MenteeDashboard() {
  const [progress, setProgress] = useState<Progress>({
    completedModules: 0,
    totalModules: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: userProgress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);

        const { data: totalModules } = await supabase
          .from('modules')
          .select('*', { count: 'exact' });

        setProgress({
          completedModules: (userProgress as UserProgress[] || []).filter(p => p.status === 'completed').length,
          totalModules: totalModules?.length || 0,
        });
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-900">Welcome Back!</h2>
        <p className="mt-2 text-gray-600">Track your progress and connect with your mentor.</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900">Learning Progress</h3>
          <div className="mt-4">
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                <div
                  style={{ width: `${(progress.completedModules / progress.totalModules) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                />
              </div>
              <p className="text-sm text-gray-600">
                {progress.completedModules} of {progress.totalModules} modules completed
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900">Next Session</h3>
          <div className="mt-4">
            <p className="text-gray-600">No upcoming sessions</p>
            <button className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Schedule Session
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900">Your Mentor</h3>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200"></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Not Assigned</p>
                <p className="text-sm text-gray-500">Find a mentor to get started</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Path */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900">Your Learning Path</h3>
        <div className="mt-4">
          <div className="space-y-4">
            {[1, 2, 3].map((module) => (
              <div key={module} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-indigo-600">{module}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Module {module}</p>
                    <p className="text-sm text-gray-500">Not started</p>
                  </div>
                </div>
                <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}