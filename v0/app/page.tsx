"use client"

import { ActivityHeatmap } from "@/components/activity-heatmap"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Daily Progress</h1>
          <nav className="flex items-center gap-4">
            <Link href="/log" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Activity Log
            </Link>
            <Link href="/admin">
              <Button size="sm">Add Entry</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
            Building Better Habits, One Day at a Time
          </h2>
          <p className="text-lg text-muted-foreground text-balance leading-relaxed">
            Welcome to my personal productivity tracker. I'm committed to doing at least one productive thing every day
            and tracking my progress. This is my journey of consistent growth and self-improvement.
          </p>
        </div>
      </section>

      {/* Activity Heatmap Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold">Activity Overview</h3>
              <p className="text-sm text-muted-foreground mt-1">My daily productivity streak over the past year</p>
            </div>
            <Link href="/log">
              <Button variant="outline" size="sm">
                View All Entries
              </Button>
            </Link>
          </div>

          <ActivityHeatmap />
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-border rounded-lg p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-3xl font-bold">7 days</p>
            </div>
            <div className="border border-border rounded-lg p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Total Activities</p>
              <p className="text-3xl font-bold">142</p>
            </div>
            <div className="border border-border rounded-lg p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Longest Streak</p>
              <p className="text-3xl font-bold">23 days</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
