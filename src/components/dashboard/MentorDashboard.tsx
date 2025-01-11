import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Mentee {
  id: string;
  full_name: string;
  avatar_url: string;
}

interface MentorshipMatch {
  id: string;
  created_at: string;
  mentee: Mentee;
}

export function MentorDashboard() {
  const [mentees, setMentees] = useState<MentorshipMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMentees() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        const { data: matches } = await supabase
          .from('mentorship_matches')
          .select(`
            *,
            mentee:mentee_id(
              id,
              full_name,
              avatar_url
            )
          `)
          .eq('mentor_id', user?.id);

        setMentees(matches || []);
      } catch (error) {
        console.error('Error loading mentees:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMentees();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Active Mentees</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">{mentees.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Upcoming Sessions</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Average Rating</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">4.8</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">My Mentees</h3>
        <div className="mt-4">
          {mentees.length === 0 ? (
            <p className="text-gray-500">No mentees assigned yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {mentees.map((match) => (
                <li key={match.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {match.mentee.full_name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        Started {new Date(match.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                        View Details
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}