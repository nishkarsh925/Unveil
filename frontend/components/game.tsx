'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Share2, Trophy, Clock, Brain, Award, Medal } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const difficultyLevels = [
  { value: 'beginner', label: 'Beginner', color: 'emerald' },
  { value: 'intermediate', label: 'Intermediate', color: 'amber' },
  { value: 'advanced', label: 'Advanced', color: 'rose' }
];

const categories = [
  { value: 'bias', label: 'Bias Detection' },
  { value: 'fact-checking', label: 'Fact Checking' },
  { value: 'source-analysis', label: 'Source Analysis' },
  { value: 'critical-thinking', label: 'Critical Thinking' }
];

const achievements = [
  { icon: Trophy, label: 'Perfect Score', unlocked: true },
  { icon: Brain, label: 'Quick Thinker', unlocked: true },
  { icon: Award, label: 'Expert Analyst', unlocked: false },
  { icon: Medal, label: 'Master Detective', unlocked: false }
];

export function MediaLiteracyGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('beginner');
  const [selectedCategories, setSelectedCategories] = useState(['bias']);
  const [progress, setProgress] = useState(0);

  const questions = [
    {
      question: "Which of these headlines shows potential clickbait?",
      options: [
        "Scientists Discover New Planet",
        "You Won't BELIEVE What This Celebrity Did Next!",
        "Global Economy Shows Signs of Recovery",
        "Local Council Approves New Infrastructure Plan"
      ],
      correct: 1,
      category: 'bias',
      difficulty: 'beginner',
      timeEstimate: '2 min'
    },
    {
      question: "What's a key indicator of source credibility?",
      options: [
        "Lots of ads",
        "Anonymous sources only",
        "Clear attribution and citations",
        "Sensational language"
      ],
      correct: 2,
      category: 'source-analysis',
      difficulty: 'intermediate',
      timeEstimate: '3 min'
    }
  ];

  const handleAnswer = (selectedIndex: number) => {
    if (selectedIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setProgress(((currentQuestion + 1) / questions.length) * 100);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    console.log('Sharing results...');
  };

  const handleCategoryToggle = (categoryValue: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryValue)
        ? prev.filter(c => c !== categoryValue)
        : [...prev, categoryValue]
    );
  };

  if (!gameStarted) {
    return (
      <Card className="glass-panel overflow-hidden rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
        <CardHeader className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] bg-clip-text text-transparent">
              Media Literacy Challenge
            </CardTitle>
            <Clock className="h-6 w-6 text-[hsl(var(--accent-primary))]" />
          </div>
          <p className="text-white/70">
            Test your ability to identify media bias, clickbait, and credible sources.
          </p>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty Level</label>
              <Select 
                value={difficulty} 
                onValueChange={setDifficulty}
              >
                <SelectTrigger className="w-full relative z-10">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <span className={`text-${level.color}-500`}>{level.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategories.includes(category.value) ? "default" : "outline"}
                    size="sm"
                    className="relative z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryToggle(category.value);
                    }}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Achievements</label>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      achievement.unlocked
                        ? 'bg-white/10 text-white'
                        : 'bg-white/5 text-white/50'
                    }`}
                  >
                    <achievement.icon className="h-4 w-4" />
                    <span className="text-sm">{achievement.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-white/70">
              <Clock className="inline h-4 w-4 mr-1" />
              Estimated time: 10-15 min
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setGameStarted(true);
              }}
              className="relative z-10 bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))]"
            >
              Start Game
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel overflow-hidden rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">
            Question {currentQuestion + 1} of {questions.length}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className={`text-sm px-2 py-1 rounded-full bg-${
              difficultyLevels.find(d => d.value === difficulty)?.color
            }-500/20`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleShare}
              className="relative z-10"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <p className="text-lg">{questions[currentQuestion].question}</p>
          <div className="grid gap-3">
            {questions[currentQuestion].options.map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full text-left justify-start h-auto py-3 relative z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAnswer(index);
                  }}
                >
                  {option}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 text-sm text-white/70">
          <div>Score: {score}/{questions.length}</div>
          <div>
            <Clock className="inline h-4 w-4 mr-1" />
            {questions[currentQuestion].timeEstimate}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}