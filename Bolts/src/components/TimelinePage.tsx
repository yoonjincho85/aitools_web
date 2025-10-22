import { useEffect, useState } from 'react';
import { Activity } from '../lib/supabase';
import { fetchActivities, deleteActivity } from '../utils/activityUtils';
import { ArrowLeft, Calendar, Trash2 } from 'lucide-react';

interface TimelinePageProps {
  onNavigateHome: () => void;
}

export default function TimelinePage({ onNavigateHome }: TimelinePageProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    const data = await fetchActivities();
    setActivities(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    setDeletingId(id);
    const success = await deleteActivity(id);

    if (success) {
      setActivities(activities.filter(a => a.id !== id));
    } else {
      alert('Failed to delete activity');
    }

    setDeletingId(null);
  };

  const groupedActivities = groupByMonth(activities);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activity Timeline</h1>
            <p className="text-gray-600">Your journey of daily progress</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-200 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Activities Yet</h3>
            <p className="text-gray-600">Start logging your daily progress to see your timeline!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedActivities).map(([monthYear, monthActivities]) => (
              <div key={monthYear}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 sticky top-0 bg-gradient-to-br from-slate-50 to-slate-100 py-2">
                  {monthYear}
                </h2>
                <div className="space-y-4">
                  {monthActivities.map((activity) => (
                    <article
                      key={activity.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 border border-gray-200 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                              {new Date(activity.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {activity.title}
                          </h3>
                        </div>
                        <button
                          onClick={() => handleDelete(activity.id)}
                          disabled={deletingId === activity.id}
                          className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg disabled:opacity-50"
                          title="Delete activity"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {activity.description && (
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {activity.description}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                        Logged on {new Date(activity.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function groupByMonth(activities: Activity[]): Record<string, Activity[]> {
  const grouped: Record<string, Activity[]> = {};

  activities.forEach(activity => {
    const date = new Date(activity.date);
    const key = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(activity);
  });

  return grouped;
}
