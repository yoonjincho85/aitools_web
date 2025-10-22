import { Activity } from '../lib/supabase';
import { generateLast365Days, getActivityCountByDate } from '../utils/activityUtils';

interface ActivityHeatmapProps {
  activities: Activity[];
}

export default function ActivityHeatmap({ activities }: ActivityHeatmapProps) {
  const days = generateLast365Days();
  const activityMap = getActivityCountByDate(activities);

  const getIntensityClass = (date: string) => {
    const count = activityMap.get(date) || 0;
    if (count === 0) return 'bg-gray-100 border-gray-200';
    return 'bg-emerald-500 border-emerald-600';
  };

  const weeks: string[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Activity Over the Past Year</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-500 border border-emerald-600"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex gap-1">
            <div className="flex flex-col justify-around text-xs text-gray-500 pr-2">
              <span>Mon</span>
              <span className="invisible">Wed</span>
              <span>Wed</span>
              <span className="invisible">Fri</span>
              <span>Fri</span>
            </div>

            <div className="flex-1">
              <div className="flex gap-1 mb-2 text-xs text-gray-500">
                {months.map((month, idx) => (
                  <span key={idx} className="w-12">{month}</span>
                ))}
              </div>

              <div className="flex gap-1">
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1">
                    {week.map((day, dayIdx) => {
                      const activity = activities.find(a => a.date === day);
                      return (
                        <div
                          key={dayIdx}
                          className={`w-3 h-3 rounded-sm border transition-all hover:ring-2 hover:ring-emerald-400 cursor-pointer ${getIntensityClass(day)}`}
                          title={activity ? `${day}: ${activity.title}` : day}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <span className="font-semibold text-gray-900">{activityMap.size}</span> productive days in the last year
      </div>
    </div>
  );
}
