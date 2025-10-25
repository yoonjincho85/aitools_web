export interface Activity {
  id: string
  date: string // YYYY-MM-DD format
  title: string
  description: string
  category?: string
}

const STORAGE_KEY = "productivity-activities"

// Get all activities from localStorage
export function getActivities(): Activity[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    // Initialize with some sample data
    const sampleData = generateSampleData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData))
    return sampleData
  }

  return JSON.parse(stored)
}

// Add a new activity
export function addActivity(activity: Omit<Activity, "id">): Activity {
  const activities = getActivities()
  const newActivity: Activity = {
    ...activity,
    id: crypto.randomUUID(),
  }

  activities.push(newActivity)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities))

  return newActivity
}

// Delete an activity
export function deleteActivity(id: string): void {
  const activities = getActivities()
  const filtered = activities.filter((a) => a.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

// Generate sample data for demo
function generateSampleData(): Activity[] {
  const activities: Activity[] = []
  const today = new Date()
  const categories = ["Learning", "Exercise", "Reading", "Coding", "Writing"]

  // Generate random activities over the past 6 months
  for (let i = 0; i < 180; i++) {
    // Random chance of having an activity (70% chance)
    if (Math.random() > 0.3) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const category = categories[Math.floor(Math.random() * categories.length)]

      activities.push({
        id: crypto.randomUUID(),
        date: date.toISOString().split("T")[0],
        title: `${category} session`,
        description: `Completed a productive ${category.toLowerCase()} session today.`,
        category,
      })
    }
  }

  return activities
}
