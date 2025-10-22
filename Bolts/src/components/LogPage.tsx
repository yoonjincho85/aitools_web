import { useState } from 'react';
import { createActivity } from '../utils/activityUtils';
import { ArrowLeft, Calendar, Save, CheckCircle2 } from 'lucide-react';

interface LogPageProps {
  onNavigateHome: () => void;
}

export default function LogPage({ onNavigateHome }: LogPageProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    const result = await createActivity(date, title.trim(), description.trim());

    if (result) {
      setSuccess(true);
      setTitle('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } else {
      setError('Failed to log activity. The date might already have an entry.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Log Your Activity</h1>
              <p className="text-gray-600">Record what you accomplished today</p>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-emerald-800 font-medium">Activity logged successfully!</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What did you accomplish?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share more details about your accomplishment..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
              />
              <p className="mt-2 text-sm text-gray-500">
                Write in blog format - share your thoughts, challenges, and learnings
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Activity
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tip</h3>
          <p className="text-blue-800">
            Consistency is key! Try to log something every day, no matter how small.
            Even 15 minutes of productive work counts as progress.
          </p>
        </div>
      </div>
    </div>
  );
}
