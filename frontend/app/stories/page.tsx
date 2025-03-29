"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { StoryCard } from "@/components/story-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, SortAsc, SortDesc, RefreshCw } from "lucide-react"

// Initial stories data as fallback with properly structured mock data
const initialStories = [{
  id: "1",
  title: "Stories Are Loading",
  description: "Fetching Stories",
  type: "general",
  url: "#",
  urlToImage: "",
  publishedAt: new Date().toISOString(),
  source: "Sample Source",
  metrics: {
    accuracy: 70,
    bias: 30,
    sources: 5
  }
}];

// Function to determine if a story is underrated but important
const isUnderratedImportant = (story) => {
  // Logic: high accuracy (>80) but relatively low sources (<15) indicates underrated important news
  return story?.metrics?.accuracy > 80 && story?.metrics?.sources < 15;
}

export default function StoriesPage() {
  const [stories, setStories] = useState(initialStories);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnderratedOnly, setShowUnderratedOnly] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [category, setCategory] = useState(""); // For filtering by category

  const fetchStories = async () => {
    setLoading(true);
    try {
      // Call our backend API to fetch stories
      const response = await fetch('http://localhost:8000/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery || null,
          category: category || null,
          count: 12
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      
      const data = await response.json();
      
      // Use the stories from the API or fallback to initial ones
      if (data && data.length > 0) {
        setStories(data);
      } else {
        console.warn("No stories returned from API, using fallback data");
        setStories(initialStories);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch stories:", error);
      // Fallback to initial stories on error
      setStories(initialStories);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stories when component mounts or search query changes
  useEffect(() => {
    fetchStories();
    
    // Auto-refresh stories every 5 minutes (not on every search change)
    const intervalId = setInterval(() => {
      if (!searchQuery) {
        fetchStories();
      }
    }, 300000); // 5 minutes
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Separate effect for search to prevent immediate trigger
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        fetchStories();
      }
    }, 500); // Debounce search by 500ms
    
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, category]);

  // Filter stories based on search query and underrated filter
  const filteredStories = stories.filter(story => {
    if (showUnderratedOnly) {
      return isUnderratedImportant(story);
    }
    return true;
  });

  return (
    <main className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold">Deep Dive Stories</h1>
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
                {loading && <span className="ml-2">(refreshing...)</span>}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Input
                type="search"
                placeholder="Search stories..."
                className="w-64 bg-white/5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                variant="outline" 
                className={showUnderratedOnly ? "bg-blue-100" : ""}
                onClick={() => setShowUnderratedOnly(!showUnderratedOnly)}
              >
                {showUnderratedOnly ? "All Stories" : "Underrated Important"}
              </Button>
              <Button variant="outline" size="icon" onClick={fetchStories}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <SortAsc className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.length > 0 ? (
              filteredStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <StoryCard 
                    {...story} 
                    isUnderrated={isUnderratedImportant(story)}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-lg text-gray-500">No stories match your criteria</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  )
}