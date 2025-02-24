"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Share2, BookmarkPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StoryCardProps {
  title: string
  description: string
  type: "viral" | "important"
  metrics: {
    accuracy: number
    bias: number
    sources: number
  }
}

export function StoryCard({ title, description, type, metrics }: StoryCardProps) {
  const getProgressColor = (value: number, type: "accuracy" | "bias") => {
    if (type === "accuracy") {
      return value >= 80 ? "bg-emerald-500" : value >= 60 ? "bg-amber-500" : "bg-rose-500";
    } else {
      return value <= 20 ? "bg-emerald-500" : value <= 40 ? "bg-amber-500" : "bg-rose-500";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`
        glass-panel overflow-hidden
        ${type === "viral" ? "border-viral/20" : "border-important/20"}
      `}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <span className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${type === "viral" 
                ? "bg-viral/10 text-viral" 
                : "bg-important/10 text-important"}
            `}>
              {type === "viral" ? "Viral" : "Important"}
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Accuracy Score</span>
                <span className={`font-medium ${
                  metrics.accuracy >= 80 ? "text-emerald-400" :
                  metrics.accuracy >= 60 ? "text-amber-400" : "text-rose-400"
                }`}>{metrics.accuracy}%</span>
              </div>
              <Progress 
                value={metrics.accuracy} 
                className="bg-white/10"
                indicatorClassName={getProgressColor(metrics.accuracy, "accuracy")}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bias Rating</span>
                <span className={`font-medium ${
                  metrics.bias <= 20 ? "text-emerald-400" :
                  metrics.bias <= 40 ? "text-amber-400" : "text-rose-400"
                }`}>{metrics.bias}%</span>
              </div>
              <Progress 
                value={metrics.bias} 
                className="bg-white/10"
                indicatorClassName={getProgressColor(metrics.bias, "bias")}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Sources Analyzed</span>
              <span className="font-medium">{metrics.sources}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-white/10"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-white/10"
            >
              <BookmarkPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}