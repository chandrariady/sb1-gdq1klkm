import { useAuth } from '../contexts/AuthContext';
import { Dashboard } from '../pages/Dashboard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const categories = [
  'Mining Engineers',
  'Mine Planning',
  'Geologists',
  'Processing Engineers',
  'Safety Officers',
  'Environmental',
];

export function LandingPage() {
  const { user } = useAuth();

  if (user) {
    return <Dashboard />;
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Learn a new skill, launch a project,
              <br />
              land your dream career.
            </h1>
            <p className="mt-8 text-3xl font-light text-[#F4B41A]">
              1-on-1 Mining Industry Mentorship
            </p>
            
            <div className="mt-16 max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  placeholder="Search by company, skills or role"
                  className="w-full pl-12 pr-32 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40C1C7] focus:border-[#40C1C7]"
                />
                <button className="absolute right-2 top-2 px-8 py-2 bg-[#40C1C7] text-white rounded-md hover:bg-[#3AAFB5] transition-colors">
                  Find mentors
                </button>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:border-[#40C1C7] hover:text-[#40C1C7] transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}