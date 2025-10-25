"use client"

import type React from "react"

import { useState } from "react"
import { addActivity } from "@/lib/activities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    title: "",
    description: "",
    category: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Add the activity
    addActivity({
      date: formData.date,
      title: formData.title,
      description: formData.description,
      category: formData.category || undefined,
    })

    // Show success message
    setShowSuccess(true)

    // Reset form
    setTimeout(() => {
      setFormData({
        date: new Date().toISOString().split("T")[0],
        title: "",
        description: "",
        category: "",
      })
      setIsSubmitting(false)
      setShowSuccess(false)
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const suggestedCategories = ["Learning", "Exercise", "Reading", "Coding", "Writing", "Creative", "Health"]

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold hover:text-muted-foreground transition-colors">
            Daily Progress
          </Link>
          <Link href="/log">
            <Button variant="outline" size="sm">
              View Log
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Log New Activity</CardTitle>
              <CardDescription>Record your daily productive activity to keep your streak going</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Activity Title</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g., Completed React tutorial"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category (optional)</Label>
                  <Input
                    id="category"
                    name="category"
                    type="text"
                    placeholder="e.g., Learning, Exercise, Reading"
                    value={formData.category}
                    onChange={handleChange}
                    list="categories"
                  />
                  <datalist id="categories">
                    {suggestedCategories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {suggestedCategories.map((cat) => (
                      <Button
                        key={cat}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
                        className="text-xs"
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe what you accomplished today..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? (
                      showSuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Activity Logged!
                        </>
                      ) : (
                        "Saving..."
                      )
                    ) : (
                      "Log Activity"
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.push("/log")}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tips */}
          <div className="mt-8 p-4 border border-border rounded-lg bg-muted/30">
            <h3 className="font-semibold mb-2">Tips for logging activities</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Be specific about what you accomplished</li>
              <li>Use categories to organize different types of activities</li>
              <li>Log activities daily to maintain your streak</li>
              <li>Focus on meaningful progress, not just busy work</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
