"use client"

import { useEffect, useState } from "react"
import { getActivities, type Activity } from "@/lib/activities"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, Tag } from "lucide-react"

export default function LogPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const allActivities = getActivities()
    // Sort by date descending (newest first)
    const sorted = allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setActivities(sorted)
  }, [])

  // Get unique categories
  const categories = Array.from(new Set(activities.map((a) => a.category).filter(Boolean)))

  // Filter activities by category
  const filteredActivities = selectedCategory ? activities.filter((a) => a.category === selectedCategory) : activities

  // Group activities by month
  const groupedByMonth = filteredActivities.reduce(
    (acc, activity) => {
      const date = new Date(activity.date)
      const monthYear = date.toLocaleDateString("en-US", { month: "long", year: "numeric" })

      if (!acc[monthYear]) {
        acc[monthYear] = []
      }
      acc[monthYear].push(activity)

      return acc
    },
    {} as Record<string, Activity[]>,
  )

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold hover:text-muted-foreground transition-colors">
            Daily Progress
          </Link>
          <Link href="/admin">
            <Button size="sm">Add Entry</Button>
          </Link>
        </div>
      </header>

      {/* Page Header */}
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-3">Activity Log</h1>
            <p className="text-lg text-muted-foreground">A chronological record of my daily productive activities</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Filter by category:
              </span>
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category || null)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Activity Feed */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-12">
          {Object.entries(groupedByMonth).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No activities logged yet.</p>
              <Link href="/admin">
                <Button className="mt-4">Add Your First Entry</Button>
              </Link>
            </div>
          ) : (
            Object.entries(groupedByMonth).map(([monthYear, monthActivities]) => (
              <div key={monthYear} className="space-y-6">
                <h2 className="text-2xl font-semibold sticky top-0 bg-background py-2 z-10">{monthYear}</h2>

                <div className="space-y-8">
                  {monthActivities.map((activity) => {
                    const date = new Date(activity.date)
                    const formattedDate = date.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })

                    return (
                      <article
                        key={activity.id}
                        className="border border-border rounded-lg p-6 hover:border-foreground/20 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-xl font-semibold">{activity.title}</h3>
                          {activity.category && <Badge variant="secondary">{activity.category}</Badge>}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <Calendar className="w-4 h-4" />
                          <time dateTime={activity.date}>{formattedDate}</time>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">{activity.description}</p>
                      </article>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
