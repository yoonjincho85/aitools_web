"use client"

import { useEffect, useState } from "react"
import { getActivities, type Activity } from "@/lib/activities"

export function ActivityHeatmap() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    setActivities(getActivities())
  }, [])

  // Generate last 365 days
  const generateDays = () => {
    const days = []
    const today = new Date()

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      days.push(date)
    }

    return days
  }

  const days = generateDays()

  // Group days by week
  const weeks: Date[][] = []
  let currentWeek: Date[] = []

  days.forEach((day, index) => {
    currentWeek.push(day)
    if (day.getDay() === 6 || index === days.length - 1) {
      weeks.push([...currentWeek])
      currentWeek = []
    }
  })

  // Get activity count for a specific date
  const getActivityCount = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return activities.filter((a) => a.date === dateStr).length
  }

  // Get color based on activity count
  const getColor = (count: number) => {
    if (count === 0) return "bg-muted"
    if (count === 1) return "bg-emerald-200 dark:bg-emerald-900"
    if (count === 2) return "bg-emerald-400 dark:bg-emerald-700"
    return "bg-emerald-600 dark:bg-emerald-500"
  }

  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        {/* Month labels */}
        <div className="flex gap-1 mb-2 ml-8">
          {weeks.map((week, weekIndex) => {
            const firstDay = week[0]
            const showMonth = firstDay.getDate() <= 7

            return (
              <div key={weekIndex} className="w-3">
                {showMonth && <span className="text-xs text-muted-foreground">{monthLabels[firstDay.getMonth()]}</span>}
              </div>
            )
          })}
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 pr-2">
            {dayLabels.map((label, index) => (
              <div key={label} className="h-3 flex items-center">
                {index % 2 === 1 && <span className="text-xs text-muted-foreground">{label}</span>}
              </div>
            ))}
          </div>

          {/* Activity squares */}
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const day = week[dayIndex]
                if (!day) return <div key={dayIndex} className="w-3 h-3" />

                const count = getActivityCount(day)
                const dateStr = day.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })

                return (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm ${getColor(count)} transition-colors cursor-pointer hover:ring-2 hover:ring-ring`}
                    title={`${dateStr}: ${count} ${count === 1 ? "activity" : "activities"}`}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900" />
            <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-700" />
            <div className="w-3 h-3 rounded-sm bg-emerald-600 dark:bg-emerald-500" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
