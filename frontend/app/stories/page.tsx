"use client"

import { motion } from "framer-motion"
import { StoryCard } from "@/components/story-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, SortAsc, SortDesc } from "lucide-react"

const stories = [
  {
    id: "1",
    title: "Global Climate Summit Coverage Analysis",
    description: "Comparing reporting across international news outlets",
    type: "important" as const,
    metrics: { accuracy: 88, bias: 25, sources: 15 }
  },
  {
    id: "2",
    title: "Tech Industry Merger Coverage",
    description: "Analysis of financial news reporting accuracy",
    type: "viral" as const,
    metrics: { accuracy: 92, bias: 18, sources: 10 }
  },
  {
    id: "3",
    title: "Healthcare Policy Reporting",
    description: "Fact-checking and bias analysis in healthcare news",
    type: "important" as const,
    metrics: { accuracy: 85, bias: 30, sources: 12 }
  }
]

export default function StoriesPage() {
  return (
    <main className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <h1 className="text-3xl font-bold">Deep Dive Stories</h1>
            <div className="flex space-x-4">
              <Input
                type="search"
                placeholder="Search stories..."
                className="w-64 bg-white/5"
              />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <SortAsc className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StoryCard {...story} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}