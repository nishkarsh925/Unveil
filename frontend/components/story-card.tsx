"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ChartBarIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon 
} from "@heroicons/react/24/outline"

// Define default values for metrics
const defaultMetrics = {
  accuracy: 0,
  bias: 0,
  sources: 0
};

export function StoryCard({ 
  id, 
  title = "Untitled Story", 
  description = "No description available", 
  type = "general", 
  url = "#", 
  urlToImage = "", 
  publishedAt = "", 
  source = "Unknown Source", 
  metrics = defaultMetrics,
  isUnderrated = false 
}) {
  // Safely use metrics with defaults if undefined
  const safeMetrics = metrics || defaultMetrics;
  
  return (
    <Link href={`/story/${id}`} className="block">
      <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
            <Badge variant={type === "important" ? "default" : "outline"}>
              {type === "important" ? "Important" : "Viral"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{source}</p>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="grid grid-cols-3 gap-2 w-full text-xs">
            <div className="flex flex-col space-y-1 items-center">
              <span className="text-muted-foreground">Accuracy Score</span>
              <span className={`font-medium ${
                safeMetrics.accuracy >= 80 ? "text-emerald-400" :
                safeMetrics.accuracy >= 60 ? "text-amber-400" : "text-rose-400"
              }`}>{safeMetrics.accuracy}%</span>
            </div>
            <div className="flex flex-col space-y-1 items-center">
              <span className="text-muted-foreground">Bias Level</span>
              <span className={`font-medium ${
                safeMetrics.bias <= 20 ? "text-emerald-400" :
                safeMetrics.bias <= 40 ? "text-amber-400" : "text-rose-400"
              }`}>{safeMetrics.bias}%</span>
            </div>
            <div className="flex flex-col space-y-1 items-center">
              <span className="text-muted-foreground">Sources</span>
              <span className="font-medium">{safeMetrics.sources}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}