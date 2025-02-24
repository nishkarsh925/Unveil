"use client"

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function StoryComparison() {
  const stories = {
    viral: {
      title: "Tech Giant's AI Breakthrough",
      sources: 15,
      engagement: 85000,
      accuracy: 82,
      bias: 45,
      summary: "Major tech company announces revolutionary AI model capabilities",
      coverage: [
        { outlet: "Tech News", sentiment: "positive", reach: 500000 },
        { outlet: "Science Daily", sentiment: "neutral", reach: 300000 },
        { outlet: "Industry Weekly", sentiment: "positive", reach: 250000 }
      ]
    },
    important: {
      title: "Climate Policy Implementation Update",
      sources: 12,
      engagement: 25000,
      accuracy: 95,
      bias: 15,
      summary: "New environmental regulations take effect with significant economic implications",
      coverage: [
        { outlet: "Environmental Report", sentiment: "neutral", reach: 200000 },
        { outlet: "Policy Review", sentiment: "neutral", reach: 150000 },
        { outlet: "Economic Times", sentiment: "negative", reach: 180000 }
      ]
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Sharing story...');
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {Object.entries(stories).map(([type, story]) => (
        <motion.div
          key={type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={`glass-panel border-${type === 'viral' ? 'viral' : 'important'}/20`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <span className={`
                    px-3 py-1 rounded-full text-sm font-medium mb-2 inline-block
                    ${type === 'viral' ? 'bg-viral/10 text-viral' : 'bg-important/10 text-important'}
                  `}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                  <CardTitle className="text-xl">{story.title}</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleShare}
                  className="relative z-10"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{story.summary}</p>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy Score</span>
                    <span className="font-medium">{story.accuracy}%</span>
                  </div>
                  <Progress 
                    value={story.accuracy} 
                    className={type === 'viral' ? 'bg-viral/20' : 'bg-important/20'} 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bias Rating</span>
                    <span className="font-medium">{story.bias}%</span>
                  </div>
                  <Progress 
                    value={story.bias} 
                    className={type === 'viral' ? 'bg-viral/20' : 'bg-important/20'} 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Sources: {story.sources}</span>
                  <span>Engagement: {story.engagement.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}