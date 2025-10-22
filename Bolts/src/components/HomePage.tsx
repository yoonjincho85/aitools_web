import { useEffect, useState } from 'react';
import { Activity } from '../lib/supabase';
import { fetchActivities } from '../utils/activityUtils';
import ActivityHeatmap from './ActivityHeatmap';
import { ArrowRight, Target, TrendingUp } from 'lucide-react';

interface HomePageProps {
  onNavigateToLog: () => void;
  onNavigateToTimeline: () => void;
}

export default function HomePage({ onNavigateToLog, onNavigateToTimeline }: HomePageProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    const data = await fetchActivities();
    setActivities(data);
    setRecentActivities(data.slice(0, 3));
    setLoading(false);
  };

  const currentStreak = calculateCurrentStreak(activities);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-6 shadow-lg">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Daily Progress Tracker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Every day is an opportunity to build something meaningful. Track your productive activities
            and watch your consistency grow over time.
          </p>
        </header>

        <div className="grid gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading your activity...</p>
              </div>
            ) : (
              <ActivityHeatmap activities={activities} />
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Current Streak</h3>
              </div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
              </div>
              <p className="text-gray-600">Keep it going!</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Total Activities</h3>
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {activities.length}
              </div>
              <p className="text-gray-600">Productive days logged</p>
            </div>
          </div>
        </div>

        {recentActivities.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="border-l-4 border-emerald-500 pl-4 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(activity.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-2">{activity.description}</p>
                </div>
              ))}
            </div>
            <button
              onClick={onNavigateToTimeline}
              className="mt-6 flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              View all activities
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={onNavigateToLog}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            Log Today's Activity
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function calculateCurrentStreak(activities: Activity[]): number {
  if (activities.length === 0) return 0;

  const sortedDates = activities
    .map(a => new Date(a.date))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const mostRecent = new Date(sortedDates[0]);
  mostRecent.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (mostRecent.getTime() !== today.getTime() && mostRecent.getTime() !== yesterday.getTime()) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const current = new Date(sortedDates[i]);
    current.setHours(0, 0, 0, 0);

    const previous = new Date(sortedDates[i - 1]);
    previous.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
