import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Curriculum {
  id: string;
  title: string;
  description: string;
  industry_focus: string[];
}

export function Curriculum() {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCurriculums() {
      try {
        const { data, error } = await supabase
          .from('curriculums')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;
        setCurriculums(data || []);
      } catch (error) {
        console.error('Error loading curriculums:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCurriculums();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <p className="text-gray-600">Loading curriculums...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Learning Paths</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {curriculums.map((curriculum) => (
          <div key={curriculum.id} className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">{curriculum.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{curriculum.description}</p>
            <div className="mt-4">
              {curriculum.industry_focus.map((focus) => (
                <span
                  key={focus}
                  className="mr-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800"
                >
                  {focus}
                </span>
              ))}
            </div>
            <button className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
              Start Learning
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}